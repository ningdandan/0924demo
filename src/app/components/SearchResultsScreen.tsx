import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { ArticlePanel } from "./ArticlePanel";
import type { AiNudge } from "./AiNudgeChips";
import { buildSmartSummary, SmartSummaryBlock } from "./SmartSummaryBlock";
import {
  SearchResultsControls,
  applyResultsFilter,
  buildFilterCounts,
  EMPTY_FILTER,
  type ResultsFilter,
  type SortOption,
} from "./SearchResultsControls";
import { useTokens } from "../TokensContext";

interface ArticleDetails {
  title: string;
  subtitle: string;
  category: string;
  lastUpdated: string;
  content: string;
  image?: string;
  summary?: string;
}

interface SearchResultsScreenProps {
  initialQuery: string;
  onSearch?: (query: string) => void;
  onStartConversation?: (ctx: SearchBridgeContext) => void;
  /** Toggle individual UI regions (used by the Results lab tab). */
  visibility?: Partial<SearchResultsVisibility>;
  /** Show AI assist card inside the article panel. */
  showAiAssist?: boolean;
}

export type SearchResultsVisibility = {
  promptBar: boolean;
  smartSummary: boolean;
  aiNudges: boolean;
  resultsMeta: boolean;
  filterSort: boolean;
  resultsList: boolean;
  pagination: boolean;
  articlePanel: boolean;
};

export const DEFAULT_SEARCH_RESULTS_VISIBILITY: SearchResultsVisibility = {
  promptBar: true,
  smartSummary: true,
  aiNudges: true,
  resultsMeta: true,
  filterSort: true,
  resultsList: true,
  pagination: true,
  articlePanel: true,
};

export interface SearchBridgeContext {
  query: string;
  summary: string;
  results: { title: string; category: string; subtitle: string }[];
}

const PAGE_SIZE = 10;
const CATALOG_SIZE = 20;

