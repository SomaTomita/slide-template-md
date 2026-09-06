#!/usr/bin/env python3
"""Dependency-free site checks for CI and local use.

Run from anywhere:  python3 tools/check_site.py
Exits non-zero (and prints every problem) if any check fails, so it can gate a
push. Checks:
  1. Internal links   - every relative href/src/data-file resolves to a real file
  2. Structure        - <div> / </div> are balanced in each HTML page
  3. Social image     - assets/og.png exists (referenced by og:image)
  4. Meta / OG        - each page has description + og:title + og:image + twitter:card
  5. Deck shell       - 3-build-a-deck/SLIDE-DECK-shell.html keeps its print rules
  6. Blueprint patterns - every (pattern: <name>) in 3-build-a-deck/blueprints/*.md
                          resolves to a real 2-patterns/<name>.md
"""
import os
import re
import sys

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["index.html", "how-to-use.html", "patterns.html", "examples.html"]
problems = []


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def check_links():
    for page in PAGES + ["404.html"]:
        path = os.path.join(SITE, page)
        if not os.path.exists(path):
            problems.append(f"[links] missing page: {page}")
            continue
        html = read(path)
        base = os.path.dirname(path)
        for ref in re.findall(r'(?:href|src|data-file)="([^"]+)"', html):
            if ref.startswith(("http://", "https://", "data:", "mailto:", "#", "javascript:")):
                continue
            rel = ref.split("#")[0].split("?")[0]
            if not rel:
                continue
            target = os.path.normpath(os.path.join(base, rel))
            if not os.path.exists(target):
                problems.append(f"[links] {page}: broken -> {ref}")


def check_div_balance():
    for page in PAGES + ["404.html"]:
        path = os.path.join(SITE, page)
        if not os.path.exists(path):
            continue
        html = read(path)
        opens = len(re.findall(r"<div\b", html))
        closes = len(re.findall(r"</div>", html))
        if opens != closes:
            problems.append(f"[divs] {page}: {opens} <div> vs {closes} </div>")


def check_og_image():
    if not os.path.exists(os.path.join(SITE, "assets", "og.png")):
        problems.append("[og] assets/og.png is missing (referenced by og:image)")


def check_meta():
    required = {
        'description': r'name="description"',
        'og:title': r'property="og:title"',
        'og:image': r'property="og:image"',
        'twitter:card': r'name="twitter:card"',
    }
    for page in PAGES:
        path = os.path.join(SITE, page)
        if not os.path.exists(path):
            continue
        html = read(path)
        for label, pat in required.items():
            if not re.search(pat, html):
                problems.append(f"[meta] {page}: missing {label}")


def check_deck_shell():
    path = os.path.join(SITE, "3-build-a-deck", "SLIDE-DECK-shell.html")
    if not os.path.exists(path):
        problems.append("[deck] 3-build-a-deck/SLIDE-DECK-shell.html is missing")
        return
    html = read(path)
    for token in ["@page", "print-color-adjust", "page-break-after", 'class="slide"']:
        if token not in html:
            problems.append(f"[deck] shell missing rule: {token}")


def check_blueprint_patterns():
    bp_dir = os.path.join(SITE, "3-build-a-deck", "blueprints")
    if not os.path.isdir(bp_dir):
        problems.append("[blueprints] 3-build-a-deck/blueprints/ is missing")
        return
    files = [f for f in os.listdir(bp_dir) if f.endswith(".md") and f != "README.md"]
    if not files:
        problems.append("[blueprints] no blueprint .md files found")
    for fn in files:
        path = os.path.join(bp_dir, fn)
        text = read(path)
        names = re.findall(r"pattern:\s*([a-z0-9-]+)\)", text)
        if not names:
            problems.append(f"[blueprints] {fn}: no (pattern: ...) references found")
        for name in names:
            recipe = os.path.join(SITE, "2-patterns", f"{name}.md")
            if not os.path.exists(recipe):
                problems.append(f"[blueprints] {fn}: unknown pattern '{name}' (no 2-patterns/{name}.md)")


def main():
    check_links()
    check_div_balance()
    check_og_image()
    check_meta()
    check_deck_shell()
    check_blueprint_patterns()
    if problems:
        print("FAIL — %d problem(s):" % len(problems))
        for p in problems:
            print("  " + p)
        return 1
    print("OK — links, structure, og image, meta, deck shell, and blueprint patterns all pass.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
