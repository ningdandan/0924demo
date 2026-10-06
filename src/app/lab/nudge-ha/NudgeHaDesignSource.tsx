import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SpecPage } from "../shared/SpecPage";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  Send,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Search,
  Zap,
  CreditCard,
  Settings,
  Plug,
  ArrowUpRight,
  X,
} from "lucide-react";

type ModeId = 1 | 2 | 3;

// ─── Step configs ─────────────────────────────────────────────────────────────

const STEP_CONFIGS: Record<ModeId, { label: string; url: string }[]> = {
  1: [
    { label: "Homepage", url: "help.acme.com" },
    { label: "Typing", url: "help.acme.com" },
    { label: "Chat", url: "help.acme.com/chat?q=how+do+i+reset+my+password" },
    { label: "Article panel", url: "help.acme.com/chat?q=how+do+i+reset+my+password" },
  ],
  2: [
    { label: "Google search", url: "google.com/search?q=reset+password+acme" },
    { label: "Article page", url: "help.acme.com/articles/password-reset" },
    { label: "Chat + Article", url: "help.acme.com/articles/password-reset" },
  ],
  3: [
    { label: "Google search", url: "google.com/search?q=how+do+I+reset+my+acme+password" },
    { label: "Chat pre-opened", url: "help.acme.com/articles/password-reset?chat=open" },
  ],
};

const MODE_SUBTITLES: Record<ModeId, string> = {
  1: "User starts from the help center homepage",
  2: "User arrives via a Google keyword search",
  3: "User arrives from a very specific Google query",
};

// ─── Shared data ──────────────────────────────────────────────────────────────

interface Citation { id: number; title: string; active?: boolean; }
interface Message { role: "user" | "ai"; text: string; citations?: Citation[]; }

const TILE_REPLIES: Record<string, Message[]> = {
  "I didn't receive the reset email. What should I do?": [
    { role: "user", text: "I didn't receive the reset email. What should I do?" },
    { role: "ai", text: "First, check your spam or junk folder — it sometimes ends up there. Also confirm you entered the right email address. If it's still missing after a few minutes, try requesting a new link from the login page.", citations: [{ id: 1, title: "Email Troubleshooting" }] },
  ],
  "My reset link has expired. How do I get a new one?": [
    { role: "user", text: "My reset link has expired. How do I get a new one?" },
    { role: "ai", text: "Reset links expire after 24 hours. Just go back to the login page, click \"Forgot password\" again, and we'll send a fresh link to your email right away." },
  ],
  "Can I reset my password from the mobile app?": [
    { role: "user", text: "Can I reset my password from the mobile app?" },
    { role: "ai", text: "Yes! Open the Acme app, tap \"Sign in\", then tap \"Forgot password\" below the login form. Enter your email and follow the reset link we send you — the process is the same as on the web." },
  ],
  "I forgot which email I used for my account.": [
    { role: "user", text: "I forgot which email I used for my account." },
    { role: "ai", text: "Try any email addresses you commonly use — we'll only send a reset link if there's a matching account. If you're still stuck, our support team can help you look up your account with other details.", citations: [{ id: 2, title: "Contact Support" }] },
  ],
};

const CHAT_MESSAGES: Record<ModeId, Message[]> = {
  1: [
    { role: "user", text: "How do I reset my password?" },
    {
      role: "ai",
      text: "You can reset your password from the login page. Click \"Forgot password\", enter your email, and check your inbox for a reset link — it expires in 24 hours.",
      citations: [{ id: 1, title: "Password Reset Guide", active: true }],
    },
    { role: "user", text: "What if I don't get the email?" },
    {
      role: "ai",
      text: "Check your spam folder first. Verify you're using the correct email address. Contact support if the issue persists.",
      citations: [{ id: 2, title: "Email Troubleshooting" }],
    },
  ],
  2: [],
  3: [
    { role: "ai", text: "Based on your search, here's how to reset your password:" },
    {
      role: "ai",
      text: "1. Go to the login page\n2. Click \"Forgot password\"\n3. Enter your account email\n4. Check your inbox — link expires in 24 hours",
      citations: [{ id: 1, title: "Password Reset Guide" }],
    },
  ],
};

// ─── NudgePills — reusable chip component ─────────────────────────────────────

interface NudgePillItem {
  label: string;
  desc?: string;
}

interface NudgePillDef {
  label: string;
  icon?: React.ReactNode;
  /** Sub-items to show in a dropdown when clicked */
  items?: NudgePillItem[];
  /** Direct-action question text (no dropdown) */
  q?: string;
}

interface NudgePillsProps {
  pills: NudgePillDef[];
  /** Called when a direct-action pill or a dropdown item is selected */
  onSelect: (pill: NudgePillDef, item?: NudgePillItem) => void;
  /** Tighter padding + smaller font so more pills fit in a row */
  compact?: boolean;
}

