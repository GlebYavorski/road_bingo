# CLAUDE.md

Guidance for Claude Code working in this repo.

## What This Is

Single-page static web app: **"Дорожное бинго"** — a road-trip bingo card generator for kids (in Russian). One file, no build step, no dependencies, no backend. Pure HTML + CSS + vanilla JS in `index.html`.

Made for the Telegram channel **@carpemachinatio** (https://t.me/carpemachinatio).

## How It Works

- `index.html` renders 5×5 bingo cards. Center cell is a free "Бинго" space (light-gray, ink-saving for B/W printers).
- A built-in word list (`DEFAULT_LIST`, ~63 items) seeds the cards; user can edit the list in a textarea.
- Each line format: **1–3 emoji**, space, then **label** (RU or EN). Parser (`parseLine`) splits at the first letter — leading run = emoji image, rest = caption. Multiple emoji help pre-readers (kids).
- Emoji font auto-scales by count: 1 → 40px, 2 → 32px, 3 → 25px (`emojiCount` uses `Intl.Segmenter` for ZWJ/flags).
- Cards are randomized per generation (`shuffle`, Fisher-Yates). "Сгенерировать" rebuilds; count selectable 1–40.
- Live counter shows valid line count vs the needed 24.
- **URL param `?list=`** carries a base64 (UTF-8-safe) encoded list so links pre-fill the textarea. "🔗 Ссылка с этим списком" button builds + copies it.
- Print CSS (`@media print`) hides controls, shows only cards, A4 portrait. Use browser Print → Save as PDF.

## Conventions

- Keep it **single-file, zero-dependency**. No frameworks, no build tooling. If that ever changes, document why here first.
- UI text is **Russian**. Code identifiers/comments may be English.
- Optimize for **B/W printing**: avoid heavy ink fills, keep backgrounds white/light-gray.
- Emoji render differently per browser — verify print output in the browser the user actually prints from.

## Deployment

Target: **Cloudflare Pages** (user preference).

- Static site, root = repo root, no build command, output dir = `/` (or `.`).
- After deploy: take a screenshot of a card, host it, and set `<meta property="og:image">` in `index.html` (currently empty) so Telegram link previews show an image. `og:title`/`og:description` already set.
- OG tags only work once hosted (Telegram crawler can't read a local file).

## Origin

Prototyped inside an Obsidian vault note ("Дорожный бинго"), then moved here. The vault still holds the source word list / idea notes; this repo is the deployable app.
