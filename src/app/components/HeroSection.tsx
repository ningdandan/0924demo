import { motion } from "motion/react";
import { SearchBar } from "./SearchBar";
import { SearchFirstPromptBar } from "./SearchFirstPromptBar";
import { CategoryButtons } from "./CategoryButtons";
import { useTokens } from "../TokensContext";

interface HeroSectionProps {
  userName?: string;
  onSearch?: (query: string) => void;
  sharedBarLayout?: boolean;
  /** Use Search-first prompt bar (no plus / send instead of call). */
  searchFirst?: boolean;
}

export function HeroSection({ onSearch, sharedBarLayout = true, searchFirst = false }: HeroSectionProps) {
  const { tokens } = useTokens();
  const t = tokens.hero;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex flex-col items-center w-full max-w-[1200px] mx-auto px-[40px] gap-[32px] py-[80px]"
    >
      <div className="flex flex-col gap-[12px] items-center text-center w-full max-w-[720px] mx-auto mb-[10px] mt-[70px]">
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold leading-[60px] text-[60px] tracking-[-1.5px] text-[#001769]">
          {t.welcomeHeading}
        </h1>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-light leading-[28px] text-[20px] tracking-[-0.4492px] text-[#001769] max-w-[560px]">
          {t.welcomeSubtext}
        </p>
      </div>

      <div className="relative w-full">
        {searchFirst ? (
          <SearchFirstPromptBar onSearch={onSearch} />
        ) : (
          <SearchBar onSearch={onSearch} sharedLayout={sharedBarLayout} />
        )}
      </div>

      <div className="w-full">
        <CategoryButtons onSearch={onSearch} />
      </div>
    </motion.div>
  );
}
