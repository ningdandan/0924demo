import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useTokens } from "../TokensContext";

interface ArticleDetails {
  title: string;
  subtitle: string;
  category: string;
  lastUpdated: string;
  content: string;
}

interface CitationChipsProps {
  citations: string[];
  articles?: ArticleDetails[];
  onArticleClick?: (article: ArticleDetails) => void;
}

export function CitationChips({ citations, articles = [], onArticleClick }: CitationChipsProps) {
  const { tokens } = useTokens();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getArticleForCitation = (citation: string) =>
    articles.find((a) => a.category === citation || a.title.includes(citation));

  return (
    <ul className="mt-[10px] flex flex-col gap-[4px]">
      {citations.map((citation, index) => {
        const article = getArticleForCitation(citation);
        return (
          <li key={index} className="relative flex items-start gap-[6px]">
            <span className="mt-[9px] size-[4px] rounded-full bg-[#364153] shrink-0" />
            <div className="relative">
              <motion.button
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.08 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => article && onArticleClick?.(article)}
                className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] leading-[22px] text-[#364153] underline underline-offset-2 hover:opacity-70 transition-opacity text-left"
              >
                {citation}
              </motion.button>

              <AnimatePresence>
                {hoveredIndex === index && article && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-[28px] z-50 w-[320px] bg-white border border-gray-200 rounded-[12px] shadow-lg p-[16px]"
                  >
                    <div className="flex flex-col gap-[8px]">
                      <h4 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] leading-[18px] text-[#364153]">
                        {article.title}
                      </h4>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[16px] text-gray-600">
                        {article.subtitle}
                      </p>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">
                        {tokens.articlePanel.lastUpdatedPrefix}{article.lastUpdated}
                      </p>
                      <div className="pt-[8px] border-t border-gray-100">
                        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] leading-[16px] text-gray-500 line-clamp-3">
                          {article.content}
                        </p>
                      </div>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-[#8200db] font-medium mt-[4px]">
                        {tokens.articlePanel.clickToView}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
