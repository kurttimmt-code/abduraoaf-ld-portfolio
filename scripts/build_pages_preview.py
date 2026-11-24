#!/usr/bin/env python3
"""Build a GitHub Pages preview without changing the Netlify site.

The production website uses domain-root links such as /projects and /ai-course/.
GitHub Pages serves this public repository under /abduraoaf-ld-portfolio/.
This script copies public site assets to _site and rewrites URLs in the copy.
No original HTML, CSS, JavaScript, or media file is modified.
"""
from __future__ import annotations

import re
import shutil
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "_site"
PROJECT = "abduraoaf-ld-portfolio"
BASE = f"/{PROJECT}/"
ASSET_EXTENSIONS = {
    ".html", ".css", ".js", ".pdf", ".mp4", ".webm", ".jpg", ".jpeg",
    ".png", ".svg", ".webp", ".vtt", ".srt", ".txt", ".ico",
}
ATTRIBUTE = re.compile(
    r"(?P<head>\b(?:href|src|poster|action)\s*=\s*)(?P<quote>['\"])(?P<value>[^'\"]+)(?P=quote)",
    re.IGNORECASE,
)
REFRESH = re.compile(r"(?P<head>\burl\s*=\s*)(?P<value>/[^'\">\s;]+)", re.IGNORECASE)
LOCAL_REF = re.compile(
    r"\b(?:href|src|poster|action)\s*=\s*['\"]([^'\"]+)['\"]",
    re.IGNORECASE,
)


def map_root_url(url: str) -> str:
    if not url.startswith("/") or url.startswith("//"):
        return url
    bits = urlsplit(url)
    relative = bits.path.lstrip("/")
    if not relative:
        relative = "index.html"
    elif relative.endswith("/"):
        relative += "index.html"
    elif not (ROOT / relative).is_file() and (ROOT / (relative + ".html")).is_file():
        relative += ".html"
    if not (ROOT / relative).is_file():
        raise RuntimeError(f"Site refers to an unavailable local resource: {url}")
    return urlunsplit(("", "", BASE + relative, bits.query, bits.fragment))


def rewrite_html(html: str) -> str:
    def replace_attr(match: re.Match[str]) -> str:
        return match.group("head") + match.group("quote") + map_root_url(match.group("value")) + match.group("quote")

    html = ATTRIBUTE.sub(replace_attr, html)
    html = REFRESH.sub(lambda m: m.group("head") + map_root_url(m.group("value")), html)
    # A preview should not compete with the canonical portfolio in search results.
    html = re.sub(
        r"<head(\s[^>]*)?>",
        lambda m: m.group(0) + '<meta name="robots" content="noindex, nofollow">',
        html,
        count=1,
        flags=re.IGNORECASE,
    )
    return html


def validate_references(output: Path) -> None:
    errors = []
    for html_file in output.rglob("*.html"):
        data = html_file.read_text(encoding="utf-8")
        for url in LOCAL_REF.findall(data):
            if url.startswith("#") or url.startswith("//") or not url:
                continue
            parts = urlsplit(url)
            if parts.scheme or parts.netloc:
                continue
            if parts.path.startswith(BASE):
                rel = parts.path[len(BASE):]
                target = output / rel
            elif parts.path.startswith("/"):
                errors.append(f"{html_file.relative_to(output)}: unexpected domain-root URL {url}")
                continue
            else:
                target = html_file.parent / parts.path
            if not target.is_file():
                errors.append(f"{html_file.relative_to(output)}: unresolved {url}")
    if errors:
        raise RuntimeError("Preview link validation failed:\n" + "\n".join(errors[:40]))


def main() -> None:
    if DEST.exists():
        shutil.rmtree(DEST)
    DEST.mkdir(parents=True)
    copied = 0
    pages = 0
    for source in ROOT.rglob("*"):
        if not source.is_file() or DEST in source.parents or ".git" in source.parts:
            continue
        if source.suffix.lower() not in ASSET_EXTENSIONS:
            continue
        relative = source.relative_to(ROOT)
        destination = DEST / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        if source.suffix.lower() == ".html":
            destination.write_text(rewrite_html(source.read_text(encoding="utf-8")), encoding="utf-8")
            pages += 1
        else:
            shutil.copy2(source, destination)
        copied += 1
    (DEST / ".nojekyll").touch()
    validate_references(DEST)
    print(f"GitHub Pages preview built: {pages} HTML pages, {copied} files, all local links checked.")


if __name__ == "__main__":
    main()
