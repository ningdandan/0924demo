import { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import {
  SearchResultsScreen,
  DEFAULT_SEARCH_RESULTS_VISIBILITY,
  type SearchResultsVisibility,
  type SearchBridgeContext,
} from "./SearchResultsScreen";

const CHECKLIST: { id: keyof SearchResultsVisibility; label: string }[] = [
  { id: "promptBar", label: "Prompt bar" },
  { id: "smartSummary", label: "Smart summary" },
  { id: "aiNudges", label: "AI nudges" },
  { id: "resultsMeta", label: "Results count" },
  { id: "filterSort", label: "Filter & sort" },
  { id: "resultsList", label: "Results list" },
  { id: "pagination", label: "Pagination" },
  { id: "articlePanel", label: "Article panel" },
];

interface SearchResultsLabScreenProps {
  onStartConversation?: (ctx: SearchBridgeContext) => void;
}

export function SearchResultsLabScreen({ onStartConversation }: SearchResultsLabScreenProps) {
  const [visibility, setVisibility] = useState<SearchResultsVisibility>(
    DEFAULT_SEARCH_RESULTS_VISIBILITY,
  );
  const [query, setQuery] = useState("How long do I have to respond to a chargeback?");

  const enabledCount = CHECKLIST.filter((c) => visibility[c.id]).length;

  const toggle = (id: keyof SearchResultsVisibility) => {
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setAll = (value: boolean) => {
    setVisibility(
      Object.fromEntries(CHECKLIST.map((c) => [c.id, value])) as SearchResultsVisibility,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex h-full min-h-0 w-full overflow-hidden"
    >
      <aside className="w-[220px] shrink-0 h-full min-h-0 flex flex-col bg-[#f7f7fa] border-r border-[#e4e4ea]">
        <div className="px-[20px] pt-[22px] pb-[16px]">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[14px] text-[#1a1a2e]">
            Components
          </h2>
          <p className="mt-[4px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#9ca3af]">
            {enabledCount}/{CHECKLIST.length} on
          </p>
        </div>

        <ul className="flex-1 min-h-0 overflow-y-auto px-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CHECKLIST.map((item) => {
            const on = visibility[item.id];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center gap-[10px] rounded-[8px] px-[8px] py-[9px] text-left hover:bg-black/[0.03] transition-colors"
                >
                  <span
                    className={`size-[16px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                      on
                        ? "bg-[#1a1a2e] border-[#1a1a2e] text-white"
                        : "bg-transparent border-[#c8c8d0]"
                    }`}
                  >
                    {on && <Check className="size-[10px]" strokeWidth={3} />}
                  </span>
                  <span
                    className={`font-['Plus_Jakarta_Sans',sans-serif] text-[13px] ${
                      on ? "text-[#1a1a2e]" : "text-[#9ca3af]"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="px-[20px] py-[16px] flex items-center gap-[12px]">
          <button
            type="button"
            onClick={() => setAll(true)}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6b7280] hover:text-[#1a1a2e] transition-colors"
          >
            All
          </button>
          <span className="text-[#d0d0d8]">·</span>
          <button
            type="button"
            onClick={() => setAll(false)}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6b7280] hover:text-[#1a1a2e] transition-colors"
          >
            None
          </button>
          <span className="text-[#d0d0d8]">·</span>
          <button
            type="button"
            onClick={() => setVisibility(DEFAULT_SEARCH_RESULTS_VISIBILITY)}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6b7280] hover:text-[#1a1a2e] transition-colors"
          >
            Reset
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 min-h-0 overflow-hidden bg-transparent">
        <SearchResultsScreen
          key={query}
          initialQuery={query}
          onSearch={(q) => setQuery(q)}
          onStartConversation={onStartConversation}
          visibility={visibility}
        />
      </div>
    </motion.div>
  );
}
