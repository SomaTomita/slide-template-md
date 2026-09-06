# slide_template.md — Design System (template)

> Paste this file (with `{{...}}` filled in for your brand) into your AI slide tool
> (Claude Design / Gemini / NotebookLM …) together with the layout pattern(s) you chose.
> Full rules, anti-patterns and a pre-flight checklist live in `SLIDE-DESIGN-RULES.md`.

## Overview
- **Reference:** {{your website / brand guideline}}
- **Use case (tone):** {{e.g. modern B2B SaaS / conservative report / editorial}}

## Mode  (decide first — the slide's job)
- `mode: {{present | document}}`
  - **present** = projected, you speak: 1 idea/slide, ≥30pt, big visuals, very few words.
  - **document** = read alone (handout / proposal): full sentences, denser, smaller body OK.
- Never build a slide that is both (the "slideument" trap).

## Colors  (60-30-10 · ≤4 colors + neutrals · WCAG AA: body ≥4.5:1, large ≥3:1)
| role | name | hex |
|---|---|---|
| Background (60%) | {{off-white}} | {{#F7F6F2}} |
| Secondary (30%) | {{}} | {{}} |
| Accent (10%, focal only) | {{}} | {{}} |
| Ink (text) | {{near-black}} | {{#1A1A1A}} |
| Muted / hairline | {{}} | {{#D9D9D5}} |
- Avoid pure `#000`/`#FFF`. One accent owns the focal point; everything else neutral/gray.

## Typography  (max 2 typefaces · sans for body · scale ratio ~1.25 · never <18pt at full scale)
- Heading font: **{{Inter}}**  ·  Body font: **{{Inter}}**

| token | 1920×1080 | 960×540 | weight | line-height |
|---|---|---|---|---|
| Display / title slide | 44pt | 22pt | 700 | 1.1 |
| H1 slide title | 36pt | 18pt | 600 | 1.15 |
| H2 subhead | 28pt | 14pt | 600 | 1.25 |
| Body | 22pt | 12pt | 400 | 1.5 |
| Caption | 16pt | 10pt | 400 | 1.4 |
- Display tracking −0.02em · UPPERCASE labels +0.08em · body measure ≤66 chars · real bold/italic only.

## Layout & spacing
- 16:9, 1920×1080. Outer safe margin **96px (5%)**; gutter **24px**.
- 12-column grid; **8px spacing scale** (8/16/24/32/48/64). Keep **≥15–20% whitespace**.

## Slide frame  (identical position on every slide)
- Title top-left → subtitle below → body. Page number bottom-right. Logo {{top-right}} — never distort, keep transparency.

## Charts & diagrams
- Pick by relationship: **trend → line**, **compare → bar (zero baseline)**, **composition → stacked bar** (avoid pie/donut), **relationship → scatter**.
- Color **one** series in accent, rest gray. **Direct labels** over legends. No 3-D, no chartjunk; no frame around the plot.
- Diagrams: align to grid, equal spacing, one flow direction, ≤5 nodes, 1 accent + grays.

## Visual hierarchy
- size → weight → color → position. Primary message top-left or on a rule-of-thirds point. **One accent per slide.**

## Do / Don't
- **Do:** action-title (a full sentence stating the slide's point); one idea per slide; show, don't tell; big legible type.
- **Don't:** walls of text; >2 fonts; rainbow color; tiny fonts; pure `#000` on `#FFF`; the slideument hybrid.
