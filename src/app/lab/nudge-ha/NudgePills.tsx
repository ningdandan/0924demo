import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  ChevronDown,
  CreditCard,
  Plug,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { useDesignTokens } from "../../DesignTokensContext";

export interface NudgePillItem {
  label: string;
  desc?: string;
}

export interface NudgePillDef {
  label: string;
  icon?: ReactNode;
  /** Sub-items to show in a dropdown when clicked */
  items?: NudgePillItem[];
  /** Direct-action question text (no dropdown) */
  q?: string;
}

interface NudgePillsProps {
  pills: NudgePillDef[];
  onSelect: (pill: NudgePillDef, item?: NudgePillItem) => void;
  compact?: boolean;
  className?: string;
}

/**
 * Help-assistant nudge pills — app CSS + design tokens.
 * Integration targets: home, article, chat (all skins) + checklist flags.
 */
export function NudgePills({
  pills,
  onSelect,
  compact = false,
  className = "",
}: NudgePillsProps) {
  const { dt } = useDesignTokens();
  const accent = dt.colors.host.link || "#2563EB";
  const [activePill, setActivePill] = useState<string | null>(null);

  const softBg = `${accent}14`;
  const softBgHover = `${accent}22`;
  const softBgActive = `${accent}28`;
  const borderIdle = `${accent}26`;
  const borderActive = `${accent}59`;

  const handlePillClick = (pill: NudgePillDef) => {
    if (pill.items) {
      setActivePill((prev) => (prev === pill.label ? null : pill.label));
    } else {
      setActivePill(null);
      onSelect(pill);
    }
  };

  const handleItemClick = (pill: NudgePillDef, item: NudgePillItem) => {
    setActivePill(null);
    onSelect(pill, item);
  };

  const activeDef = pills.find((p) => p.label === activePill);

  return (
    <div className={`w-full ${className}`.trim()}>
      <div className={`flex flex-wrap ${compact ? "gap-[6px]" : "gap-[8px]"}`}>
        {pills.map((pill) => {
          const isActive = activePill === pill.label;
          const hasDropdown = !!pill.items;
          return (
            <button
              key={pill.label}
              type="button"
              onClick={() => handlePillClick(pill)}
              className={`inline-flex items-center rounded-full transition-all select-none whitespace-nowrap font-['Plus_Jakarta_Sans',sans-serif] ${
                compact
                  ? "gap-[4px] px-[10px] py-[4px] text-[10.5px]"
                  : "gap-[6px] px-[12px] py-[6px] text-[11.5px]"
              }`}
              style={{
                background: isActive ? softBgActive : softBg,
                border: `1px solid ${isActive ? borderActive : borderIdle}`,
                color: accent,
                boxShadow: isActive ? `0 0 0 3px ${accent}14` : undefined,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = softBgHover;
                  e.currentTarget.style.borderColor = borderActive;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = softBg;
                  e.currentTarget.style.borderColor = borderIdle;
                }
              }}
            >
              {pill.icon ? (
                <span className="shrink-0">{pill.icon}</span>
              ) : (
                <Sparkles size={compact ? 9 : 10} className="shrink-0 opacity-60" />
              )}
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

      <AnimatePresence>
        {activeDef?.items && (
          <motion.div
            key={activeDef.label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="mt-[8px] bg-white rounded-[12px] overflow-hidden border border-[#e8e8ed] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)]"
          >
            {activeDef.items.map((item, i) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleItemClick(activeDef, item)}
                className="w-full flex items-center gap-[12px] px-[14px] py-[10px] text-left hover:bg-[#f8fafb] transition-colors"
                style={{
                  borderBottom:
                    i < activeDef.items!.length - 1 ? "1px solid #f0f0f4" : undefined,
                }}
              >
                <div
                  className="size-[6px] rounded-full shrink-0 mt-[2px]"
                  style={{ background: `${accent}59` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12.5px] font-medium text-[#1a1a2e] leading-snug">
                    {item.label}
                  </p>
                  {item.desc && (
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#9ca3af] mt-[2px] leading-snug">
                      {item.desc}
                    </p>
                  )}
                </div>
                <ArrowUpRight size={11} className="shrink-0 text-[#c8c8d0]" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const SAMPLE_NUDGE_PILLS: NudgePillDef[] = [
  {
    label: "Getting started",
    icon: <Zap size={10} />,
    items: [
      { label: "Set up your workspace", desc: "Configure your environment" },
      { label: "Invite team members", desc: "Add collaborators to your org" },
      { label: "Connect your first integration", desc: "Zapier, Slack, and more" },
    ],
  },
  {
    label: "Account & security",
    icon: <Settings size={10} />,
    items: [
      { label: "Reset your password", desc: "Forgot or need to change it?" },
      { label: "Enable two-factor auth", desc: "Add an extra layer of security" },
    ],
  },
  {
    label: "Billing & plans",
    icon: <CreditCard size={10} />,
    items: [
      { label: "View current plan", desc: "See features and limits" },
      { label: "Upgrade or downgrade", desc: "Switch your subscription" },
    ],
  },
  {
    label: "API & integrations",
    icon: <Plug size={10} />,
    q: "How do I generate an API key?",
  },
];

export function NudgePillsPlayground() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className="max-w-[640px] mx-auto px-[24px] py-[28px] space-y-[20px]">
      <header>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af] mb-[6px]">
          Component · app CSS
        </p>
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-[22px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
          Nudge pills (HA)
        </h1>
        <p className="mt-[6px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[20px] text-[#6b7280]">
          Topic pills with optional dropdowns. Spec + full prototype in Specs / Demo tabs.
        </p>
      </header>

      <div className="rounded-[16px] border border-[#e8e8ed] bg-white p-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <NudgePills
          pills={SAMPLE_NUDGE_PILLS}
          onSelect={(pill, item) =>
            setLast(item ? `${pill.label} → ${item.label}` : pill.q ?? pill.label)
          }
        />
        {last && (
          <p className="mt-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6b7280]">
            Last selected: <span className="text-[#1a1a2e] font-medium">{last}</span>
          </p>
        )}
      </div>
    </div>
  );
}
