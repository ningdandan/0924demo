import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, X, RotateCcw, ChevronDown, ChevronRight, Type, Layers, Sparkles, Settings2 } from "lucide-react";
import { useDesignTokens } from "../DesignTokensContext";
import type { DesignTokens } from "../DesignTokensContext";

// ─── helpers ──────────────────────────────────────────────────────────────────

function isHex(v: string) { return /^#([0-9a-fA-F]{3,8})$/.test(v.trim()); }
function isRgba(v: string) { return v.startsWith("rgba(") || v.startsWith("rgb("); }
function isGradient(v: string) { return v.includes("gradient"); }
function isColor(v: string) { return isHex(v) || isRgba(v); }

/** Flatten nested object into path→value pairs */
function flattenObj(obj: Record<string, unknown>, prefix: string[] = []): { path: string[]; value: string }[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const p = [...prefix, k];
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      return flattenObj(v as Record<string, unknown>, p);
    }
    return [{ path: p, value: String(v) }];
  });
}

/** Human-readable label from camelCase / dotPath */
function label(path: string[]) {
  const last = path[path.length - 1];
  return last.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

function groupLabel(path: string[]) {
  return path.slice(0, -1).map((s) => s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())).join(" › ");
}

// ─── Color swatch picker ───────────────────────────────────────────────────────

