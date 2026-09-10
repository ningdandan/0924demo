#!/usr/bin/env python3
"""Create a Salesforce Service Cloud pre-sales research report for a company.

The script asks Claude to research the company live using Anthropic's built-in
web search tool, then writes a human-readable Markdown report to stdout and to
report_<company>.md.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

try:
    import anthropic
except ImportError:  # pragma: no cover - depends on the local environment
    anthropic = None


DEFAULT_MODEL = "claude-sonnet-4-6"
ROOT_DIR = Path(__file__).resolve().parents[1]
RESEARCH_REPORT_DIR = ROOT_DIR / "research_report"
WEB_SEARCH_TOOL = {
    "type": "web_search_20250305",
    "name": "web_search",
    "max_uses": 3,
}


def make_filename(company: str) -> str:
    """Convert the company name into a safe local Markdown filename."""
    slug = re.sub(r"[^A-Za-z0-9]+", "_", company.strip()).strip("_").lower()
    return RESEARCH_REPORT_DIR / f"report_{slug or 'company'}.md"


def build_prompt(company: str, url: str | None = None) -> str:
    """Build the instruction Claude will use after researching the company."""
    url_instruction = ""
    if url:
        url_instruction = (
            f"\nStart with this company URL as a primary source when useful: {url}\n"
            "Use web search to supplement it with current public information.\n"
        )

    return f"""
Research {company} using web search, then write a clean Markdown RESEARCH REPORT
for a pre-sales engineer preparing a Salesforce Service Cloud demo.
{url_instruction}

Important requirements:
- This must be a human-readable Markdown report, not JSON.
- Be specific and concrete to {company}; avoid generic support examples.
- Use what you find from web search. If a detail is uncertain, say so plainly.
- Keep Salesforce Service Cloud notes grounded in normal, real capabilities:
  knowledge articles, self-service/help center, case creation and routing,
  agent workspace/context, automation/actions, status updates, and escalation.
- Do not claim custom integrations or company-specific Salesforce deployments
  unless you found evidence for them.

Include these sections:

# {company} - Salesforce Service Cloud Demo Research Report

## 1. Company Overview
Describe what the company does in a few specific sentences.

## 2. Likely End Users for a Help Center or Support Portal
Identify the real people who would use support: customers, account holders,
patients, drivers, partners, admins, merchants, employees, etc. Be specific.

## 3. Common Support Portal Problems
List the 5 most common problem types those end users would bring to a support
portal. For each one, include:
- Problem type
- Why it likely matters for this company
- Realistic example question a user would type
- How Salesforce Service Cloud could help, in a grounded way

## 4. Suggested End-to-End Demo Conversation
Give one compelling support conversation scenario. Show the flow step by step:
user starts with a concrete problem, self-service or bot attempts to help,
knowledge or account context is used, a case is opened if needed, an action or
workflow is triggered, and the user gets a resolution or next step.

## 5. Sources and Research Notes
Briefly list the main public sources or source types you relied on.
""".strip()


def extract_markdown(response: anthropic.types.Message) -> str:
    """Join only Claude's text blocks into a final Markdown string."""
    chunks: list[str] = []
    for block in response.content:
        if getattr(block, "type", None) == "text":
            chunks.append(block.text)
    return "\n\n".join(chunks).strip()


def generate_report(company: str, url: str | None = None) -> str:
    """Call Anthropic Messages API with web search enabled."""
    if anthropic is None:
        raise RuntimeError(
            "The anthropic package is not installed. Install it with: pip install anthropic"
        )

    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY environment variable is not set.")

    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model=DEFAULT_MODEL,
        max_tokens=5000,
        temperature=0.2,
        tools=[WEB_SEARCH_TOOL],
        messages=[
            {
                "role": "user",
                "content": build_prompt(company, url),
            }
        ],
    )

    markdown = extract_markdown(response)
    if not markdown:
        raise RuntimeError("Anthropic returned no Markdown text blocks.")
    return markdown


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate a Salesforce Service Cloud demo research report."
    )
    parser.add_argument(
        "company",
        nargs="+",
        help='Company name to research, for example: "Acme Corp"',
    )
    parser.add_argument(
        "--url",
        help="Optional company URL to use as a primary research source.",
    )
    args = parser.parse_args()

    company = " ".join(args.company).strip()
    output_path = make_filename(company)

    try:
        markdown = generate_report(company, args.url)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as file:
        file.write(markdown)
        file.write("\n")

    print(markdown)
    print(f"\n\nReport saved to: {output_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
