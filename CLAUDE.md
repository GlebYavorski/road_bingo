# CLAUDE.md

Guidance for Claude Code working in this repo.

## What This Is

Static web app: **"Дорожное бинго"** — a road-trip bingo card generator for kids, **bilingual (RU/EN)**. No build step, no dependencies, no backend. Pure HTML + CSS + vanilla JS, split into a few flat files served as-is.

Made for the Telegram channel **@carpemachinatio** (https://t.me/carpemachinatio).

## Files

Loaded via plain `<link>`/`<script>` tags in order — no bundler. Browser fetches each directly; Cloudflare serves them static.

- `index.html` — thin shell: head/meta, markup, control buttons. Translatable text carries `data-i18n="key"` (plain text) or `data-i18n-html="key"` (markup); filled on load from `STRINGS`.
- `styles.css` — all CSS (themes, layout, print).
- `words.js` — `WORDS = {ru, en}`, the default word lists (~67 each). RU = post-Soviet/European road realities; EN = US/UK road-trip realities (RV, pickup, mailbox, billboard…). **Not translations of each other** — curated per region.
- `i18n.js` — `STRINGS = {ru, en}`, all UI strings. Static keys are strings; dynamic ones (counter, card title, share alert) are functions. Functions reference the global `NEEDED` from `app.js` (resolved at call time).
- `app.js` — all logic: parsing, render, theme, language, share link, init.

## How It Works

- Renders 5×5 bingo cards. Center cell is a free "Бинго"/"Bingo" space (light-gray, ink-saving for B/W printers).
- A built-in word list (`WORDS[lang]`) seeds the cards; user can edit the list in a textarea.
- Each line format: **1–3 emoji**, space, then **label** (RU or EN). Parser (`parseLine`) splits at the first letter — leading run = emoji image, rest = caption. Multiple emoji help pre-readers (kids).
- Emoji font auto-scales by count: 1 → 40px, 2 → 32px, 3 → 25px (`emojiCount` uses `Intl.Segmenter` for ZWJ/flags).
- Cards are randomized per generation (`shuffle`, Fisher-Yates). "Сгенерировать"/"Generate" rebuilds; count selectable 1–40.
- Live counter shows valid line count vs the needed 24.
- **Language**: `LANG` ('ru'|'en'). Resolved at init by priority **`?lang=` → `localStorage` → `navigator.language` → ru**. Toggle button (top-left) flips it and persists to `localStorage`. Switching swaps the default word list **only if** the textarea still holds the old language's default — a customized/`?list=` list is left untouched. `setLang` re-applies `STRINGS`, `<html lang>`, `document.title`, and re-renders.
- **URL param `?list=`** carries a base64 (UTF-8-safe) encoded list so links pre-fill the textarea. Share button builds `?lang=<lang>&list=<...>` and copies it.
- Print CSS (`@media print`) hides controls, shows only cards, A4 portrait. Use browser Print → Save as PDF.

## Conventions

- Keep it **zero-build, zero-dependency**: flat static files loaded by `<script>`/`<link>`, no frameworks, no bundler. Split files by concern when one grows unwieldy; don't introduce tooling. If that ever changes, document why here first.
- UI text is **bilingual RU/EN** — all user-facing strings live in `i18n.js`, never hard-coded in markup or logic. Add a key to **both** `ru` and `en`. Code identifiers/comments may be English.
- Optimize for **B/W printing**: avoid heavy ink fills, keep backgrounds white/light-gray.
- Emoji render differently per browser — verify print output in the browser the user actually prints from.

## Deployment

Target: **Cloudflare Pages** (user preference).

- Static site, root = repo root, no build command, output dir = `/` (or `.`). All `.html`/`.css`/`.js` files ship as-is.
- **i18n SEO caveat**: language is switched client-side (one URL). Static `<head>` meta (title/OG/`og:locale`) stays Russian, so Telegram/crawler previews are always RU regardless of `?lang=`. `hreflang` alternates point en → `?lang=en`. If proper per-language previews/SEO become important, split into separate static entry pages (e.g. `/` + `/en/`) sharing the same css/js — document the move here first.
- After deploy: take a screenshot of a card, host it, and set `<meta property="og:image">` in `index.html` (currently empty) so Telegram link previews show an image. `og:title`/`og:description` already set.
- OG tags only work once hosted (Telegram crawler can't read a local file).

## Origin

Prototyped inside an Obsidian vault note ("Дорожный бинго"), then moved here. The vault still holds the source word list / idea notes; this repo is the deployable app.
