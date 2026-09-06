#!/usr/bin/env python3
import re, os, html

# slide-en root, resolved relative to this script (slide-en/tools/genpat.py)
SRC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(SRC, "2-patterns")
os.makedirs(OUT, exist_ok=True)
doc = open(os.path.join(SRC, "patterns.html"), encoding="utf-8").read()

# group headings with positions  -> category names
groups = []
for m in re.finditer(r'<div class="group"><h2>(.*?)</h2>', doc, re.S):
    name = m.group(1).replace("&amp;", "&")
    name = re.sub(r'^[^A-Za-z]+', '', name).strip()   # strip leading emoji/space
    groups.append((m.start(), name))

# cards: pname + tag, with positions
cards = list(re.finditer(r'<span class="pname">([^<]+)</span><span class="tag (present|hybrid|read)"', doc))

USE = {"present": "Present", "hybrid": "Hybrid", "read": "Read"}
USENOTE = {
    "present": "Projected, you speak — keep words minimal, type big (>=30pt).",
    "hybrid":  "Works both projected and as a read-alone handout.",
    "read":    "Read alone (handout/doc) — fuller sentences and denser text are OK.",
}

# class -> structure phrase, in priority order
PH = [
 ("nb-sec","an inverse ink section divider — a mono section marker, a small label, a huge bold heading and a handwritten aside"),
 ("tt-fin","a colophon closer — kicker and italic sign-off, a giant 'Fin.', a few pills, then a four-column credits list over a rule"),
 ("tt-quote","a pull-quote on the left (italic serif with one bold sans phrase, avatar attribution) and an ink panel of three roman-numbered short reads on the right"),
 ("mh-state","a centered statement in heavy display serif with a stacked double rule bracketing one word, then three numbered supporting cells over a thick rule"),
 ("nb-stats","three pinned stat cards — tilted, hard offset shadows, a giant figure with a small unit, a bold caption and one line of body"),
 ("ed-agenda","an editorial agenda — five tall tiles in a row, each a mono number, a serif topic title and a small footer label; tiles alternate ink, soft and card fills"),
 ("ed-twocol","an editorial two-column — a large image placeholder with a caption row on the left; kicker, serif headline, two paragraphs and a three-column meta list on the right"),
 ("ed-steps","four step tiles in a row (two filled), each a mono step number, a serif title, one line of body and an owner / timing marker"),
 ("nb-agenda","a notebook agenda — numbered rows with dotted leaders running to a mono duration on the right, ruled top and bottom"),
 ("nb-quote","a pinned quote card — a tilted card with a hard offset shadow, a giant opening quote mark, the quote and the speaker"),
 ("nb-ledger","a comparison ledger — a bordered grid with an ink header row, one row per lever, and pill-shaped verdicts in each cell"),
 ("tt-tl","a five-stop timeline — a thin axis with dots, an italic serif year, a bold title and a caption per stop, and a pill ribbon along the bottom"),
 ("tt-grid","eight principle cards in a 4x2 grid, each an italic index, a bold title and two lines; a few cards carry soft, ink or accent fills"),
 ("mh-cover","a masthead cover on an accent ground — an italic 'The', two lines of huge display serif, and a stacked double rule bracketing a small word between them"),
 ("mh-kpi","a KPI grid — masthead rule, serif headline, then four tiles with a mono label, a big serif figure, a delta and a one-line note; tiles alternate inverse ink"),
 ("ed-cover","an editorial cover — a mono topbar with a monogram circle, an oversized serif title in the lower left, and a ruled footline"),
 ("ed-mani","a manifesto split — left: chapter numeral and a lede with an italic serif emphasis; right: an inverse ink panel with a short note and a signature"),
 ("ed-fig","a headline-figure slide on an inverse ink ground — one giant number with a serif unit, a short annotation, and a small breakdown of bars"),
 ("ed-open","a section opener — an inverse panel with a giant numeral on the left; kicker, serif title, a stacked double rule, lede and pill marks on the right"),
 ("ed-pins","three note cards pinned to the page — hard offset shadows, slight tilt, a mono rule number, a bold title, a line of body and a handwritten aside"),
 ("divider","a section divider — a big section number and title with a vertical accent bar"),
 ("c-center","a centered cover — kicker, large title, subtitle"),
 ("c-split","a cover with a full-bleed image on the left and the title on the right"),
 ("c-grad","a cover with a gradient panel and the title near the bottom"),
 ("s-key","a single key message, centered and framed by hairlines"),
 ("qtext","a large pull-quote, centered, with attribution"),
 ("kpirow","three large KPI numbers in a row, each with a label and a small change indicator"),
 ("split6040","a big number / statement on the left and a small supporting chart on the right"),
 ("combo","vertical bars with a trend line overlaid"),
 ("barchart","a vertical bar chart on a zero baseline; one bar highlighted in the accent"),
 ("hbars","horizontal bars, one per metric, with value labels"),
 ("stackbar","a stacked bar chart with a legend (composition over time)"),
 ("threecol-charts","three donut / progress rings side by side, each with a caption"),
 ("donutwrap","a donut chart with a labeled breakdown list beside it"),
 ("donutc","a donut / progress ring with a central value"),
 ("fbig","four numbered steps left-to-right, each a short label + one line"),
 ("fimg","four steps, each with an image placeholder, a label and a caption"),
 ("fcallout","a step flow with a highlighted callout box"),
 ("pyr","a four-level pyramid, widest at the bottom"),
 ("funnel","a four-stage funnel narrowing downward; the final stage is highlighted"),
 ("venn","two overlapping circles with the overlap labeled"),
 ("quad","four quadrants arranged around a central core circle"),
 ("bicircle","two large circles exchanging through a center icon"),
 ("swim","two swimlanes (roles), each a row of steps left-to-right"),
 ("flow-dec","a flowchart with a decision diamond and two branches"),
 ("org","an org-chart tree: a top box connecting down to a row of boxes"),
 ("splitbox","two boxes (Before / After) with an arrow between them"),
 ("twocol2","two comparison columns with an arrow between them"),
 ("kanban","three columns (To do / Doing / Done) of cards"),
 ("gantt","a Gantt chart: tasks as rows, quarters as columns, a bar on each track"),
 ("plans","three pricing-plan cards, one marked recommended"),
 ("rmatrix","a 2x2 matrix with labeled axes"),
 ("vtl","a vertical timeline with a rail and dated rows"),
 ("mile2","a horizontal milestone timeline (Q1-Q4) with a box under each"),
 ("road","a winding road with numbered stops"),
 ("seqbody","a sequence diagram between actors, with messages passing between them"),
 ("glayers","a goal tree (KGI -> KPI -> actions) as stacked layers"),
 ("sum2","a numbered summary list of key points"),
 ("toc","an agenda / table-of-contents list"),
 ("plan","pricing / plan cards"),
 ("rows","customer testimonials as stacked rows — a photo on the left, the customer's name/role, and a longer quote"),
 ("tstm","customer testimonials — a 2x2 grid of cards, each a round avatar, a one-line headline and a short quote"),
 ("cards","a grid of cards, each a small headline + supporting line"),
 ("tbl","a data table with a header row"),
 ("vsteps","a vertical step flow with a rail and numbered steps"),
]
CATFB = {
 "Profiles":"a person profile — photo/avatar, name & role, and supporting details",
 "FAQ":"a Q&A list — questions paired with short answers",
 "Agenda":"an agenda / table-of-contents list",
 "Tables":"a data table",
}

