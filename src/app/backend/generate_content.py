#!/usr/bin/env python3
"""Generate demo content JSON from an existing Markdown research report.

This script does not do research or web search. It uses the report as the only
source of facts, asks Claude to fill the JSON template, validates the result,
and writes generated_<business>.json.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

try:
    import anthropic
except ImportError:  # pragma: no cover - depends on the local environment
    anthropic = None


MODEL = "claude-sonnet-4-6"
ROOT_DIR = Path(__file__).resolve().parents[1]
DEFAULT_REPORT = "report_disney_resort.md"
RESEARCH_REPORT_DIR = ROOT_DIR / "research_report"
TEMPLATE_PATH = ROOT_DIR / "references" / "generated.template.json"
EXAMPLE_PATH = ROOT_DIR / "references" / "generated_example.json"
RESULT_DIR = ROOT_DIR / "result"


def read_text(path: str) -> str:
    """Read a UTF-8 text file with a clear error if it is missing."""
    try:
        with open(path, "r", encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError as exc:
        raise RuntimeError(f"Required input file not found: {path}") from exc


def read_json(path: str) -> Any:
    """Read JSON from disk for validation and prompt reference."""
    try:
        return json.loads(read_text(path))
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"Invalid JSON in {path}: {exc}") from exc


def business_slug_from_report_path(path: str) -> str:
    """Derive the output business slug from report_<business>.md."""
    filename = os.path.basename(path)
    business = re.sub(r"^report_", "", filename)
    business = re.sub(r"\.md$", "", business)
    business = re.sub(r"[^A-Za-z0-9]+", "_", business).strip("_").lower()
    return business or "business"


def output_path_for_report(path: str) -> str:
    """Build result/generated_<business>.json."""
    return RESULT_DIR / f"generated_{business_slug_from_report_path(path)}.json"


def resolve_report_path(report_input: str) -> Path:
    """Resolve a CLI report argument into a Markdown report path."""
    report_path = Path(report_input)
    if report_path.exists():
        return report_path

    if report_path.suffix != ".md":
        report_input = f"{report_input}.md"
        report_path = Path(report_input)

    if report_path.exists():
        return report_path

    filename = report_path.name
    if not filename.startswith("report_"):
        filename = f"report_{filename}"

    return RESEARCH_REPORT_DIR / filename


def parse_args() -> argparse.Namespace:
    """Read the report to transform from the terminal."""
    parser = argparse.ArgumentParser(
        description="Generate demo JSON from an existing research report."
    )
    parser.add_argument(
        "report",
        nargs="?",
        default=DEFAULT_REPORT,
        help=(
            "Report to use, e.g. disney_resort, report_disney_resort.md, "
            "or research_report/report_disney_resort.md"
        ),
    )
    return parser.parse_args()


def strip_template_doc(value: Any) -> Any:
    """Remove template-only documentation before validating final output keys."""
    if isinstance(value, dict):
        return {
            key: strip_template_doc(item)
            for key, item in value.items()
            if key != "__doc__"
        }
    if isinstance(value, list):
        return [strip_template_doc(item) for item in value]
    return value


def structure_signature(value: Any) -> Any:
    """Represent only object keys and array lengths, not specific string values."""
    if isinstance(value, dict):
        return {key: structure_signature(item) for key, item in value.items()}
    if isinstance(value, list):
        return [structure_signature(item) for item in value]
    return "<value>"


def ensure_no_placeholders(value: Any, path: str = "$") -> None:
    """Fail if any template placeholder-looking strings remain in the output."""
    if isinstance(value, dict):
        for key, item in value.items():
            ensure_no_placeholders(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            ensure_no_placeholders(item, f"{path}[{index}]")
    elif isinstance(value, str) and "<" in value and ">" in value:
        raise RuntimeError(f"Unfilled placeholder appears at {path}: {value}")


def validate_generated(template: Any, generated: Any) -> None:
    """Ensure the generated JSON matches the template's keys and array lengths."""
    expected = structure_signature(strip_template_doc(template))
    actual = structure_signature(generated)

    if actual != expected:
        raise RuntimeError(
            "Generated JSON does not match the template structure exactly. "
            "Check for added/missing keys or changed array lengths."
        )

    learning = generated.get("articles", {}).get("learning")
    if not isinstance(learning, list) or len(learning) != 3:
        raise RuntimeError('Expected articles to be wrapped as {"learning": [...3...]}.')

    ensure_no_placeholders(generated)


