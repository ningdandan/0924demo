import { AnimatePresence, motion } from "motion/react";
import { Mic, Search, Send, Sparkles } from "lucide-react";
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

function PromptIdle({ focused, typed }: { focused: boolean; typed: string }) {
  return (
    <div
      className="mx-auto w-full max-w-[340px] transition-all duration-300"
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
        <span
          className="flex-1 text-[12px] truncate"
          style={{ color: typed ? "#111827" : "#9CA3AF" }}
        >
          {typed || "Ask anything about your account…"}
        </span>
        {typed ? (
          <div
            className="size-7 rounded-full flex items-center justify-center"
            style={{ background: "#001769" }}
          >
            <Send size={11} color="#fff" />
          </div>
        ) : (
          <Mic size={13} style={{ color: "#9CA3AF" }} />
        )}
      </div>
    </div>
  );
}

function SuggestionPanel({ highlight }: { highlight: number }) {
  const groups = [
    {
      label: "Topics",
      items: ["Reset password", "Update payment method", "Cancel plan"],
    },
    {
      label: "Objects",
      items: ["Account · Alex Rivera", "Device · Living room TV"],
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -4, height: 0 }}
      className="mx-auto w-full max-w-[340px] mt-2 overflow-hidden"
    >
      <div
        className="rounded-2xl bg-white px-3 py-3 space-y-3"
        style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
      >
        {groups.map((g) => (
          <div key={g.label}>
            <p
              className="text-[9px] font-semibold uppercase tracking-[0.08em] mb-1.5 px-1"
              style={{ color: "#9CA3AF" }}
            >
              {g.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {g.items.map((item, i) => {
                const idx = g.label === "Topics" ? i : i + 3;
                const on = highlight === idx;
                return (
                  <div
                    key={item}
                    className="rounded-lg px-2 py-1.5 text-[11px] transition-colors"
                    style={{
                      background: on ? "#EEF2FF" : "transparent",
                      color: on ? "#001769" : "#374151",
                      fontWeight: on ? 600 : 400,
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/** 01 — Resting glow pill on the help home */
function WIdle({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 5200, [0, 1800, 3600]);
  const pulse = step === 1;
  return (
    <SpecShell url="help.acme.com">
      <SpecCanvas minH={220}>
        <div className="px-5 pt-8 pb-6 flex flex-col items-center gap-4">
          <SpecStencil w={120} h={10} opacity={0.22} />
          <SpecStencil w={180} h={7} opacity={0.12} />
          <motion.div
            animate={{ scale: pulse ? 1.02 : 1, y: pulse ? -2 : 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <PromptIdle focused={false} typed="" />
          </motion.div>
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 02 — Focus expands into grouped suggestions */
function WExpand({ inView }: { inView: boolean }) {
  // 0 idle  1 focus+panel  2 highlight topic  3 settle
  const step = useAnimLoop(inView, 7000, [0, 900, 2600, 4800]);
  const focused = step >= 1;
  return (
    <SpecShell url="help.acme.com">
      <SpecCanvas minH={280}>
        <div className="px-5 pt-6 pb-5">
          <PromptIdle focused={focused} typed="" />
          <AnimatePresence>{focused && <SuggestionPanel highlight={step === 2 ? 1 : -1} />}</AnimatePresence>
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 03 — Type → send → results */
function WSubmit({ inView }: { inView: boolean }) {
  // 0 empty focus  1 typing  2 send flash  3 results landing
  const step = useAnimLoop(inView, 7800, [0, 900, 2800, 3600, 6800]);
  const typed =
    step === 0
      ? ""
      : step === 1
        ? "payout on hold"
        : "Why is my payout on hold?";
  const showResults = step >= 3;
  return (
    <SpecShell url={showResults ? "help.acme.com/search" : "help.acme.com"}>
      <SpecCanvas minH={260} bg={showResults ? "#F8F8FA" : "#F5F5F3"}>
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="compose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="px-5 pt-10 pb-8"
            >
              <PromptIdle focused typed={typed} />
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 flex justify-center"
                >
                  <span
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "#EEF2FF", color: "#001769" }}
                  >
                    Sending…
                  </span>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 pt-4 pb-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 h-8 rounded-full bg-white px-3 flex items-center gap-2"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  <Search size={11} color="#9CA3AF" />
                  <span className="text-[10px]" style={{ color: "#111827" }}>
                    Why is my payout on hold?
                  </span>
                </div>
              </div>
              <div
                className="rounded-xl bg-white p-3 space-y-2"
                style={{ border: "1px solid #E8E8ED" }}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={10} color="#001769" />
                  <span className="text-[9px] font-semibold" style={{ color: "#6B7280" }}>
                    Smart summary
                  </span>
                </div>
                <SpecStencil w="92%" h={8} opacity={0.28} />
                <SpecStencil w="70%" h={8} opacity={0.16} />
              </div>
              {[88, 72, 64].map((w, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white px-3 py-2.5"
                  style={{ border: "1px solid #ECECF1" }}
                >
                  <SpecStencil w={`${w}%`} h={7} opacity={0.22} />
                  <div className="mt-1.5">
                    <SpecStencil w="55%" h={5} opacity={0.12} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 04 — Follow-up ask bar under summary on results */
function WFollowUp({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 6500, [0, 1200, 2800, 4200, 5800]);
  const typed = step >= 2 ? "Can I still get paid this week?" : "";
  const sent = step >= 3;
  return (
    <SpecShell url="help.acme.com/search?q=payout">
      <SpecCanvas minH={250}>
        <div className="px-4 py-4 space-y-3">
          <div
            className="rounded-xl bg-white overflow-hidden"
            style={{ border: "1px solid #E8E8ED" }}
          >
            <div className="px-3 pt-3 pb-2 space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkles size={10} color="#001769" />
                <span className="text-[9px] font-semibold" style={{ color: "#6B7280" }}>
                  Smart summary
                </span>
              </div>
              <SpecStencil w="95%" h={7} opacity={0.24} />
              <SpecStencil w="78%" h={7} opacity={0.14} />
            </div>
            <div className="px-3 pb-3 pt-1" style={{ borderTop: "1px solid #ECECF1" }}>
              <div
                className="flex items-center gap-2 rounded-full px-3 py-2"
                style={{ background: "#FAFAFB", border: "1px solid #E4E4EA" }}
              >
                <span
                  className="flex-1 text-[11px] truncate"
                  style={{ color: typed ? "#111827" : "#9CA3AF" }}
                >
                  {typed || "Ask a follow-up question…"}
                </span>
                <motion.div
                  animate={{
                    background: sent ? "#001769" : "#E5E7EB",
                    scale: step === 2 ? 1.08 : 1,
                  }}
                  className="size-6 rounded-full flex items-center justify-center"
                >
                  <Send size={10} color={sent ? "#fff" : "#6B7280"} />
                </motion.div>
              </div>
              <div className="mt-2 flex gap-1.5 overflow-hidden">
                {["Clear verification", "Dispute spike", "Talk to support"].map((c, i) => (
                  <span
                    key={c}
                    className="shrink-0 text-[9px] rounded-full px-2 py-1"
                    style={{
                      background: step === 1 && i === 0 ? "#EEF2FF" : "#FAFAFB",
                      border: "1px solid #E4E4EA",
                      color: step === 1 && i === 0 ? "#001769" : "#6B7280",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {sent && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] text-center"
              style={{ color: "#6B7280" }}
            >
              Hands off to conversation with summary context
            </motion.p>
          )}
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

const SECTIONS: SpecSection[] = [
  {
    num: "01",
    tag: "Idle",
    title: "A glowing prompt is the only starting move",
    desc: "On help home, the bar rests as a gradient pill with soft glow — brand signal first, then a single place to ask. No competing CTAs in the first viewport.",
    bullets: [
      "Full-width centered max width keeps focus on one input",
      "Gradient + glow mark it as the AI / search affordance",
      "Mic stays secondary until the user is ready to speak",
    ],
    Widget: WIdle,
  },
  {
    num: "02",
    tag: "Expand",
    title: "Focus opens grouped suggestions, not a flat list",
    desc: "When the bar expands, suggestions arrive in topic and object groups so people can refine by intent or by the thing they care about — account, device, order.",
    bullets: [
      "Pill morphs into a rounded card shell on focus",
      "Groups stay scannable: Topics, Objects, recent asks",
      "Keyboard / hover highlight prepares the next submit",
    ],
    Widget: WExpand,
  },
  {
    num: "03",
    tag: "Submit",
    title: "Typing and send land you on enhanced results",
    desc: "Submit (enter or paper plane) commits the query and transitions into search-enhanced results — smart summary first, then the classic list underneath.",
    bullets: [
      "Empty submit is blocked; plane only activates with text",
      "Query carries into the results address / search chrome",
      "Landing prioritizes AI summary over raw ranking noise",
    ],
    Widget: WSubmit,
  },
  {
    num: "04",
    tag: "Follow-up",
    title: "The same ask pattern continues under the summary",
    desc: "On results, a quieter follow-up bar sits under Smart summary so people can deepen the question or jump to chat without leaving the answer context.",
    bullets: [
      "Placeholder invites a follow-up, not a brand-new search",
      "Suggestion chips offer next questions tuned to the query",
      "Send can hand off summary + top results into conversation",
    ],
    Widget: WFollowUp,
  },
];

export function PromptBarSpec() {
  return (
    <SpecPage
      monoLabel="Design Specs · Prompt bar"
      title="Prompt bar interaction system"
      subtitle="Four moments that define how people start — and continue — asking for help across home and search-enhanced results."
      sections={SECTIONS}
    />
  );
}
