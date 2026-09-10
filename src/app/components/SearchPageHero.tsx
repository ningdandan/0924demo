import { motion } from "motion/react";
import { SearchBarWithDropdown } from "./SearchBarWithDropdown";
import { CategoryButtons } from "./CategoryButtons";
import { useTokens } from "../TokensContext";

interface SearchPageHeroProps {
  userName?: string;
  onSearch?: (query: string) => void;
}

export function SearchPageHero({ onSearch }: SearchPageHeroProps) {
  const { tokens } = useTokens();
  const t = tokens.searchHero;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-[32px] items-center w-full max-w-[1200px] mx-auto py-[80px] px-[40px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-[12px] items-start w-full ml-[200px] mr-[0px] mt-[70px] mb-[10px]"
      >
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold leading-[60px] text-[60px] tracking-[-1.5px] text-[#ffffff]">
          {t.greetingPrefix}{t.userName}.
        </h1>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-normal leading-[28px] text-[20px] tracking-[-0.4492px] text-[#ffffff]">
          {t.subtext}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative w-full"
      >
        <SearchBarWithDropdown onSearch={onSearch} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full"
      >
        <CategoryButtons onSearch={onSearch} />
      </motion.div>
    </motion.div>
  );
}
