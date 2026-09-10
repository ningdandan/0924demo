import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check, Plus, X, Building2 } from "lucide-react";
import { useTokens } from "../TokensContext";
import { useDesignTokens } from "../DesignTokensContext";
import { defaultTokens, type Tokens } from "../tokens";
import fixedJson from "../content/fixed.json";

import generatedDelta   from "../content/generated script/generated_delta.json";
import generatedDisney  from "../content/generated script/generated_disney.json";
import generatedPearson from "../content/generated script/generated_pearson.json";
import generatedStripe  from "../content/generated script/generated_stripe.json";

type Script = { label: string; emoji: string; data: Record<string, unknown> };

const BASE_SCRIPTS: Record<string, Script> = {
  delta:   { label: "Delta Air Lines",   emoji: "✈️",  data: generatedDelta   as Record<string, unknown> },
  disney:  { label: "Walt Disney",       emoji: "🏰",  data: generatedDisney  as Record<string, unknown> },
  pearson: { label: "Pearson Education", emoji: "📚",  data: generatedPearson as Record<string, unknown> },
  stripe:  { label: "Stripe",            emoji: "💳",  data: generatedStripe  as Record<string, unknown> },
};

const EMOJI_OPTIONS = [
  "🏢", "🏦", "🏥", "🏫", "🏪", "🏭", "🏨", "🏗️",
  "✈️", "🚂", "🚢", "🚀", "🛒", "📦", "💊", "🎓",
  "💻", "📱", "🔬", "⚡", "🌱", "🎮", "🎬", "🎵",
  "💰", "💳", "📊", "🔑", "🛡️", "🌍", "🏆", "⭐",
];

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key], tv = target[key];
    if (sv !== null && typeof sv === "object" && !Array.isArray(sv) &&
        tv !== null && typeof tv === "object" && !Array.isArray(tv)) {
      result[key] = deepMerge(tv as Record<string, unknown>, sv as Record<string, unknown>);
    } else {
      result[key] = sv;
    }
  }
  return result;
}

function buildTokens(generated: Record<string, unknown>, brandName: string): Tokens {
  const merged = deepMerge(fixedJson as unknown as Record<string, unknown>, generated);
  const chatScriptMessages = ((merged.chatScript as any)?.messages ?? []).map((m: any) => ({
    ...m,
    role: m.role as "user" | "agent",
    citations: (m.citations ?? []) as string[],
  }));
  return {
    ...defaultTokens,
    brandName,
    hero:               (merged.hero              ?? defaultTokens.hero)               as typeof defaultTokens.hero,
    searchHero:         (merged.searchHero        ?? defaultTokens.searchHero)         as typeof defaultTokens.searchHero,
    searchBar:          (merged.searchBar         ?? defaultTokens.searchBar)          as typeof defaultTokens.searchBar,
    searchBarDropdown:  (merged.searchBarDropdown ?? defaultTokens.searchBarDropdown)  as typeof defaultTokens.searchBarDropdown,
    categories:         (merged.categories        ?? defaultTokens.categories)         as typeof defaultTokens.categories,
    sidebar:            (merged.sidebar           ?? defaultTokens.sidebar)            as typeof defaultTokens.sidebar,
    chat:               (merged.chat              ?? defaultTokens.chat)               as typeof defaultTokens.chat,
    articles:           (merged.articles          ?? defaultTokens.articles)           as typeof defaultTokens.articles,
    chatScript:         { messages: chatScriptMessages as typeof defaultTokens.chatScript.messages },
  };
}

// ─── New Company Modal ────────────────────────────────────────────────────────

interface NewCompanyModalProps {
  onClose: () => void;
  onAdd: (key: string, script: Script) => void;
}

const PHASES = ["Research", "Generate", "Done"] as const;
type Phase = "researching" | "generating" | "done";

function phaseIndex(p: Phase) {
  return p === "researching" ? 0 : p === "generating" ? 1 : 2;
}

function LiveLog({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);

  return (
    <div className="rounded-[12px] overflow-hidden bg-[#0f0f18]">
      {/* Terminal chrome */}
      <div className="flex items-center gap-[6px] px-[14px] py-[9px] border-b border-white/5">
        <div className="size-[8px] rounded-full bg-[#ff5f57]" />
        <div className="size-[8px] rounded-full bg-[#febc2e]" />
        <div className="size-[8px] rounded-full bg-[#28c840]" />
        <span className="ml-[8px] font-mono text-[10px] text-white/25 select-none">research output</span>
      </div>
      <div ref={ref} className="h-[260px] overflow-y-auto px-[14px] py-[10px] flex flex-col gap-[1px]" style={{ scrollBehavior: "smooth" }}>
        {lines.length === 0
          ? <span className="font-mono text-[11px] text-white/20">Connecting…</span>
          : lines.map((line, i) => {
              const isStatus  = line.startsWith("🔍") || line.startsWith("✨") || line.startsWith("⏳") || line.startsWith("🔄");
              const isH1      = line.startsWith("# ") && !line.startsWith("## ");
              const isH2      = line.startsWith("## ");
              const isDivider = line === "---";
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -3 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`font-mono leading-[1.65] whitespace-pre-wrap break-words ${
                    isDivider ? "text-white/10 text-[10px]"
                    : isStatus  ? "text-[#a5b4fc] text-[11px] font-semibold mt-[4px]"
                    : isH1      ? "text-white text-[12px] font-bold mt-[6px]"
                    : isH2      ? "text-[#c7d2fe] text-[11px] font-semibold mt-[4px]"
                    : "text-white/45 text-[11px]"
                  }`}
                >
                  {isDivider ? "─".repeat(38) : line || " "}
                </motion.span>
              );
            })
        }
        <motion.span
          className="font-mono text-[11px] text-[#6366f1]"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "steps(1)" }}
        >▋</motion.span>
      </div>
    </div>
  );
}

