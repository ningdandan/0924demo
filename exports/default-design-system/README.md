# Default design system export

Portable styling from this project's **default** skin (not Disney+/Southwest host skins).

## Contents

| File | What it is |
|------|------------|
| `tokens.css` | CSS custom properties — drop into any project |
| `style-guide.html` | Open in a browser for a visual styleguide + copyable component CSS |
| `SKILL.md` | Cursor Agent skill — install to reuse via the agent |

## Quick start

1. Open `style-guide.html` in a browser (needs `tokens.css` beside it).
2. Copy `tokens.css` into your other app.
3. Optional — install the skill for Cursor:
   ```bash
   mkdir -p ~/.cursor/skills/search-exp-default-style
   cp SKILL.md ~/.cursor/skills/search-exp-default-style/
   # Optionally also copy tokens.css / style-guide.html next to the skill
   ```

## Source of truth in this repo

- `src/app/designTokens.json`
- `src/app/components/AiAssistCard.tsx`, `AiNudgeChips.tsx`, `SearchFirstPromptBar.tsx`
- `src/app/components/cardStyles.ts`
