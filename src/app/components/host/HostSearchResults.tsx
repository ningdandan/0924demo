import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Search,
  Sparkles,
  X,
  ChevronDown,
} from "lucide-react";
import { useDesignTokens } from "../../DesignTokensContext";
import { useTokens } from "../../TokensContext";
import {
  SearchResultsControls,
  applyResultsFilter,
  buildFilterCounts,
  EMPTY_FILTER,
  type ResultsFilter,
  type SortOption,
} from "../SearchResultsControls";
import { buildSmartSummary, SmartSummaryBlock } from "../SmartSummaryBlock";
import type { SearchBridgeContext } from "../SearchResultsScreen";

export interface HostArticleDetails {
  title: string;
  subtitle: string;
  category: string;
  lastUpdated: string;
  content: string;
  summary?: string;
}

export interface HostSearchResultsProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  onHome?: () => void;
  onOpenArticle: (article: HostArticleDetails) => void;
  onStartConversation?: (ctx: SearchBridgeContext) => void;
  showSmartSummary?: boolean;
  showFilterSort?: boolean;
  showAiNudges?: boolean;
  showAiAssist?: boolean;
  showResultsList?: boolean;
  showPagination?: boolean;
}

function resultSnippet(article: HostArticleDetails, max = 160) {
  const raw = (article.summary || article.subtitle || article.content.split("\n\n")[0] || "")
    .replace(/\s+/g, " ")
    .trim();
  if (raw.length <= max) return raw;
  return raw.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

const CARD_SHADOW = "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)";

/**
 * Help-center search results shell (Disney+/Southwest).
 * Composes shared essence: SmartSummaryBlock → AiAssistCard → AiNudgeChips,
 * and SearchResultsControls — only chrome/CSS differs from default.
 */
export function HostSearchResults({
  initialQuery,
  onSearch,
  onHome,
  onOpenArticle,
  onStartConversation,
  showSmartSummary = true,
  showFilterSort = true,
  showAiNudges = false,
  showAiAssist = true,
  showResultsList = true,
  showPagination = true,
}: HostSearchResultsProps) {
  const { tokens } = useTokens();
  const { dt } = useDesignTokens();
  const catalog = (tokens.articles?.learning ?? []) as HostArticleDetails[];
  const categories = (tokens.categories ?? []) as { label: string; menuItems?: string[] }[];
  const query = initialQuery.trim();

  const host = dt.colors.host;
  const ui = dt.colors.ui;
  const font = dt.fonts.families.body;
  const assistantLabel = `${tokens.brandName} Virtual Assistant`;
  const pageBg = "#F6F7F8";

  const [draft, setDraft] = useState(query);
  const [filter, setFilter] = useState<ResultsFilter>(EMPTY_FILTER);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setDraft(query);
    setPage(1);
    setFilter(EMPTY_FILTER);
  }, [query]);

  const smartSummary = useMemo(() => buildSmartSummary(query || "help", catalog), [query, catalog]);
  const summaryPlain = `${smartSummary.leadBefore}${smartSummary.highlight}${smartSummary.leadAfter}`;
  const filterCounts = useMemo(() => buildFilterCounts(catalog, categories), [catalog, categories]);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    let items = catalog.filter((a) => {
      if (!q) return true;
      const hay = `${a.title} ${a.subtitle} ${a.category} ${a.summary ?? ""} ${a.content}`.toLowerCase();
      return hay.includes(q) || q.split(/\s+/).some((w) => w.length > 2 && hay.includes(w));
    });
    items = applyResultsFilter(items, filter);
    items = [...items].sort((a, b) => {
      if (sortBy === "newest") return Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated);
      if (sortBy === "oldest") return Date.parse(a.lastUpdated) - Date.parse(b.lastUpdated);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      const as = a.title.toLowerCase().includes(q) ? 0 : 1;
      const bs = b.title.toLowerCase().includes(q) ? 0 : 1;
      return as - bs || a.title.localeCompare(b.title);
    });
    return items;
  }, [catalog, query, filter, sortBy]);

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, total);
  const pageItems = results.slice((safePage - 1) * pageSize, safePage * pageSize);
  const noResults = total === 0;

  const submit = () => {
    const q = draft.trim();
    if (q) onSearch(q);
  };

  const openAssistant = (askQuery?: string) => {
    const q = (askQuery ?? (query || draft || "Help me")).trim();
    if (!q || !onStartConversation) return;
    onStartConversation({
      query: q,
      summary: noResults
        ? "Sorry, this topic doesn't seem to be covered in our help articles."
        : summaryPlain,
      results: results.slice(0, 4).map((r) => ({
        title: r.title,
        category: r.category,
        subtitle: r.subtitle,
      })),
    });
  };

  const nudgeSuggestions = useMemo(() => {
    if (noResults) {
      return [
        "What topics are covered in Help?",
        "How do I contact support?",
        "Can you help me find an article?",
      ];
    }
    const fromCitations = smartSummary.citations.map((c) => c.title).filter(Boolean);
    const fromResults = results.slice(0, 2).map((r) => `Tell me more about ${r.title}`);
    return [...fromCitations.slice(0, 1), ...fromResults, "What should I do next?"]
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .slice(0, 3);
  }, [noResults, smartSummary.citations, results]);

  const canAsk = Boolean(onStartConversation);

  return (
    <div
      className="h-full min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ fontFamily: font, background: pageBg, color: ui.body }}
    >
      <div className="max-w-[880px] mx-auto px-[24px] py-[28px] pb-[96px]">
        <nav className="text-[13px] mb-[12px]" aria-label="Breadcrumb">
          <button
            type="button"
            className="hover:underline font-medium"
            style={{ color: host.link }}
            onClick={onHome}
          >
            Help Center
          </button>
          <span className="mx-[8px]" style={{ color: host.link }}>
            ›
          </span>
          <span className="font-medium" style={{ color: host.link }}>
            Search
          </span>
        </nav>

        <h1
          className="text-[36px] font-bold tracking-[-0.02em] mb-[20px]"
          style={{ color: "#0b0c0f" }}
        >
          Search
        </h1>

        <div
          className="mb-[20px] rounded-[8px] bg-white overflow-hidden"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <div className="flex items-stretch gap-[10px] p-[16px]">
            <div
              className="flex-1 min-w-0 flex items-center gap-[10px] h-[44px] px-[12px] rounded-[4px] border bg-white"
              style={{ borderColor: "#cfd3da" }}
            >
              <Search className="size-[16px] shrink-0" style={{ color: "#8b929c" }} />
              <input
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="Enter a question or topic"
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[15px] placeholder:text-[#9ca3af]"
                style={{ color: "#0b0c0f" }}
                aria-label="search"
              />
              {draft && (
                <button
                  type="button"
                  onClick={() => setDraft("")}
                  className="size-[18px] rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#9ca3af", color: "#fff" }}
                  aria-label="Clear"
                >
                  <X className="size-[11px]" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={submit}
              className="h-[44px] px-[22px] rounded-[4px] text-white text-[15px] font-semibold shrink-0 hover:opacity-90"
              style={{ background: "#1a1b1e" }}
            >
              Search
            </button>
          </div>

          {showSmartSummary && (
            <>
              <div className="h-px mx-[16px]" style={{ background: "#e8eaed" }} />
              <div className="px-[16px] pt-[4px] pb-[4px]">
                <SmartSummaryBlock
                  model={smartSummary}
                  title="AI Summary"
                  variant="plain"
                  feedbackStyle="yesno"
                  showAskInput={canAsk}
                  showSuggestions={canAsk && showAiNudges}
                  suggestions={nudgeSuggestions}
                  info="Responses generated with the assistance of AI technology, avoid sharing personal information. For the most accurate and complete information, please check source links."
                  onAsk={(askQuery) => openAssistant(askQuery)}
                  onCitationClick={(citation) => {
                    const match = catalog.find((a) => a.title === citation.title);
                    if (match) onOpenArticle(match);
                  }}
                >
                  {noResults ? (
                    <p className="text-[15px] leading-[22px]" style={{ color: "#1a1b1e" }}>
                      Sorry, this topic doesn&apos;t seem to be covered in our help articles. Please
                      try rephrasing your question or looking through our{" "}
                      <button
                        type="button"
                        onClick={onHome}
                        className="font-medium hover:underline"
                        style={{ color: host.link }}
                      >
                        supported topics
                      </button>
                      .{" "}
                      {canAsk && (
                        <>
                          You can also get more help or connect with a live agent by using the{" "}
                          <button
                            type="button"
                            onClick={() => openAssistant()}
                            className="font-medium hover:underline"
                            style={{ color: host.link }}
                          >
                            {assistantLabel}
                          </button>
                          .
                        </>
                      )}
                    </p>
                  ) : undefined}
                </SmartSummaryBlock>
              </div>
            </>
          )}
        </div>

        {showFilterSort && (
          <div className="mb-[20px]">
            <SearchResultsControls
              variant="host-card"
              hideSort={noResults}
              categories={categories}
              filter={filter}
              counts={filterCounts}
              sortBy={sortBy}
              onFilterChange={(next) => {
                setFilter(next);
                setPage(1);
              }}
              onSortChange={(next) => {
                setSortBy(next);
                setPage(1);
              }}
            />
          </div>
        )}

        {showResultsList && total > 0 && (
          <div className="flex items-center justify-between gap-[12px] mb-[14px] flex-wrap">
            <p className="text-[14px]" style={{ color: "#1a1b1e" }}>
              Showing {startIdx}-{endIdx} of {total} results
              {query ? ` for '${query}'` : ""}
            </p>
          </div>
        )}

        {showResultsList &&
          (pageItems.length > 0 ? (
            <ul className="flex flex-col gap-[12px]">
              {pageItems.map((article) => (
                <li key={article.title}>
                  <button
                    type="button"
                    onClick={() => onOpenArticle(article)}
                    className="w-full text-left rounded-[8px] bg-white px-[20px] py-[18px] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                    style={{ boxShadow: CARD_SHADOW }}
                  >
                    <p
                      className="text-[17px] font-bold mb-[6px] leading-[22px]"
                      style={{ color: "#0b0c0f" }}
                    >
                      {article.title}
                    </p>
                    <p className="text-[14px] leading-[20px]" style={{ color: "#4b5563" }}>
                      {resultSnippet(article)}
                    </p>
                    {showAiAssist && article.summary && (
                      <span
                        className="mt-[10px] inline-flex items-center gap-[4px] text-[12px] font-medium"
                        style={{ color: host.link }}
                      >
                        <Sparkles className="size-[12px]" />
                        AI assist available
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center text-center py-[56px] px-[16px]">
              <FileSearch
                className="size-[64px] mb-[18px]"
                style={{ color: host.link }}
                strokeWidth={1.35}
              />
              <p className="text-[20px] font-bold mb-[8px]" style={{ color: "#0b0c0f" }}>
                No results – please try a different term.
              </p>
              <p className="text-[14px] max-w-[440px] leading-[20px]" style={{ color: "#6b7280" }}>
                Your search{query ? `, ${query},` : ""} didn&apos;t match any results. Please try
                again using a different term.
              </p>
            </div>
          ))}

        {showResultsList && showPagination && total > 0 && (
          <div className="mt-[22px] flex items-center justify-between gap-[12px] flex-wrap">
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="appearance-none h-[36px] pl-[12px] pr-[32px] rounded-[4px] border bg-white text-[14px] outline-none"
                style={{ borderColor: "#cfd3da", color: "#1a1b1e" }}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 size-[14px]"
                style={{ color: "#6b7280" }}
              />
            </div>
            <div className="flex items-center gap-[6px]">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="size-[32px] rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-black/[0.04]"
                style={{ color: "#6b7280" }}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-[16px]" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(0, 7)
                .map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className="size-[32px] rounded-full text-[13px] font-semibold"
                    style={
                      n === safePage
                        ? { background: "#0b0c0f", color: "#fff" }
                        : { color: "#1a1b1e" }
                    }
                  >
                    {n}
                  </button>
                ))}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="size-[32px] rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-black/[0.04]"
                style={{ color: "#6b7280" }}
                aria-label="Next page"
              >
                <ChevronRight className="size-[16px]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
