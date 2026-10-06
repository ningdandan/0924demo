import { AnimatePresence, motion } from "motion/react";
import { Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  SpecCanvas,
  SpecPage,
  SpecShell,
  SpecStencil,
  useAnimLoop,
  type SpecSection,
} from "../shared/SpecPage";

function CitationChip({
  n,
  hot,
}: {
  n: number;
  hot?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center justify-center align-super ml-0.5 rounded px-1 text-[8px] font-bold"
      style={{
        background: hot ? "#001769" : "#E8EEFF",
        color: hot ? "#fff" : "#001769",
        minWidth: 12,
        height: 12,
        transition: "all 0.25s ease",
      }}
    >
      {n}
    </span>
  );
}

function SummaryCard({
  expanded,
  citeHot,
  showFeedback,
  feedback,
  showAsk,
  chipHot,
}: {
  expanded?: boolean;
  citeHot?: number | null;
  showFeedback?: boolean;
  feedback?: "up" | "down" | null;
  showAsk?: boolean;
  chipHot?: number;
}) {
  return (
    <div
      className="rounded-xl bg-white overflow-hidden"
      style={{ border: "1px solid #E8E8ED", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
    >
      <div className="px-3.5 pt-3.5 pb-3">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles size={11} color="#001769" />
          <span className="text-[10px] font-semibold" style={{ color: "#6B7280" }}>
            Smart summary
          </span>
        </div>

        <p className="text-[12px] leading-[18px]" style={{ color: "#1A1A2E" }}>
          Most holds are caused by{" "}
          <mark
            className="rounded px-0.5 font-semibold"
            style={{ background: "#DCE8FF", color: "#001769" }}
          >
            incomplete verification, a dispute spike, or unusual volume
          </mark>
          .
          <CitationChip n={1} hot={citeHot === 1} /> Start in Dashboard → Account
          details and clear every red-flagged field.
          <CitationChip n={2} hot={citeHot === 2} />
          {!expanded && (
            <>
              {" "}
              <span className="font-semibold" style={{ color: "#001769" }}>
                View more
              </span>
            </>
          )}
        </p>

        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[12px] leading-[18px] mt-2.5 overflow-hidden"
              style={{ color: "#1A1A2E" }}
            >
              Upload a clear government ID and verified bank account — verification
              holds usually clear within a few business days.
              <CitationChip n={1} hot={citeHot === 1} /> If Account details looks
              complete, resolve Needs response disputes first.
              <CitationChip n={2} hot={citeHot === 2} />{" "}
              <span className="font-semibold" style={{ color: "#001769" }}>
                View less
              </span>
            </motion.p>
          )}
        </AnimatePresence>

        {showFeedback && (
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[9px]" style={{ color: "#9CA3AF" }}>
              Updated from 3 sources · just now
            </span>
            {feedback ? (
              <motion.span
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[9px]"
                style={{ color: "#9CA3AF" }}
              >
                {feedback === "up" ? "Thanks for the feedback" : "We’ll keep improving"}
              </motion.span>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px]" style={{ color: "#9CA3AF" }}>
                  Helpful?
                </span>
                <ThumbsUp size={11} color="#9CA3AF" />
                <ThumbsDown size={11} color="#9CA3AF" />
              </div>
            )}
          </div>
        )}
      </div>

      {showAsk && (
        <div className="px-3 pb-3 pt-1" style={{ borderTop: "1px solid #ECECF1" }}>
          <div
            className="rounded-full px-3 py-2 text-[10px] mb-2"
            style={{ background: "#FAFAFB", border: "1px solid #E4E4EA", color: "#9CA3AF" }}
          >
            Ask a follow-up question…
          </div>
          <div className="flex gap-1.5">
            {["Clear verification", "Open disputes", "Contact support"].map((c, i) => (
              <span
                key={c}
                className="text-[9px] rounded-full px-2 py-1"
                style={{
                  background: chipHot === i ? "#EEF2FF" : "#FAFAFB",
                  border: "1px solid #E4E4EA",
                  color: chipHot === i ? "#001769" : "#6B7280",
                  fontWeight: chipHot === i ? 600 : 400,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CitationPopover({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      className="absolute right-3 bottom-3 w-[200px] rounded-xl bg-white p-3 z-10"
      style={{
        border: "1px solid #E8E8ED",
        boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
      }}
    >
      <p className="text-[8px] font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#9CA3AF" }}>
        Source
      </p>
      <p className="text-[11px] font-semibold leading-snug mb-1" style={{ color: "#001769" }}>
        {title}
      </p>
      <SpecStencil w="100%" h={5} opacity={0.14} />
      <div className="mt-1">
        <SpecStencil w="80%" h={5} opacity={0.1} />
      </div>
    </motion.div>
  );
}

/** 01 — Direct answer with highlighted fact */
function WAnswer({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 5600, [0, 800, 2200, 4200]);
  const show = step >= 1;
  return (
    <SpecShell url="help.acme.com/search?q=payout+hold">
      <SpecCanvas minH={250}>
        <div className="px-4 py-4 space-y-3">
          <div className="flex gap-2">
            <SpecStencil w={90} h={8} opacity={0.14} />
            <SpecStencil w={40} h={8} opacity={0.08} />
          </div>
          <AnimatePresence>
            {show && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <SummaryCard showFeedback={step >= 2} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 02 — Citations open source peeks */
function WCitations({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 7000, [0, 1200, 2800, 4500, 6200]);
  const citeHot = step === 1 || step === 2 ? 1 : step === 3 ? 2 : null;
  const pop =
    step === 2
      ? "Payout holds guide"
      : step === 3
        ? "Respond to a Dispute"
        : null;
  return (
    <SpecShell url="help.acme.com/search?q=payout+hold">
      <SpecCanvas minH={260}>
        <div className="px-4 py-4 relative">
          <SummaryCard citeHot={citeHot} showFeedback />
          <AnimatePresence>
            {pop && <CitationPopover title={pop} />}
          </AnimatePresence>
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 03 — Expand / collapse long detail */
function WExpand({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 6400, [0, 1400, 3600, 5600]);
  const expanded = step === 1 || step === 2;
  return (
    <SpecShell url="help.acme.com/search?q=payout+hold">
      <SpecCanvas minH={280}>
        <div className="px-4 py-4">
          <SummaryCard expanded={expanded} showFeedback />
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 04 — Feedback + follow-up chips */
function WFeedbackAsk({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 7200, [0, 1000, 2400, 4000, 5800]);
  const feedback = step >= 2 ? ("up" as const) : null;
  const chipHot = step === 3 ? 0 : step === 4 ? 1 : -1;
  return (
    <SpecShell url="help.acme.com/search?q=payout+hold">
      <SpecCanvas minH={290}>
        <div className="px-4 py-4">
          <SummaryCard
            showFeedback
            feedback={feedback}
            showAsk={step >= 1}
            chipHot={chipHot}
          />
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

const SECTIONS: SpecSection[] = [
  {
    num: "01",
    tag: "Answer",
    title: "Lead with a direct answer and a highlighted fact",
    desc: "Smart summary sits above the result list. The first sentence answers the query; the key clause is marked so scanning eyes catch the takeaway immediately.",
    bullets: [
      "Title reads “Smart summary” with a quiet sparkles cue",
      "Highlight uses brand-tinted mark — not all-caps shouting",
      "Body clamps to a short preview before View more",
    ],
    Widget: WAnswer,
  },
  {
    num: "02",
    tag: "Citations",
    title: "Inline citations connect the answer to sources",
    desc: "Numbered marks in the prose open source peeks — title, freshness, and excerpt — so trust is inspectable without leaving the summary.",
    bullets: [
      "Citation chips sit inline as superscript-style marks",
      "Hover / click reveals a compact source card",
      "Opening a citation can focus the matching article panel",
    ],
    Widget: WCitations,
  },
  {
    num: "03",
    tag: "Expand",
    title: "View more reveals depth without dumping a wall of text",
    desc: "Long guidance stays collapsed by default. Expanding unfolds additional paragraphs with the same citation pattern, then View less restores the skim state.",
    bullets: [
      "Default clamp keeps results list visible below",
      "Extra paragraphs keep citations and tone consistent",
      "Collapse is one click — no modal, no route change",
    ],
    Widget: WExpand,
  },
  {
    num: "04",
    tag: "Continue",
    title: "Feedback and follow-ups close the loop",
    desc: "After reading, people can rate the answer and keep going — either with a free-text follow-up or with AI suggestion chips tuned to the query.",
    bullets: [
      "Thumbs (or Yes/No on host skins) acknowledge usefulness",
      "Ask bar invites the next question in context",
      "Chips offer ranked next asks without retyping",
    ],
    Widget: WFeedbackAsk,
  },
];

export function SearchSummarySpec() {
  return (
    <SpecPage
      monoLabel="Design Specs · Search summary"
      title="Smart summary interaction system"
      subtitle="Four patterns for answering on the results page — highlight the fact, cite the source, expand with care, and invite the next step."
      sections={SECTIONS}
    />
  );
}
