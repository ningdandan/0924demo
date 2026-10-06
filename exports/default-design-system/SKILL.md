---
name: search-exp-default-style
description: >-
  Applies the Search Experience default design system (Plus Jakarta Sans,
  navy/purple brand, sky-periwinkle theme gradient, AI assist card, search bar
  glow, subtle nudge chips). Use when building or restyling UI to match the
  default search-experience look, or when the user asks for default CSS tokens,
  AI summary card styling, search bar styling, or to reuse this design system.
---

# Search Experience — Default style

## Source package

Copy from the originating repo:

`exports/default-design-system/`

| File | Purpose |
|------|---------|
| `tokens.css` | CSS variables (colors, gradients, shadows, type, radii) |
| `style-guide.html` | Visual reference + component CSS to copy |
| `SKILL.md` | This skill |

Canonical token JSON in the original app: `src/app/designTokens.json`.

## Rules when implementing UI

1. **Font**: Plus Jakarta Sans for body and headings. Load from Google Fonts if needed.
2. **Page background**: use `--gradient-page` (soft green → lavender → blue), not flat purple-on-white.
3. **Primary CTA**: `--gradient-button-primary` (deep navy), white text, ~10px radius, 13px semibold.
4. **Search bar (closed)**: pill (`border-radius: 9999px`) with `--theme-gradient` ring and `--shadow-search-glow`. Inner field white. Max width ~896px.
5. **Search bar (open)**: white panel, radius 16–20px, suggestions below.
6. **AI assist card**: white, `1px #e8e8ed` border, 16px radius, soft card shadow. Label row with sparkles + 12px semibold muted title. Body 14px / 22px. Highlight facts with `#dce8ff` mark + navy text.
7. **Follow-up chips (subtle)**: pill, `#fafafb` fill, `#e4e4ea` border, 12px `#6b7280` text — use under ask input.
8. **Theme chips (primary)**: soft overlay on `--theme-gradient`, navy text, optional sparkles icon.
9. **Result titles**: 18px semibold `--brand-navy-deep`; snippets 14px `--ui-muted-dark`.
10. **Avoid**: generic Inter/Roboto stacks; purple-on-white AI clichés; cream+serif terracotta; flat single-color pages without atmosphere.

## Token quick reference

```
--brand-navy-deep: #001769
--brand-navy: #1e1b4b
--brand-purple: #8200db
--ui-body: #364153
--ui-muted: #9ca3af
--ui-muted-dark: #6b7280
--ui-border-faint: #e5e7eb
--ui-bg-page: #f5f5f7
--accent-indigo: #6366f1
--theme-gradient: linear-gradient(135deg, #D6EFFC, #D8E4FF, #D6F3FD)
--gradient-button-primary: linear-gradient(142.634deg, #101C86, #020642)
--font-body: 'Plus Jakarta Sans', sans-serif
```

## Component mapping (original React)

| Pattern | Component |
|---------|-----------|
| Search pill | `SearchFirstPromptBar` / `SearchBar` |
| AI summary | `SmartSummaryBlock` → `AiAssistCard` |
| Suggestion chips | `AiNudgeChips` (`subtle` / default) |
| Action cards | `cardStyles.ts` tokens |

When porting, prefer CSS variables from `tokens.css` over hard-coded hex duplicated from Tailwind class strings.