function ColorRow({ path, value }: { path: string[]; value: string }) {
  const { setToken } = useDesignTokens();
  const [localVal, setLocalVal] = useState(value);
  const [textVal, setTextVal] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // sync external changes
  if (value !== localVal && !document.activeElement?.closest?.(".te-row")) {
    setLocalVal(value);
    setTextVal(value);
  }

  const commit = useCallback((v: string) => {
    setLocalVal(v);
    setTextVal(v);
    setToken(path, v);
  }, [path, setToken]);

  const displayColor = isHex(localVal) || isRgba(localVal) ? localVal : "#cccccc";

  return (
    <div className="te-row flex items-center gap-[10px] py-[7px] px-[12px] hover:bg-gray-50 rounded-[8px] group">
      {/* Swatch + native color picker */}
      <div className="relative shrink-0">
        <div
          className="size-[28px] rounded-[6px] border border-black/10 cursor-pointer shadow-sm"
          style={{ background: displayColor }}
          onClick={() => inputRef.current?.click()}
        />
        <input
          ref={inputRef}
          type="color"
          value={isHex(localVal) ? localVal : "#cccccc"}
          onChange={(e) => commit(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </div>
      {/* Text input */}
      <input
        type="text"
        value={textVal}
        onChange={(e) => setTextVal(e.target.value)}
        onBlur={(e) => { const v = e.target.value.trim(); if (v) commit(v); else setTextVal(localVal); }}
        onKeyDown={(e) => { if (e.key === "Enter") { const v = textVal.trim(); if (v) commit(v); } }}
        className="flex-1 min-w-0 font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#364153] bg-transparent border-0 outline-none font-mono"
      />
      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 whitespace-nowrap">{label(path)}</span>
    </div>
  );
}

// ─── Gradient editor ──────────────────────────────────────────────────────────

function GradientRow({ path, value }: { path: string[]; value: string }) {
  const { setToken } = useDesignTokens();
  const [val, setVal] = useState(value);

  if (value !== val) setVal(value);

  const commit = (v: string) => { setVal(v); setToken(path, v); };

  return (
    <div className="te-row flex flex-col gap-[6px] py-[8px] px-[12px] hover:bg-gray-50 rounded-[8px]">
      <div className="flex items-center gap-[8px]">
        {/* Preview strip */}
        <div
          className="h-[22px] w-[44px] rounded-[5px] shrink-0 border border-black/10"
          style={{ background: val }}
        />
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium text-[#364153]">{label(path)}</span>
        {path.length > 1 && <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-gray-400">{groupLabel(path)}</span>}
      </div>
      <textarea
        value={val}
        rows={2}
        onChange={(e) => setVal(e.target.value)}
        onBlur={(e) => commit(e.target.value.trim())}
        className="w-full font-mono text-[11px] text-[#364153] bg-gray-50 border border-gray-200 rounded-[6px] px-[8px] py-[6px] resize-none focus:outline-none focus:ring-1 focus:ring-[#6366f1]/40 leading-[16px]"
      />
    </div>
  );
}

// ─── Font size / weight / family slider+text ──────────────────────────────────

function TypographyRow({ path, value }: { path: string[]; value: string }) {
  const { setToken } = useDesignTokens();
  const [val, setVal] = useState(value);

  if (value !== val) setVal(value);

  const numericPx = parseFloat(val);
  const isPx = val.endsWith("px") && !isNaN(numericPx);
  const isWeight = /^\d{3}$/.test(val.trim());

  const commit = (v: string) => { setVal(v); setToken(path, v); };

  return (
    <div className="te-row flex items-center gap-[10px] py-[6px] px-[12px] hover:bg-gray-50 rounded-[8px]">
      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 w-[80px] shrink-0 truncate">{label(path)}</span>
      {isPx && (
        <input
          type="range"
          min={isWeight ? 100 : 8}
          max={isWeight ? 900 : 80}
          step={isWeight ? 100 : 1}
          value={numericPx}
          onChange={(e) => commit(`${e.target.value}px`)}
          className="flex-1 accent-[#6366f1] h-[3px]"
        />
      )}
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={(e) => commit(e.target.value.trim())}
        onKeyDown={(e) => { if (e.key === "Enter") commit(val); }}
        className="w-[80px] font-mono text-[11px] text-[#364153] bg-gray-50 border border-gray-200 rounded-[6px] px-[6px] py-[4px] text-center focus:outline-none focus:ring-1 focus:ring-[#6366f1]/40"
      />
    </div>
  );
}

// ─── Shadow editor ────────────────────────────────────────────────────────────

function ShadowRow({ path, value }: { path: string[]; value: string }) {
  const { setToken } = useDesignTokens();
  const [val, setVal] = useState(value);

  if (value !== val) setVal(value);

  const commit = (v: string) => { setVal(v); setToken(path, v); };

  return (
    <div className="te-row flex flex-col gap-[4px] py-[8px] px-[12px] hover:bg-gray-50 rounded-[8px]">
      <div className="flex items-center gap-[6px]">
        <div className="size-[24px] rounded-[4px] bg-white border border-gray-200" style={{ boxShadow: val }} />
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium text-[#364153]">{label(path)}</span>
      </div>
      <textarea
        value={val}
        rows={2}
        onChange={(e) => setVal(e.target.value)}
        onBlur={(e) => commit(e.target.value.trim())}
        className="w-full font-mono text-[11px] text-[#364153] bg-gray-50 border border-gray-200 rounded-[6px] px-[8px] py-[6px] resize-none focus:outline-none focus:ring-1 focus:ring-[#6366f1]/40 leading-[16px]"
      />
    </div>
  );
}

// ─── Section accordion ────────────────────────────────────────────────────────

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[6px] w-full px-[12px] py-[8px] hover:bg-gray-100 rounded-[8px] transition-colors"
      >
        {open ? <ChevronDown className="size-[12px] text-gray-400" /> : <ChevronRight className="size-[12px] text-gray-400" />}
        <span className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[11px] text-gray-500 uppercase tracking-wider">{title}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tab: Colors ──────────────────────────────────────────────────────────────

function ColorsTab({ dt }: { dt: DesignTokens }) {
  const allColors = flattenObj(dt.colors as unknown as Record<string, unknown>);
  const solidColors = allColors.filter((e) => isColor(e.value));

  // Group by first segment (brand, ui, accent, fixed, alpha)
  const groups: Record<string, typeof solidColors> = {};
  for (const entry of solidColors) {
    const g = entry.path[0];
    (groups[g] ??= []).push(entry);
  }

  return (
    <div className="flex flex-col gap-[4px]">
      {Object.entries(groups).map(([g, entries]) => (
        <Section key={g} title={g.replace(/^./, (c) => c.toUpperCase())} defaultOpen={g === "brand" || g === "accent"}>
          {entries.map((e) => (
            <ColorRow key={e.path.join(".")} path={e.path} value={e.value} />
          ))}
        </Section>
      ))}
    </div>
  );
}

// ─── Tab: Gradients ───────────────────────────────────────────────────────────

function GradientsTab({ dt }: { dt: DesignTokens }) {
  const all = flattenObj(dt.gradients as unknown as Record<string, unknown>);
  const groups: Record<string, typeof all> = {};
  for (const entry of all) {
    const g = entry.path[0];
    (groups[g] ??= []).push(entry);
  }

  return (
    <div className="flex flex-col gap-[4px]">
      {Object.entries(groups).map(([g, entries]) => (
        <Section key={g} title={g.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())} defaultOpen>
          {entries.map((e) => (
            <GradientRow key={e.path.join(".")} path={e.path} value={e.value} />
          ))}
        </Section>
      ))}
    </div>
  );
}

// ─── Tab: Typography ─────────────────────────────────────────────────────────

function TypographyTab({ dt }: { dt: DesignTokens }) {
  const sections: Array<{ title: string; subkey: keyof typeof dt.fonts; obj: Record<string, unknown> }> = [
    { title: "Families",     subkey: "families",    obj: dt.fonts.families    as unknown as Record<string, unknown> },
    { title: "Sizes",        subkey: "sizes",       obj: dt.fonts.sizes       as unknown as Record<string, unknown> },
    { title: "Weights",      subkey: "weights",     obj: dt.fonts.weights     as unknown as Record<string, unknown> },
    { title: "Line Heights", subkey: "lineHeights", obj: dt.fonts.lineHeights as unknown as Record<string, unknown> },
    { title: "Tracking",     subkey: "tracking",    obj: dt.fonts.tracking    as unknown as Record<string, unknown> },
  ];

  return (
    <div className="flex flex-col gap-[4px]">
      {sections.map(({ title, subkey, obj }) => (
        <Section key={subkey} title={title} defaultOpen={subkey === "sizes" || subkey === "families"}>
          {Object.entries(obj).map(([k, v]) => (
            <TypographyRow key={k} path={["fonts", subkey, k]} value={String(v)} />
          ))}
        </Section>
      ))}
    </div>
  );
}

// ─── Tab: Effects (shadows + theme) ──────────────────────────────────────────

function EffectsTab({ dt }: { dt: DesignTokens }) {
  const shadows = flattenObj(dt.shadows as unknown as Record<string, unknown>);
  const themeEntries = flattenObj(dt.themes as unknown as Record<string, unknown>);
  const themeColors = themeEntries.filter((e) => isColor(e.value));
  const themeGrads  = themeEntries.filter((e) => isGradient(e.value));

  return (
    <div className="flex flex-col gap-[4px]">
      <Section title="Theme" defaultOpen>
        {themeGrads.map((e) => (
          <GradientRow key={e.path.join(".")} path={e.path} value={e.value} />
        ))}
        {themeColors.map((e) => (
          <ColorRow key={e.path.join(".")} path={e.path} value={e.value} />
        ))}
      </Section>
      <Section title="Shadows" defaultOpen>
        {shadows.map((e) => (
          <ShadowRow key={e.path.join(".")} path={e.path} value={e.value} />
        ))}
      </Section>
    </div>
  );
}

// ─── Presets ─────────────────────────────────────────────────────────────────

interface Preset {
  id: string;
  label: string;
  swatchA: string;
  swatchB: string;
  tokens: Array<{ path: string[]; value: string }>;
}

const PRESETS: Preset[] = [
  {
    id: "indigo",
    label: "Indigo",
    swatchA: "#6366f1",
    swatchB: "#1e1b4b",
    tokens: [
      { path: ["colors", "brand", "navy"],                    value: "#1e1b4b" },
      { path: ["colors", "brand", "purple"],                  value: "#8200db" },
      { path: ["colors", "ui", "body"],                       value: "#364153" },
      { path: ["colors", "ui", "muted"],                      value: "#9ca3af" },
      { path: ["colors", "ui", "iconStroke"],                 value: "#4A5565" },
      { path: ["colors", "accent", "indigo"],                 value: "#6366f1" },
      { path: ["gradients", "pageBackground"],                value: "linear-gradient(135deg, #e8f5f0 0%, #ede8f7 50%, #e8f0f7 100%)" },
      { path: ["gradients", "theme", "skyPeriwinkle"],        value: "linear-gradient(135deg, #D6EFFC 0%, #D8E4FF 49%, #D6F3FD 95%)" },
      { path: ["gradients", "button", "primary"],             value: "linear-gradient(142.634deg, #101C86 0%, #020642 100%)" },
      { path: ["gradients", "button", "send"],                value: "linear-gradient(135deg, #8200db 0%, #4c1d95 100%)" },
      { path: ["gradients", "button", "indigo"],              value: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" },
      { path: ["colors", "alpha", "railBg"],                  value: "rgba(220, 225, 255, 0.75)" },
      { path: ["themes", "skyPeriwinkle", "gradient"],        value: "linear-gradient(135deg, #D6EFFC 0%, #D8E4FF 49%, #D6F3FD 95%)" },
      { path: ["themes", "skyPeriwinkle", "textColor"],       value: "#1e1b4b" },
      { path: ["themes", "skyPeriwinkle", "swatchA"],         value: "#A3D9F6" },
      { path: ["themes", "skyPeriwinkle", "swatchB"],         value: "#ABBFFD" },
    ],
  },
  {
    id: "ocean",
    label: "Ocean",
    swatchA: "#0ea5e9",
    swatchB: "#0c4a6e",
    tokens: [
      { path: ["colors", "brand", "navy"],                    value: "#0c4a6e" },
      { path: ["colors", "brand", "purple"],                  value: "#0369a1" },
      { path: ["colors", "ui", "body"],                       value: "#1e3a4f" },
      { path: ["colors", "ui", "muted"],                      value: "#7ea8c0" },
      { path: ["colors", "ui", "iconStroke"],                 value: "#2e6484" },
      { path: ["colors", "accent", "indigo"],                 value: "#0ea5e9" },
      { path: ["gradients", "pageBackground"],                value: "linear-gradient(135deg, #e0f2fe 0%, #e0f7fa 50%, #e8f5f0 100%)" },
      { path: ["gradients", "theme", "skyPeriwinkle"],        value: "linear-gradient(135deg, #bae6fd 0%, #a5f3fc 50%, #cffafe 95%)" },
      { path: ["gradients", "button", "primary"],             value: "linear-gradient(142deg, #0369a1 0%, #0c4a6e 100%)" },
      { path: ["gradients", "button", "send"],                value: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)" },
      { path: ["gradients", "button", "indigo"],              value: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)" },
      { path: ["colors", "alpha", "railBg"],                  value: "rgba(186, 230, 253, 0.75)" },
      { path: ["themes", "skyPeriwinkle", "gradient"],        value: "linear-gradient(135deg, #bae6fd 0%, #a5f3fc 50%, #cffafe 95%)" },
      { path: ["themes", "skyPeriwinkle", "textColor"],       value: "#0c4a6e" },
      { path: ["themes", "skyPeriwinkle", "swatchA"],         value: "#7dd3fc" },
      { path: ["themes", "skyPeriwinkle", "swatchB"],         value: "#67e8f9" },
    ],
  },
  {
    id: "forest",
    label: "Forest",
    swatchA: "#10b981",
    swatchB: "#064e3b",
    tokens: [
      { path: ["colors", "brand", "navy"],                    value: "#064e3b" },
      { path: ["colors", "brand", "purple"],                  value: "#059669" },
      { path: ["colors", "ui", "body"],                       value: "#1a3d2e" },
      { path: ["colors", "ui", "muted"],                      value: "#6aad8a" },
      { path: ["colors", "ui", "iconStroke"],                 value: "#2d6b4a" },
      { path: ["colors", "accent", "indigo"],                 value: "#10b981" },
      { path: ["gradients", "pageBackground"],                value: "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 50%, #d1fae5 100%)" },
      { path: ["gradients", "theme", "skyPeriwinkle"],        value: "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 40%, #d1fae5 95%)" },
      { path: ["gradients", "button", "primary"],             value: "linear-gradient(142deg, #065f46 0%, #064e3b 100%)" },
      { path: ["gradients", "button", "send"],                value: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
      { path: ["gradients", "button", "indigo"],              value: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
      { path: ["colors", "alpha", "railBg"],                  value: "rgba(167, 243, 208, 0.75)" },
      { path: ["themes", "skyPeriwinkle", "gradient"],        value: "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 40%, #d1fae5 95%)" },
      { path: ["themes", "skyPeriwinkle", "textColor"],       value: "#064e3b" },
      { path: ["themes", "skyPeriwinkle", "swatchA"],         value: "#6ee7b7" },
      { path: ["themes", "skyPeriwinkle", "swatchB"],         value: "#34d399" },
    ],
  },
];

function PresetsRow({ activePreset, onSelect }: { activePreset: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="flex gap-[8px] px-[16px] py-[14px] border-b border-gray-100">
      {PRESETS.map((preset) => {
        const isActive = activePreset === preset.id;
        return (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.id)}
            className={`flex-1 flex flex-col items-center gap-[8px] py-[10px] px-[6px] rounded-[12px] border-2 transition-all ${
              isActive ? "border-[#6366f1] bg-[#6366f1]/5" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
            }`}
          >
            {/* Swatch pair */}
            <div className="flex gap-[3px]">
              <div className="size-[18px] rounded-full border border-black/10" style={{ background: preset.swatchA }} />
              <div className="size-[18px] rounded-full border border-black/10" style={{ background: preset.swatchB }} />
            </div>
            <span className={`font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold ${isActive ? "text-[#6366f1]" : "text-gray-500"}`}>
              {preset.label}
            </span>
            {isActive && (
              <div className="size-[5px] rounded-full bg-[#6366f1]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main editor panel ────────────────────────────────────────────────────────

const TABS = [
  { id: "colors",    label: "Colors",     icon: Palette  },
  { id: "gradients", label: "Gradients",  icon: Sparkles },
  { id: "type",      label: "Typography", icon: Type     },
  { id: "effects",   label: "Effects",    icon: Layers   },
] as const;

type TabId = typeof TABS[number]["id"];

export function ThemeEditor() {
  const { dt, setToken, reset } = useDesignTokens();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("colors");
  const [activePreset, setActivePreset] = useState<string | null>("indigo");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const applyPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    for (const { path, value } of preset.tokens) {
      setToken(path, value);
    }
    setActivePreset(id);
  };

  const handleReset = () => {
    reset();
    setActivePreset("indigo");
  };

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-[24px] right-[196px] z-[200]">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-[8px] px-[14px] py-[10px] rounded-[14px] bg-white border border-gray-200 hover:bg-gray-50 transition-all"
          style={{
            boxShadow: open ? `0 4px 20px ${dt.colors.alpha.focusRingOpen}` : dt.shadows.floatingBtn,
            borderColor: open ? dt.colors.accent.indigo : undefined,
          }}
        >
          <Palette className="size-[15px] text-[#6366f1]" />
          <span className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-[#364153]">
            Style
          </span>
        </button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-[72px] right-[120px] z-[200] w-[360px] bg-white border border-gray-200 rounded-[18px] flex flex-col overflow-hidden"
            style={{ boxShadow: dt.shadows.editorPanel, maxHeight: advancedOpen ? 640 : "none" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-[16px] py-[14px] border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-[8px]">
                <div className="size-[28px] rounded-[8px] bg-[#6366f1]/10 flex items-center justify-center">
                  <Palette className="size-[14px] text-[#6366f1]" />
                </div>
                <span className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[14px] text-[#1e1b4b]">Style</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-[5px] px-[8px] py-[5px] rounded-[8px] hover:bg-gray-100 transition-colors"
                  title="Reset to defaults"
                >
                  <RotateCcw className="size-[12px] text-gray-400" />
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">Reset</span>
                </button>
                <button onClick={() => setOpen(false)} className="p-[6px] rounded-[8px] hover:bg-gray-100 transition-colors">
                  <X className="size-[14px] text-gray-400" />
                </button>
              </div>
            </div>

            {/* Presets */}
            <PresetsRow activePreset={activePreset} onSelect={applyPreset} />

            {/* Advanced toggle */}
            <button
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex items-center justify-between w-full px-[16px] py-[11px] hover:bg-gray-50 transition-colors shrink-0"
            >
              <div className="flex items-center gap-[6px]">
                <Settings2 className="size-[12px] text-gray-400" />
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium text-gray-500">Advanced</span>
              </div>
              <ChevronDown className={`size-[13px] text-gray-400 transition-transform duration-200 ${advancedOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Advanced editor — collapsible */}
            <AnimatePresence initial={false}>
              {advancedOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden shrink-0 border-t border-gray-100"
                >
                  {/* Tabs */}
                  <div className="flex gap-[2px] px-[12px] pt-[10px] pb-[8px] shrink-0">
                    {TABS.map(({ id, label: lbl, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={`flex items-center gap-[5px] px-[10px] py-[6px] rounded-[8px] transition-colors font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium ${
                          tab === id ? "bg-[#6366f1]/10 text-[#6366f1]" : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="size-[12px]" />
                        {lbl}
                      </button>
                    ))}
                  </div>

                  {/* Scrollable content */}
                  <div className="overflow-y-auto px-[4px] py-[8px] [scrollbar-width:thin] [scrollbar-color:#e5e7eb_transparent]" style={{ maxHeight: 380 }}>
                    {tab === "colors"    && <ColorsTab    dt={dt} />}
                    {tab === "gradients" && <GradientsTab dt={dt} />}
                    {tab === "type"      && <TypographyTab dt={dt} />}
                    {tab === "effects"   && <EffectsTab   dt={dt} />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
