import { Check } from "lucide-react";
import type { MaturityMode } from "./MaturityToggle";

export type FeatureId =
  | "customHeader"
  | "customSubheader"
  | "searchSummary"
  | "multiChannelEscalation"
  | "filterSort"
  | "aiNudges"
  | "aiAssistArticles"
  | "multiObjectSuggestions"
  | "inChatRecommendations"
  | "dynamicCards";

/** Screens where a feature checkbox is relevant. */
export type FeaturePage = "home" | "results" | "article" | "chat";

export type FeatureFlags = Record<FeatureId, boolean>;

const PAGE_LABELS: Record<FeaturePage, string> = {
  home: "Home",
  results: "Search results",
  article: "Article",
  chat: "Conversation",
};

export const FEATURE_ITEMS: {
  id: FeatureId;
  label: string;
  availableIn: MaturityMode[];
  /** Pages where this control is meaningful. */
  pages: FeaturePage[];
  /** When available in a mode, whether it starts on. Defaults to true. */
  defaultOn?: boolean;
}[] = [
  {
    id: "customHeader",
    label: "Customized header",
    availableIn: ["search-enhanced", "conversational"],
    pages: ["home"],
  },
  {
    id: "customSubheader",
    label: "Customized subheader",
    availableIn: ["search-enhanced", "conversational"],
    pages: ["home"],
  },
  {
    id: "searchSummary",
    label: "Search summary",
    availableIn: ["search-enhanced"],
    pages: ["results"],
  },
  {
    id: "multiChannelEscalation",
    label: "Multi channel escalation",
    availableIn: ["conversational"],
    pages: ["home", "chat"],
  },
  {
    id: "filterSort",
    label: "Filter and sort",
    availableIn: ["search-enhanced"],
    pages: ["results"],
  },
  {
    id: "aiNudges",
    label: "AI suggestion chips",
    availableIn: ["search-enhanced"],
    pages: ["results"],
    defaultOn: false,
  },
  {
    id: "aiAssistArticles",
    label: "AI assist on articles",
    availableIn: ["search-enhanced"],
    pages: ["article"],
  },
  {
    id: "multiObjectSuggestions",
    label: "Search bar suggestions",
    availableIn: ["search-enhanced", "conversational"],
    pages: ["home", "chat"],
  },
  {
    id: "inChatRecommendations",
    label: "In-chat recommendations",
    availableIn: ["search-enhanced", "conversational"],
    pages: ["chat"],
  },
  {
    id: "dynamicCards",
    label: "Dynamic cards",
    availableIn: ["search-enhanced", "conversational"],
    pages: ["chat"],
  },
];

export function defaultFlagsForMode(mode: MaturityMode): FeatureFlags {
  return Object.fromEntries(
    FEATURE_ITEMS.map((item) => [
      item.id,
      item.availableIn.includes(mode) && item.defaultOn !== false,
    ]),
  ) as FeatureFlags;
}

export function isFeatureAvailable(id: FeatureId, mode: MaturityMode): boolean {
  return FEATURE_ITEMS.find((item) => item.id === id)?.availableIn.includes(mode) ?? false;
}

interface FeatureChecklistProps {
  mode: MaturityMode;
  page: FeaturePage | null;
  flags: FeatureFlags;
  onChange: (id: FeatureId, enabled: boolean) => void;
}

export function FeatureChecklist({ mode, page, flags, onChange }: FeatureChecklistProps) {
  const items = page
    ? FEATURE_ITEMS.filter((item) => item.pages.includes(page))
    : [];

  return (
    <div className="shrink-0 rounded-[14px] bg-[#e8e8ed] border border-[#d8d8e0] px-[10px] py-[12px]">
      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280] mb-[2px] px-[4px]">
        Component checklist
      </p>
      {page && (
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-[#9ca3af] mb-[8px] px-[4px]">
          {PAGE_LABELS[page]}
        </p>
      )}
      {items.length === 0 ? (
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[16px] text-[#9ca3af] px-[4px] py-[4px]">
          No components for this page
        </p>
      ) : (
        <ul className="flex flex-col gap-[2px]">
          {items.map((item) => {
            const available = item.availableIn.includes(mode);
            const on = available && flags[item.id];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={!available}
                  onClick={() => available && onChange(item.id, !flags[item.id])}
                  title={
                    available
                      ? undefined
                      : `Not available in ${
                          mode === "current"
                            ? "Current contact center"
                            : mode === "search-enhanced"
                              ? "Search enhanced"
                              : "Fully conversational"
                        }`
                  }
                  className={`w-full flex items-start gap-[8px] rounded-[8px] px-[6px] py-[7px] text-left transition-colors ${
                    available
                      ? "hover:bg-black/[0.04] cursor-pointer"
                      : "opacity-40 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`mt-[1px] size-[14px] rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${
                      on
                        ? "bg-[#1a1a2e] border-[#1a1a2e] text-white"
                        : "bg-white border-[#b0b0bc]"
                    }`}
                  >
                    {on && <Check className="size-[9px]" strokeWidth={3} />}
                  </span>
                  <span
                    className={`font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[15px] ${
                      on ? "text-[#1a1a2e]" : "text-[#6b7280]"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
