import { motion } from "motion/react";
import { SearchBar } from "./SearchBar";
import { SearchFirstPromptBar } from "./SearchFirstPromptBar";
import { CategoryButtons } from "./CategoryButtons";
import { ContactCenterBotFab, ContactCenterTopicTree } from "./ContactCenterExtras";
import { useTokens } from "../TokensContext";

interface HeroSectionProps {
  userName?: string;
  onSearch?: (query: string) => void;
  sharedBarLayout?: boolean;
  /** Use Search-first prompt bar (no plus / send instead of call). */
  searchFirst?: boolean;
  /** Legacy contact-center extras under the welcome grid. */
  showTopicTree?: boolean;
  showBotFab?: boolean;
  onOpenArticle?: (title: string) => void;
  /** Personalized greeting vs general welcome copy. */
  personalizedHeader?: boolean;
  personalizedSubheader?: boolean;
  showSuggestions?: boolean;
  showEscalation?: boolean;
}

const GENERAL_HEADING = "Welcome";
const GENERAL_SUBTEXT = "Search our help center or ask a question to get started.";

export function HeroSection({
  onSearch,
  sharedBarLayout = true,
  searchFirst = false,
  showTopicTree = false,
  showBotFab = false,
  onOpenArticle,
  personalizedHeader = true,
  personalizedSubheader = true,
  showSuggestions = true,
  showEscalation = false,
}: HeroSectionProps) {
  const { tokens } = useTokens();
  const t = tokens.hero;
  const heading = personalizedHeader ? t.welcomeHeading : GENERAL_HEADING;
  const subtext = personalizedSubheader ? t.welcomeSubtext : GENERAL_SUBTEXT;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="relative flex flex-col items-center w-full max-w-[1200px] mx-auto px-[40px] gap-[32px] py-[80px] pb-[48px]"
    >
      <div className="flex flex-col gap-[12px] items-center text-center w-full max-w-[720px] mx-auto mb-[10px] mt-[70px]">
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold leading-[60px] text-[60px] tracking-[-1.5px] text-[#001769]">
          {heading}
        </h1>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-light leading-[28px] text-[20px] tracking-[-0.4492px] text-[#001769] max-w-[560px]">
          {subtext}
        </p>
      </div>

      <div className="relative w-full">
        {searchFirst ? (
          <SearchFirstPromptBar onSearch={onSearch} showSuggestions={showSuggestions} />
        ) : (
          <SearchBar
            onSearch={onSearch}
            sharedLayout={sharedBarLayout}
            showSuggestions={showSuggestions}
            showEscalation={showEscalation}
          />
        )}
      </div>

      <div className="w-full">
        <CategoryButtons onSearch={onSearch} />
      </div>

      {showTopicTree && onOpenArticle && (
        <ContactCenterTopicTree onOpenArticle={onOpenArticle} />
      )}

      {showBotFab && <ContactCenterBotFab />}
    </motion.div>
  );
}
