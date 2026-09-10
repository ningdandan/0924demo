#!/usr/bin/env python3
"""Minimal HTTP server bridging the Vite frontend to the content-generation scripts.

Run alongside the Vite dev server:
    ANTHROPIC_API_KEY=sk-... python src/app/backend/server.py

    POST /api/generate  { "company": "Acme Corp", "url": "https://..." }
    → text/event-stream SSE:
        event: log    data: <line of text>
        event: done   data: <generated JSON string>
        event: error  data: <error message>
"""

from __future__ import annotations

import json
import queue
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

from service_cloud_research_report import generate_report       # noqa: E402
from generate_content import generate_json_text, validate_generated  # noqa: E402

TEMPLATE_PATH = BACKEND_DIR / "generated.template.json"
EXAMPLE_PATH  = BACKEND_DIR / "generated_example.json"
PORT = 5001

SENTINEL     = object()
MAX_RETRIES  = 4
RETRY_DELAYS = [5, 15, 30, 60]   # seconds


def _is_overload(exc: Exception) -> bool:
    s = str(exc).lower()
    return "overloaded" in s or "529" in s


def _with_retry(fn, q: queue.Queue, label: str):
    for attempt in range(MAX_RETRIES + 1):
        try:
            return fn()
        except Exception as exc:
            if _is_overload(exc) and attempt < MAX_RETRIES:
                wait = RETRY_DELAYS[attempt]
                q.put(("log", f"⏳ API overloaded — retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})…"))
                time.sleep(wait)
                q.put(("log", f"🔄 Retrying {label}…"))
            else:
                raise


def _sse(event: str, data: str) -> bytes:
    safe = data.replace("\n", "\\n")
    return f"event: {event}\ndata: {safe}\n\n".encode()


class _Handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self._cors(200)
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/generate":
            self._cors(404)
            self.end_headers()
            return

        length = int(self.headers.get("Content-Length", 0))
        body    = json.loads(self.rfile.read(length) or b"{}")
        company = (body.get("company") or "").strip()
        url     = (body.get("url") or "").strip() or None

        if not company:
            self._cors(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "company is required"}).encode())
            return

        self._cors(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Accel-Buffering", "no")
        self.end_headers()

        q: queue.Queue = queue.Queue()

        def run():
            try:
                q.put(("log", f"🔍 Researching **{company}** with web search…"))
                markdown = _with_retry(lambda: generate_report(company, url), q, "research")

                q.put(("log", "---"))
                for line in markdown.splitlines():
                    q.put(("log", line if line.strip() else " "))
                q.put(("log", "---"))

                q.put(("log", "✨ Generating demo JSON…"))
                template_text = TEMPLATE_PATH.read_text(encoding="utf-8")
                example_text  = EXAMPLE_PATH.read_text(encoding="utf-8")
                template      = json.loads(template_text)

                raw       = _with_retry(lambda: generate_json_text(markdown, template_text, example_text), q, "generation")
                generated = json.loads(raw)
                validate_generated(template, generated)

                q.put(("done", json.dumps(generated)))
            except json.JSONDecodeError as exc:
                q.put(("error", f"Model returned invalid JSON: {exc}"))
            except Exception as exc:
                q.put(("error", str(exc)))
            finally:
                q.put(SENTINEL)

        threading.Thread(target=run, daemon=True).start()

        while True:
            item = q.get()
            if item is SENTINEL:
                break
            event, data = item
            try:
                self.wfile.write(_sse(event, data))
                self.wfile.flush()
            except BrokenPipeError:
                break

    def _cors(self, status: int):
        self.send_response(status)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def log_message(self, fmt, *args):
        sys.stdout.write(f"[server] {fmt % args}\n")
        sys.stdout.flush()


if __name__ == "__main__":
    httpd = HTTPServer(("127.0.0.1", PORT), _Handler)
    print(f"Generation server → http://127.0.0.1:{PORT}", flush=True)
    httpd.serve_forever()
