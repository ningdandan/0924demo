import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AiAssistCard } from "./AiAssistCard";

export interface SummaryCitation {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  excerpt: string;
}

export interface SmartSummaryModel {
  question: string;
  /** Plain sentence with the key fact called out separately for highlight. */
  leadBefore: string;
  highlight: string;
  leadAfter: string;
  detail: string;
  citations: SummaryCitation[];
  info: string;
}

interface ArticleLike {
  title: string;
  subtitle: string;
  category: string;
  lastUpdated: string;
  content: string;
  summary?: string;
}

function excerptFrom(article: ArticleLike, max = 140) {
  const raw = (article.summary || article.content || "").replace(/\s+/g, " ").trim();
  if (raw.length <= max) return raw;
  return raw.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function citationFrom(article: ArticleLike | undefined, id: number, fallbackTitle: string): SummaryCitation {
  if (!article) {
    return {
      id,
      label: fallbackTitle,
      title: fallbackTitle,
      subtitle: "",
      lastUpdated: "",
      excerpt: "",
    };
  }
  return {
    id,
    label: article.title,
    title: article.title,
    subtitle: article.subtitle,
    lastUpdated: article.lastUpdated,
    excerpt: excerptFrom(article),
  };
}

/** Build a direct-answer summary tuned to the query (demo content). */
export function buildSmartSummary(query: string, catalog: ArticleLike[]): SmartSummaryModel {
  const q = query.toLowerCase();
  const byTitle = (partial: string) =>
    catalog.find((a) => a.title.toLowerCase().includes(partial.toLowerCase()));

  const disputeArticle = byTitle("Respond to a Dispute") ?? catalog[0];
  const payoutArticle = byTitle("Payout on Hold") ?? catalog[1];
  const billingArticle = byTitle("Proration") ?? catalog[2];

  if (q.includes("payout") || q.includes("hold")) {
    return {
      question: "Why is my payout on hold, and what should I do?",
      leadBefore: "Most holds are caused by ",
      highlight: "incomplete verification, a dispute spike, or unusual volume",
      leadAfter: ".",
      detail:
        "Check Dashboard → Account details for missing documents first — verification holds usually clear within a few business days once uploads are complete.{{1}} If the hold is risk-related, resolve open disputes and reply to any Stripe review email with context.{{2}}",
      citations: [
        citationFrom(payoutArticle, 1, "Payout holds guide"),
        citationFrom(disputeArticle, 2, "Dispute response guide"),
      ],
      info: "Based on 2 knowledge articles · Updated May 2026",
    };
  }

  if (
    q.includes("proration") ||
    q.includes("billing") ||
    q.includes("subscription") ||
    q.includes("invoice") ||
    q.includes("upgrade")
  ) {
    return {
      question: "Why was I charged when I upgraded mid-cycle?",
      leadBefore: "An immediate charge is expected — Stripe bills ",
      highlight: "the prorated difference for the rest of the current period",
      leadAfter: ".",
      detail:
        "Your renewal date stays the same; the next full invoice uses the new plan price.{{1}} Open Billing → Invoices to see the proration line items, or open a case with the invoice ID if the amount looks wrong.{{2}}",
      citations: [
        citationFrom(billingArticle, 1, "Billing & proration guide"),
        citationFrom(billingArticle, 2, "Billing & proration guide"),
      ],
      info: "Based on 1 knowledge article · Updated May 2026",
    };
  }

  return {
    question: "How long do I have to respond to a chargeback?",
    leadBefore: "You typically have ",
    highlight: "7–21 days to submit a response",
    leadAfter: ", depending on the card network.",
    detail:
      "Open Payments → Disputes, attach tracking or delivery evidence for the reason code, and submit before the deadline shown on the dispute.{{1}} After you submit, issuers usually take 60–75 days to decide.{{2}}",
    citations: [
      citationFrom(disputeArticle, 1, "Dispute response guide"),
      citationFrom(
        disputeArticle
          ? { ...disputeArticle, subtitle: "Issuer review window after evidence is submitted." }
          : undefined,
        2,
        "Dispute timeline",
      ),
    ],
    info: "Based on 2 knowledge articles · Updated May 2026",
  };
}

function CitationMark({
  citation,
  onOpen,
}: {
  citation: SummaryCitation;
  onOpen?: (citation: SummaryCitation) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex align-super"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => onOpen?.(citation)}
        className="ml-[2px] px-[4px] h-[16px] min-w-[16px] rounded-[4px] bg-[#001769]/[0.08] hover:bg-[#001769]/[0.14] font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-semibold text-[#001769] leading-none transition-colors"
        aria-label={`Source ${citation.id}: ${citation.title}`}
      >
        {citation.id}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 top-[22px] z-50 w-[280px] rounded-[12px] bg-white border border-[#e4e4ea] shadow-[0_12px_32px_rgba(0,0,0,0.12)] p-[14px] text-left"
          >
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-semibold tracking-[0.08em] uppercase text-[#9ca3af] mb-[6px]">
              Source {citation.id}
            </p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] leading-[18px] text-[#1a1a2e] mb-[4px]">
              {citation.title}
            </p>
            {citation.subtitle && (
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[16px] text-[#6b7280] mb-[8px]">
                {citation.subtitle}
              </p>
            )}
            {citation.excerpt && (
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] leading-[16px] text-[#6b7280] line-clamp-3 border-t border-[#f0f0f4] pt-[8px]">
                {citation.excerpt}
              </p>
            )}
            {citation.lastUpdated && (
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-[#9ca3af] mt-[8px]">
                Updated {citation.lastUpdated}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

function DetailWithCitations({
  text,
  citations,
  onOpenCitation,
}: {
  text: string;
  citations: SummaryCitation[];
  onOpenCitation?: (c: SummaryCitation) => void;
}) {
  const parts = text.split(/(\{\{\d+\}\})/g);
  const byId = new Map(citations.map((c) => [c.id, c]));

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\{\{(\d+)\}\}$/);
        if (match) {
          const id = Number(match[1]);
          const citation = byId.get(id);
          if (!citation) return null;
          return <CitationMark key={`c-${i}`} citation={citation} onOpen={onOpenCitation} />;
        }
        return <span key={`t-${i}`}>{part}</span>;
      })}
    </>
  );
}

interface SmartSummaryBlockProps {
  model: SmartSummaryModel;
  /** Quiet follow-up suggestion pills under the ask input. */
  suggestions?: string[];
  onAsk?: (query: string) => void;
  onCitationClick?: (citation: SummaryCitation) => void;
  showAskInput?: boolean;
  showSuggestions?: boolean;
}

export function SmartSummaryBlock({
  model,
  suggestions = [],
  onAsk,
  onCitationClick,
  showAskInput = true,
  showSuggestions = true,
}: SmartSummaryBlockProps) {
  return (
    <AiAssistCard
      title="Smart summary"
      info={model.info}
      suggestions={suggestions}
      onAsk={onAsk}
      showAskInput={showAskInput}
      showSuggestions={showSuggestions}
    >
      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#1a1a2e]">
        {model.leadBefore}
        <mark className="bg-[#dce8ff] text-[#001769] font-semibold px-[3px] rounded-[3px]">
          {model.highlight}
        </mark>
        {model.leadAfter}
        {model.citations[0] && (
          <CitationMark citation={model.citations[0]} onOpen={onCitationClick} />
        )}{" "}
        <DetailWithCitations
          text={model.detail}
          citations={model.citations}
          onOpenCitation={onCitationClick}
        />
      </p>
    </AiAssistCard>
  );
}
