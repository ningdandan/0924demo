import { useState } from "react";
import {
  RecommendationChips,
  type RecommendationChip,
} from "../../components/RecommendationChips";

export type { RecommendationChip };
export {
  RecommendationChips,
  buildInChatRecommendationChips,
  buildFollowUpRecommendationChips,
} from "../../components/RecommendationChips";

/** Interactive playground for the lab. */
export function RecommendationChipsPlayground() {
  const [refreshing, setRefreshing] = useState(false);
  const [dimmed, setDimmed] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const chips: RecommendationChip[] = [
    { id: "r1", label: "Release hold on #TRK-88432" },
    { id: "r2", label: "Apply goodwill credit for missed update" },
    { id: "r3", label: "Call Marcus Fri with shipping update" },
    { id: "r4", label: "Send express shipping options for Sat" },
  ];

  return (
    <div className="max-w-[640px] mx-auto px-[24px] py-[28px] space-y-[20px]">
      <header>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af] mb-[6px]">
          Component · app CSS
        </p>
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-[22px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
          In-chat recommendations
        </h1>
        <p className="mt-[6px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[20px] text-[#6b7280]">
          Action chips below the chat input. Spec sheet in Specs tab; original demo in Demo tab.
        </p>
      </header>

      <div className="rounded-[16px] border border-[#e8e8ed] bg-white p-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <RecommendationChips
          chips={chips}
          refreshing={refreshing}
          dimmed={dimmed}
          onSelect={(c) => {
            setLast(c.label);
            setDimmed(true);
            setRefreshing(true);
            window.setTimeout(() => {
              setRefreshing(false);
              setDimmed(false);
            }, 1400);
          }}
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