def strip_tags(s):
    s = re.sub(r'<br\s*/?>', ' / ', s)
    s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(re.sub(r'\s+', ' ', s)).strip()

def first(rxs, seg):
    for rx in rxs:
        m = re.search(rx, seg, re.S)
        if m:
            t = strip_tags(m.group(1))
            if t:
                return t
    return ""

def slug(s):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')

# shared "how to drive the AI" block, reused in every bundle + ALL-PATTERNS
BUILD_INSTR = (
"> **Build instructions (every slide):**\n"
"> - Give the AI your `slide_template.md` (your design system) **+ this file**.\n"
"> - Per slide say: *\"a slide on <topic>\"* and let the AI pick a fitting layout below — or name one (e.g. *\"use `three-kpi-big-number`\"*).\n"
"> - One idea per slide. Title = a full-sentence action title. Keep one accent color; everything else neutral gray. Colors and fonts from `slide_template.md`. Write in `<language>`.\n"
)

index = {}
entries = {}   # cat -> [compact catalog entry]
for i, c in enumerate(cards):
    pname, tag = c.group(1), c.group(2)
    start = c.start()
    end = cards[i+1].start() if i+1 < len(cards) else doc.find('<style', start)
    if end == -1: end = len(doc)
    cat = ""
    for gpos, gname in groups:
        if gpos < start: cat = gname
        else: break
    sidx = doc.find('<div class="slide', start)
    seg = doc[sidx:end] if sidx != -1 and sidx < end else doc[start:end]

    classes = set()
    for cm in re.findall(r'class="([^"]+)"', seg):
        classes.update(cm.split())
    phrase = next((p for t, p in PH if t in classes), CATFB.get(cat, f"a {cat.lower()} layout"))

    kicker = first([r'class="(?:akick|kick|label|foot|lab|kicker|nb)"[^>]*>(.*?)<'], seg)
    title  = first([r'<h2[^>]*class="[^"]*atitle[^"]*"[^>]*>(.*?)</h2>',
                    r'<h2[^>]*class="[^"]*serif[^"]*"[^>]*>(.*?)</h2>',
                    r'<h2[^>]*>(.*?)</h2>',
                    r'class="qtext"[^>]*>(.*?)</p>'], seg)
    sub    = first([r'class="(?:sub|meta2|info|qby|dcap)"[^>]*>(.*?)<'], seg)

    used = {kicker, title, sub}
    slots, seen = [], set()
    for t in re.findall(r'>([^<>]+)<', seg):
        t = html.unescape(t).strip()
        if not t or t in used or t in seen: continue
        if not re.search(r'[A-Za-z0-9]', t): continue
        if len(t) > 64: continue
        if (title and t in title) or (kicker and t in kicker) or (sub and t in sub): continue
        seen.add(t); slots.append(t)
    slots = slots[:16]
    slotline = ", ".join(slots) if slots else "(your content)"

    md = f"""# {pname}

**Category:** {cat}  ·  **Use case:** {USE[tag]}

## What it is
{phrase[0].upper()+phrase[1:]}.

## Reference content (swap in your own)
- **Kicker / label:** {kicker or '—'}
- **Title (action title):** {title or '—'}
"""
    if sub:
        md += f"- **Subtitle:** {sub}\n"
    md += f"- **In the body:** {slotline}\n"
    md += f"""
## Prompt — build this slide
```text
Using the attached slide_template.md (my design system) and this layout recipe,
create one 16:9 slide.

Layout — {pname}: {phrase}.
Title is an action title (a full sentence stating the point). Keep one accent
color; everything else neutral gray. Colors, fonts and spacing come from
slide_template.md — do not restyle the layout.

Content:
- Kicker: {kicker or '...'}
- Title: {title or '...'}
- Body: {slotline}

Write the slide in <language>. Output one slide only.
```

## Notes
- **{USE[tag]}** — {USENOTE[tag]}
- Pair with your `slide_template.md`. Replace `<language>` with your language.
"""
    open(os.path.join(OUT, pname + ".md"), "w", encoding="utf-8").write(md)
    index.setdefault(cat, []).append(pname)

    # compact catalog entry (for category bundles + ALL-PATTERNS — no per-recipe boilerplate)
    ce = f"### {pname}\n*{cat} · {USE[tag]}* — {phrase[0].upper()+phrase[1:]}.\n"
    ref = f'title "{title}"' if title else ''
    if sub: ref = (ref + f' · subtitle "{sub}"') if ref else f'subtitle "{sub}"'
    if ref: ce += f"- Reference — {ref}\n"
    ce += f"- Body — {slotline}\n"
    entries.setdefault(cat, []).append(ce)

