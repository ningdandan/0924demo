import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Zap, MessageSquare, Search, Sparkles, Clock, GraduationCap, BookOpen, Users, FileText } from "lucide-react";
import svgPaths from "@/imports/svg-4p3mzw9u4a";
import content from "../content";
import { useTokens } from "../TokensContext";
import { useDesignTokens } from "../DesignTokensContext";

const GROUP_ICONS: Record<string, typeof GraduationCap> = {
  Students:    GraduationCap,
  Modules:     BookOpen,
  Assignments: FileText,
  Cohorts:     Users,
};

// [category, key, fallback]
const GROUP_COLOR_KEYS: Record<string, [string, string, string]> = {
  Students:    ["accent", "indigo",   "#6366f1"],
  Modules:     ["accent", "sky",      "#0ea5e9"],
  Assignments: ["accent", "amber",    "#f59e0b"],
  Cohorts:     ["accent", "emerald",  "#10b981"],
};

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <strong className="font-semibold text-[#1e1b4b]">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </span>
  );
}

function SidebarSearch({ onLearnerSelect, onClose }: { onLearnerSelect?: (name: string) => void; onClose?: () => void }) {
  const { tokens } = useTokens();
  const { dt } = useDesignTokens();
  const sidebar = tokens.sidebar ?? content.sidebar;
  const actions = sidebar.actions ?? [];
  const conversations = sidebar.conversations ?? [];

  const zeroState = (sidebar.zeroState ?? []).map((g: any) => {
    const [cat, key, fallback] = GROUP_COLOR_KEYS[g.group] ?? ["accent", "indigo", "#6366f1"];
    const color = (dt.colors as any)[cat]?.[key] ?? fallback;
    return { group: g.group, icon: GROUP_ICONS[g.group] ?? GraduationCap, color, items: g.items };
  });

  const allSuggestions = [
    ...actions.map((a: any) => ({ text: a.label, time: null as string | null, isAction: true })),
    ...conversations.map((c: any) => ({ text: c.title, time: c.time as string | null, isAction: false })),
  ];

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allSuggestions.filter((s) => s.text.toLowerCase().includes(q)).slice(0, 5);
  }, [query, allSuggestions]);

  const showZeroState = focused && query.trim() === "";
  const showResults = focused && results.length > 0;
  const showDropdown = showZeroState || showResults;

  const handleFocus = () => { if (blurTimer.current) clearTimeout(blurTimer.current); setFocused(true); };
  const handleBlur  = () => { blurTimer.current = setTimeout(() => setFocused(false), 150); };
  const handleSelect = (text: string) => { setQuery(text); setFocused(false); };

  return (
    <div className="relative px-[16px] py-[12px] border-b border-black/5">
      <div
        className="flex items-center gap-[8px] bg-white/70 rounded-[10px] px-[10px] py-[8px] transition-all"
        style={{ boxShadow: focused ? `0 0 0 2px ${dt.colors.alpha.focusRing}` : "none" }}
      >
        <Search className="size-[14px] text-[#9ca3af] flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={content.sidebar.searchPlaceholder}
          className="flex-1 bg-transparent border-0 outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[13px] placeholder:text-[#9ca3af] min-w-0"
          style={{ color: "var(--color-body, #364153)" }}
        />
        {query && (
          <button onMouseDown={(e) => e.preventDefault()} onClick={() => setQuery("")}
            className="text-[#9ca3af] hover:text-[#6b7280] transition-colors leading-none">
            <X className="size-[12px]" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-[16px] right-[16px] top-[calc(100%-4px)] z-50 bg-white rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.1)] overflow-hidden max-h-[400px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {showZeroState ? (
              zeroState.flatMap((group: any) =>
                group.items.map((item: any, i: number) => (
                  <button
                    key={`${group.group}-${i}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (group.group === "Students" && onLearnerSelect) { onLearnerSelect(item.text); onClose?.(); }
                      else { handleSelect(item.text); }
                    }}
                    className="w-full px-[12px] py-[9px] hover:bg-gray-50 transition-colors text-left flex items-start gap-[8px] border-b border-gray-50 last:border-b-0"
                  >
                    <div className="shrink-0 size-[26px] rounded-[7px] flex items-center justify-center mt-[1px]" style={{ background: group.color }}>
                      <group.icon className="size-[12px] text-white" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] leading-snug truncate">{item.text}</span>
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#9ca3af] mt-[1px] truncate">{item.sub}</span>
                    </div>
                  </button>
                ))
              )
            ) : (
              results.map((r, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(r.text)}
                  className={`w-full px-[12px] py-[9px] hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-b-0 flex gap-[8px] ${r.time ? "items-start" : "items-center"}`}
                >
                  <div
                    className={`shrink-0 size-[26px] rounded-[7px] flex items-center justify-center ${r.time ? "mt-[1px]" : ""}`}
                    style={{ background: r.isAction ? dt.colors.accent.indigo : dt.colors.accent.slate }}
                  >
                    {r.isAction ? <Sparkles className="size-[12px] text-white" /> : <MessageSquare className="size-[12px] text-white" />}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] leading-snug">
                      <HighlightMatch text={r.text} query={query} />
                    </span>
                    {r.time && (
                      <span className="flex items-center gap-[3px] mt-[2px]">
                        <Clock className="size-[9px] text-[#9ca3af]" />
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#9ca3af]">{r.time}</span>
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar({ onLearnerSelect }: { onLearnerSelect?: (name: string) => void }) {
  const { tokens } = useTokens();
  const { dt } = useDesignTokens();
  const sidebar = tokens.sidebar ?? content.sidebar;
  const actions = sidebar.actions ?? [];
  const conversations = sidebar.conversations ?? [];
  const [open, setOpen] = useState(false);

  const railBg = dt.colors.alpha.railBg;

  return (
    <>
      {/* Icon rail */}
      <aside
        className="w-[52px] flex flex-col items-center py-[16px] gap-[8px] flex-shrink-0 z-10"
        style={{ background: railBg }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center p-[8px] rounded-[12px] hover:bg-black/5 transition-colors"
        >
          <svg className="block size-[20px]" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p118af100} fill="#364153" />
          </svg>
        </button>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-black/10"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 400, mass: 0.8 }}
            className="fixed left-0 top-0 bottom-0 w-[300px] z-30 flex flex-col backdrop-blur-[16px]"
            style={{ background: railBg, boxShadow: dt.shadows.sidebar }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-[20px] pt-[20px] pb-[16px] border-b border-black/5 flex-shrink-0">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px]" style={{ color: "var(--color-navy, #1e1b4b)" }}>{sidebar.portalTitle}</h2>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] mt-[2px]" style={{ color: "color-mix(in srgb, var(--color-navy, #1e1b4b) 60%, transparent)" }}>{sidebar.userRole}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-[6px] hover:bg-black/5 rounded-[8px] transition-colors">
                <X className="size-[16px] text-gray-500" />
              </button>
            </div>

            {/* Quick lookup search */}
            <SidebarSearch onLearnerSelect={onLearnerSelect} onClose={() => setOpen(false)} />

            <div className="flex-1 overflow-y-auto px-[16px] py-[16px] flex flex-col gap-[24px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <section>
                <div className="flex items-center gap-[6px] mb-[8px] px-[4px]">
                  <Zap className="size-[13px]" style={{ color: "var(--color-navy, #1e1b4b)" }} />
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px]" style={{ color: "var(--color-navy, #1e1b4b)" }}>{sidebar.actionsHeading}</p>
                </div>
                <div className="flex flex-col gap-0">
                  {actions.map((a: any) => (
                    <button key={a.label} className="flex items-center px-[12px] py-[10px] rounded-[10px] hover:bg-gray-100 transition-colors text-left w-full">
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153]">{a.label}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-[6px] mb-[8px] px-[4px]">
                  <MessageSquare className="size-[13px]" style={{ color: "var(--color-navy, #1e1b4b)" }} />
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px]" style={{ color: "var(--color-navy, #1e1b4b)" }}>{sidebar.conversationsHeading}</p>
                </div>
                <div className="flex flex-col gap-0">
                  {conversations.map((c: any) => (
                    <button key={c.title} className="flex flex-col items-start px-[12px] py-[10px] rounded-[10px] hover:bg-gray-100 transition-colors text-left w-full">
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153]">{c.title}</p>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
