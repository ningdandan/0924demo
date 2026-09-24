import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export type SortOption = "relevance" | "newest" | "oldest" | "title";

export type FilterTopic = { category: string; topic: string };

export type ResultsFilter = {
  categories: string[];
  topics: FilterTopic[];
};

export const EMPTY_FILTER: ResultsFilter = { categories: [], topics: [] };

interface CategoryOption {
  label: string;
  menuItems?: string[];
}

interface FilterCounts {
  total: number;
  categories: Record<string, number>;
  topics: Record<string, number>;
}

interface SearchResultsControlsProps {
  categories: CategoryOption[];
  filter: ResultsFilter;
  counts: FilterCounts;
  sortBy: SortOption;
  onFilterChange: (filter: ResultsFilter) => void;
  onSortChange: (sort: SortOption) => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevance",
  newest: "Newest",
  oldest: "Oldest",
  title: "Title A–Z",
};

const TOPIC_ALIASES: Record<string, string[]> = {
  response: ["respond", "dispute", "dashboard", "chargeback", "submit"],
  evidence: ["evidence", "documentation", "proof", "tracking"],
  "reason codes": ["reason", "product not received", "code", "fraudulent"],
  deadlines: ["deadline", "timeline", "days", "window", "60"],
  "case tracking": ["case", "status", "progress", "open"],
  holds: ["hold", "payout", "paused", "release"],
  verification: ["verification", "kyc", "identity", "documents"],
  schedules: ["schedule", "timing", "arrive", "transfer"],
  banking: ["bank", "account"],
  reserves: ["reserve", "balance"],
  invoices: ["invoice", "receipt", "download", "billing"],
  "plans & proration": ["proration", "upgrade", "plan", "mid-cycle"],
  subscriptions: ["subscription", "cancel", "pause"],
  "usage billing": ["usage", "tiered", "billing"],
  refunds: ["refund", "credit", "credit note"],
  "open cases": ["case", "dispute", "ch_3", "open"],
  alerts: ["hold", "verification", "alert"],
  "saved articles": ["guide", "article", "knowledge"],
  "quick start": ["step", "first", "respond", "dashboard"],
};

function topicKey(category: string, topic: string) {
  return `${category}::${topic}`;
}

function isFilterEmpty(filter: ResultsFilter) {
  return filter.categories.length === 0 && filter.topics.length === 0;
}

function filterSelectionCount(filter: ResultsFilter) {
  return filter.categories.length + filter.topics.length;
}

function filterLabel(filter: ResultsFilter, totalCount: number): string {
  if (isFilterEmpty(filter)) return `All categories (${totalCount})`;
  const count = filterSelectionCount(filter);
  if (count === 1) {
    if (filter.categories.length === 1) return filter.categories[0];
    const t = filter.topics[0];
    return t ? t.topic : "1 selected";
  }
  return `${count} selected`;
}

export function topicMatchesArticle(
  topic: string,
  article: { title: string; subtitle?: string; summary?: string },
): boolean {
  const hay = `${article.title} ${article.subtitle ?? ""} ${article.summary ?? ""}`.toLowerCase();
  const key = topic.toLowerCase();

  if (article.title.toLowerCase() === key || hay.includes(key)) return true;

  const aliases = TOPIC_ALIASES[key];
  if (aliases?.some((term) => hay.includes(term))) return true;

  const tokens = key.split(/[\s&/]+/).filter((t) => t.length > 2);
  return tokens.some((t) => hay.includes(t));
}

export function buildFilterCounts<
  T extends { title: string; category: string; subtitle?: string; summary?: string },
>(catalog: T[], categories: CategoryOption[]): FilterCounts {
  const categoryCounts: Record<string, number> = {};
  const topicCounts: Record<string, number> = {};

  for (const cat of categories) {
    categoryCounts[cat.label] = catalog.filter((item) => item.category === cat.label).length;
    for (const topic of cat.menuItems ?? []) {
      topicCounts[topicKey(cat.label, topic)] = catalog.filter(
        (item) => item.category === cat.label && topicMatchesArticle(topic, item),
      ).length;
    }
  }

  return { total: catalog.length, categories: categoryCounts, topics: topicCounts };
}

export function applyResultsFilter<
  T extends { title: string; category: string; subtitle?: string; summary?: string },
>(items: T[], filter: ResultsFilter): T[] {
  if (isFilterEmpty(filter)) return items;

  return items.filter((item) => {
    if (filter.categories.includes(item.category)) return true;
    return filter.topics.some(
      (t) => t.category === item.category && topicMatchesArticle(t.topic, item),
    );
  });
}

function ControlButton({
  label,
  value,
  active,
  open,
  onClick,
}: {
  label: string;
  value: string;
  active?: boolean;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-[4px] py-[2px] transition-opacity ${
        open || active ? "opacity-100" : "opacity-70 hover:opacity-100"
      }`}
    >
      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-normal text-[#6b7280]">
        {label}
      </span>
      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6b7280]/40">·</span>
      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium text-[#6b7280] max-w-[180px] truncate">
        {value}
      </span>
      <ChevronDown
        className={`size-[12px] shrink-0 text-[#6b7280] transition-transform ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function FilterCheckbox({
  checked,
  indeterminate,
  onChange,
  label,
  count,
  bold,
  nested,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
  count?: number;
  bold?: boolean;
  nested?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-[10px] cursor-pointer transition-colors hover:bg-gray-50 ${
        nested ? "px-[10px] py-[8px] rounded-[8px] ml-[30px] mr-[10px]" : "px-[14px] py-[9px]"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        ref={(el) => {
          if (el) el.indeterminate = !!indeterminate;
        }}
        onChange={onChange}
        className="size-[15px] rounded-[4px] border-gray-300 text-[#364153] focus:ring-[#364153]/20 cursor-pointer shrink-0"
      />
      <span
        className={`flex-1 min-w-0 font-['Plus_Jakarta_Sans',sans-serif] leading-snug ${
          bold ? "text-[13px] font-semibold text-[#364153]" : "text-[12px] text-[#6b7280]"
        }`}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] tabular-nums text-[#9ca3af] shrink-0">
          {count}
        </span>
      )}
    </label>
  );
}