def build_prompt(report: str, template_text: str, example_text: str) -> str:
    """Create the transformation prompt for Claude."""
    return f"""
You transform an existing Markdown research report into demo content JSON for a
Salesforce Service Cloud demo.

The Markdown report is the ONLY source of facts. Do not use outside knowledge,
web search, or generic assumptions beyond reasonable demo wording grounded in
the report. The existing generated_example.json file is ONLY a style, length, and
granularity reference. Do not copy its education content or domain.

Fill EVERY <placeholder> from the template with concrete content grounded in the
report. The output scope is only:
- hero
- searchHero
- searchBar
- searchBarDropdown
- sidebar.portalTitle, sidebar.conversations, sidebar.zeroState
- chat.promptSuggestions
- chatScript with ONE conversation
- articles with exactly 3 objects inside {{"learning": [...]}}

Strict JSON rules:
- Output ONLY valid JSON.
- Do not wrap the JSON in Markdown fences.
- Do not include commentary.
- Preserve the template's keys exactly, excluding template-only "__doc__".
- Preserve all array lengths exactly.
- Keep articles wrapped as {{"learning": [ ... exactly 3 ... ]}}.
- Do not add keys.
- Do not remove keys.
- Cards in chatScript should be minimal; if the template contains a card field,
  fill it with simple text-only JSON or a short string. Do not invent complex
  card payloads.

SOURCE OF TRUTH REPORT:
<<<REPORT
{report}
REPORT

TARGET TEMPLATE:
<<<TEMPLATE
{template_text}
TEMPLATE

FILLED EXAMPLE FOR STYLE ONLY:
<<<EXAMPLE
{example_text}
EXAMPLE
""".strip()


def extract_text(response: anthropic.types.Message) -> str:
    """Join only Claude's text blocks into a final string."""
    chunks: list[str] = []
    for block in response.content:
        if getattr(block, "type", None) == "text":
            chunks.append(block.text)
    return "\n\n".join(chunks).strip()


def generate_json_text(report: str, template_text: str, example_text: str) -> str:
    """Call Anthropic Messages API to transform the report into JSON."""
    if anthropic is None:
        raise RuntimeError(
            "The anthropic package is not installed. Install it with: pip install anthropic"
        )

    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY environment variable is not set.")

    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model=MODEL,
        max_tokens=12000,
        temperature=0.2,
        messages=[
            {
                "role": "user",
                "content": build_prompt(report, template_text, example_text),
            }
        ],
    )
    return extract_text(response)


def main() -> int:
    try:
        args = parse_args()
        report_path = resolve_report_path(args.report)
        output_path = output_path_for_report(report_path)
        report = read_text(report_path)
        template_text = read_text(TEMPLATE_PATH)
        example_text = read_text(EXAMPLE_PATH)
        template = read_json(TEMPLATE_PATH)

        raw_output = generate_json_text(report, template_text, example_text)
        try:
            generated = json.loads(raw_output)
        except json.JSONDecodeError as exc:
            print("Model output was not valid JSON. Raw output follows:\n")
            print(raw_output)
            print(f"\nJSON parse error: {exc}", file=sys.stderr)
            return 1

        validate_generated(template, generated)

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as file:
            json.dump(generated, file, indent=2, ensure_ascii=False)
            file.write("\n")

    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    article_count = len(generated["articles"]["learning"])
    message_count = len(generated["chatScript"]["messages"])
    suggestion_count = len(generated["searchBar"]["allSuggestions"])
    print(
        f"Filled {output_path}: {article_count} articles, "
        f"{message_count} chat messages, {suggestion_count} search suggestions."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
