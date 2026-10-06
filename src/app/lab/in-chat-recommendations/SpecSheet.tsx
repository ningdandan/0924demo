import { useState, useEffect, useRef, ReactNode } from "react";
import {
  PhoneForwarded,
  Gift,
  Calendar,
  FileText,
  Bot,
  Mic,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { SpecPage } from "../shared/SpecPage";

// ─── Animation loop hook ──────────────────────────────────────────────────────

function useAnimLoop(
  inView: boolean,
  totalMs: number,
  timestamps: number[],
) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) {
      setStep(0);
      return;
    }
    const start = Date.now();
    const last = { s: -1 };
    let raf: number;
    const tick = () => {
      const t = (Date.now() - start) % totalMs;
      let s = 0;
      for (let i = 0; i < timestamps.length; i++) {
        if (t >= timestamps[i]) s = i;
      }
      if (last.s !== s) {
        last.s = s;
        setStep(s);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);
  return step;
}

// ─── Stencil helper ───────────────────────────────────────────────────────────

function Stencil({
  w,
  h = 6,
  opacity = 0.45,
}: {
  w: string | number;
  h?: number;
  opacity?: number;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        background: "#CBD5E1",
        borderRadius: 3,
        opacity,
        flexShrink: 0,
      }}
    />
  );
}

// ─── Browser chrome ───────────────────────────────────────────────────────────