function NewCompanyModal({ onClose, onAdd }: NewCompanyModalProps) {
  const { dt } = useDesignTokens();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [emoji, setEmoji] = useState("🏢");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("researching");
  const [log, setLog] = useState<string[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !loading) onClose();
    if (e.key === "Enter" && name.trim() && !loading) handleSubmit();
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError(null);
    setLoading(true);
    setPhase("researching");
    setLog([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: trimmed, url: url.trim() || undefined }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        const j = text ? JSON.parse(text) : {};
        throw new Error(j.error || `Server error ${res.status}`);
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = "";
      let generated: Record<string, unknown> | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const evtMatch  = part.match(/^event: (\w+)/m);
          const dataMatch = part.match(/^data: (.+)/m);
          if (!evtMatch || !dataMatch) continue;
          const evt  = evtMatch[1];
          const raw  = dataMatch[1];

          if (evt === "log") {
            const line = raw.replace(/\\n/g, "\n");
            if (line.startsWith("✨")) setPhase("generating");
            setLog((prev) => [...prev, line]);
          } else if (evt === "done") {
            setPhase("done");
            generated = JSON.parse(raw);
          } else if (evt === "error") {
            throw new Error(raw.replace(/\\n/g, "\n"));
          }
        }
      }

      if (!generated) throw new Error("No content received from server.");
      const key = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now();
      onAdd(key, { label: trimmed, emoji, data: generated });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  const activePhaseIdx = phaseIndex(phase);
  const phaseLabel = phase === "researching" ? `Researching ${name.trim()}…`
    : phase === "generating" ? "Building demo script…"
    : "Almost done…";

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center" onKeyDown={handleKeyDown}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
        onClick={() => { if (!loading) onClose(); }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        layout
        className="relative bg-white rounded-[20px] overflow-hidden"
        style={{ boxShadow: dt.shadows.modalDrop, width: loading ? 560 : 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            /* ── Loading view ── */
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {/* Header */}
              <div className="px-[24px] pt-[24px] pb-[18px] flex items-center justify-between">
                <div className="flex items-center gap-[12px]">
                  <span className="text-[26px] leading-none">{emoji}</span>
                  <div>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[15px] text-[#1e1b4b]">{name.trim()}</p>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#6366f1] mt-[1px]">{phaseLabel}</p>
                  </div>
                </div>
                {/* Step dots */}
                <div className="flex items-center gap-[6px]">
                  {PHASES.map((label, i) => (
                    <div key={label} className="flex items-center gap-[6px]">
                      <div className="flex flex-col items-center gap-[3px]">
                        <div className={`size-[7px] rounded-full transition-all duration-400 ${
                          i < activePhaseIdx ? "bg-[#6366f1]"
                          : i === activePhaseIdx ? "bg-[#6366f1] ring-[3px] ring-[#6366f1]/20"
                          : "bg-gray-200"
                        }`} />
                        <span className={`font-['Plus_Jakarta_Sans',sans-serif] text-[9px] ${i <= activePhaseIdx ? "text-[#6366f1]" : "text-gray-300"}`}>{label}</span>
                      </div>
                      {i < PHASES.length - 1 && (
                        <div className={`w-[16px] h-[1px] mb-[10px] transition-colors duration-400 ${i < activePhaseIdx ? "bg-[#6366f1]" : "bg-gray-200"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Live log */}
              <div className="px-[12px] pb-[12px]">
                <LiveLog lines={log} />
              </div>
            </motion.div>
          ) : (
            /* ── Form view ── */
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {/* Header */}
              <div className="flex items-center justify-between px-[24px] pt-[24px] pb-[20px]">
                <div className="flex items-center gap-[10px]">
                  <div className="size-[36px] rounded-[10px] bg-[#6366f1]/10 flex items-center justify-center">
                    <Building2 className="size-[18px] text-[#6366f1]" />
                  </div>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px] text-[#1e1b4b]">Add New Company</h2>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-400 mt-[1px]">Generate a demo script with AI</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-[6px] rounded-[8px] hover:bg-gray-100 transition-colors">
                  <X className="size-[16px] text-gray-400" />
                </button>
              </div>

              <div className="px-[24px] pb-[24px] flex flex-col gap-[16px]">
                {/* Emoji + Name */}
                <div className="flex gap-[12px] items-start">
                  <div className="relative">
                    <button
                      onClick={() => setShowEmojiPicker((v) => !v)}
                      className="size-[52px] rounded-[12px] bg-gray-50 border border-gray-200 flex items-center justify-center text-[26px] hover:bg-gray-100 transition-colors shrink-0"
                    >
                      {emoji}
                    </button>
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 4 }} transition={{ duration: 0.12 }}
                          className="absolute top-[calc(100%+6px)] left-0 z-10 bg-white border border-gray-200 rounded-[14px] p-[10px] w-[220px]"
                          style={{ boxShadow: dt.shadows.emojiPicker }}
                        >
                          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-[8px] px-[2px]">Choose an icon</p>
                          <div className="grid grid-cols-8 gap-[4px]">
                            {EMOJI_OPTIONS.map((e) => (
                              <button key={e} onClick={() => { setEmoji(e); setShowEmojiPicker(false); }}
                                className={`size-[24px] flex items-center justify-center text-[16px] rounded-[6px] hover:bg-gray-100 transition-colors ${emoji === e ? "bg-[#6366f1]/10" : ""}`}
                              >{e}</button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex-1 flex flex-col gap-[6px]">
                    <label className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[12px] text-gray-500">
                      Company name <span className="text-red-400">*</span>
                    </label>
                    <input ref={nameRef} type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-[14px] py-[10px] bg-gray-50 border border-gray-200 rounded-[10px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-[#364153] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]/50 transition-all"
                    />
                  </div>
                </div>

                {/* URL */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[12px] text-gray-500">
                    Company URL <span className="text-gray-300">(optional)</span>
                  </label>
                  <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-[14px] py-[10px] bg-gray-50 border border-gray-200 rounded-[10px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-[#364153] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]/50 transition-all"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-[10px] px-[14px] py-[10px]">
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-red-600 leading-[18px]">{error}</p>
                  </div>
                )}

                {!error && (
                  <div className="bg-[#f0f0f8] border border-[#e0e0f0] rounded-[10px] px-[14px] py-[10px]">
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6366f1] leading-[18px]">
                      Claude researches the company live and builds a tailored demo script. Takes ~60 seconds.
                    </p>
                  </div>
                )}

                <div className="flex gap-[8px] justify-end">
                  <button onClick={onClose}
                    className="px-[16px] py-[9px] rounded-[10px] border border-gray-200 font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] hover:bg-gray-50 transition-colors"
                  >Cancel</button>
                  <button onClick={handleSubmit} disabled={!name.trim()}
                    className="flex items-center gap-[6px] px-[16px] py-[9px] rounded-[10px] font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ background: dt.gradients.button.indigo }}
                  >
                    <Plus className="size-[14px]" />
                    Generate Script
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── ScriptSwitcher ───────────────────────────────────────────────────────────

export function ScriptSwitcher() {
  const { setTokens } = useTokens();
  const { dt } = useDesignTokens();
  const [scripts, setScripts] = useState<Record<string, Script>>(BASE_SCRIPTS);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const select = (key: string) => {
    setActive(key);
    setOpen(false);
    setTokens(buildTokens(scripts[key].data, scripts[key].label));
  };

  const handleAdd = (key: string, script: Script) => {
    setScripts((prev) => ({ ...prev, [key]: script }));
    setActive(key);
    setTokens(buildTokens(script.data, script.label));
  };

  const activeScript = active ? scripts[active] : null;

  return (
    <>
      <div className="fixed bottom-[24px] right-[24px] z-[200]">
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-[8px] px-[14px] py-[10px] rounded-[14px] bg-white border border-gray-200 hover:bg-gray-50 transition-all"
            style={{ boxShadow: dt.shadows.floatingBtn }}
          >
            <span className="text-[16px] leading-none">{activeScript?.emoji ?? "🌐"}</span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-[#364153]">
              {activeScript?.label ?? "Switch Script"}
            </span>
            <ChevronDown className={`size-[14px] text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute bottom-[calc(100%+8px)] right-0 w-[220px] bg-white border border-gray-200 rounded-[14px] overflow-hidden"
                style={{ boxShadow: dt.shadows.emojiPicker }}
              >
                {/* Script list */}
                {Object.entries(scripts).map(([key, script]) => (
                  <button
                    key={key}
                    onClick={() => select(key)}
                    className="flex items-center gap-[10px] w-full px-[14px] py-[11px] hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-b-0"
                  >
                    <span className="text-[18px] leading-none w-[24px] text-center">{script.emoji}</span>
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] flex-1 truncate">{script.label}</span>
                    {active === key && <Check className="size-[14px] text-[#6366f1] shrink-0" />}
                  </button>
                ))}

                {/* Divider + Add button */}
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => { setOpen(false); setShowModal(true); }}
                    className="flex items-center gap-[10px] w-full px-[14px] py-[11px] hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="size-[24px] rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <Plus className="size-[11px] text-gray-400" />
                    </div>
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-gray-400">New company…</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <NewCompanyModal
            onClose={() => setShowModal(false)}
            onAdd={handleAdd}
          />
        )}
      </AnimatePresence>
    </>
  );
}
