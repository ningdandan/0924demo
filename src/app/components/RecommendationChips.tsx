import { useState, type ComponentType } from "react";
import {
  Calendar,
  FileText,
  Gift,
  PhoneForwarded,
  Sparkles,
  type LucideProps,
} from "lucide-react";
import { useDesignTokens } from "../DesignTokensContext";

export type RecommendationChip = {
  id: string;
  label: string;
  icon?: ComponentType<LucideProps>;
};

interface RecommendationChipsProps {
  chips: RecommendationChip[];
  onSelect?: (chip: RecommendationChip) => void;
  /** Skeleton shimmer while the AI re-reads context */
  refreshing?: boolean;
  /** Dim chips after a send so the thread stays primary */
  dimmed?: boolean;
  label?: string;
  className?: string;
}

/**
 * In-chat recommendation chips — below the composer.
 * States: idle · hover · refreshing (shimmer) · dimmed (post-send).
 */
export function RecommendationChips({
  chips,
  onSelect,
  refreshing = false,
  dimmed = false,
  label = "AI Assist",
  className = "",
}: RecommendationChipsProps) {
  const { dt } = useDesignTokens();
  const accent = dt.colors.host.link || dt.colors.brand.navyDeep || "#001769";

  return (
    <div
      className={`space-y-[8px] transition-opacity duration-300 ${
        dimmed && !refreshing ? "opacity-45" : "opacity-100"
      } ${className}`.trim()}
    >
      <div className="flex items-center gap-[6px]">
        <Sparkles className="size-[10px]" style={{ color: accent }} />
        <span
          className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: accent }}
        >
          {label}
        </span>
      </div>

      <div className="flex gap-[8px] overflow-x-auto pb-[2px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {refreshing
          ? [150, 185, 155, 120].map((w, i) => (
              <div
                key={i}
                className="shrink-0 h-[36px] rounded-full bg-[#f3f3f6] overflow-hidden relative border border-[#e8e8ed]"
                style={{ width: w }}
              >
                <div className="absolute inset-0 animate-[recShimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white to-transparent" />
              </div>
            ))
          : chips.map((chip) => {
              const Icon = chip.icon;
              return (
                <button
                  key={chip.id}
                  type="button"
                  disabled={dimmed}
                  onClick={() => onSelect?.(chip)}
                  className="shrink-0 inline-flex items-center gap-[6px] rounded-full border border-[#e4e4ea] bg-white px-[14px] py-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-medium text-[#374151] hover:bg-blue-50 hover:border-[#2563EB]/30 hover:text-[#2563EB] active:scale-[0.98] transition-all disabled:pointer-events-none"
                >
                  {Icon && <Icon className="size-[13px] text-[#9ca3af]" />}
                  {chip.label}
                </button>
              );
            })}
      </div>
      <style>{`@keyframes recShimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}

const ICON_CYCLE = [PhoneForwarded, Gift, Calendar, FileText] as const;

/** Contextual action chips for the chat composer (demo content). */
export function buildInChatRecommendationChips(
  query: string,
  categoryHint = "",
): RecommendationChip[] {
  const q = query.toLowerCase();
  const cat = categoryHint.toLowerCase();
  let labels: string[];

  if (q.includes("hold") || q.includes("ship") || q.includes("trk") || cat.includes("order")) {
    labels = [
      "Release hold on this order",
      "Apply goodwill credit for missed update",
      "Schedule a callback with shipping status",
      "Send express shipping options",
    ];
  } else if (q.includes("dispute") || q.includes("chargeback") || cat.includes("dispute")) {
    labels = [
      "Outline evidence I need to submit",
      "Show dispute response deadline",
      "Draft a reply for Needs response",
      "Open the dispute in Dashboard",
    ];
  } else if (
    q.includes("payout") ||
    q.includes("billing") ||
    q.includes("payment") ||
    q.includes("invoice") ||
    cat.includes("billing")
  ) {
    labels = [
      "Explain why payout is on hold",
      "List steps to lift the hold",
      "Show invoice and proration detail",
      "Escalate to billing specialist",
    ];
  } else if (q.includes("password") || q.includes("login") || q.includes("reset")) {
    labels = [
      "Walk me through password reset",
      "I didn’t get the reset email",
      "My reset link expired",
      "Reset via mobile app instead",
    ];
  } else {
    labels = [
      "Summarize the key next steps",
      "Open the most relevant article",
      "What should I do first?",
      "Connect me with a specialist",
    ];
  }

  return labels.map((label, i) => ({
    id: `rec-${i}-${label.slice(0, 24)}`,
    label,
    icon: ICON_CYCLE[i % ICON_CYCLE.length],
  }));
}

/** Follow-up chip set after a recommendation was used. */
export function buildFollowUpRecommendationChips(
  selectedLabel: string,
): RecommendationChip[] {
  const base = selectedLabel.toLowerCase();
  let labels: string[];
  if (base.includes("hold") || base.includes("release")) {
    labels = [
      "Apply goodwill credit",
      "Schedule Fri callback to confirm",
      "Email tracking update",
    ];
  } else if (base.includes("credit") || base.includes("goodwill")) {
    labels = [
      "Release hold on this order",
      "Schedule Fri callback",
      "Send shipping options",
    ];
  } else if (base.includes("callback") || base.includes("schedule")) {
    labels = [
      "Release hold now",
      "Apply goodwill credit",
      "Send express options",
    ];
  } else {
    labels = [
      "Summarize what we decided",
      "Send me a recap email",
      "Anything else I should know?",
    ];
  }
  return labels.map((label, i) => ({
    id: `rec-f-${i}-${label.slice(0, 24)}`,
    label,
    icon: ICON_CYCLE[i % ICON_CYCLE.length],
  }));
}
