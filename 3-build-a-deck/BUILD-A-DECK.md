# BUILD-A-DECK — build slides one at a time

> Build slides by handing your `slide_template.md` + chosen pattern(s) + content to the AI.

## Steps
1. Pick a pattern name from the gallery (`patterns.html` / `2-patterns/`) — e.g. `three-kpi-big-number`.
2. Attach your **`slide_template.md`** and that pattern's recipe, **`2-patterns/<name>.md`** (the **Copy recipe** / **Download** buttons on the Patterns page give you exactly this file).
3. Build **one** slide with the prompt below. If it's good, do the next one with the next pattern.
4. Refine 1–2 times (below).

## Build one slide
```text
Using the attached slide_template.md (design) and the layout recipe {{name}}.md,
create one 16:9 slide.

Topic / content: {{your points here}}

Rules: slide_template.md is authoritative. One idea per slide. Title = a full-sentence
action title (states the point). Colors/fonts from slide_template.md only. Just one slide first.
```

## Make it a whole deck (optional)
- In `SLIDE-DECK-template.md`, write the title, audience, goal, slide count, and a pattern per slide, then hand it all over to generate in sequence.
- Starting from scratch? Use a ready-made storyline in `blueprints/` (sales proposal, company pitch, quarterly report, research report) instead of the blank template.

## Refine (one line each)
- "Bring the title and subtitle closer."
- "Only fix this; leave everything else."
- "Use the logo as-is; don't modify it."
- Image compare is most precise: "Page 1 = your output, Page 2 = my fix — match Page 2."
- Say "this is the final pass" to stop.

> The AI's first output is rough by design. 1–2 minutes of nudging per slide gets it there — faster than building from scratch.