total = sum(len(v) for v in index.values())
ordered = [(g, slug(g), len(index[g])) for _, g in groups if g in index]

# ---- tier 2: category bundles ----
BUN = os.path.join(OUT, "bundles")
os.makedirs(BUN, exist_ok=True)
for gname, sg, n in ordered:
    body = [f"# {gname} — pattern bundle ({n})", "",
            f"> All {n} **{gname}** layouts in one file. Hand this to your AI with your `slide_template.md`, then name a layout — or let the AI pick.",
            BUILD_INSTR, "---", ""]
    body += entries[gname]
    open(os.path.join(BUN, sg + ".md"), "w", encoding="utf-8").write("\n".join(body).rstrip() + "\n")

# ---- tier 2b: curated sets (cross-category) ----
SETS = {
  "editorial-set": (
    "Editorial set",
    "The twenty editorial layouts (literary quarterly, fashion masthead, arts publication, field notebook) plus five everyday essentials, so one file covers a whole stylish deck.",
    ["editorial-cover-topbar","editorial-numeral-opener","masthead-cover-ornament","notebook-section-ink","trio-colophon-closer",
     "editorial-agenda-tiles","notebook-agenda-rows",
     "editorial-manifesto-split","editorial-two-col-image-meta","notebook-quote-pinned","trio-quote-endorsements","masthead-statement-three",
     "editorial-four-step-tiles","trio-timeline-five-stops",
     "pinned-notecards","trio-principles-grid","notebook-comparison-ledger",
     "editorial-big-figure","masthead-kpi-grid-four","notebook-three-stats-pinned",
     "three-kpi-big-number","kpi-bar-chart","four-step-flow","testimonial-2x2-avatar","closing-slide"]),
}
SETD = os.path.join(OUT, "sets")
os.makedirs(SETD, exist_ok=True)
ce_by_name = {}
for cat, lst in entries.items():
    for ce in lst:
        ce_by_name[ce.split("\n",1)[0][4:]] = ce
