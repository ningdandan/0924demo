import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Sparkles, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import content from "../content";
import { AiNudgeChips } from "./AiNudgeChips";

interface AiAssistCardProps {
  /** Header label — e.g. Smart summary / AI summary */
  title?: string;
  /** Quiet meta line (sources / updated). */
  info?: string;
  /** Body content above the divider. */
  children: ReactNode;
  suggestions?: string[];
  onAsk?: (query: string) => void;
  showAskInput?: boolean;
  showSuggestions?: boolean;
  showFeedback?: boolean;
  className?: string;
  /** card = white bordered panel; plain = no fill/border (AI zone). */
  variant?: "card" | "plain";
  /** Pin ask input + nudges to the bottom of a full-height container. */
  pinAskToBottom?: boolean;
}

/**
 * Shared AI assist layout: summary body → divider → ask input → subtle horizontal nudges.
 * Used by search-results, in-article AI, and AI zone (plain).
 */
export function AiAssistCard({
  title = "AI summary",
  info,
  children,
  suggestions = [],
  onAsk,
  showAskInput = true,
  showSuggestions = true,
  showFeedback = true,
  className = "",
  variant = "card",
  pinAskToBottom = false,
}: AiAssistCardProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [askValue, setAskValue] = useState("");
  const chat = content.chat;
  const isPlain = variant === "plain";

  const submitAsk = (override?: string) => {
    const q = (override ?? askValue).trim();
    if (!q) return;
    onAsk?.(q);
    setAskValue("");
  };

  const suggestionNudges = suggestions.map((label) => ({
    label,
    kind: "question" as const,
  }));

  const body = (
    <div className={isPlain ? "pb-[14px]" : "px-[20px] pt-[18px] pb-[16px]"}>
      <div className="flex items-center gap-[6px] mb-[12px]">
        <Sparkles className="size-[13px] text-[#001769]" strokeWidth={2} />
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-semibold text-[#6b7280]">
          {title}
        </p>
      </div>

      {children}

      {(info || showFeedback) && (
        <div className="mt-[14px] flex items-center justify-between gap-[12px] flex-wrap">
          {info ? (
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#9ca3af]">
              {info}
            </p>
          ) : (
            <span />
          )}
          {showFeedback && (
            <div className="flex items-center gap-[8px]">
              {feedback ? (
                <motion.p
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#9ca3af]"
                >
                  {feedback === "up" ? chat.feedbackPositive : chat.feedbackNegative}
                </motion.p>
              ) : (
                <>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#9ca3af]">
                    {chat.feedbackPrompt}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFeedback("up")}
                    className="text-[#9ca3af] hover:text-[#1a1a2e] transition-colors"
                    aria-label="Helpful"
                  >
                    <ThumbsUp className="size-[12px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedback("down")}
                    className="text-[#9ca3af] hover:text-[#1a1a2e] transition-colors"
                    aria-label="Not helpful"
                  >
                    <ThumbsDown className="size-[12px]" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const askFooter = showAskInput ? (
    <div className={`shrink-0 ${isPlain ? "" : ""}`}>
      <div className="h-px bg-[#ececf1]" />
      <div className={isPlain ? "pt-[10px] pb-[2px]" : "px-[14px] pt-[10px] pb-[12px]"}>
        <div className="flex items-center gap-[6px] rounded-full border border-[#e4e4ea] bg-[#fafafb] px-[12px] py-[6px] focus-within:border-[#c8c8d0] transition-colors">
          <input
            type="text"
            value={askValue}
            onChange={(e) => setAskValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitAsk();
              }
            }}
            placeholder="Ask a follow-up question…"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[18px] text-[#1a1a2e] placeholder:text-[#9ca3af]"
            aria-label="Ask a follow-up question"
          />
          <button
            type="button"
            onClick={() => submitAsk()}
            className="size-[24px] rounded-full flex items-center justify-center shrink-0 text-[#6b7280] hover:text-[#1a1a2e] hover:bg-black/[0.04] transition-colors"
            aria-label="Send"
          >
            <Send className="size-[12px]" />
          </button>
        </div>

        {showSuggestions && suggestionNudges.length > 0 && (
          <div className="mt-[8px]">
            <AiNudgeChips
              subtle
              nudges={suggestionNudges}
              onNudge={(nudge) => submitAsk(nudge.label)}
            />
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div
      className={`${
        isPlain
          ? "overflow-hidden"
          : "rounded-[16px] bg-white border border-[#e8e8ed] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden"
      } ${pinAskToBottom ? "h-full min-h-0 flex flex-col" : ""} ${className}`.trim()}
    >
      {pinAskToBottom ? (
        <>
          <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {body}
          </div>
          {askFooter}
        </>
      ) : (
        <>
          {body}
          {askFooter}
        </>
      )}
    </div>
  );
}
