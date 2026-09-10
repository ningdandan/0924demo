import { Sparkles, MessageSquare } from "lucide-react";
import { useTheme } from "../ThemeContext";

export interface AiNudge {
  label: string;
  /** chat = primary start-chat action; question = suggested prompt */
  kind?: "question" | "chat";
}

interface AiNudgeChipsProps {
  nudges: AiNudge[];
  onNudge?: (nudge: AiNudge) => void;
  className?: string;
  /** Stack pills vertically, left-aligned (AI zone). */
  stack?: boolean;
  /** Quiet suggestion chips — for search results under the prompt bar. */
  subtle?: boolean;
}

/** AI nudge chips — default gradient style, or subtle for secondary suggestions. */
export function AiNudgeChips({
  nudges,
  onNudge,
  className = "",
  stack = false,
  subtle = false,
}: AiNudgeChipsProps) {
  if (nudges.length === 0) return null;

  const { theme } = useTheme();
  const solidGradient = theme.gradient;
  const softGradient = `linear-gradient(rgba(255,255,255,0.72), rgba(255,255,255,0.72)), ${theme.gradient}`;

  if (subtle) {
    return (
      <div
        className={`flex font-['Plus_Jakarta_Sans',sans-serif] gap-[6px] items-center justify-start flex-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`.trim()}
      >
        {nudges.map((nudge) => (
          <button
            key={nudge.label}
            type="button"
            onClick={() => onNudge?.(nudge)}
            className="shrink-0 inline-flex items-center rounded-full border border-[#e4e4ea] bg-[#fafafb] px-[11px] py-[5px] text-left transition-colors hover:bg-[#f3f3f6] hover:border-[#d8d8e0]"
          >
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-normal text-[#6b7280] whitespace-nowrap">
              {nudge.label}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex font-['Plus_Jakarta_Sans',sans-serif] gap-[8px] items-start justify-start ${
        stack ? "flex-col flex-nowrap" : "flex-row flex-wrap"
      } ${className}`.trim()}
    >
      {nudges.map((nudge) => {
        const isChat = nudge.kind === "chat";
        return (
          <button
            key={nudge.label}
            type="button"
            onClick={() => onNudge?.(nudge)}
            className={`inline-flex items-center justify-start gap-[6px] rounded-full px-[12px] py-[6px] text-left transition-opacity hover:opacity-90 shadow-[0px_8px_24px_rgba(6,106,254,0.06)] ${
              isChat ? "border border-white/60" : "border border-white/55"
            }`}
            style={{
              backgroundImage: isChat ? solidGradient : softGradient,
              color: theme.textColor,
            }}
          >
            {isChat ? (
              <MessageSquare className="size-[13px] shrink-0" />
            ) : (
              <Sparkles className="size-[13px] shrink-0" />
            )}
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-semibold">
              {nudge.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
