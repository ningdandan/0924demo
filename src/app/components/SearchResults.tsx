import { motion } from "motion/react";
import { useState } from "react";

interface SearchResult {
  title: string;
  subtitle: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  onArticleClick?: (result: SearchResult) => void;
}

export function SearchResults({ results, onArticleClick }: SearchResultsProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedResults = showAll ? results : results.slice(0, 4);
  const hasMore = results.length > 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-[12px] shadow-sm overflow-hidden"
    >
      {displayedResults.map((result, index) => (
        <button
          key={index}
          className="w-full text-left p-[16px] hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group"
          onClick={() => onArticleClick && onArticleClick(result)}
        >
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[15px] leading-[20px] text-[#364153] mb-[4px] group-hover:text-[#066afe] transition-colors">
            {result.title}
          </h3>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[18px] text-[#6b7280]">
            {result.subtitle}
          </p>
        </button>
      ))}
      
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full text-center p-[14px] hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-[#066afe] hover:text-[#0556d6] transition-colors">
            View {results.length - 4} more result{results.length - 4 > 1 ? 's' : ''}
          </span>
        </button>
      )}
    </motion.div>
  );
}