function SpecBrowserChrome({ url }: { url: string }) {
  return (
    <div
      style={{
        background: "#2A2A28",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
      className="px-3 py-1.5 flex items-center gap-2 shrink-0"
    >
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
        <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
        <div className="w-2 h-2 rounded-full bg-[#28C840]" />
      </div>
      <div className="flex-1 max-w-[220px] mx-auto bg-black/20 rounded px-2 py-0.5 flex items-center gap-1">
        <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
          <circle
            cx="3.5"
            cy="3.5"
            r="2.9"
            stroke="#5A5A58"
            strokeWidth="0.55"
          />
          <path
            d="M2.3 3.5C2.3 2.4 2.7 1.4 3.5 0.6C4.3 1.4 4.7 2.4 4.7 3.5C4.7 4.6 4.3 5.6 3.5 6.4C2.7 5.6 2.3 4.6 2.3 3.5Z"
            stroke="#5A5A58"
            strokeWidth="0.55"
          />
          <path
            d="M0.6 3.5H6.4"
            stroke="#5A5A58"
            strokeWidth="0.55"
          />
        </svg>
        <span className="text-[7.5px] text-[#5a5a58] font-mono truncate">
          {url}
        </span>
      </div>
    </div>
  );
}

function WidgetShell({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        height: 320,
      }}
    >
      <SpecBrowserChrome url={url} />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ─── Mini chat bubble ─────────────────────────────────────────────────────────

function Bubble({
  role,
  children,
  dim,
}: {
  role: "agent" | "customer";
  children: ReactNode;
  dim?: boolean;
}) {
  return (
    <div
      className={`flex gap-2 ${role === "customer" ? "flex-row-reverse" : ""}`}
      style={{
        opacity: dim ? 0.4 : 1,
        transition: "opacity 0.3s",
      }}
    >
      <div
        className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[7px] font-bold
        ${role === "customer" ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-500"}`}
      >
        {role === "customer" ? "MW" : <Bot size={8} />}
      </div>
      <div
        className={`max-w-[72%] rounded-2xl px-2.5 py-1.5 text-[8px] leading-[1.5]
        ${role === "customer" ? "bg-[#2563EB] text-white rounded-tr-sm" : "bg-white text-[#111] rounded-tl-sm shadow-sm"}`}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Shared chat thread ───────────────────────────────────────────────────────

function ChatThread({ dimAll }: { dimAll?: boolean }) {
  return (
    <div className="space-y-2">
      <Bubble role="customer" dim={dimAll}>
        Hi, I placed order #TRK-88432 six days ago — needed by
        Saturday.
      </Bubble>
      <Bubble role="agent" dim={dimAll}>
        I completely understand. Let me pull that up right now.
      </Bubble>
      <Bubble role="agent" dim={dimAll}>
        Found it — it&apos;s on a warehouse hold. I apologize
        you weren&apos;t notified.
      </Bubble>
      <Bubble role="customer" dim={dimAll}>
        A warehouse hold? No one told me anything about this.
      </Bubble>
    </div>
  );
}

// ─── Chips component ─────────────────────────────────────────────────────────

type Chip = { icon: typeof PhoneForwarded; label: string };

const defaultChips: Chip[] = [
  { icon: PhoneForwarded, label: "Release hold on #TRK-88432" },
  { icon: Gift, label: "Apply goodwill credit" },
  { icon: Calendar, label: "Call Marcus Fri" },
];

const nextChips: Chip[] = [
  { icon: Gift, label: "Apply goodwill credit" },
  { icon: Calendar, label: "Schedule Fri callback" },
  { icon: FileText, label: "Email express options" },
];

function ChipsRow({
  chips,
  hoveredIdx = -1,
}: {
  chips: Chip[];
  hoveredIdx?: number;
}) {
  return (
    <div className="flex gap-1.5 overflow-hidden">
      {chips.map((c, i) => {
        const Icon = c.icon;
        const isHovered = i === hoveredIdx;
        return (
          <div
            key={i}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[7.5px] font-medium shrink-0 transition-all duration-200
              ${
                isHovered
                  ? "bg-blue-50 border-[#2563EB]/40 text-[#2563EB] shadow-sm scale-[1.02]"
                  : "bg-white border-[#E5E7EB] text-[#374151]"
              }`}
          >
            <Icon
              size={9}
              className={
                isHovered ? "text-[#2563EB]" : "text-[#9CA3AF]"
              }
            />
            <span>{c.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ShimmerRow() {
  return (
    <div className="flex gap-1.5">
      {[120, 100, 110].map((w, i) => (
        <div
          key={i}
          className="h-[26px] rounded-full bg-white overflow-hidden relative shrink-0"
          style={{ width: w }}
        >
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]
            bg-gradient-to-r from-transparent via-slate-100 to-transparent"
          />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Widget 01 — Default: chips rest below input, personalized to conversation
// Steps: 0=idle  1=hover-chip-1  2=hover-chip-2  3=hover-chip-3  4=idle-again
// ─────────────────────────────────────────────────────────────────────────────

function Widget01({ inView }: { inView: boolean }) {
  const step = useAnimLoop(
    inView,
    8000,
    [0, 1400, 3200, 5000, 6800],
  );

  const hoveredIdx =
    step === 1 ? 0 : step === 2 ? 1 : step === 3 ? 2 : -1;

  return (
    <WidgetShell url="crm.acme.com/conversations/4821">
      <div className="flex flex-col h-full bg-[#F4F6F9]">
        <div className="px-3 pt-2.5 pb-1 shrink-0">
          <p className="text-[9px] font-semibold text-[#111827]">
            Marcus Webb
          </p>
        </div>
        <div className="flex-1 px-3 py-1 overflow-hidden">
          <ChatThread />
        </div>
        <div className="px-3 pt-1 shrink-0">
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2.5 shadow-sm">
            <span className="text-[#9CA3AF] text-base leading-none shrink-0">
              +
            </span>
            <span className="flex-1 text-[8.5px] text-[#9CA3AF]">
              Type a reply…
            </span>
            <Mic
              size={11}
              className="text-[#9CA3AF] shrink-0"
            />
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 shrink-0 space-y-1.5">
          <div className="flex items-center gap-1 px-0.5">
            <Sparkles size={7} className="text-[#2563EB]" />
            <span className="text-[6.5px] font-mono font-medium text-[#2563EB] uppercase tracking-wide">
              AI Assist
            </span>
          </div>
          <ChipsRow
            chips={defaultChips}
            hoveredIdx={hoveredIdx}
          />
        </div>
      </div>
    </WidgetShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Widget 02 — Send: chip tapped → fills input → sends as message
// Steps: 0=idle  1=chip-hover  2=chip-in-input  3=message-sent  4=settled
// ─────────────────────────────────────────────────────────────────────────────

function Widget02({ inView }: { inView: boolean }) {
  const step = useAnimLoop(
    inView,
    8000,
    [0, 1200, 2200, 3400, 5500, 7200],
  );

  const hovering = step === 1;
  const inInput = step === 2;
  const sent = step >= 3 && step < 5;

  return (
    <WidgetShell url="crm.acme.com/conversations/4821">
      <div className="flex flex-col h-full bg-[#F4F6F9]">
        <div className="px-3 pt-2.5 pb-1 shrink-0">
          <p className="text-[9px] font-semibold text-[#111827]">
            Marcus Webb
          </p>
        </div>
        <div className="flex-1 px-3 py-1 overflow-hidden space-y-2">
          <ChatThread dimAll={sent} />
          {sent && (
            <Bubble role="agent">
              Release hold on #TRK-88432
            </Bubble>
          )}
        </div>
        <div className="px-3 pt-1 shrink-0">
          <div
            className={`flex items-center gap-2 bg-white rounded-full px-3 py-2.5 shadow-sm transition-all duration-300
            ${inInput ? "ring-1 ring-[#2563EB]/30" : ""}`}
          >
            <span className="text-[#9CA3AF] text-base leading-none shrink-0">
              +
            </span>
            <span
              className={`flex-1 text-[8.5px] truncate transition-colors duration-200
              ${inInput ? "text-[#111827] font-medium" : "text-[#9CA3AF]"}`}
            >
              {inInput
                ? "Release hold on #TRK-88432"
                : "Type a reply…"}
            </span>
            {inInput ? (
              <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 9 9"
                  fill="none"
                >
                  <path
                    d="M1.5 4.5L7.5 4.5M7.5 4.5L5 2M7.5 4.5L5 7"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : (
              <Mic
                size={11}
                className="text-[#9CA3AF] shrink-0"
              />
            )}
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 shrink-0 space-y-1.5">
          <div className="flex items-center gap-1 px-0.5">
            <Sparkles size={7} className="text-[#2563EB]" />
            <span className="text-[6.5px] font-mono font-medium text-[#2563EB] uppercase tracking-wide">
              AI Assist
            </span>
          </div>
          <div
            className={`transition-opacity duration-300 ${sent ? "opacity-30" : "opacity-100"}`}
          >
            <ChipsRow
              chips={defaultChips}
              hoveredIdx={hovering ? 0 : -1}
            />
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Widget 03 — Refresh: shimmer → typing → new chips resolve
// Steps: 0=chips-normal  1=shimmer  2=typing  3=agent-reply  4=new-chips  5=settled
// ─────────────────────────────────────────────────────────────────────────────

function Widget03({ inView }: { inView: boolean }) {
  const step = useAnimLoop(
    inView,
    9000,
    [0, 1000, 2000, 3200, 4600, 6800],
  );

  const shimmer = step === 1 || step === 2;
  const typing = step === 2;
  const agentReplied = step >= 3 && step < 5;
  const showNew = step >= 4 && step < 5;

  return (
    <WidgetShell url="crm.acme.com/conversations/4821">
      <div className="flex flex-col h-full bg-[#F4F6F9]">
        <div className="px-3 pt-2.5 pb-1 shrink-0">
          <p className="text-[9px] font-semibold text-[#111827]">
            Marcus Webb
          </p>
        </div>
        <div className="flex-1 px-3 py-1 overflow-hidden space-y-2">
          <ChatThread />
          {agentReplied && (
            <Bubble role="agent">
              On it — escalated #TRK-88432 to fulfillment as
              priority. Hold releases within the hour.
            </Bubble>
          )}
          {typing && (
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <Bot size={8} className="text-slate-500" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm flex items-center gap-1">
                {[0, 150, 300].map((d, i) => (
                  <span
                    key={i}
                    className="w-1 h-1 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="px-3 pt-1 shrink-0">
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2.5 shadow-sm">
            <span className="text-[#9CA3AF] text-base leading-none shrink-0">
              +
            </span>
            <span className="flex-1 text-[8.5px] text-[#9CA3AF]">
              Type a reply…
            </span>
            <Mic
              size={11}
              className="text-[#9CA3AF] shrink-0"
            />
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 shrink-0 space-y-1.5">
          <div className="flex items-center gap-1 px-0.5">
            <Sparkles size={7} className="text-[#2563EB]" />
            <span className="text-[6.5px] font-mono font-medium text-[#2563EB] uppercase tracking-wide">
              AI Assist
            </span>
          </div>
          {shimmer ? (
            <ShimmerRow />
          ) : showNew ? (
            <ChipsRow chips={nextChips} />
          ) : (
            <ChipsRow chips={defaultChips} />
          )}
        </div>
      </div>
    </WidgetShell>
  );
}

// ─── Section data ─────────────────────────────────────────────────────────────

const SPEC_SECTIONS: {
  num: string;
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
  Widget: (props: { inView: boolean }) => ReactNode;
}[] = [
  {
    num: "01",
    tag: "Default",
    title:
      "Chips surface below the input, tuned to the conversation",
    desc: "After each exchange the AI reads the full thread and generates a short set of chips — each one a specific, ready-to-send action. They reference real details from the conversation: the order number, the customer's name, the deadline.",
    bullets: [
      "Up to 4 chips, ranked by urgency",
      "Labels are generated per-conversation — never generic",
      "Hovering a chip highlights it before committing",
    ],
    Widget: Widget01,
  },
  {
    num: "02",
    tag: "Send",
    title: "One tap sends the action directly into the chat",
    desc: "Tapping a chip moves its label into the input bar — giving the agent a split second to confirm — then sends it as their message. The chips fade as the message enters the thread, keeping focus on the conversation.",
    bullets: [
      "Chip label populates the input on first tap",
      "A send button appears; the message is dispatched on confirm",
      "Chips dim after sending so the thread stays primary",
    ],
    Widget: Widget02,
  },
  {
    num: "03",
    tag: "Refresh",
    title: "Chips shimmer while the AI re-reads, then resolve",
    desc: "While the agent's reply is being processed, the chips enter a skeleton state — still visible, just holding their space. The moment the agent's response lands, the shimmer resolves into a fresh set of chips scoped to the new state of the conversation.",
    bullets: [
      "Chips stay visible as skeletons during generation — no layout jump",
      "Typing indicator appears in the thread in sync",
      "New chips reflect the updated context, not the previous turn",
    ],
    Widget: Widget03,
  },
];

// ─── Design spec page ─────────────────────────────────────────────────────────

export default function SpecSheet(_props?: { onViewDemo?: () => void }) {
  return (
    <SpecPage
      monoLabel="Design Specs · In-chat recommendations"
      title="Suggestion chips"
      subtitle="The AI reads every message in real time and surfaces a short set of ready-to-send actions below the reply bar. One tap, and the action is in the thread — personalized to this conversation, this customer, this moment."
      sections={SPEC_SECTIONS}
    />
  );
}