export function SearchResultsControls({
  categories,
  filter,
  counts,
  sortBy,
  onFilterChange,
  onSortChange,
}: SearchResultsControlsProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
        setSortOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filterActive = !isFilterEmpty(filter);

  const toggleCategory = (category: string) => {
    const isSelected = filter.categories.includes(category);
    const nextCategories = isSelected
      ? filter.categories.filter((c) => c !== category)
      : [...filter.categories, category];
    const nextTopics = filter.topics.filter((t) => t.category !== category);
    onFilterChange({ categories: nextCategories, topics: nextTopics });
  };

  const toggleTopic = (category: string, topic: string) => {
    const key = topicKey(category, topic);
    const categorySelected = filter.categories.includes(category);

    if (categorySelected) {
      const cat = categories.find((c) => c.label === category);
      const siblings = (cat?.menuItems ?? []).filter((t) => t !== topic);
      onFilterChange({
        categories: filter.categories.filter((c) => c !== category),
        topics: [
          ...filter.topics.filter((t) => t.category !== category),
          ...siblings.map((t) => ({ category, topic: t })),
        ],
      });
      return;
    }

    const exists = filter.topics.some((t) => topicKey(t.category, t.topic) === key);
    const nextTopics = exists
      ? filter.topics.filter((t) => topicKey(t.category, t.topic) !== key)
      : [...filter.topics, { category, topic }];

    onFilterChange({ categories: filter.categories, topics: nextTopics });
  };

  const categoryTopicState = useMemo(() => {
    const state: Record<string, { selectedTopics: number; totalTopics: number }> = {};
    for (const cat of categories) {
      const topics = cat.menuItems ?? [];
      const selectedTopics = topics.filter((topic) =>
        filter.topics.some((t) => t.category === cat.label && t.topic === topic),
      ).length;
      state[cat.label] = { selectedTopics, totalTopics: topics.length };
    }
    return state;
  }, [categories, filter.topics]);

  const selectSort = (next: SortOption) => {
    onSortChange(next);
    setSortOpen(false);
  };

  return (
    <div ref={rootRef} className="flex items-center gap-[14px] shrink-0">
      <div className="relative">
        <ControlButton
          label="Filter"
          value={filterLabel(filter, counts.total)}
          active={filterActive}
          open={filterOpen}
          onClick={() => {
            setSortOpen(false);
            setFilterOpen((v) => !v);
          }}
        />

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              className="absolute left-0 top-[calc(100%+6px)] w-[300px] max-h-[360px] overflow-y-auto bg-white rounded-[12px] border border-[#e8e8ed] shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-50 [scrollbar-width:thin]"
            >
              <div className="px-[12px] pt-[10px] pb-[6px] border-b border-[#f0f0f4] sticky top-0 bg-white z-10 flex items-center justify-between gap-[8px]">
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#9ca3af]">
                  Category
                </p>
                {filterActive && (
                  <button
                    type="button"
                    onClick={() => onFilterChange(EMPTY_FILTER)}
                    className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#6b7280] hover:text-[#1a1a2e] transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {categories.map((category) => {
                const catCount = counts.categories[category.label] ?? 0;
                const topicState = categoryTopicState[category.label];
                const categoryChecked = filter.categories.includes(category.label);
                const categoryIndeterminate =
                  !categoryChecked &&
                  topicState.selectedTopics > 0 &&
                  topicState.selectedTopics < topicState.totalTopics;

                return (
                  <div key={category.label} className="py-[4px] border-b border-[#f5f5f7] last:border-b-0">
                    <FilterCheckbox
                      checked={categoryChecked}
                      indeterminate={categoryIndeterminate}
                      onChange={() => toggleCategory(category.label)}
                      label={category.label}
                      count={catCount}
                      bold
                    />

                    <div className="pb-[2px]">
                      {(category.menuItems ?? []).map((topic) => {
                        const key = topicKey(category.label, topic);
                        const topicChecked =
                          categoryChecked ||
                          filter.topics.some(
                            (t) => t.category === category.label && t.topic === topic,
                          );

                        return (
                          <FilterCheckbox
                            key={key}
                            checked={topicChecked}
                            onChange={() => toggleTopic(category.label, topic)}
                            label={topic}
                            count={counts.topics[key] ?? 0}
                            nested
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <ControlButton
          label="Sort"
          value={SORT_LABELS[sortBy]}
          open={sortOpen}
          onClick={() => {
            setFilterOpen(false);
            setSortOpen((v) => !v);
          }}
        />

        <AnimatePresence>
          {sortOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              className="absolute left-0 top-[calc(100%+6px)] w-[168px] bg-white rounded-[12px] border border-[#e8e8ed] shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden z-50"
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectSort(option)}
                  className={`w-full px-[12px] py-[9px] text-left font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6b7280] transition-colors hover:bg-[#f7f7fa] ${
                    sortBy === option ? "font-semibold" : "font-normal"
                  }`}
                >
                  {SORT_LABELS[option]}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
