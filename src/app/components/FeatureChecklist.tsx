import { Check } from "lucide-react";
import type { MaturityMode } from "./MaturityToggle";

export type FeatureId =
  | "customHeader"
  | "customSubheader"
  | "searchSummary"
  | "multiChannelEscalation"
  | "filterSort"
  | "aiAssistArticles"
  | "multiObjectSuggestions";

export type FeatureFlags = Record<FeatureId, boolean>;

export const FEATURE_ITEMS: {
  id: FeatureId;
  label: string;
  availableIn: MaturityMode[];
}[] = [
  {
    id: "customHeader",
    label: "Customized header",
    availableIn: ["search-enhanced", "conversational"],
  },
  {
    id: "customSubheader",
    label: "Customized subheader",
    availableIn: ["search-enhanced", "conversational"],
  },
  {
    id: "searchSummary",
    label: "Search summary",
    availableIn: ["search-enhanced"],
  },
  {
    id: "multiChannelEscalation",
    label: "Multi channel escalation",
    availableIn: ["conversational"],
  },
  {
    id: "filterSort",
    label: "Filter and sort",
    availableIn: ["search-enhanced"],
  },
  {
    id: "aiAssistArticles",
    label: "AI assist on articles",
    availableIn: ["search-enhanced"],
  },
  {
    id: "multiObjectSuggestions",
    label: "Grouped bar suggestions",
    availableIn: ["search-enhanced", "conversational"],
  },
];

export function defaultFlagsForMode(mode: MaturityMode): FeatureFlags {
  return Object.fromEntries(
    FEATURE_ITEMS.map((item) => [item.id, item.availableIn.includes(mode)]),
  ) as FeatureFlags;
}

export function isFeatureAvailable(id: FeatureId, mode: MaturityMode): boolean {
  return FEATURE_ITEMS.find((item) => item.id === id)?.availableIn.includes(mode) ?? false;
}

interface FeatureChecklistProps {
  mode: MaturityMode;
  flags: FeatureFlags;
  onChange: (id: FeatureId, enabled: boolean) => void;
}

export function FeatureChecklist({ mode, flags, onChange }: FeatureChecklistProps) {
  return (
    <div className="shrink-0 rounded-[14px] bg-[#e8e8ed] border border-[#d8d8e0] px-[10px] py-[12px]">
      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280] mb-[8px] px-[4px]">
        Feature checklist
      </p>
      <ul className="flex flex-col gap-[2px]">
        {FEATURE_ITEMS.map((item) => {
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
    </div>
  );
}
