# CREATE-YOUR-DESIGN — build your own design system (slide_template.md)

> Generate your own `slide_template.md` from your brand. Paste into Claude Design / Gemini, etc.

## How to
1. Attach **`slide_template.md`** (template) and **`SLIDE-DESIGN-RULES.md`** to the AI.
2. Add your brand cues: brand colors (hex) / a logo image / a screenshot or URL of your site.
3. Paste the prompt below. Save the `slide_template.md` it returns and reuse it.

## Prompt
```text
Using the attached slide_template.md (template) and SLIDE-DESIGN-RULES.md, create a slide_template.md
for our brand.

- Brand colors: {{list #HEX, or "sample from the attached screenshot / this URL"}}
- Logo: {{attached; top-right on every slide; never distort or recolor; keep transparency}}
- Mode: {{present | document}}
- Tone: {{conservative | balanced | stylish}}

Replace every {{...}} with concrete values. Keep 60-30-10, WCAG AA (body 4.5:1),
max 2 fonts, 8px spacing, 16:9. Don't over-decorate.
Output only the finished slide_template.md (markdown).
```

## Check the output has
- [ ] Concrete hex (background / secondary / accent / ink / muted) in a 60-30-10 split
- [ ] At most two fonts + a body size scale
- [ ] A chosen mode (present / document)
- [ ] Fixed positions for logo / title / page number
- [ ] Chart & diagram rules

## Refine (one line each)
- "Accent is too loud — desaturate one step."
- "Body contrast is under 4.5:1 — darken the ink."
- "There are three fonts — reduce to two."

> Prefer a ready-made starting point? Pick one of the ten systems in `examples/` and save it.
