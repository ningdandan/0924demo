import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { Clock, HelpCircle, Layers, Mic, Search, Send } from "lucide-react";
import {
  SpecCanvas,
  SpecPage,
  SpecShell,
  SpecStencil,
  useAnimLoop,
  type SpecSection,
} from "../shared/SpecPage";

const GRADIENT =
  "linear-gradient(135deg, #c7d2fe 0%, #ddd6fe 45%, #fbcfe8 100%)";

type Row = { label: string; sub?: string; icon: "search" | "layers" | "help" | "clock" };

function RowIcon({ kind }: { kind: Row["icon"] }) {
  const Icon =
    kind === "search" ? Search : kind === "layers" ? Layers : kind === "help" ? HelpCircle : Clock;
  return (
    <span
      className="size-7 rounded-lg flex items-center justify-center shrink-0"
      style={{ background: "#F3F4F6" }}
    >
      <Icon size={13} color="#6B7280" />
    </span>
  );
}

function SuggestionPanel({
  groups,
  highlight,
  query = "",
}: {
  groups: { title: string; rows: Row[] }[];
  highlight?: number;
  query?: string;
}) {
  let flat = 0;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div style={{ borderTop: "1px solid #f3f4f6" }} className="pt-1 pb-1">
        {groups.map((g) => (
          <div key={g.title} className="mt-1">
            <p
              className="text-[9px] font-semibold uppercase tracking-[0.06em] px-4 pt-2 pb-1"
              style={{ color: "#9CA3AF" }}
            >
              {g.title}
            </p>
            {g.rows.map((row) => {
              const idx = flat++;
              const on = highlight === idx;
              const label = query
                ? (() => {
                    const i = row.label.toLowerCase().indexOf(query.toLowerCase());
                    if (i < 0) return row.label;
                    return (
                      <>
                        {row.label.slice(0, i)}
                        <strong style={{ color: "#1a1a2e" }}>
                          {row.label.slice(i, i + query.length)}
                        </strong>
                        {row.label.slice(i + query.length)}
                      </>
                    );
                  })()
                : row.label;
              return (
                <div
                  key={row.label}
                  className="flex items-start gap-2.5 px-4 py-2 mx-1 rounded-xl transition-colors"
                  style={{ background: on ? "#F3F4F6" : "transparent" }}
                >
                  <RowIcon kind={row.icon} />
                  <div className="min-w-0">
                    <p className="text-[12px] leading-snug" style={{ color: "#374151" }}>
                      {label}
                    </p>
                    {row.sub && (
                      <p className="text-[10px] truncate" style={{ color: "#9CA3AF" }}>
                        {row.sub}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PromptShell({
  focused,
  typed,
  children,
}: {
  focused: boolean;
  typed: string;
  children?: ReactNode;
}) {
  return (
    <div
      className="mx-auto w-full max-w-[360px] transition-all duration-300 overflow-hidden"
      style={{
        borderRadius: focused ? 18 : 999,
        padding: focused ? 4 : "4px 8px 4px 4px",
        backgroundImage: focused ? "none" : GRADIENT,
        backgroundColor: focused ? "#fff" : "transparent",
        boxShadow: focused
          ? "0 8px 28px rgba(0,23,105,0.10)"
          : "0 10px 32px rgba(6,106,254,0.14)",
      }}
    >
      <div
        className="flex items-center gap-2 px-3"
        style={{
          background: "#fff",
          borderRadius: focused ? 14 : 999,
          minHeight: 40,
        }}
      >
        <Search size={13} style={{ color: "#9CA3AF", flexShrink: 0 }} />
        <span className="flex-1 text-[12px] truncate" style={{ color: typed ? "#111827" : "#9CA3AF" }}>
          {typed || "Ask anything about your account…"}
        </span>
        {typed ? (
          <div className="size-7 rounded-full flex items-center justify-center" style={{ background: "#001769" }}>
            <Send size={11} color="#fff" />
          </div>
        ) : (
          <Mic size={13} style={{ color: "#9CA3AF" }} />
        )}
      </div>
      {children}
    </div>
  );
}

const SEARCH_ENHANCED_GROUPS = [
  {
    title: "Past searches",
    rows: [
      { label: "Disney+ plans and prices", icon: "search" as const },
      { label: "Login issues", icon: "search" as const },
      { label: "Update payment method", icon: "search" as const },
    ],
  },
  {
    title: "Frequent objects",
    rows: [
      { label: "Subscriber account", sub: "Account · Active", icon: "layers" as const },
      { label: "Living room TV", sub: "Device · Last streamed 2h ago", icon: "layers" as const },
    ],
  },
];

const CONVERSATIONAL_GROUPS = [
  {
    title: "Frequent objects",
    rows: [
      { label: "Subscriber account", sub: "Account · Active", icon: "layers" as const },
      { label: "Living room TV", sub: "Device · Last streamed 2h ago", icon: "layers" as const },
    ],
  },
  {
    title: "Frequently asked questions",
    rows: [
      { label: "How do I reset my password?", icon: "help" as const },
      { label: "Where do I manage devices?", icon: "help" as const },
    ],
  },
];

/** 01 — Appear under the focused prompt */
function WReveal({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 6200, [0, 900, 2800, 5000]);
  const open = step >= 1;
  return (
    <SpecShell url="help.acme.com">
      <SpecCanvas minH={300}>
        <div className="px-5 pt-7 pb-5">
          <PromptShell focused={open} typed="">
            <AnimatePresence>
              {open && (
                <SuggestionPanel
                  groups={SEARCH_ENHANCED_GROUPS}
                  highlight={step === 2 ? 1 : -1}
                />
              )}
            </AnimatePresence>
          </PromptShell>
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 02 — Grouped sections, not a flat chip row */
function WGroups({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 7000, [0, 1400, 3200, 5200]);
  const section = step === 1 ? 0 : step === 2 ? 1 : -1;
  return (
    <SpecShell url="help.acme.com">
      <SpecCanvas minH={300}>
        <div className="px-5 pt-6 pb-5">
          <PromptShell focused typed="">
            <div style={{ borderTop: "1px solid #f3f4f6" }} className="pt-1 pb-1">
              {SEARCH_ENHANCED_GROUPS.map((g, gi) => (
                <motion.div
                  key={g.title}
                  animate={{
                    opacity: section === -1 || section === gi ? 1 : 0.35,
                    scale: section === gi ? 1.01 : 1,
                  }}
                  className="mt-1 origin-top"
                >
                  <p
                    className="text-[9px] font-semibold uppercase tracking-[0.06em] px-4 pt-2 pb-1"
                    style={{ color: section === gi ? "#001769" : "#9CA3AF" }}
                  >
                    {g.title}
                  </p>
                  {g.rows.map((row) => (
                    <div key={row.label} className="flex items-start gap-2.5 px-4 py-2">
                      <RowIcon kind={row.icon} />
                      <div>
                        <p className="text-[12px]" style={{ color: "#374151" }}>
                          {row.label}
                        </p>
                        {row.sub && (
                          <p className="text-[10px]" style={{ color: "#9CA3AF" }}>
                            {row.sub}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </PromptShell>
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 03 — Query filters + highlight */
function WFilter({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 6800, [0, 1000, 2800, 4800]);
  const query = step === 0 ? "" : step === 1 ? "pay" : "payment";
  const groups =
    query.length === 0
      ? SEARCH_ENHANCED_GROUPS
      : [
          {
            title: "Past searches",
            rows: SEARCH_ENHANCED_GROUPS[0].rows.filter((r) =>
              r.label.toLowerCase().includes(query.toLowerCase()),
            ),
          },
        ].filter((g) => g.rows.length > 0);
  return (
    <SpecShell url="help.acme.com">
      <SpecCanvas minH={280}>
        <div className="px-5 pt-6 pb-5">
          <PromptShell focused typed={query || ""}>
            <SuggestionPanel groups={groups} query={query} highlight={step >= 2 ? 0 : -1} />
          </PromptShell>
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 04 — Select fills & submits */
function WSelect({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 7200, [0, 900, 2400, 3400, 5800]);
  const selected = step >= 2;
  const landed = step >= 3;
  return (
    <SpecShell url={landed ? "help.acme.com/search" : "help.acme.com"}>
      <SpecCanvas minH={280} bg={landed ? "#F8F8FA" : "#F5F5F3"}>
        <AnimatePresence mode="wait">
          {!landed ? (
            <motion.div key="pick" className="px-5 pt-6 pb-5" exit={{ opacity: 0, y: -6 }}>
              <PromptShell focused typed={selected ? "Update payment method" : ""}>
                {!selected && (
                  <SuggestionPanel groups={SEARCH_ENHANCED_GROUPS} highlight={step === 1 ? 2 : -1} />
                )}
              </PromptShell>
            </motion.div>
          ) : (
            <motion.div
              key="land"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 pt-4 pb-5 space-y-3"
            >
              <div
                className="h-8 rounded-full bg-white px-3 flex items-center gap-2"
                style={{ border: "1px solid #E5E7EB" }}
              >
                <Search size={11} color="#9CA3AF" />
                <span className="text-[10px]" style={{ color: "#111827" }}>
                  Update payment method
                </span>
              </div>
              <div className="rounded-xl bg-white p-3 space-y-2" style={{ border: "1px solid #E8E8ED" }}>
                <SpecStencil w="90%" h={8} opacity={0.24} />
                <SpecStencil w="70%" h={8} opacity={0.14} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 05 — Conversational mode swaps group set */
function WMode({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 7000, [0, 1800, 3800, 5600]);
  const conversational = step === 1 || step === 2;
  return (
    <SpecShell url="help.acme.com">
      <SpecCanvas minH={300}>
        <div className="px-5 pt-5 pb-5 space-y-3">
          <div className="flex justify-center">
            <div
              className="inline-flex rounded-full p-0.5 text-[10px] font-semibold"
              style={{ background: "rgba(0,0,0,0.06)" }}
            >
              <span
                className="px-2.5 py-1 rounded-full"
                style={{
                  background: !conversational ? "#fff" : "transparent",
                  color: !conversational ? "#111" : "#6B7280",
                }}
              >
                Search enhanced
              </span>
              <span
                className="px-2.5 py-1 rounded-full"
                style={{
                  background: conversational ? "#fff" : "transparent",
                  color: conversational ? "#111" : "#6B7280",
                }}
              >
                Conversational
              </span>
            </div>
          </div>
          <PromptShell focused typed="">
            <SuggestionPanel
              groups={conversational ? CONVERSATIONAL_GROUPS : SEARCH_ENHANCED_GROUPS}
              highlight={step === 2 ? 2 : -1}
            />
          </PromptShell>
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

const SECTIONS: SpecSection[] = [
  {
    num: "01",
    tag: "Reveal",
    title: "Suggestions unfold under the focused prompt",
    desc: "When the bar opens, grouped suggestions appear inside the same shell — not as a separate floating menu — so the ask and the shortcuts stay one surface.",
    bullets: [
      "Only mounts when the prompt is focused / expanded",
      "Sits below the input with a hairline divider",
      "Controlled by the search-bar suggestions checklist toggle",
    ],
    Widget: WReveal,
  },
  {
    num: "02",
    tag: "Groups",
    title: "Sections beat a flat chip strip",
    desc: "Items are titled groups — Past searches, Frequent objects, FAQs — each with an icon tile so people scan by intent instead of reading a long undifferentiated list.",
    bullets: [
      "Uppercase group labels stay quiet and scannable",
      "Object rows can carry a secondary meta line",
      "Empty groups are omitted entirely",
    ],
    Widget: WGroups,
  },
  {
    num: "03",
    tag: "Filter",
    title: "Typing filters the list and highlights matches",
    desc: "As the query grows, groups shrink to matching rows and the matched substring is bolded — so the list stays useful while composing.",
    bullets: [
      "Filter runs across label and subtitle",
      "Match highlight uses the body weight, not a loud color block",
      "Groups with zero hits disappear",
    ],
    Widget: WFilter,
  },
  {
    num: "04",
    tag: "Select",
    title: "A row fills the bar and submits",
    desc: "Choosing a suggestion writes the value into the prompt and fires search — the same path as typing and hitting send.",
    bullets: [
      "mousedown preventDefault keeps focus stable until submit",
      "Value, not just label, is what gets submitted",
      "Landing continues into enhanced results",
    ],
    Widget: WSelect,
  },
  {
    num: "05",
    tag: "Modes",
    title: "Maturity mode swaps which groups appear",
    desc: "Search-enhanced leans on past searches + objects. Fully conversational swaps in frequently asked questions beside objects — same component, different data shape.",
    bullets: [
      "search-enhanced: Past searches · Frequent objects",
      "conversational: Frequent objects · Frequently asked questions",
      "One SuggestionGroupList renders both modes",
    ],
    Widget: WMode,
  },
];

export function SearchSuggestionsSpec() {
  return (
    <SpecPage
      monoLabel="Design Specs · Search bar suggestions"
      title="Search bar suggestions"
      subtitle="The grouped list that opens under the prompt — past searches, objects, and FAQs that filter as you type and submit on select."
      sections={SECTIONS}
    />
  );
}
