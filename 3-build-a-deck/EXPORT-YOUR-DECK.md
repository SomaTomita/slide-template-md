# EXPORT-YOUR-DECK — present or share your slides

> You've generated slides in the chat. Turn them into one deck you can actually use —
> no export tools. Built around `SLIDE-DECK-shell.html` (a self-contained, print-ready deck).

## Step 1 — assemble your slides into one file
Attach `SLIDE-DECK-shell.html` + your `slide_template.md`, then paste:

```text
Using the attached SLIDE-DECK-shell.html, assemble my full deck.
- Fill :root with the colors and fonts from my slide_template.md.
- Replace the two example <section class="slide"> blocks with ONE per slide, in order.
- Build each slide from the pattern I name (see 2-patterns/), self-contained inside the shell.
- Keep the print rules and the <script> unchanged. Output the full HTML file only.
```

Save what it returns as `deck.html`.

## Step 2 — use it

### A) Present it — recommended (exact 16:9, nothing to export)
Open `deck.html` in a browser → press **P** → **→ / Space / click** to advance, **F** for
fullscreen, **Esc** to exit. Nothing to install or convert.

### B) A PDF to send (handout / attachment)
Open `deck.html` → **Print** (Cmd/Ctrl + P) → **Save as PDF**, with:
- **Layout: Landscape**
- **Margins: None**
- **Background graphics: ON**  ← without this, the colors print blank
- One slide per page. Browsers rarely offer a 16:9 paper size, so each slide prints
  onto a taller page and sits centered with **visible white bands above and below**
  (often a quarter of the page or more) — the slide itself still looks right, just
  smaller on the page. Fine for a handout; if it bothers you, present instead (A).

### C) Into PowerPoint / Google Slides (editable-ish)
Simplest: make the PDF (B), then insert each page as an image; or run the PDF through an
online PDF→PPTX. Advanced & model-dependent: ask an AI that can run code to emit `.pptx`
via `python-pptx` from the same content — quality varies by model; treat it as experimental.

> Honest limit: pixel-exact 16:9 PDF straight from a browser print dialog isn't guaranteed —
> so **present in the browser (A)** when you can, and use the PDF (B) to share.