for sname, (title, desc, members) in SETS.items():
    missing = [m for m in members if m not in ce_by_name]
    if missing: raise SystemExit("set %s references unknown patterns: %s" % (sname, missing))
    body = [f"# {title} — pattern set ({len(members)})", "", f"> {desc}", BUILD_INSTR, "---", ""]
    body += [ce_by_name[m] for m in members]
    open(os.path.join(SETD, sname + ".md"), "w", encoding="utf-8").write("\n".join(body).rstrip() + "\n")

# ---- tier 3: everything in one file ----
allp = [f"# ALL-PATTERNS — every layout in one file ({total})", "",
        "> One file with **every** layout recipe. Best if you don't want to choose: give the AI this file + your `slide_template.md`, describe each slide, and let it pick the closest layout.",
        BUILD_INSTR, "", "## Contents"]
for gname, sg, n in ordered:
    allp.append(f"- **{gname}** ({n}): " + ", ".join(f"`{p}`" for p in index[gname]))
allp.append("\n---")
for gname, sg, n in ordered:
    allp.append(f"\n## {gname}\n")
    allp += entries[gname]
open(os.path.join(OUT, "ALL-PATTERNS.md"), "w", encoding="utf-8").write("\n".join(allp).rstrip() + "\n")

# ---- README: the 3 tiers ----
lines = [f"# Pattern recipes ({total} layouts)", "",
    "Three ways to use these:", "",
    "1. **One at a time** — open a recipe below, copy it, paste with your `slide_template.md` (or click a card on the Patterns page).",
    "2. **By category** — grab a whole category in one file: see **Category bundles**.",
    "3. **Everything** — [`ALL-PATTERNS.md`](ALL-PATTERNS.md): one file with every layout; hand it to your AI and let it pick.",
    "", "## Individual recipes"]
for gname, sg, n in ordered:
    lines.append(f"\n### {gname}\n")
    for p in index[gname]:
        lines.append(f"- [{p}]({p}.md)")
lines.append("\n## Curated sets\n")
for sname, (title, desc, members) in SETS.items():
    lines.append(f"- [{title}](sets/{sname}.md) ({len(members)}) — {desc}")
lines.append("\n## Category bundles\n")
for gname, sg, n in ordered:
    lines.append(f"- [{gname}](bundles/{sg}.md) ({n})")
lines += ["\n## Everything", "- [ALL-PATTERNS.md](ALL-PATTERNS.md)"]
open(os.path.join(OUT, "README.md"), "w", encoding="utf-8").write("\n".join(lines) + "\n")

print("generated", total, "recipes,", len(ordered), "category bundles, + ALL-PATTERNS.md in", OUT)
