# Component lab — integration prep

This folder holds **extracted** components from the Figma Make design packages.
They are **not** wired into the product demo yet.

## Packages

| Lab id | Source / notes | App-CSS component | Spec / demo |
| --- | --- | --- | --- |
| `prompt-bar` | Existing `SearchFirstPromptBar` + results follow-up ask | *(integration later)* | `prompt-bar/PromptBarSpec.tsx` |
| `search-suggestions` | Existing `SuggestionGroupList` under the prompt | Already in product (`SuggestionGroups.tsx`) | `search-suggestions/SearchSuggestionsSpec.tsx` |
| `search-summary` | Existing `SmartSummaryBlock` / `AiAssistCard` | *(integration later — already in product)* | `search-summary/SearchSummarySpec.tsx` |
| `dynamic-card` | `Component - Dynamic card designs` | `components/DynamicCard.tsx` + `ChatDynamicCard.tsx` (wired into `ChatScreen`) | `DesignSpec.tsx` + gallery · checklist: `dynamicCards` |
| `in-chat` | `Component - In Chat Recommendations` | `components/RecommendationChips.tsx` (wired into `ChatScreen`) | `SpecSheet.tsx` + `ChatDemo.tsx` · checklist: `inChatRecommendations` |
| `nudge-ha` | `Component - Nudge - HAs` | `nudge-ha/NudgePills.tsx` | `NudgeHaDesignSource.tsx` + `specs/nudge-ha-design-spec-sheet.md` |

Design-folder CSS / shadcn theme was **not** imported. Product components use this app’s `cardStyles`, Plus Jakarta, and `useDesignTokens` / `useTheme`.

## Open the lab

Left sidebar → **Component lab** (or set `labOpen` in `App.tsx`).

Tabs per package:

- **Component** — live control styled with app CSS
- **Specs** — original design spec sheet (scroll animations)
- **Demo** — original interactive prototype (where available)

## Next step: integrate everywhere on screen

When integrating, wire each control through **all** of:

1. **Default skin**
2. **Disney+ skin** (`HostShell` / `HostSearchResults` path)
3. **Southwest skin**
4. **Feature checklist** page-scoped flags (home / results / article / chat)
5. **Maturity modes** that should expose the feature

### Suggested checklist flags (draft)

| Feature | Suggested `FeatureId` | Pages |
| --- | --- | --- |
| Dynamic cards in chat | `dynamicCards` | `chat` |
| In-chat recommendation chips | `inChatRecommendations` | `chat` |
| HA nudge pills | `haNudges` | `home`, `article`, `chat` |

### Placement hints

- **DynamicCard** → conversational `ChatScreen` (and host chat) where action cards already appear (`SendNotificationCard` / cardStyles family).
- **RecommendationChips** → bottom of chat composer (near existing suggestion / escalation UI).
- **NudgePills** → help home search area, article AI zone, and chat follow-ups (matches HA design placements).

Do not ship only on the default skin — host CSS wrappers must compose the same shared components.