function NudgePills({ pills, onSelect, compact = false }: NudgePillsProps) {
  const [activePill, setActivePill] = useState<string | null>(null);

  const handlePillClick = (pill: NudgePillDef) => {
    if (pill.items) {
      setActivePill(prev => (prev === pill.label ? null : pill.label));
    } else {
      setActivePill(null);
      onSelect(pill);
    }
  };

  const handleItemClick = (pill: NudgePillDef, item: NudgePillItem) => {
    setActivePill(null);
    onSelect(pill, item);
  };

  const activeDef = pills.find(p => p.label === activePill);

  return (
    <div className="w-full">
      {/* Pill row */}
      <div className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}>
        {pills.map(pill => {
          const isActive = activePill === pill.label;
          const hasDropdown = !!pill.items;
          return (
            <button
              key={pill.label}
              onClick={() => handlePillClick(pill)}
              className={`flex items-center rounded-full transition-all select-none whitespace-nowrap ${
                compact
                  ? "gap-1 px-2.5 py-[4px] text-[10.5px]"
                  : "gap-1.5 px-3 py-1.5 text-[11.5px]"
              }`}
              style={{
                background: isActive ? "#E0EAFF" : "#F0F4FF",
                border: `1px solid ${isActive ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.15)"}`,
                color: "#2563EB",
                fontWeight: 400,
                boxShadow: isActive ? "0 0 0 3px rgba(37,99,235,0.08)" : undefined,
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "#E8EFFE";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.28)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "#F0F4FF";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.15)";
                }
              }}
            >
              {pill.icon
                ? <span className="shrink-0">{pill.icon}</span>
                : <Sparkles size={compact ? 9 : 10} className="shrink-0 opacity-60" />
              }
              {pill.label}
              {hasDropdown && (
                <ChevronDown
                  size={compact ? 9 : 11}
                  style={{
                    transition: "transform 0.2s ease",
                    transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Dropdown panel */}
      <AnimatePresence>
        {activeDef?.items && (
          <motion.div
            key={activeDef.label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="mt-2 bg-white rounded-xl overflow-hidden"
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {activeDef.items.map((item, i) => (
              <button
                key={item.label}
                onClick={() => handleItemClick(activeDef, item)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left group transition-colors"
                style={{
                  borderBottom:
                    i < activeDef.items!.length - 1
                      ? "1px solid rgba(0,0,0,0.05)"
                      : undefined,
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLElement).style.background = "#F8F9FF")
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLElement).style.background = "")
                }
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5"
                  style={{ background: "rgba(37,99,235,0.35)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-medium text-[#111110] leading-snug">
                    {item.label}
                  </p>
                  {item.desc && (
                    <p className="text-[11px] text-[#9A9A98] mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  )}
                </div>
                <ArrowUpRight
                  size={11}
                  className="shrink-0 transition-opacity"
                  style={{ color: "#C0C0BE" }}
                />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mode 1 pill data ─────────────────────────────────────────────────────────

const MODE1_TOPIC_PILLS: NudgePillDef[] = [
  {
    label: "Getting started",
    icon: <Zap size={10} />,
    items: [
      { label: "Set up your workspace", desc: "Configure your environment" },
      { label: "Invite team members", desc: "Add collaborators to your org" },
      { label: "Connect your first integration", desc: "Zapier, Slack, and more" },
      { label: "Import your data", desc: "Migrate from other tools" },
    ],
  },
  {
    label: "Account & security",
    icon: <Settings size={10} />,
    items: [
      { label: "Reset your password", desc: "Forgot or need to change it?" },
      { label: "Enable two-factor auth", desc: "Add an extra layer of security" },
      { label: "Update email address", desc: "Change your login email" },
      { label: "Manage active sessions", desc: "See and revoke logins" },
    ],
  },
  {
    label: "Billing & plans",
    icon: <CreditCard size={10} />,
    items: [
      { label: "View current plan", desc: "See features and limits" },
      { label: "Upgrade or downgrade", desc: "Switch your subscription" },
      { label: "Download invoices", desc: "Access billing history" },
      { label: "Cancel subscription", desc: "End or pause your plan" },
    ],
  },
  {
    label: "API & integrations",
    icon: <Plug size={10} />,
    items: [
      { label: "Generate an API key", desc: "Authenticate your requests" },
      { label: "Set up webhooks", desc: "Connect real-time events" },
      { label: "Rate limits & quotas", desc: "Understand usage constraints" },
      { label: "SDK & client libraries", desc: "Start building faster" },
    ],
  },
];

// ─── Mode 2 pill data ─────────────────────────────────────────────────────────

const MODE2_NUDGE_PILLS: NudgePillDef[] = [
  { label: "I didn't receive the reset email", q: "I didn't receive the reset email. What should I do?" },
  { label: "My reset link expired", q: "My reset link has expired. How do I get a new one?" },
  { label: "Reset via mobile app", q: "Can I reset my password from the mobile app?" },
  { label: "I don't know my email", q: "I forgot which email I used for my account." },
];

// ─── Shared page nav ──────────────────────────────────────────────────────────

function PageNav() {
  return (
    <div
      className="px-7 py-3 flex items-center justify-between shrink-0"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center">
          <Sparkles size={13} className="text-white" />
        </div>
        <span className="text-[13.5px] font-bold text-[#111110]">Acme Help</span>
      </div>
      <div className="flex items-center gap-5">
        <span className="text-[12px] text-[#9A9A98]">Community</span>
        <span className="text-[12px] text-[#9A9A98]">Status</span>
        <button
          className="text-[12px] font-semibold text-[#2563EB] px-3 py-1 rounded-lg"
          style={{ border: "1px solid rgba(37,99,235,0.25)" }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

// ─── Mode 1 · Step 1 — Homepage ───────────────────────────────────────────────

function Mode1Step1({
  onPromptClick,
  onTopicSelect,
}: {
  onPromptClick: () => void;
  onTopicSelect: () => void;
}) {
  return (
    <div className="h-full bg-white flex flex-col">
      <PageNav />
      <div className="flex-1 flex flex-col items-center justify-center px-6" style={{ paddingBottom: "2.5rem" }}>

        {/* Personalized greeting block */}
        <div className="w-full max-w-[600px] mb-6">
          <h1 className="text-[26px] font-bold text-[#111110] leading-tight mb-1.5">
            Sarah, how can we help you today?
          </h1>
          <p className="text-[13px] leading-relaxed" style={{ color: "#9A9A98" }}>
            Your team onboarding is still in progress — 3 of 8 members haven't accepted their invite yet.
          </p>
        </div>

        {/* Prompt bar */}
        <div
          onClick={onPromptClick}
          className="w-full max-w-[600px] flex items-center gap-3 bg-white rounded-2xl px-4 py-3 cursor-text transition-shadow hover:shadow-md mb-4"
          style={{
            border: "1.5px solid rgba(0,0,0,0.1)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <Search size={15} className="text-[#C0C0BE] shrink-0" />
          <span className="flex-1 text-[13px] text-[#C8C8C6]">Ask anything...</span>
          <div className="w-7 h-7 rounded-lg bg-[#EAEAE8] flex items-center justify-center shrink-0">
            <Send size={11} className="text-[#ABABAB]" />
          </div>
        </div>

        {/* Topic pills with dropdown */}
        <div className="w-full max-w-[600px]">
          <NudgePills
            compact
            pills={MODE1_TOPIC_PILLS}
            onSelect={(_pill, item) => {
              if (item) onTopicSelect();
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Mode 1 · Step 2 — Auto-typing ────────────────────────────────────────────

const TYPED_QUERY = "How do I reset my password?";

function Mode1Step2({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      if (i <= TYPED_QUERY.length) {
        setText(TYPED_QUERY.slice(0, i));
        i++;
        setTimeout(tick, 42);
      } else {
        setDone(true);
        setTimeout(() => { if (!cancelled) onComplete(); }, 650);
      }
    };

    const initial = setTimeout(tick, 180);
    return () => { cancelled = true; clearTimeout(initial); };
  }, []);

  const showDropdown = text.length >= 5;

  return (
    <div className="h-full bg-white flex flex-col">
      <PageNav />
      <div className="flex-1 flex flex-col items-center pt-10 px-6">
        <div className="w-full max-w-[600px] mb-5">
          <h1 className="text-[26px] font-bold text-[#111110] leading-tight mb-1.5">
            How can we help you today?
          </h1>
          <p className="text-[13px]" style={{ color: "#9A9A98" }}>
            Your team onboarding is still in progress — 3 of 8 members haven't accepted their invite yet.
          </p>
        </div>

        <div className="relative w-full max-w-[600px]">
          <div
            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3"
            style={{
              border: "1.5px solid #2563EB",
              boxShadow: "0 0 0 3px rgba(37,99,235,0.1), 0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <Search size={15} className="text-[#2563EB] shrink-0" />
            <span className="flex-1 text-[13px] text-[#111110] flex items-center">
              {text}
              {!done && (
                <span
                  className="inline-block w-[1.5px] h-4 bg-[#2563EB] ml-px"
                  style={{ animation: "pulse 0.9s ease-in-out infinite" }}
                />
              )}
            </span>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
              style={{ background: text.length > 0 ? "#2563EB" : "#EAEAE8" }}
            >
              <Send size={11} className={text.length > 0 ? "text-white" : "text-[#ABABAB]"} />
            </div>
          </div>

          {showDropdown && (
            <div
              className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl overflow-hidden z-10"
              style={{
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            >
              {[
                { label: TYPED_QUERY, active: true },
                { label: "Password requirements and rules" },
                { label: "Enable two-factor authentication" },
                { label: "Account recovery options" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5"
                  style={{ background: item.active ? "rgba(37,99,235,0.04)" : undefined }}
                >
                  <Search size={11} style={{ color: item.active ? "#2563EB" : "#C0C0BE" }} />
                  <span
                    className="flex-1 text-[12.5px]"
                    style={{ color: item.active ? "#2563EB" : "#111110", fontWeight: item.active ? 500 : 400 }}
                  >
                    {item.label}
                  </span>
                  {item.active && <ChevronRight size={12} style={{ color: "#2563EB" }} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Mode 1 · Step 3 — Chat full width ───────────────────────────────────────

const MODE1_FOLLOWUP_CHIPS = [
  "What if I don't get the email?",
  "Can I reset from the mobile app?",
  "How do I enable two-factor auth?",
];

const MODE1_CHIP_REPLIES: Record<string, string> = {
  "What if I don't get the email?":
    "Check your spam or junk folder first. If it's still not there after a few minutes, try resending from the login page. Make sure you're using the email address on your account.",
  "Can I reset from the mobile app?":
    "Yes — open the app and tap \"Sign in\", then \"Forgot password?\" below the password field. The reset flow is the same as the web version.",
  "How do I enable two-factor auth?":
    "Go to Settings → Security → Two-factor authentication and follow the prompts to connect an authenticator app or SMS number.",
};

interface ChatTurn {
  role: "user" | "ai";
  text: string;
}

function Mode1Step3({ onCitationClick }: { onCitationClick: () => void }) {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [usedChips, setUsedChips] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleChip = (chip: string) => {
    if (usedChips.has(chip)) return;
    setUsedChips(prev => new Set([...prev, chip]));
    const reply = MODE1_CHIP_REPLIES[chip] ?? "Let me look into that for you.";
    setTurns(prev => [
      ...prev,
      { role: "user", text: chip },
      { role: "ai", text: reply },
    ]);
    // scroll to bottom after render
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  };


  return (
    <div className="h-full bg-white flex flex-col">
      {/* Minimal top bar */}
      <div
        className="px-6 py-3 flex items-center shrink-0"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-1.5 text-[12px] text-[#9A9A98]">
          <span>Help</span>
          <ChevronRight size={11} className="text-[#C8C8C6]" />
          <span className="text-[#111110] font-medium">How do I reset my password?</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-8" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-[560px] mx-auto px-6 space-y-6">

          {/* Initial user bubble */}
          <div className="flex justify-end">
            <div
              className="bg-[#2563EB] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13px] leading-relaxed"
              style={{ maxWidth: "72%" }}
            >
              How do I reset my password?
            </div>
          </div>

          {/* Initial AI response */}
          <div className="space-y-3">
            <p className="text-[14px] text-[#111110] leading-[1.7]">
              You can reset your password from the login page. Click{" "}
              <span className="font-semibold">"Forgot password"</span>, enter your email,
              and check your inbox for a reset link — it expires in 24 hours.
              <sup>
                <button
                  className="font-semibold ml-[1px]"
                  style={{ fontSize: "10px", color: "#2563EB", lineHeight: 1 }}
                  onClick={onCitationClick}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                >
                  [1]
                </button>
              </sup>
            </p>

            {/* Reference footnote */}
            <div className="flex items-center gap-1.5">
              <span
                className="text-[11px] font-semibold text-[#2563EB] cursor-pointer hover:opacity-70"
                style={{ fontFamily: "'DM Mono', monospace" }}
                onClick={onCitationClick}
              >
                [1]
              </span>
              <span
                className="text-[11px] text-[#9A9A98] cursor-pointer hover:text-[#2563EB] transition-colors"
                onClick={onCitationClick}
              >
                Password Reset Guide
              </span>
            </div>
          </div>

          {/* Follow-up turns */}
          {turns.map((turn, i) => (
            <div key={i} className={turn.role === "user" ? "flex justify-end" : ""}>
              {turn.role === "user" ? (
                <div
                  className="bg-[#2563EB] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13px] leading-relaxed"
                  style={{ maxWidth: "72%" }}
                >
                  {turn.text}
                </div>
              ) : (
                <p className="text-[14px] text-[#111110] leading-[1.7]">{turn.text}</p>
              )}
            </div>
          ))}

        </div>
      </div>

      {/* Input bar + chips below */}
      <div className="px-6 pt-2.5 pb-2 shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="max-w-[560px] mx-auto">
          {/* Input */}
          <div className="flex items-center gap-3 bg-[#F3F3F1] rounded-xl px-4 py-2.5 mb-2">
            <input
              className="flex-1 bg-transparent text-[13px] placeholder:text-[#C8C8C6] outline-none"
              placeholder="Ask a follow-up..."
              readOnly
            />
            <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
              <Send size={12} className="text-white" />
            </div>
          </div>

          {/* Horizontally scrolling suggestion chips — always visible */}
          <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {MODE1_FOLLOWUP_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => handleChip(chip)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all select-none whitespace-nowrap shrink-0"
                  style={{
                    background: "#F0F4FF",
                    border: "1px solid rgba(37,99,235,0.15)",
                    color: "#2563EB",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "#E0EAFF";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.35)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "#F0F4FF";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.15)";
                  }}
                >
                  <Sparkles size={8} />
                  {chip}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mode 2 · Step 1 — Google SERP ───────────────────────────────────────────

function Mode2Step1({ onArticleClick }: { onArticleClick: () => void }) {
  const others = [
    { url: "support.microsoft.com › en-us › account", title: "Reset your Microsoft account password", snippet: "Go to the Microsoft account recovery page, select the reason you need your password reset, and follow the steps to verify your identity." },
    { url: "help.dropbox.com › en-us › article", title: "Reset your Dropbox password | Dropbox Help", snippet: "You can reset your password from the Dropbox login page or from your account settings if you're already logged in." },
    { url: "support.google.com › accounts › answer", title: "Recover your Google Account or Gmail", snippet: "To recover your account, follow the steps to verify it's yours. You'll be asked some questions to confirm it's your account." },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-5 py-2.5 flex items-center gap-4 shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <span className="text-[20px] font-bold tracking-tight select-none">
          <span style={{ color: "#4285F4" }}>G</span><span style={{ color: "#EA4335" }}>o</span>
          <span style={{ color: "#FBBC05" }}>o</span><span style={{ color: "#4285F4" }}>g</span>
          <span style={{ color: "#34A853" }}>l</span><span style={{ color: "#EA4335" }}>e</span>
        </span>
        <div className="flex-1 max-w-lg flex items-center gap-3 bg-white rounded-full px-4 py-2" style={{ border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          <span className="flex-1 text-[13px] text-[#111110]">reset password acme</span>
          <Search size={15} style={{ color: "#4285F4" }} className="shrink-0" />
        </div>
      </div>
      <div className="flex items-center gap-5 px-[148px] pt-2 pb-1" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        {["All", "Images", "Videos", "News", "Shopping"].map((tab, i) => (
          <span key={tab} className="text-[12.5px] pb-2 cursor-pointer" style={{ color: i === 0 ? "#1A73E8" : "#5F6368", borderBottom: i === 0 ? "2px solid #1A73E8" : "2px solid transparent", fontWeight: i === 0 ? 500 : 400 }}>
            {tab}
          </span>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-[148px] py-4" style={{ scrollbarWidth: "none" }}>
        <p className="text-[12px] mb-4" style={{ color: "#70757A" }}>About 2,840,000 results (0.42 seconds)</p>
        <div onClick={onArticleClick} className="mb-6 cursor-pointer group p-3 rounded-xl transition-colors hover:bg-[#F8F8F8]" style={{ border: "1px solid rgba(37,99,235,0.12)", background: "rgba(37,99,235,0.015)" }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-sm bg-[#2563EB] flex items-center justify-center shrink-0">
              <Sparkles size={8} className="text-white" />
            </div>
            <span className="text-[11.5px]" style={{ color: "#3C4043" }}>help.acme.com › articles › password-reset</span>
          </div>
          <p className="text-[17px] font-normal group-hover:underline mb-1" style={{ color: "#1A0DAB" }}>
            Resetting Your Password — Acme Help Center
          </p>
          <p className="text-[12.5px] leading-relaxed" style={{ color: "#4D5156" }}>
            Learn how to reset your Acme account password step by step. Go to the login page, click{" "}
            <span className="font-medium">"Forgot password"</span>, enter your email, and follow the reset link sent to your inbox. Links expire in 24 hours.
          </p>
        </div>
        {others.map((r) => (
          <div key={r.title} className="mb-6">
            <div className="text-[11.5px] mb-0.5" style={{ color: "#3C4043" }}>{r.url}</div>
            <p className="text-[17px] font-normal cursor-pointer hover:underline mb-1" style={{ color: "#1A0DAB" }}>{r.title}</p>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "#4D5156" }}>{r.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Article + Chat page — shared by Mode 2 and Mode 3 ───────────────────────

const PANEL_EXPAND_MS = 340;
const CONTENT_APPEAR_MS = 370;

const DEFAULT_GREETING: Message[] = [
  { role: "ai", text: "Hi! I see you're reading about password reset. Is there anything specific I can help you with?" },
];

const MODE3_SUMMARY: Message[] = [
  {
    role: "ai",
    text: "I found a guide on resetting your Acme password. The short version: go to the login page, click \"Forgot password\", enter your email, and follow the link in your inbox — it expires in 24 hours.",
  },
];

function Mode2ArticlePage({
  forceOpen = false,
  initialMessages,
  showFloatingBar = true,
  inChatPills = false,
  footerChips,
}: {
  forceOpen?: boolean;
  initialMessages?: Message[];
  showFloatingBar?: boolean;
  inChatPills?: boolean;
  footerChips?: string[];
}) {
  const [chatPhase, setChatPhase] = useState<"closed" | "opening" | "open">(
    forceOpen ? "open" : "closed"
  );
  const [pillsConsumed, setPillsConsumed] = useState(false);
  const [askAnythingOpen, setAskAnythingOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(
    forceOpen ? (initialMessages ?? DEFAULT_GREETING) : []
  );

  const chatIsVisible = chatPhase === "opening" || chatPhase === "open";
  const contentVisible = chatPhase === "open";

  const expandChat = (msgs: Message[]) => {
    setPillsConsumed(true);
    if (chatPhase === "open") {
      setMessages(prev => [...prev, ...msgs]); // append so summary stays visible
      return;
    }
    setChatPhase("opening");
    setTimeout(() => {
      setChatPhase("open");
      setMessages(msgs);
    }, CONTENT_APPEAR_MS);
  };

  const handleNudgeSelect = (pill: NudgePillDef) => {
    const q = pill.q ?? pill.label;
    const msgs: Message[] = TILE_REPLIES[q] ?? [{ role: "user", text: q }];
    expandChat(msgs);
  };

  const handleBarClick = () => {
    if (chatPhase !== "closed") return;
    expandChat(DEFAULT_GREETING);
  };

  const handleClose = () => {
    setChatPhase("closed");
    setPillsConsumed(false);
    setAskAnythingOpen(false);
  };

  const articleSteps = [
    "Navigate to accounts.acme.com",
    "Click \"Forgot password\" below the sign-in form",
    "Enter the email address for your account",
    "Click \"Send reset link\" — check your inbox within 2–5 min",
    "Open the email and click \"Reset password\"",
    "Enter and confirm your new password",
  ];

  return (
    <div className="h-full flex p-3 gap-0" style={{ background: "#EBEBEA" }}>

      {/* ── Chat card (slides in from left) ── */}
      <div
        style={{
          width: chatIsVisible ? "44%" : "0%",
          flexShrink: 0,
          overflow: "hidden",
          transition: `width ${PANEL_EXPAND_MS}ms cubic-bezier(0.4,0,0.2,1), margin-right ${PANEL_EXPAND_MS}ms cubic-bezier(0.4,0,0.2,1)`,
          marginRight: chatIsVisible ? "12px" : "0px",
        }}
      >
        <div
          className="h-full bg-white rounded-2xl flex flex-col overflow-hidden"
          style={{
            minWidth: "220px",
            opacity: contentVisible ? 1 : 0,
            transition: "opacity 0.18s ease",
            boxShadow: "0 2px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          {/* Chat header */}
          <div className="px-3.5 py-2.5 flex items-center gap-2 shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
              <Sparkles size={9} className="text-white" />
            </div>
            <span className="text-[12px] font-semibold text-[#111110] flex-1">Help Center Chat</span>
            <button
              onClick={handleClose}
              className="w-5 h-5 rounded-md flex items-center justify-center transition-colors hover:bg-[#F3F3F1]"
            >
              <X size={12} className="text-[#9A9A98]" />
            </button>
          </div>

          {/* Messages + in-chat action pills (Mode 3) */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: "none" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" ? (
                  <div className="max-w-[92%] space-y-1.5">
                    {/* Plain text — no gray bubble */}
                    <p className="text-[13px] text-[#111110] leading-[1.7] whitespace-pre-line">
                      {msg.text}
                      {msg.citations && msg.citations.map((c, ci) => (
                        <sup key={c.id}>
                          <span
                            className="font-semibold ml-[1px]"
                            style={{ fontSize: "9px", color: "#2563EB", lineHeight: 1 }}
                          >
                            [{ci + 1}]
                          </span>
                        </sup>
                      ))}
                    </p>
                    {/* Footnote rows */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="space-y-0.5 pt-0.5">
                        {msg.citations.map((c, ci) => (
                          <div key={c.id} className="flex items-center gap-1.5">
                            <span
                              className="text-[10px] font-semibold text-[#2563EB]"
                              style={{ fontFamily: "'DM Mono', monospace" }}
                            >
                              [{ci + 1}]
                            </span>
                            <span className="text-[10px] text-[#9A9A98]">{c.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="max-w-[88%] bg-[#2563EB] text-white rounded-2xl rounded-tr-sm px-3 py-2 text-[12px] leading-relaxed">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}

            {/* In-chat action pills — Mode 3: shown until user picks one */}
            {inChatPills && !pillsConsumed && (
              <div className="pt-1">
                <p className="text-[10px] text-[#ABABAB] uppercase tracking-wide font-medium mb-2">
                  What would you like to know?
                </p>
                <div className="flex flex-wrap gap-1.5">
                {MODE2_NUDGE_PILLS.map(pill => (
                  <button
                    key={pill.label}
                    onClick={() => handleNudgeSelect(pill)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11.5px] transition-all"
                    style={{
                      background: "#F0F4FF",
                      border: "1px solid rgba(37,99,235,0.14)",
                      color: "#2563EB",
                      fontWeight: 400,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "#E0EAFF";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.3)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "#F0F4FF";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.14)";
                    }}
                  >
                    <Sparkles size={10} className="shrink-0 opacity-60" />
                    {pill.label}
                  </button>
                ))}
                </div>
              </div>
            )}
          </div>

          {/* Input + optional footer chips */}
          <div className="px-3 pt-2.5 pb-2 shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="flex items-center gap-2 bg-[#F3F3F1] rounded-lg px-3 py-1.5 mb-2">
              <input className="flex-1 bg-transparent text-[12px] placeholder:text-[#ABABAB] outline-none" placeholder="Ask anything..." readOnly />
              <div className="w-[22px] h-[22px] rounded-md bg-[#2563EB] flex items-center justify-center">
                <Send size={10} className="text-white" />
              </div>
            </div>
            {footerChips && (
              <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {footerChips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => {
                      setMessages(prev => [
                        ...prev,
                        { role: "user", text: chip },
                        { role: "ai", text: MODE1_CHIP_REPLIES[chip] ?? "Let me look into that." },
                      ]);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] transition-all select-none whitespace-nowrap shrink-0"
                    style={{ background: "#F0F4FF", border: "1px solid rgba(37,99,235,0.15)", color: "#2563EB", fontWeight: 400 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#E0EAFF"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F0F4FF"; }}
                  >
                    <Sparkles size={8} className="opacity-60" />
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Article card ── */}
      <div
        className="flex-1 bg-white rounded-2xl flex flex-col overflow-hidden relative"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)" }}
      >
        {/* Breadcrumb */}
        <div className="px-5 py-2.5 flex items-center gap-1.5 shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <span className="text-[11.5px] text-[#9A9A98]">Help Center</span>
          <ChevronRight size={11} className="text-[#C8C8C6]" />
          <span className="text-[11.5px] text-[#9A9A98]">Account</span>
          <ChevronRight size={11} className="text-[#C8C8C6]" />
          <span className="text-[11.5px] font-semibold text-[#111110]">Password Reset</span>
        </div>

        {/* Article content */}
        <div
          className="flex-1 overflow-y-auto py-4"
          style={{ scrollbarWidth: "none", paddingBottom: chatIsVisible ? "1rem" : "5.5rem" }}
        >
          <div className="max-w-[440px] mx-auto px-5">
            <h2 className="text-[18px] font-bold text-[#111110] mb-1.5 leading-tight">
              Resetting Your Password
            </h2>

            <div className="flex items-center gap-2 mb-3 text-[11px] text-[#9A9A98]" style={{ fontFamily: "'DM Mono', monospace" }}>
              <span>Updated Jan 12, 2025</span><span>·</span><span>5 min read</span>
            </div>

            {/* Rec chips + "Ask anything else" that morphs into inline blue card */}
            {!pillsConsumed && !chatIsVisible && (
              <div className="mb-4">
                <AnimatePresence mode="wait">
                  {!askAnythingOpen ? (
                    <motion.div
                      key="chips"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.14 }}
                      className="flex flex-wrap gap-1.5"
                    >
                      {MODE2_NUDGE_PILLS.slice(0, 3).map(pill => (
                        <button
                          key={pill.label}
                          onClick={() => handleNudgeSelect(pill)}
                          className="inline-flex items-center gap-1 px-2.5 py-[4px] rounded-full text-[10.5px] transition-all select-none whitespace-nowrap"
                          style={{ background: "#F0F4FF", border: "1px solid rgba(37,99,235,0.15)", color: "#2563EB", fontWeight: 400 }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#E8EFFE"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F0F4FF"; }}
                        >
                          <Sparkles size={9} className="opacity-60 shrink-0" />
                          {pill.label}
                        </button>
                      ))}
                      <button
                        onClick={() => setAskAnythingOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-[4px] rounded-full text-[10.5px] transition-all select-none whitespace-nowrap"
                        style={{ background: "#F0F4FF", border: "1px solid rgba(37,99,235,0.15)", color: "#2563EB", fontWeight: 400 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#E8EFFE"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F0F4FF"; }}
                      >
                        <Sparkles size={9} className="opacity-60 shrink-0" />
                        Ask anything else
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ask-card"
                      layoutId="chat-trigger"
                      className="rounded-2xl px-3 py-2"
                      style={{ background: "#2563EB", boxShadow: "0 4px 20px rgba(37,99,235,0.28)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          onClick={() => expandChat(DEFAULT_GREETING)}
                          className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2 cursor-text"
                          style={{ background: "rgba(255,255,255,0.15)" }}
                        >
                          <input
                            className="flex-1 bg-transparent text-[11px] text-white placeholder:text-white/60 outline-none"
                            placeholder="Ask anything..."
                            readOnly
                          />
                          <div
                            onClick={() => expandChat(DEFAULT_GREETING)}
                            className="w-[18px] h-[18px] rounded-md bg-white flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <Send size={8} style={{ color: "#2563EB" }} />
                          </div>
                        </div>
                        <button
                          onClick={() => setAskAnythingOpen(false)}
                          className="w-[26px] h-[26px] rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(255,255,255,0.15)" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.25)"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"}
                        >
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <p className="text-[12.5px] text-[#111110] leading-relaxed mb-4">
              If you've forgotten your password or need to change it for security reasons, you can reset it at any time from the login page. The process takes less than two minutes.
            </p>

            <h3 className="text-[13px] font-semibold text-[#111110] mb-3 mt-4">Step-by-step</h3>
            <ol className="space-y-2 mb-4">
              {articleSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[12px] text-[#111110] leading-relaxed">
                  <span className="shrink-0 w-[18px] h-[18px] rounded-full bg-[#EEF2FF] text-[#2563EB] text-[9px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
              <p className="text-[11px] font-semibold text-amber-800 mb-0.5">Important</p>
              <p className="text-[11.5px] text-amber-700 leading-relaxed">
                Reset links expire after 24 hours. Return to login to request a new one.
              </p>
            </div>
          </div>
        </div>

        {/* Floating chat bar — hidden when askAnythingOpen (it flies up via layoutId) */}
        {chatPhase === "closed" && showFloatingBar && !askAnythingOpen && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[340px]" style={{ pointerEvents: "all" }}>
            <motion.div
              layoutId="chat-trigger"
              className="rounded-2xl px-3 py-2"
              style={{
                background: "#2563EB",
                boxShadow: "0 4px 24px rgba(37,99,235,0.35), 0 1px 4px rgba(0,0,0,0.1)",
              }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            >
              <div
                onClick={handleBarClick}
                className="flex items-center gap-2 rounded-xl px-3 py-2 cursor-text"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <input
                  className="flex-1 bg-transparent text-[11px] text-white placeholder:text-white/60 outline-none"
                  placeholder="Ask anything..."
                  readOnly
                />
                <div className="w-[18px] h-[18px] rounded-md bg-white flex items-center justify-center shrink-0">
                  <Send size={8} style={{ color: "#2563EB" }} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Floating windows (Mode 1 step 4, Mode 3 step 2) ─────────────────────────

function ChatWindow({ mode, messages, half }: { mode: ModeId; messages?: Message[]; half?: boolean }) {
  const msgs = messages ?? CHAT_MESSAGES[mode];
  return (
    <div
      className={`${half ? "flex-1" : "w-[300px] shrink-0"} bg-white rounded-2xl overflow-hidden flex flex-col`}
      style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div className="px-3.5 py-2.5 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="w-[20px] h-[20px] rounded-full bg-[#2563EB] flex items-center justify-center">
          <Sparkles size={9} className="text-white" />
        </div>
        <span className="text-[12px] font-semibold text-[#111110] flex-1">Help Center Chat</span>
        {mode === 3 && (
          <span className="text-[9px] font-mono uppercase tracking-wide text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full" style={{ border: "1px solid rgba(16,185,129,0.2)" }}>auto-opened</span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-white" style={{ scrollbarWidth: "none" }}>
        {msgs.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" ? (
              <div className="max-w-[90%]">
                <div className="bg-[#F3F3F1] rounded-2xl rounded-tl-sm px-3 py-2 text-[12px] text-[#111110] leading-relaxed whitespace-pre-line">{msg.text}</div>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {msg.citations.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium select-none"
                        style={{
                          border: c.active ? "1px solid #2563EB" : "1px solid rgba(0,0,0,0.1)",
                          background: c.active ? "rgba(37,99,235,0.05)" : undefined,
                          color: c.active ? "#2563EB" : "#6F6F6D",
                          boxShadow: c.active ? "0 0 0 2px rgba(37,99,235,0.12)" : undefined,
                        }}
                      >
                        <BookOpen size={9} />
                        {c.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-[90%] bg-[#2563EB] text-white rounded-2xl rounded-tr-sm px-3 py-2 text-[12px] leading-relaxed">{msg.text}</div>
            )}
          </div>
        ))}
      </div>
      <div className="px-3 py-2.5" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="flex items-center gap-2 bg-[#F3F3F1] rounded-lg px-3 py-1.5">
          <input className="flex-1 bg-transparent text-[12px] placeholder:text-[#ABABAB] outline-none" placeholder={mode === 1 ? "Ask a follow-up..." : "Ask anything..."} readOnly />
          <div className="w-[22px] h-[22px] rounded-md bg-[#2563EB] flex items-center justify-center">
            <Send size={10} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleWindow() {
  return (
    <div
      className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div className="px-4 py-2.5 flex items-center gap-1" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <span className="text-[11px] text-[#9A9A98]">Help Center</span>
        <ChevronRight size={10} className="text-[#C8C8C6]" />
        <span className="text-[11px] text-[#9A9A98]">Account</span>
        <ChevronRight size={10} className="text-[#C8C8C6]" />
        <span className="text-[11px] font-semibold text-[#111110]">Password Reset</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-[420px]">
          <h2 className="text-[15px] font-bold text-[#111110] mb-1 leading-tight">Resetting Your Password</h2>
          <div className="flex items-center gap-2 mb-4 text-[10.5px] text-[#9A9A98]" style={{ fontFamily: "'DM Mono', monospace" }}>
            <span>Updated Jan 12, 2025</span><span>·</span><span>5 min read</span>
          </div>
          <p className="text-[12px] text-[#111110] leading-relaxed mb-4">
            If you've forgotten your password or need to change it for security reasons, you can reset it at any time from the login page.
          </p>
          <h3 className="text-[12.5px] font-semibold text-[#111110] mb-2.5 mt-4">Step-by-step</h3>
          <ol className="space-y-2 mb-4">
            {[
              "Navigate to accounts.acme.com",
              "Click \"Forgot password\" below the sign-in form",
              "Enter the email address for your account",
              "Click \"Send reset link\" — check your inbox",
              "Open the email and click \"Reset password\"",
              "Enter and confirm your new password",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-[11.5px] text-[#111110] leading-relaxed">
                <span className="shrink-0 w-[17px] h-[17px] rounded-full bg-[#EEF2FF] text-[#2563EB] text-[9px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <p className="text-[10.5px] font-semibold text-amber-800 mb-0.5">Important</p>
            <p className="text-[11px] text-amber-700 leading-relaxed">Reset links expire after 24 hours.</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-2.5 flex items-center gap-2" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <span className="text-[11px] text-[#9A9A98]">Was this helpful?</span>
        <button className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-[#6F6F6D]" style={{ border: "1px solid rgba(0,0,0,0.1)" }}><ThumbsUp size={10} /> Yes</button>
        <button className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-[#6F6F6D]" style={{ border: "1px solid rgba(0,0,0,0.1)" }}><ThumbsDown size={10} /> No</button>
      </div>
    </div>
  );
}

function FloatingWindowsStep({ mode, messages, half }: { mode: ModeId; messages?: Message[]; half?: boolean }) {
  return (
    <div className="h-full flex items-stretch gap-3 p-4" style={{ background: "#F0F0EE" }}>
      <ChatWindow mode={mode} messages={messages} half={half} />
      <ArticleWindow />
    </div>
  );
}

// ─── Mode 3 · Step 1 — Google SERP (action-driven query) ─────────────────────

function Mode3Step1({ onArticleClick }: { onArticleClick: () => void }) {
  const others = [
    { url: "support.microsoft.com › en-us › account", title: "I forgot my Microsoft account password — fix it now", snippet: "Quick steps to immediately recover access to your Microsoft account using a verification code sent to your backup email or phone." },
    { url: "community.acme.com › discussion", title: "Locked out of Acme? Here's what to do first", snippet: "Community thread with step-by-step solutions for regaining account access when you've forgotten your password or can't log in." },
    { url: "help.acme.com › account › locked", title: "Account locked or access denied — Acme Help", snippet: "If your account is locked after failed login attempts, here's how to unlock it and reset your credentials safely." },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-5 py-2.5 flex items-center gap-4 shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <span className="text-[20px] font-bold tracking-tight select-none">
          <span style={{ color: "#4285F4" }}>G</span><span style={{ color: "#EA4335" }}>o</span>
          <span style={{ color: "#FBBC05" }}>o</span><span style={{ color: "#4285F4" }}>g</span>
          <span style={{ color: "#34A853" }}>l</span><span style={{ color: "#EA4335" }}>e</span>
        </span>
        <div className="flex-1 max-w-lg flex items-center gap-3 bg-white rounded-full px-4 py-2" style={{ border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          <span className="flex-1 text-[13px] text-[#111110]">how do I reset my acme password I can't log in</span>
          <Search size={15} style={{ color: "#4285F4" }} className="shrink-0" />
        </div>
      </div>
      <div className="flex items-center gap-5 px-[148px] pt-2 pb-1" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        {["All", "Images", "Videos", "News", "Shopping"].map((tab, i) => (
          <span key={tab} className="text-[12.5px] pb-2 cursor-pointer" style={{ color: i === 0 ? "#1A73E8" : "#5F6368", borderBottom: i === 0 ? "2px solid #1A73E8" : "2px solid transparent", fontWeight: i === 0 ? 500 : 400 }}>{tab}</span>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-[148px] py-4" style={{ scrollbarWidth: "none" }}>
        <p className="text-[12px] mb-4" style={{ color: "#70757A" }}>About 1,240,000 results (0.31 seconds)</p>

        <div className="mb-5 p-4 rounded-xl" style={{ border: "1px solid rgba(0,0,0,0.1)", background: "#FAFAFA" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "#70757A" }}>Featured snippet · From help.acme.com</p>
          <p className="text-[13px] text-[#111110] leading-relaxed mb-3">
            To reset your Acme password: go to the login page → click <strong>"Forgot password"</strong> → enter your email → open the reset link in your inbox. The link expires in 24 hours.
          </p>
          <div onClick={onArticleClick} className="text-[12px] cursor-pointer hover:underline" style={{ color: "#1A0DAB" }}>
            Resetting Your Password — Acme Help Center ↗
          </div>
        </div>

        <div onClick={onArticleClick} className="mb-6 cursor-pointer group p-3 rounded-xl transition-colors hover:bg-[#F8F8F8]" style={{ border: "1px solid rgba(37,99,235,0.12)", background: "rgba(37,99,235,0.015)" }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-sm bg-[#2563EB] flex items-center justify-center shrink-0">
              <Sparkles size={8} className="text-white" />
            </div>
            <span className="text-[11.5px]" style={{ color: "#3C4043" }}>help.acme.com › articles › password-reset</span>
          </div>
          <p className="text-[17px] font-normal group-hover:underline mb-1" style={{ color: "#1A0DAB" }}>Resetting Your Password — Acme Help Center</p>
          <p className="text-[12.5px] leading-relaxed" style={{ color: "#4D5156" }}>
            Step-by-step guide to reset your Acme password immediately. Click <span className="font-medium">"Forgot password"</span> on the login page, enter your email, and follow the link.
          </p>
        </div>

        {others.map((r) => (
          <div key={r.title} className="mb-6">
            <div className="text-[11.5px] mb-0.5" style={{ color: "#3C4043" }}>{r.url}</div>
            <p className="text-[17px] font-normal cursor-pointer hover:underline mb-1" style={{ color: "#1A0DAB" }}>{r.title}</p>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "#4D5156" }}>{r.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step content dispatcher ──────────────────────────────────────────────────

function StepContent({
  mode,
  step,
  setStep,
}: {
  mode: ModeId;
  step: number;
  setStep: (s: number) => void;
}) {
  if (mode === 1) {
    if (step === 1) return (
      <Mode1Step1
        onPromptClick={() => setStep(2)}
        onTopicSelect={() => setStep(3)}
      />
    );
    if (step === 2) return <Mode1Step2 onComplete={() => setStep(3)} />;
    if (step === 3) return <Mode1Step3 onCitationClick={() => setStep(4)} />;
    return (
      <Mode2ArticlePage
        key="m1s4"
        forceOpen
        initialMessages={CHAT_MESSAGES[1]}
        footerChips={MODE1_FOLLOWUP_CHIPS}
      />
    );
  }

  if (mode === 2) {
    if (step === 1) return <Mode2Step1 onArticleClick={() => setStep(2)} />;
    if (step === 2) return <Mode2ArticlePage key="m2s2" />;
    return <Mode2ArticlePage key="m2s3" forceOpen />;
  }

  if (step === 1) return <Mode3Step1 onArticleClick={() => setStep(2)} />;
  return (
    <Mode2ArticlePage
      key="m3s2"
      forceOpen
      initialMessages={MODE3_SUMMARY}
      inChatPills
    />
  );
}

// ─── Browser frame ────────────────────────────────────────────────────────────

function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.5), 0 24px 80px rgba(0,0,0,0.55)",
      }}
    >
      <div
        className="px-4 py-2.5 flex items-center gap-3"
        style={{ background: "#2A2A28", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div
          className="flex-1 rounded-md px-2.5 py-1 flex items-center gap-1.5 max-w-sm mx-auto"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Globe size={10} className="text-[#5A5A58] shrink-0" />
          <span className="text-[11px] text-[#5A5A58] truncate" style={{ fontFamily: "'DM Mono', monospace" }}>
            {url}
          </span>
        </div>
      </div>
      <div className="h-[520px]">{children}</div>
    </div>
  );
}

// ─── Step nav / breadcrumb ────────────────────────────────────────────────────

function StepNav({ mode, step, setStep }: { mode: ModeId; step: number; setStep: (s: number) => void }) {
  const steps = STEP_CONFIGS[mode];
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <button
              onClick={() => setStep(i + 1)}
              className="text-[14px] font-semibold transition-colors px-1"
              style={{ color: step === i + 1 ? "#F0F0EE" : "#3E3E3C" }}
            >
              {s.label}
            </button>
            {i < steps.length - 1 && (
              <ChevronRight size={14} className="mx-1.5" style={{ color: "#2A2A28" }} />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity disabled:opacity-20"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <ChevronLeft size={16} style={{ color: "#F0F0EE" }} />
        </button>
        <button
          onClick={() => setStep(Math.min(steps.length, step + 1))}
          disabled={step === steps.length}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity disabled:opacity-20"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <ChevronRight size={16} style={{ color: "#F0F0EE" }} />
        </button>
      </div>
    </div>
  );
}

// ─── Design Specs ─────────────────────────────────────────────────────────────

function useAnimLoop(inView: boolean, totalMs: number, timestamps: number[]) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) { setStep(0); return; }
    const start = Date.now();
    const last = { s: -1 };
    let raf: number;
    const tick = () => {
      const t = (Date.now() - start) % totalMs;
      let s = 0;
      for (let i = 0; i < timestamps.length; i++) { if (t >= timestamps[i]) s = i; }
      if (last.s !== s) { last.s = s; setStep(s); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);
  return step;
}

function SpecBrowserChrome({ url }: { url: string }) {
  return (
    <div className="px-3 py-1.5 flex items-center gap-2 shrink-0" style={{ background: "#2A2A28", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex gap-1 shrink-0">
        <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
        <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
        <div className="w-2 h-2 rounded-full bg-[#28C840]" />
      </div>
      <div className="flex-1 max-w-[200px] mx-auto bg-black/20 rounded px-2 py-0.5 flex items-center gap-1">
        <Globe size={7} className="text-[#5A5A58] shrink-0" />
        <span className="text-[8px] text-[#5A5A58] truncate" style={{ fontFamily: "'DM Mono', monospace" }}>{url}</span>
      </div>
    </div>
  );
}

function HomepageWidget({ inView }: { inView: boolean }) {
  // 0:base 1:pills-in 2:pill-hover 3:dropdown 4:item-highlight 5:collapse
  const step = useAnimLoop(inView, 6800, [0, 700, 1700, 2500, 3700, 5200]);
  const items = ["Reset my password", "Update payment method", "Cancel subscription", "Change account email"];
  const pills = ["Account & billing", "Getting started", "Integrations", "Mobile app"];

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
      <SpecBrowserChrome url="help.acme.com" />
      <div className="bg-white px-6 py-8 flex flex-col items-center" style={{ minHeight: 260 }}>
        <p className="text-[16px] font-bold text-[#111110] mb-1 text-center">Sarah, how can we help you?</p>
        <p className="text-[10px] text-[#9A9A98] mb-5 text-center">Your team onboarding is in progress — 3 of 8 pending</p>
        <div className="w-full max-w-[360px] flex items-center gap-2 rounded-xl px-3 py-2 mb-3" style={{ border: "1.5px solid rgba(0,0,0,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <Search size={13} className="text-[#C0C0BE] shrink-0" />
          <span className="text-[12px] text-[#C8C8C6] flex-1">Ask anything...</span>
        </div>
        <motion.div
          className="w-full max-w-[360px] flex flex-wrap gap-1.5"
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {pills.map((pill, i) => (
            <div key={pill} className="relative">
              <button
                className="inline-flex items-center gap-1 px-2.5 py-[4px] rounded-full text-[10.5px] whitespace-nowrap transition-all"
                style={{
                  background: step >= 2 && i === 0 ? "#E0EAFF" : "#F0F4FF",
                  border: `1px solid ${step >= 2 && i === 0 ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.15)"}`,
                  color: "#2563EB", fontWeight: 400,
                  boxShadow: step >= 2 && i === 0 ? "0 0 0 3px rgba(37,99,235,0.08)" : undefined,
                }}
              >
                <Sparkles size={9} className="opacity-60 shrink-0" />
                {pill}
                {i === 0 && <ChevronDown size={9} style={{ transform: step >= 3 && step < 5 ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />}
              </button>
              <AnimatePresence>
                {i === 0 && step >= 3 && step < 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16 }}
                    className="absolute top-full left-0 mt-1.5 bg-white rounded-xl overflow-hidden z-20"
                    style={{ minWidth: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.13)", border: "1px solid rgba(0,0,0,0.07)" }}
                  >
                    {items.map((item, j) => (
                      <div key={item} className="px-3 py-2 text-[11px] transition-colors"
                        style={{ background: step === 4 && j === 0 ? "#EEF2FF" : "white", color: step === 4 && j === 0 ? "#2563EB" : "#111110" }}>
                        {item}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ArticleWidget({ inView }: { inView: boolean }) {
  // 0:chips+bar 1:chip-hover 2:card-in 3:settled 4:x-click 5:reset
  const step = useAnimLoop(inView, 7200, [0, 1400, 2200, 2900, 4800, 6000]);
  const chips = ["I didn't receive the reset email", "My reset link expired", "Reset via mobile app"];

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
      <SpecBrowserChrome url="help.acme.com/articles/password-reset" />
      <div className="bg-white relative overflow-hidden" style={{ minHeight: 300 }}>
        <div className="px-6 py-5">
          <div className="flex items-center gap-1 mb-3">
            <span className="text-[9.5px] text-[#9A9A98]">Help Center</span>
            <ChevronRight size={9} className="text-[#C8C8C6]" />
            <span className="text-[9.5px] font-medium text-[#111110]">Password Reset</span>
          </div>
          <h2 className="text-[18px] font-bold text-[#111110] mb-1 leading-tight">Resetting Your Password</h2>
          <p className="text-[10px] text-[#9A9A98] mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>Updated Jan 12, 2025 · 5 min read</p>

          <AnimatePresence mode="wait">
            {step < 2 || step >= 5 ? (
              <motion.div key="chips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="flex flex-wrap gap-1.5 mb-4">
                {chips.map(chip => (
                  <button key={chip} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] whitespace-nowrap"
                    style={{ background: "#F0F4FF", border: "1px solid rgba(37,99,235,0.15)", color: "#2563EB", fontWeight: 400 }}>
                    <Sparkles size={8} className="opacity-60" />{chip}
                  </button>
                ))}
                <button className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] whitespace-nowrap transition-all"
                  style={{
                    background: step === 1 ? "#E0EAFF" : "#F0F4FF",
                    border: `1px solid ${step === 1 ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.15)"}`,
                    color: "#2563EB", fontWeight: 400,
                    boxShadow: step === 1 ? "0 0 0 2px rgba(37,99,235,0.08)" : undefined,
                  }}>
                  <Sparkles size={8} className="opacity-60" />Ask anything else
                </button>
              </motion.div>
            ) : (
              <motion.div key="card"
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="rounded-xl px-3 py-2 mb-4 flex items-center gap-2"
                style={{ background: "#2563EB" }}
              >
                <div className="flex-1 flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <span className="flex-1 text-[10px] text-white/60">Ask anything...</span>
                  <div className="w-4 h-4 rounded bg-white flex items-center justify-center shrink-0">
                    <Send size={7} style={{ color: "#2563EB" }} />
                  </div>
                </div>
                <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                  style={{ background: step >= 4 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)" }}>
                  <X size={8} className="text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[11px] text-[#6F6F6D] leading-relaxed">
            If you've forgotten your password, you can reset it at any time from the login page. The process takes less than two minutes...
          </p>
        </div>

        {/* Floating bar */}
        <AnimatePresence>
          {(step < 2 || step >= 5) && (
            <motion.div key="floater"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2" style={{ width: 220 }}>
              <div className="rounded-xl px-3 py-2" style={{ background: "#2563EB", boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
                <div className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <span className="flex-1 text-[9.5px] text-white/60">Ask anything...</span>
                  <div className="w-3.5 h-3.5 rounded bg-white flex items-center justify-center shrink-0">
                    <Send size={6} style={{ color: "#2563EB" }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChatWidget({ inView }: { inView: boolean }) {
  // 0:base 1:chip-hover 2:user-msg 3:ai-response 4:settled 5:reset
  const step = useAnimLoop(inView, 7500, [0, 1600, 2400, 3400, 5200, 6800]);
  const followChips = ["What if I don't get the email?", "Can I reset from mobile?", "Enable two-factor auth"];

  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
      <SpecBrowserChrome url="help.acme.com/chat" />
      <div className="bg-white flex flex-col" style={{ minHeight: 300 }}>
        <div className="px-4 py-2 flex items-center gap-1 shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <span className="text-[9.5px] text-[#9A9A98]">Help</span>
          <ChevronRight size={9} className="text-[#C8C8C6]" />
          <span className="text-[9.5px] font-medium text-[#111110]">How do I reset my password?</span>
        </div>

        <div className="flex-1 px-4 py-4 space-y-4 overflow-hidden">
          <div className="flex justify-end">
            <div className="bg-[#2563EB] text-white rounded-2xl rounded-tr-sm px-3 py-2 text-[10.5px] leading-relaxed" style={{ maxWidth: "70%" }}>
              How do I reset my password?
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[11px] text-[#111110] leading-relaxed">
              You can reset your password from the login page. Click{" "}
              <span className="font-semibold">"Forgot password"</span>, enter your email, and check for a reset link — it expires in 24 hours.
              <sup><span className="font-semibold ml-[1px]" style={{ fontSize: 8, color: "#2563EB" }}>[1]</span></sup>
            </p>
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-semibold text-[#2563EB]" style={{ fontFamily: "'DM Mono', monospace" }}>[1]</span>
              <span className="text-[8px] text-[#9A9A98]">Password Reset Guide</span>
            </div>
          </div>

          <AnimatePresence>
            {step >= 2 && (
              <motion.div key="followup" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-[#2563EB] text-white rounded-2xl rounded-tr-sm px-3 py-2 text-[10.5px]" style={{ maxWidth: "70%" }}>
                    What if I don't get the email?
                  </div>
                </div>
                {step >= 3 && (
                  <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-[#111110] leading-relaxed">
                    Check your spam or junk folder first. Verify you're using the correct email address. Contact support if still missing.
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 pt-2 pb-2 shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2 bg-[#F3F3F1] rounded-lg px-3 py-1.5 mb-1.5">
            <span className="flex-1 text-[10px] text-[#C8C8C6]">Ask a follow-up...</span>
            <div className="w-4 h-4 rounded bg-[#2563EB] flex items-center justify-center shrink-0">
              <Send size={7} className="text-white" />
            </div>
          </div>
          <div className="flex gap-1.5 overflow-x-hidden">
            {followChips.map((chip, i) => (
              <button key={chip}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] whitespace-nowrap shrink-0 transition-all"
                style={{
                  background: step === 1 && i === 0 ? "#E0EAFF" : "#F0F4FF",
                  border: `1px solid ${step === 1 && i === 0 ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.15)"}`,
                  color: "#2563EB", fontWeight: 400,
                  boxShadow: step === 1 && i === 0 ? "0 0 0 2px rgba(37,99,235,0.08)" : undefined,
                }}>
                <Sparkles size={7} className="opacity-60" />{chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stencil helper — placeholder text block
function Stencil({ w, h = 7, opacity = 1 }: { w: string | number; h?: number; opacity?: number }) {
  return <div style={{ width: w, height: h, background: "#E8E8E6", borderRadius: 3, opacity }} />;
}

function PanelWidget({ inView }: { inView: boolean }) {
  // 0:pills+bar  1:pill-hover  2:panel-opening  3:panel-open  4:x-hover  5:panel-closing  6:pills-back
  const step = useAnimLoop(inView, 8200, [0, 1300, 2200, 3000, 5000, 5900, 6800]);

  const panelOpen = step >= 2 && step < 6;
  const pillsVisible = step < 2 || step >= 6;
  const hoverPill = step === 1;
  const xHover = step === 4;

  const nudgePills = ["Forgot password?", "Email not received"];

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
      <SpecBrowserChrome url="help.acme.com/articles/getting-started" />
      <div className="bg-[#F7F7F5] flex overflow-hidden relative" style={{ minHeight: 300 }}>

        {/* Chat panel — slides in from left */}
        <motion.div
          animate={{ width: panelOpen ? 180 : 0, opacity: panelOpen ? 1 : 0 }}
          transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
          className="flex-shrink-0 overflow-hidden bg-white flex flex-col"
          style={{ borderRight: panelOpen ? "1px solid rgba(0,0,0,0.07)" : "none" }}
        >
          {/* Panel header */}
          <div className="px-3 py-2 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-1.5">
              <Sparkles size={9} style={{ color: "#2563EB" }} />
              <span className="text-[9px] font-semibold text-[#111110]">Help Assistant</span>
            </div>
            <div
              className="w-4 h-4 rounded flex items-center justify-center transition-all"
              style={{ background: xHover ? "rgba(0,0,0,0.08)" : "transparent" }}
            >
              <X size={9} className="text-[#9A9A98]" />
            </div>
          </div>

          {/* Panel chat content — stencil */}
          <div className="flex-1 px-3 py-3 space-y-3 overflow-hidden">
            <div className="flex justify-end">
              <div className="rounded-2xl rounded-tr-sm px-2.5 py-1.5 space-y-1" style={{ background: "#2563EB", maxWidth: "75%" }}>
                <Stencil w="100%" h={6} opacity={0.6} />
                <Stencil w="60%" h={6} opacity={0.6} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Stencil w="95%" h={6} opacity={0.45} />
              <Stencil w="80%" h={6} opacity={0.45} />
              <Stencil w="88%" h={6} opacity={0.45} />
              <Stencil w="50%" h={6} opacity={0.45} />
            </div>
          </div>

          {/* Panel input stencil */}
          <div className="px-3 pb-3 pt-2 shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="rounded-lg px-2.5 py-2 flex items-center gap-2" style={{ background: "#F3F3F1" }}>
              <Stencil w="70%" h={6} opacity={0.4} />
              <div className="w-4 h-4 rounded bg-[#2563EB] flex items-center justify-center shrink-0">
                <Send size={7} className="text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Article column */}
        <div className="flex-1 px-5 py-5 flex flex-col min-w-0">
          {/* Breadcrumb stencil */}
          <div className="flex items-center gap-1.5 mb-4">
            <Stencil w={36} h={6} opacity={0.5} />
            <div style={{ width: 6, height: 6, opacity: 0.25 }}><ChevronRight size={6} className="text-[#111110]" /></div>
            <Stencil w={52} h={6} />
          </div>

          {/* Title stencil */}
          <Stencil w="72%" h={14} />
          <div className="mt-1.5 mb-3"><Stencil w="45%" h={14} /></div>

          {/* Meta stencil */}
          <div className="flex gap-2 mb-4">
            <Stencil w={60} h={6} opacity={0.4} />
            <Stencil w={40} h={6} opacity={0.4} />
          </div>

          {/* Nudge pills — animate in/out */}
          <AnimatePresence>
            {pillsVisible && (
              <motion.div
                key="pills"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.28 }}
                className="flex flex-wrap gap-1.5 mb-4"
              >
                {nudgePills.map((pill, i) => (
                  <div key={pill}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] whitespace-nowrap transition-all"
                    style={{
                      background: hoverPill && i === 0 ? "#E0EAFF" : "#F0F4FF",
                      border: `1px solid ${hoverPill && i === 0 ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.15)"}`,
                      color: "#2563EB", fontWeight: 400,
                      boxShadow: hoverPill && i === 0 ? "0 0 0 2px rgba(37,99,235,0.08)" : undefined,
                    }}>
                    <Sparkles size={8} className="opacity-60" />{pill}
                  </div>
                ))}
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] whitespace-nowrap"
                  style={{ background: "#F0F4FF", border: "1px solid rgba(37,99,235,0.15)", color: "#2563EB", fontWeight: 400 }}>
                  <Sparkles size={8} className="opacity-60" />Ask anything else
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Body stencil lines */}
          <div className="space-y-2">
            {[88, 100, 76, 100, 92, 64].map((pct, i) => (
              <Stencil key={i} w={`${pct}%`} h={7} opacity={0.55} />
            ))}
          </div>
        </div>

        {/* Floating bar — only when panel closed */}
        <AnimatePresence>
          {!panelOpen && (
            <motion.div
              key="floater"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2"
              style={{ width: 200, pointerEvents: "none" }}
            >
              <div className="rounded-xl px-3 py-2" style={{ background: "#2563EB", boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
                <div className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <span className="flex-1 text-[9.5px] text-white/60">Ask anything...</span>
                  <div className="w-3.5 h-3.5 rounded bg-white flex items-center justify-center shrink-0">
                    <Send size={6} style={{ color: "#2563EB" }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InitiatedChatWidget({ inView }: { inView: boolean }) {
  // 0:blank  1:summary-in  2:pills-in  3:pill-hover  4:pill-click→msg  5:ai-reply  6:settled  7:reset
  const step = useAnimLoop(inView, 8600, [0, 700, 1600, 2600, 3500, 4500, 6200, 7800]);

  const pills = ["How do I reset it?", "Link didn't arrive", "Reset from mobile"];
  const showSummary = step >= 1;
  const showPills = step >= 2 && step < 4;
  const hoverIdx = step === 3 ? 0 : -1;
  const showConversation = step >= 4;

  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
      <SpecBrowserChrome url="help.acme.com/chat" />
      <div className="bg-white flex flex-col" style={{ minHeight: 300 }}>

        {/* Chat header */}
        <div className="px-4 py-2.5 flex items-center gap-2 shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <Sparkles size={10} style={{ color: "#2563EB" }} />
          <span className="text-[10px] font-semibold text-[#111110]">Help Assistant</span>
        </div>

        {/* Chat body */}
        <div className="flex-1 flex flex-col px-4 py-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {!showConversation ? (
              <motion.div key="pre" className="flex-1 flex flex-col items-center justify-center gap-4 pb-2">

                {/* AI summary */}
                <AnimatePresence>
                  {showSummary && (
                    <motion.div
                      key="summary"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full space-y-1.5"
                    >
                      <Stencil w="92%" h={7} opacity={0.45} />
                      <Stencil w="78%" h={7} opacity={0.45} />
                      <Stencil w="85%" h={7} opacity={0.45} />
                      <Stencil w="55%" h={7} opacity={0.45} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pills centered */}
                <AnimatePresence>
                  {showPills && (
                    <motion.div
                      key="centered-pills"
                      initial={{ opacity: 0, scale: 0.94, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 360, damping: 28 }}
                      className="w-full"
                    >
                      <p className="text-[8.5px] uppercase tracking-[0.1em] text-center mb-2.5" style={{ color: "#ABABAB", fontFamily: "'DM Mono', monospace" }}>
                        What would you like to know?
                      </p>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {pills.map((pill, i) => (
                          <div key={pill}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9.5px] whitespace-nowrap transition-all"
                            style={{
                              background: hoverIdx === i ? "#E0EAFF" : "#F0F4FF",
                              border: `1px solid ${hoverIdx === i ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.15)"}`,
                              color: "#2563EB", fontWeight: 400,
                              boxShadow: hoverIdx === i ? "0 0 0 3px rgba(37,99,235,0.08)" : undefined,
                            }}>
                            <Sparkles size={8} className="opacity-60 shrink-0" />
                            {pill}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div key="convo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="flex-1 space-y-3">
                {/* AI summary stencil */}
                <div className="space-y-1.5">
                  <Stencil w="88%" h={6} opacity={0.4} />
                  <Stencil w="72%" h={6} opacity={0.4} />
                </div>
                {/* User message */}
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-sm px-3 py-2 text-[10px] text-white" style={{ background: "#2563EB", maxWidth: "70%" }}>
                    How do I reset it?
                  </div>
                </div>
                {/* AI reply */}
                <AnimatePresence>
                  {step >= 5 && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-1.5">
                      <Stencil w="96%" h={6} opacity={0.45} />
                      <Stencil w="80%" h={6} opacity={0.45} />
                      <Stencil w="60%" h={6} opacity={0.45} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="px-4 pb-3 pt-2 shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2 bg-[#F3F3F1] rounded-lg px-3 py-1.5">
            <span className="flex-1 text-[9.5px] text-[#C8C8C6]">Ask a question...</span>
            <div className="w-4 h-4 rounded bg-[#2563EB] flex items-center justify-center shrink-0">
              <Send size={7} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SPEC_SECTIONS: {
  num: string; tag: string; title: string; desc: string; bullets: string[];
  Widget: (props: { inView: boolean }) => ReactNode;
}[] = [
  {
    num: "01", tag: "Article page",
    title: "In-context nudge",
    desc: "While reading documentation, relevant suggestions sit below the article title. \"Ask anything else\" expands inline — the floating assistant bar at the bottom animates up to meet it. When the chat panel opens, the chips disappear. They return when the panel is closed.",
    bullets: ["3 topic chips + 1 open-ended action", "Floating bar morphs up to the chip position", "Reappears when the chat panel is closed"],
    Widget: ArticleWidget,
  },
  {
    num: "02", tag: "Chat Panel",
    title: "Pill opens the side panel",
    desc: "Clicking a nudge pill on the article page opens a chat side panel — the pills disappear so they don't compete with the active conversation. Closing the panel brings them back, letting the user pick a different topic or ask freely.",
    bullets: ["Clicking any pill opens the chat panel", "Pills hide while the panel is open", "Closing the panel restores the pills"],
    Widget: PanelWidget,
  },
  {
    num: "03", tag: "Chat initiated",
    title: "Pills appear at chat start",
    desc: "When the chat is opened proactively — before the user has typed anything — a short AI summary appears first, followed by nudge pills centered in the conversation area. They give the user a clear starting point without requiring them to articulate a question.",
    bullets: ["Pills appear centered after the AI summary", "Disappear as soon as the user selects one", "Selection becomes the first user message"],
    Widget: InitiatedChatWidget,
  },
  {
    num: "04", tag: "Homepage",
    title: "Zero-state recommendations",
    desc: "Before the user types anything, smart topic suggestions appear below the search bar. Each pill expands into a sub-menu of specific actions — giving users direct entry into a scoped AI conversation without articulating a question first.",
    bullets: ["Contextual to the user's account state", "Each pill expands into a dropdown of sub-topics", "Disappears once a question is typed"],
    Widget: HomepageWidget,
  },
  {
    num: "05", tag: "Chat",
    title: "Realtime follow-up chips",
    desc: "After each AI response, the most likely next questions appear as chips below the input bar. Users can continue the conversation with one tap — chips stay persistent throughout the session.",
    bullets: ["Always visible below the prompt bar", "Each chip sends a new user message", "Chips persist even after being used"],
    Widget: ChatWidget,
  },
];

export function NudgeHaSpec() {
  return (
    <SpecPage
      monoLabel="Design Specs · Nudge · HA"
      title="The blue nudge pill"
      subtitle="One component, three placements. Each adapts its position and behavior to the user's current context across the help experience."
      sections={SPEC_SECTIONS}
    />
  );
}

/** Interactive prototype — usecase switcher lives in the page body, not a second header. */
export function NudgeHaPrototype() {
  const [mode, setMode] = useState<ModeId>(1);
  const [step, setStep] = useState(1);

  const handleModeChange = (m: ModeId) => {
    setMode(m);
    setStep(1);
  };
  const currentUrl = STEP_CONFIGS[mode][step - 1].url;

  return (
    <div
      className="h-full min-h-0 overflow-y-auto"
      style={{ background: "#0E0E0D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-[1080px] mx-auto px-10 pt-10 pb-6">
        <p
          className="text-[10px] uppercase tracking-[0.18em] mb-4 font-mono"
          style={{ color: "#2E2E2C" }}
        >
          Interactive demo · Nudge · HA
        </p>
        <h2 className="text-[28px] font-bold mb-3 leading-tight" style={{ color: "#F0F0EE" }}>
          Experience walkthrough
        </h2>
        <p className="text-[13px] leading-[1.7] max-w-[520px] mb-6" style={{ color: "#484846" }}>
          Step through homepage, article, and chat placements. Switch usecases below — this control stays in the page body so the Components chrome stays unified.
        </p>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.1em] mr-1" style={{ color: "#3E3E3C" }}>
              Usecase
            </span>
            <div
              className="flex items-center rounded-xl p-1 gap-0.5"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {([1, 2, 3] as ModeId[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleModeChange(m)}
                  className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                  style={
                    mode === m
                      ? { background: "rgba(255,255,255,0.1)", color: "#F0F0EE" }
                      : { color: "#3E3E3C" }
                  }
                >
                  Usecase {m}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[12px]" style={{ color: "#5A5A58" }}>
            {MODE_SUBTITLES[mode]}
          </p>
        </div>

        <StepNav mode={mode} step={step} setStep={setStep} />
        <BrowserFrame url={currentUrl}>
          <StepContent mode={mode} step={step} setStep={setStep} />
        </BrowserFrame>
      </div>
    </div>
  );
}

/** @deprecated Prefer NudgeHaSpec / NudgeHaPrototype from ComponentLab */
export default function App() {
  return <NudgeHaSpec />;
}
