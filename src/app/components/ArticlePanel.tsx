import { X } from "lucide-react";
import { useTokens } from "../TokensContext";
import classroomImg from "../../imports/classroom.jpg";
import { AiAssistCard } from "./AiAssistCard";
import type { AiNudge } from "./AiNudgeChips";

const IMAGE_MAP: Record<string, string> = {
  "image-0": classroomImg,
  "image-1": classroomImg,
  "image-2": classroomImg,
  "image-3": classroomImg,
};

interface ArticleDetails {
  title: string;
  subtitle: string;
  category: string;
  lastUpdated: string;
  content: string;
  image?: string;
  summary?: string;
}

export type ArticleAiNudge = AiNudge;

interface ArticlePanelProps {
  article: ArticleDetails | null;
  onClose?: () => void;
  /** Hide the close control (e.g. full-page article). */
  hideClose?: boolean;
  /** Follow-up nudges inside the AI summary card. */
  aiNudges?: ArticleAiNudge[];
  onAiNudge?: (nudge: ArticleAiNudge) => void;
  /** Hide the in-article AI summary card (e.g. when summary lives in AI zone). */
  hideSummary?: boolean;
}

export function ArticlePanel({
  article,
  onClose,
  hideClose = false,
  aiNudges,
  onAiNudge,
  hideSummary = false,
}: ArticlePanelProps) {
  const { tokens } = useTokens();
  const t = tokens.articlePanel;

  if (!article) return null;

  const heroSrc = article.image ? IMAGE_MAP[article.image] : null;
  const blocks = article.content.split("\n\n").filter(Boolean);
  const mid = Math.max(1, Math.floor(blocks.length / 2));
  const beforeImage = blocks.slice(0, mid);
  const afterImage = blocks.slice(mid);

  const showAiCard = Boolean(article.summary && !hideSummary);
  const suggestionLabels = (aiNudges ?? [])
    .filter((n) => n.kind !== "chat")
    .map((n) => n.label);

  const renderBlock = (block: string, index: number) => {
    const newlineIdx = block.indexOf("\n");
    if (newlineIdx !== -1) {
      const heading = block.slice(0, newlineIdx);
      const body = block.slice(newlineIdx + 1);
      return (
        <div key={index}>
          <p className="font-semibold text-[#1e1b4b] mb-[4px]">{heading}</p>
          <p>{body}</p>
        </div>
      );
    }
    return <p key={index}>{block}</p>;
  };

  return (
    <div className="backdrop-blur-[12px] bg-white/80 rounded-[33px] flex flex-col shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] h-full min-h-0">
      <div className="px-[24px] pt-[36px] pb-[14px] border-b border-white/20 flex items-start justify-between flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[26px] leading-[32px] text-[#364153] mb-[8px]">
            {article.title}
          </h2>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[18px] text-[#6b7280] mb-0">
            {t.lastUpdatedPrefix}
            {article.lastUpdated}
          </p>
        </div>
        {!hideClose && onClose && (
          <button
            onClick={onClose}
            className="p-[8px] hover:bg-white/30 rounded-[8px] transition-colors ml-[12px] flex-shrink-0"
          >
            <X className="w-[20px] h-[20px] text-[#364153]" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className={`px-[24px] pb-[24px] flex flex-col gap-[20px] ${
            showAiCard ? "pt-[12px]" : "pt-[14px]"
          }`}
        >
          {showAiCard && (
            <AiAssistCard
              title="AI summary"
              info={`Based on this article · Updated ${article.lastUpdated}`}
              suggestions={suggestionLabels}
              showSuggestions={suggestionLabels.length > 0}
              onAsk={(query) => {
                const match = (aiNudges ?? []).find((n) => n.label === query);
                onAiNudge?.(match ?? { label: query, kind: "question" });
              }}
            >
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#1a1a2e]">
                {article.summary}
              </p>
            </AiAssistCard>
          )}

          <div className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] leading-[24px] text-[#364153] space-y-[16px]">
            {beforeImage.map((block, i) => renderBlock(block, i))}
          </div>

          {heroSrc && (
            <div className="w-full h-[180px] overflow-hidden rounded-[16px]">
              <img src={heroSrc} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] leading-[24px] text-[#364153] space-y-[16px]">
            {afterImage.map((block, i) => renderBlock(block, mid + i))}
          </div>
        </div>
      </div>
    </div>
  );
}