function parseDate(value: string) {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

function resultSnippet(article: ArticleDetails) {
  const raw = (article.summary || article.subtitle || article.content.split("\n\n")[0] || "").trim();
  if (raw.length <= 165) return raw;
  return `${raw.slice(0, 162).trim()}…`;
}

function resultPath(brandSlug: string, article: ArticleDetails) {
  const crumb = article.category.replace(/\s+/g, " ").trim();
  return `support.${brandSlug}.com › ${crumb}`;
}

const SAMPLE_SEED: Omit<ArticleDetails, "category">[] = [
  {
    title: "Dispute response windows by card network",
    subtitle: "Visa, Mastercard, and Amex deadlines compared — what 7–21 days means in practice.",
    lastUpdated: "May 12, 2026",
    summary: "Response windows vary by network. Most merchants see 7–21 days from notification.",
    content:
      "Dispute response windows by card network\n\nCard networks set firm deadlines for merchant responses. Visa and Mastercard commonly allow 7–21 days depending on the reason code and region. Always use the deadline shown on the dispute detail page in your Dashboard — it is authoritative for that case.\n\nWhat to do first\nNote the network, reason code, and countdown. Gather evidence that matches the reason before drafting your narrative.\n\nWhen to escalate\nIf the deadline is under 5 days and evidence is incomplete, escalate to support with the dispute ID attached.",
  },
  {
    title: "Submitting evidence for product-not-received disputes",
    subtitle: "Tracking numbers, delivery photos, and customer emails that strengthen your case.",
    lastUpdated: "May 8, 2026",
    summary: "Delivery confirmation and tracking are the strongest evidence for PNR disputes.",
    content:
      "Submitting evidence for product-not-received disputes\n\nInclude carrier tracking with delivery confirmation, the ship-to address, and any buyer acknowledgment. Screenshots should show dates clearly.\n\nWhat to do first\nExport tracking from your fulfillment system and match it to the charge ID.\n\nWhen to escalate\nIf tracking shows delivered but the issuer still rules against you, open a review request with support.",
  },
  {
    title: "How to upload dispute files in the Dashboard",
    subtitle: "File types, size limits, and where Submit evidence lives under Payments.",
    lastUpdated: "April 30, 2026",
    summary: "Upload PDFs and images from Payments → Disputes → Submit evidence before the deadline.",
    content:
      "How to upload dispute files in the Dashboard\n\nGo to Payments → Disputes, open the case, and choose Submit evidence. Supported formats include PDF, PNG, and JPG. Keep filenames short and descriptive.\n\nWhat to do first\nCombine related documents into a single PDF when possible.\n\nWhen to escalate\nUpload errors or stuck submissions should be reported with the dispute ID and browser details.",
  },
  {
    title: "Chargeback reason codes explained",
    subtitle: "Fraud, product not received, and not as described — evidence that fits each code.",
    lastUpdated: "April 28, 2026",
    summary: "Match your evidence pack to the reason code; generic uploads rarely win.",
    content:
      "Chargeback reason codes explained\n\nEach reason code implies a different defense. Fraud needs authorization proof; PNR needs delivery proof; not-as-described needs product description and photos.\n\nWhat to do first\nRead the reason code on the dispute before collecting files.\n\nWhen to escalate\nUnfamiliar or regional reason codes can be clarified with support.",
  },
  {
    title: "Tracking an open dispute case to resolution",
    subtitle: "Status meanings from Needs response through Won or Lost.",
    lastUpdated: "May 2, 2026",
    summary: "Dashboard status updates as you submit and as the issuer decides — typically 60–75 days after submission.",
    content:
      "Tracking an open dispute case to resolution\n\nAfter submission, the issuer reviews evidence. Expect 60–75 days for a decision in most networks. Stripe notifies you by email and Dashboard badge.\n\nWhat to do first\nBookmark the dispute page and watch for status changes.\n\nWhen to escalate\nNo status change past the expected review window — contact support with dates.",
  },
  {
    title: "Preventing repeat chargebacks on similar orders",
    subtitle: "Billing descriptors, proactive tracking emails, and Radar settings that help.",
    lastUpdated: "April 18, 2026",
    summary: "Clear descriptors and early shipping updates reduce friendly fraud and PNR disputes.",
    content:
      "Preventing repeat chargebacks on similar orders\n\nUse recognizable billing descriptors, send tracking promptly, and respond to buyer inquiries within 24 hours.\n\nWhat to do first\nAudit your statement descriptor and shipping confirmation templates.\n\nWhen to escalate\nA sudden dispute-rate spike may need a risk review with Stripe.",
  },
  {
    title: "Partial refunds vs fighting a dispute",
    subtitle: "When refunding is cheaper than evidence submission and fees.",
    lastUpdated: "March 22, 2026",
    summary: "For low-value cases near deadline, a refund can be faster than a weak evidence pack.",
    content:
      "Partial refunds vs fighting a dispute\n\nWeigh dispute fees, win likelihood, and customer lifetime value. A partial refund before the deadline can close some cases.\n\nWhat to do first\nCheck remaining response time and evidence quality.\n\nWhen to escalate\nHigh-value cases should still go to a full evidence submission.",
  },
  {
    title: "Why payouts get paused after a dispute spike",
    subtitle: "How elevated dispute rates trigger automated risk holds on payouts.",
    lastUpdated: "May 9, 2026",
    summary: "A rising dispute rate can pause payouts until open cases are addressed.",
    content:
      "Why payouts get paused after a dispute spike\n\nCard-network thresholds force processors to review accounts with elevated dispute rates. Holds often lift after you respond to open disputes and document remediation.\n\nWhat to do first\nClear Needs response disputes and reply to any risk email.\n\nWhen to escalate\nHolds lasting beyond a few business days with no Dashboard guidance — open a support case.",
  },
  {
    title: "Completing KYC to release a verification hold",
    subtitle: "IDs, ownership details, and bank verification Stripe commonly requests.",
    lastUpdated: "May 6, 2026",
    summary: "Missing KYC documents are the most common cause of verification-related payout holds.",
    content:
      "Completing KYC to release a verification hold\n\nUpload clear government ID, business registration, and verified bank details under Settings → Account details.\n\nWhat to do first\nOpen Account details and complete every red-flagged field.\n\nWhen to escalate\nRepeated rejections for blurry documents — resubmit higher-resolution scans.",
  },
  {
    title: "Payout schedule options and arrival timing",
    subtitle: "Daily, weekly, and manual payouts — when funds typically hit your bank.",
    lastUpdated: "April 14, 2026",
    summary: "Arrival depends on your payout schedule plus bank processing time (often 1–3 business days).",
    content:
      "Payout schedule options and arrival timing\n\nConfigure schedule under Settings → Payouts. Bank holidays and weekend cutoffs can add delay.\n\nWhat to do first\nConfirm schedule and bank account status are Active.\n\nWhen to escalate\nMissing payouts past the expected arrival window — share the payout ID with support.",
  },
  {
    title: "Updating the bank account used for payouts",
    subtitle: "How to change destination accounts without interrupting settlements.",
    lastUpdated: "March 30, 2026",
    summary: "Add and verify a new bank account before removing the old one to avoid payout failures.",
    content:
      "Updating the bank account used for payouts\n\nAdd the new account, complete micro-deposit or instant verification, then set it as default.\n\nWhat to do first\nVerify the new account fully before switching default.\n\nWhen to escalate\nFailed verification loops — contact support with the bank last4.",
  },
  {
    title: "Understanding Stripe reserves on your balance",
    subtitle: "Rolling reserves, fixed reserves, and how they affect available funds.",
    lastUpdated: "April 4, 2026",
    summary: "Reserves hold a portion of your balance for risk coverage and release on a defined schedule.",
    content:
      "Understanding Stripe reserves on your balance\n\nReserved funds appear separately from available balance. Release timing is listed on the reserve terms in your account.\n\nWhat to do first\nReview Balances for reserved vs available amounts.\n\nWhen to escalate\nUnexpected reserve increases — ask risk for the trigger.",
  },
  {
    title: "Mid-cycle upgrades and proration charges",
    subtitle: "Why an upgrade creates an immediate line item on your invoice.",
    lastUpdated: "May 15, 2026",
    summary: "Stripe bills the prorated difference for the remainder of the current period right away.",
    content:
      "Mid-cycle upgrades and proration charges\n\nYour billing cycle anchor stays the same. The next full period invoices at the new price.\n\nWhat to do first\nOpen Billing → Invoices and inspect proration line items.\n\nWhen to escalate\nIncorrect proration math — send invoice ID to support.",
  },
  {
    title: "Downloading invoices and receipts for accounting",
    subtitle: "PDF export, tax lines, and sharing invoices with finance.",
    lastUpdated: "April 21, 2026",
    summary: "Every Stripe Billing invoice can be downloaded as a PDF from Billing → Invoices.",
    content:
      "Downloading invoices and receipts for accounting\n\nFilter by date or customer, open the invoice, and download PDF. Tax and proration appear as separate lines when applicable.\n\nWhat to do first\nLocate the invoice ID from email or Dashboard search.\n\nWhen to escalate\nMissing invoices after a confirmed charge — provide the charge ID.",
  },
  {
    title: "Canceling or pausing a subscription cleanly",
    subtitle: "End-of-period vs immediate cancel, and when credits apply.",
    lastUpdated: "March 18, 2026",
    summary: "Default cancels often take effect at period end; immediate cancel may need a credit note.",
    content:
      "Canceling or pausing a subscription cleanly\n\nChoose cancel at period end to avoid mid-cycle credits, or cancel immediately if your configuration allows.\n\nWhat to do first\nConfirm the subscription ID and desired end behavior.\n\nWhen to escalate\nUnexpected renewals after cancel — share the subscription timeline with support.",
  },
  {
    title: "Usage-based billing tiers and overage invoices",
    subtitle: "How metered usage rolls into the next invoice and what to audit.",
    lastUpdated: "April 9, 2026",
    summary: "Metered usage aggregates through the period and appears as overage or tier lines on renewal.",
    content:
      "Usage-based billing tiers and overage invoices\n\nReview usage reports before period close to avoid surprise overages.\n\nWhat to do first\nCheck Billing usage for the active subscription.\n\nWhen to escalate\nUsage spikes you cannot explain — request a usage export.",
  },
  {
    title: "Requesting a credit note after a billing error",
    subtitle: "What to include so support can apply a credit to the next invoice.",
    lastUpdated: "March 12, 2026",
    summary: "Provide invoice ID, expected vs charged amounts, and subscription ID for faster credits.",
    content:
      "Requesting a credit note after a billing error\n\nCredits offset future invoices; refunds return funds to the payment method when issued.\n\nWhat to do first\nScreenshot the unexpected line item and note the invoice ID.\n\nWhen to escalate\nCredits not appearing on the next cycle — follow up with the case number.",
  },
  {
    title: "Open cases checklist for merchants",
    subtitle: "Disputes, verification tasks, and risk emails to clear this week.",
    lastUpdated: "May 11, 2026",
    summary: "A weekly sweep of open disputes and account alerts prevents deadline misses.",
    content:
      "Open cases checklist for merchants\n\nPrioritize Needs response disputes, then verification tasks, then informational alerts.\n\nWhat to do first\nSort Disputes by deadline ascending.\n\nWhen to escalate\nBlocked actions with no clear Dashboard CTA — open support with screenshots.",
  },
  {
    title: "Dashboard alerts that need same-day action",
    subtitle: "Which banners are informational versus deadline-critical.",
    lastUpdated: "May 3, 2026",
    summary: "Deadline and verification banners should be handled the same day; news banners can wait.",
    content:
      "Dashboard alerts that need same-day action\n\nRed or countdown banners tied to disputes and KYC are urgent. Product announcements are not.\n\nWhat to do first\nClick through every countdown banner and resolve or schedule work.\n\nWhen to escalate\nAlerts that do not open a clear workflow — report the banner copy to support.",
  },
  {
    title: "Quick start: first response to a new dispute",
    subtitle: "A 15-minute path from notification email to evidence draft.",
    lastUpdated: "May 1, 2026",
    summary: "Open the dispute, note the deadline and reason, gather core evidence, draft the narrative.",
    content:
      "Quick start: first response to a new dispute\n\n1) Open from email deep link. 2) Capture deadline and reason code. 3) Pull tracking or auth proof. 4) Draft a short factual summary. 5) Upload and submit.\n\nWhat to do first\nDo not wait for perfect packaging — submit strong core evidence before the deadline.\n\nWhen to escalate\nMissing notification details — search Disputes by charge ID.",
  },
];

/** Build a 20-item catalog from real articles + generated samples. */
function buildCatalog(
  articles: ArticleDetails[],
  categories: { label: string; menuItems?: string[] }[],
): ArticleDetails[] {
  const categoryLabels =
    categories.length > 0
      ? categories.map((c) => c.label)
      : ["Disputes & Chargebacks", "Payouts & Account Holds", "Billing & Subscriptions"];

  const byTitle = new Map(articles.map((a) => [a.title.toLowerCase(), a]));
  const merged: ArticleDetails[] = [...articles];

  for (let i = 0; i < SAMPLE_SEED.length && merged.length < CATALOG_SIZE; i++) {
    const seed = SAMPLE_SEED[i];
    if (byTitle.has(seed.title.toLowerCase())) continue;
    const category = categoryLabels[i % categoryLabels.length];
    const item: ArticleDetails = { ...seed, category };
    byTitle.set(seed.title.toLowerCase(), item);
    merged.push(item);
  }

  // Pad if still short
  let n = 1;
  while (merged.length < CATALOG_SIZE) {
    const category = categoryLabels[(merged.length) % categoryLabels.length];
    merged.push({
      title: `Additional guide ${n}: ${category}`,
      subtitle: `Reference material covering common workflows in ${category.toLowerCase()}.`,
      category,
      lastUpdated: "April 1, 2026",
      summary: `Supplementary article for ${category}.`,
      content: `Additional guide ${n}\n\nPractical steps and definitions for ${category}.`,
    });
    n += 1;
  }

  return merged.slice(0, CATALOG_SIZE);
}

function nudgesForSearch(query: string, results: ArticleDetails[]): AiNudge[] {
  const q = query.toLowerCase();
  const topCategory = results[0]?.category?.toLowerCase() ?? "";
  let questions: string[];

  if (q.includes("dispute") || q.includes("chargeback") || topCategory.includes("dispute")) {
    questions = [
      "How long do I have to respond?",
      "What evidence do I need to submit?",
      "Where do I upload this in the Dashboard?",
    ];
  } else if (q.includes("payout") || q.includes("hold") || topCategory.includes("payout")) {
    questions = [
      "Why was my payout put on hold?",
      "How do I get the hold lifted?",
      "How long do holds usually last?",
    ];
  } else if (
    q.includes("billing") ||
    q.includes("subscription") ||
    q.includes("invoice") ||
    q.includes("proration") ||
    topCategory.includes("billing")
  ) {
    questions = [
      "Why was I charged mid-cycle?",
      "How do I view my invoice?",
      "Can I get a prorated refund?",
    ];
  } else {
    questions = [
      "Can you summarize the key steps?",
      "What should I do next?",
      "Which article is most relevant?",
    ];
  }

  return [
    ...questions.map((label) => ({ label, kind: "question" as const })),
    { label: "Start a chat", kind: "chat" as const },
  ];
}

export function SearchResultsScreen({
  initialQuery,
  onSearch,
  onStartConversation,
  visibility: visibilityProp,
  showAiAssist = true,
}: SearchResultsScreenProps) {
  const visibility = { ...DEFAULT_SEARCH_RESULTS_VISIBILITY, ...visibilityProp };
  const { tokens } = useTokens();
  const baseArticles: ArticleDetails[] = tokens.articles.learning;
  const categories = (tokens.categories ?? []) as { label: string; menuItems?: string[] }[];

  const [selectedArticle, setSelectedArticle] = useState<ArticleDetails | null>(null);
  const [filter, setFilter] = useState<ResultsFilter>(EMPTY_FILTER);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [page, setPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [draftQuery, setDraftQuery] = useState(initialQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPage(1);
    setFilter(EMPTY_FILTER);
    setSortBy("relevance");
    setDraftQuery(initialQuery);
    setSearchOpen(false);
  }, [initialQuery]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }
  }, [searchOpen]);

  // Clear side panel when article panel is toggled off in the lab
  useEffect(() => {
    if (!visibility.articlePanel) setSelectedArticle(null);
  }, [visibility.articlePanel]);

  const query = initialQuery.trim() || tokens.searchBar.suggestions?.[0] || "Search";
  const brandSlug = String(tokens.brandName ?? "support")
    .toLowerCase()
    .replace(/\s+/g, "");

  const submitDraftSearch = () => {
    const next = draftQuery.trim();
    if (!next) return;
    setSearchOpen(false);
    onSearch?.(next);
  };

  const catalog = useMemo(
    () => buildCatalog(baseArticles, categories),
    [baseArticles, categories],
  );

  const filterCounts = useMemo(
    () => buildFilterCounts(catalog, categories),
    [catalog, categories],
  );

  const smartSummary = useMemo(
    () => buildSmartSummary(query, catalog),
    [query, catalog],
  );

  const summaryPlain = `${smartSummary.leadBefore}${smartSummary.highlight}${smartSummary.leadAfter} ${smartSummary.detail.replace(/\{\{\d+\}\}/g, "")}`;

  const filteredSorted = useMemo(() => {
    const q = query.toLowerCase();
    const words = q.split(/\s+/).filter((w) => w.length >= 3);

    let items = catalog.map((article) => {
      const hay = `${article.title} ${article.subtitle} ${article.category} ${article.summary ?? ""}`.toLowerCase();
      const score = words.reduce((acc, word) => (hay.includes(word) ? acc + 1 : acc), 0);
      return { article, score };
    });

    const filtered = applyResultsFilter(
      items.map((i) => i.article),
      filter,
    );
    const filteredSet = new Set(filtered.map((a) => a.title));
    items = items.filter((i) => filteredSet.has(i.article.title));

    items.sort((a, b) => {
      if (sortBy === "relevance") return b.score - a.score || a.article.title.localeCompare(b.article.title);
      if (sortBy === "newest") return parseDate(b.article.lastUpdated) - parseDate(a.article.lastUpdated);
      if (sortBy === "oldest") return parseDate(a.article.lastUpdated) - parseDate(b.article.lastUpdated);
      return a.article.title.localeCompare(b.article.title);
    });

    return items.map((i) => i.article);
  }, [catalog, query, filter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredSorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const showMetaRow = visibility.filterSort;
  const showResultsBlock =
    visibility.filterSort ||
    visibility.resultsList ||
    visibility.pagination;

  return (
    <motion.div
      key="search-results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex h-full w-full gap-[16px] overflow-hidden px-[16px] py-[8px]"
    >
      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        <div className="flex flex-col h-full w-full min-h-0 max-w-[720px] mx-auto">
          {visibility.promptBar && (
            <div className="pt-[12px] pb-[8px] px-[24px] flex-shrink-0 relative z-10">
              <div className="flex items-start justify-between gap-[16px]">
                <div className="min-w-0 flex-1">
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af] mb-[6px]">
                    Search results
                  </p>
                  <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[26px] leading-[32px] tracking-[-0.03em] text-[#001769] truncate">
                    {query}
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen((open) => !open)}
                  className={`mt-[4px] size-[40px] rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    searchOpen
                      ? "bg-[#001769] border-[#001769] text-white"
                      : "bg-white border-[#e4e4ea] text-[#4b5563] hover:bg-[#f7f7fa] hover:border-[#d8d8e0]"
                  }`}
                  aria-label={searchOpen ? "Close search" : "Search again"}
                  title="Search again"
                >
                  {searchOpen ? <X className="size-[16px]" strokeWidth={2.2} /> : <Search className="size-[16px]" strokeWidth={2.2} />}
                </button>
              </div>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-[14px] flex items-center gap-[10px] h-[44px] px-[14px] rounded-full bg-white border border-[#e4e4ea] shadow-[0_4px_16px_rgba(0,0,0,0.04)] focus-within:border-[#c8c8d0]">
                      <Search className="size-[16px] text-[#9ca3af] shrink-0" strokeWidth={2.2} />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={draftQuery}
                        onChange={(e) => setDraftQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            submitDraftSearch();
                          }
                          if (e.key === "Escape") setSearchOpen(false);
                        }}
                        placeholder="Search again…"
                        className="flex-1 min-w-0 bg-transparent border-0 outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-[#1a1a2e] placeholder:text-[#9ca3af]"
                        aria-label="Search again"
                      />
                      <button
                        type="button"
                        onClick={submitDraftSearch}
                        className="shrink-0 rounded-full bg-[#001769] text-white px-[14px] py-[7px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-semibold hover:opacity-90 transition-opacity"
                      >
                        Search
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="relative flex-1 min-h-0">
            <div className="h-full overflow-y-auto px-[24px] pt-[16px] pb-[40px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visibility.smartSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 }}
                  className="mb-[32px]"
                >
                  <SmartSummaryBlock
                    model={smartSummary}
                    suggestions={nudgesForSearch(query, filteredSorted)
                      .filter((n) => n.kind !== "chat")
                      .map((n) => n.label)}
                    showAskInput
                    showSuggestions={visibility.aiNudges}
                    onAsk={(askQuery) =>
                      onStartConversation?.({
                        query: askQuery,
                        summary: summaryPlain,
                        results: filteredSorted.slice(0, 4).map((r) => ({
                          title: r.title,
                          category: r.category,
                          subtitle: r.subtitle,
                        })),
                      })
                    }
                    onCitationClick={(citation) => {
                      if (!visibility.articlePanel) return;
                      const match = catalog.find((a) => a.title === citation.title);
                      if (match) setSelectedArticle(match);
                    }}
                  />
                </motion.div>
              )}

              {showResultsBlock && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.08 }}
                >
                  {showMetaRow && (
                    <div className="flex items-center justify-start gap-[12px] mb-[12px]">
                      <SearchResultsControls
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

                  {visibility.resultsList && (
                    <div className="flex flex-col gap-[4px]">
                      {pageItems.map((result) => (
                        <button
                          key={result.title}
                          type="button"
                          className="w-full text-left py-[16px] px-[4px] rounded-[10px] hover:bg-black/[0.02] transition-colors group"
                          onClick={() => {
                            if (visibility.articlePanel) setSelectedArticle(result);
                          }}
                        >
                          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-normal leading-[16px] text-[#6b7280] mb-[4px] truncate">
                            {resultPath(brandSlug, result)}
                          </p>
                          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-semibold leading-[24px] tracking-[-0.01em] text-[#001769] group-hover:underline mb-[4px]">
                            {result.title}
                          </h3>
                          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-normal leading-[22px] text-[#4b5563] line-clamp-2">
                            <span className="font-medium text-[#6b7280]">{result.lastUpdated}</span>
                            <span className="text-[#9ca3af]"> · </span>
                            {resultSnippet(result)}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {visibility.resultsList && filteredSorted.length === 0 && (
                    <p className="py-[32px] text-center font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#9ca3af]">
                      No results match this filter.
                    </p>
                  )}

                  {visibility.pagination && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-[4px] pt-[24px]">
                      <button
                        type="button"
                        disabled={safePage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="size-[28px] rounded-[6px] flex items-center justify-center text-[#9ca3af] hover:bg-black/[0.04] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronLeft className="size-[15px]" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setPage(n)}
                          className={`min-w-[28px] h-[28px] rounded-[6px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] transition-colors ${
                            n === safePage
                              ? "bg-[#1a1a2e] text-white font-medium"
                              : "text-[#9ca3af] hover:bg-black/[0.04]"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={safePage >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="size-[28px] rounded-[6px] flex items-center justify-center text-[#9ca3af] hover:bg-black/[0.04] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronRight className="size-[15px]" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {visibility.articlePanel && selectedArticle && (
          <motion.div
            key={selectedArticle.title}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 140, mass: 1.2 }}
            className="flex-1 h-full min-w-0"
          >
            <div className="h-full">
              <ArticlePanel
                article={selectedArticle}
                onClose={() => setSelectedArticle(null)}
                hideSummary={!showAiAssist}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
