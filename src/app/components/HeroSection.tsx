import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Accessibility,
  Armchair,
  Award,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Headphones,
  Luggage,
  NotebookPen,
  PlaneTakeoff,
  Rocket,
  CreditCard,
  MonitorSmartphone,
  Clapperboard,
  TriangleAlert,
  Layers,
  Trophy,
  Wallet,
  Search,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { SearchBar } from "./SearchBar";
import { SearchFirstPromptBar } from "./SearchFirstPromptBar";
import { CategoryButtons } from "./CategoryButtons";
import { ContactCenterBotFab, ContactCenterTopicTree } from "./ContactCenterExtras";
import { useTokens } from "../TokensContext";
import { useSkin } from "../SkinContext";
import { useDesignTokens } from "../DesignTokensContext";

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
  /** Current vs essence modes for help-mirror / help-pathway home. */
  helpMirrorVariant?: "mirror" | "search-enhanced" | "conversational";
}

const GENERAL_HEADING = "Welcome";
const GENERAL_SUBTEXT = "Search our help center or ask a question to get started.";
const SITE_EYEBROW = "We're all ears.";
const SITE_HEADING = "How can we help?";

const TOPIC_ICONS = [
  Rocket,
  CreditCard,
  MonitorSmartphone,
  Clapperboard,
  TriangleAlert,
  Smartphone,
  Layers,
  Trophy,
];

const FOOTER_LINKS = [
  "Subscriber Agreement",
  "Privacy Policy",
  "Your US State Privacy Rights",
  "Children's Online Privacy Policy",
  "Do Not Sell or Share My Personal Information",
  "Interest-Based Ads",
  "Manage Privacy Preferences",
  "Closed Captioning Inquiries & Complaints",
];

const PATHWAY_ICONS: Record<string, LucideIcon> = {
  "Planning & Booking": CalendarDays,
  "Getting Ready": ClipboardCheck,
  "Day of Travel": PlaneTakeoff,
  "Delays, Cancellations, or Schedule Revisions": Clock3,
  Baggage: Luggage,
  "Travel Funds, Refunds, Reimbursements, & Receipts": Wallet,
  "Rapid Rewards®": Award,
  "Disability-Related Accommodations": Accessibility,
  "Assigned Seats": Armchair,
  "Contact Us": Headphones,
};

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
  helpMirrorVariant = "mirror",
}: HeroSectionProps) {
  const { tokens } = useTokens();
  const { skin } = useSkin();
  const { dt } = useDesignTokens();
  const t = tokens.hero;
  const helpMirror = skin.layout.home === "help-mirror";
  const helpPathway = skin.layout.home === "help-pathway";
  const essence = helpMirrorVariant !== "mirror";
  const [showAllAdditional, setShowAllAdditional] = useState(false);
  const [heroDraft, setHeroDraft] = useState("");

  const heading = personalizedHeader ? t.welcomeHeading : GENERAL_HEADING;
  const subtext = personalizedSubheader ? t.welcomeSubtext : GENERAL_SUBTEXT;

  const popular = useMemo(() => {
    const fromSuggestions = (tokens.searchBar?.suggestions ?? []).slice(0, 6);
    return fromSuggestions.length >= 4
      ? fromSuggestions
      : (tokens.articles?.learning ?? []).slice(0, 6).map((a: { title: string }) => a.title);
  }, [tokens.searchBar?.suggestions, tokens.articles?.learning]);

  const topics = useMemo(() => {
    const cats = tokens.categories ?? [];
    return cats.length > 0 ? cats.map((c) => c.label) : [];
  }, [tokens.categories]);

  if (helpPathway) {
    const host = dt.colors.host;
    const pathways = tokens.homePathways;
    const primary = pathways?.primary ?? [];
    const additional = pathways?.additional ?? [];
    const visibleAdditional = showAllAdditional ? additional : additional.slice(0, 4);
    const headingText =
      essence && personalizedHeader
        ? tokens.hero?.welcomeHeading || pathways?.heading
        : pathways?.heading || "What do you need help with?";
    const subheadingText =
      essence && personalizedSubheader
        ? tokens.hero?.welcomeSubtext || pathways?.subheading
        : pathways?.subheading || "Choose one of the topics below to get started";

    const PathwayTile = ({
      title,
      summary,
      accent,
    }: {
      title: string;
      summary: string;
      accent: string;
    }) => {
      const Icon = PATHWAY_ICONS[title] ?? Layers;
      return (
        <button
          type="button"
          onClick={() => onSearch?.(title)}
          className="group flex h-full min-h-[9rem] w-full flex-col items-stretch rounded-[4px] border bg-white p-[24px] text-left transition-colors duration-300 hover:text-white"
          style={{
            borderColor: dt.colors.ui.borderLight,
            borderTopWidth: 4,
            borderTopColor: accent,
            color: dt.colors.brand.navy,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = host.searchCta;
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.color = dt.colors.brand.navy;
          }}
        >
          <Icon
            className="mb-[8px] size-[48px] shrink-0"
            strokeWidth={1.5}
            style={{ color: "currentColor" }}
          />
          <span className="flex items-start justify-between gap-[12px]">
            <span className="text-[24px] font-bold leading-[32px]">{title}</span>
            <ChevronRight className="mt-[6px] size-[20px] shrink-0 opacity-70" />
          </span>
          <span
            className="mt-[8px] text-[15px] font-normal leading-[22px] opacity-90 group-hover:text-white"
            style={{ color: "inherit" }}
          >
            {summary}
          </span>
        </button>
      );
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="h-full min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ fontFamily: dt.fonts.families.body, background: host.pageBg }}
      >
        <section className="max-w-[1120px] mx-auto px-[24px] pt-[36px] pb-[28px]">
          <h1
            className="text-[32px] sm:text-[36px] font-bold leading-[1.2] tracking-[-0.02em] mb-[8px]"
            style={{ color: dt.colors.brand.navy }}
          >
            {headingText}
          </h1>
          <p className="text-[16px] leading-[24px] mb-[28px]" style={{ color: dt.colors.ui.mutedDark }}>
            {subheadingText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
            {primary.map((tile) => (
              <PathwayTile
                key={tile.title}
                title={tile.title}
                summary={tile.summary}
                accent={host.tileAccent}
              />
            ))}
          </div>
        </section>

        <section className="max-w-[1120px] mx-auto px-[24px] pb-[36px]">
          {helpMirrorVariant === "search-enhanced" ? (
            <div
              className="rounded-[6px] px-[24px] py-[20px]"
              style={{ background: host.searchCta }}
            >
              <h2 className="text-[24px] font-bold text-white mb-[12px]">
                {pathways?.searchHeading || "Search our help options and FAQs"}
              </h2>
              <div className="text-left -mx-[4px]">
                <SearchFirstPromptBar onSearch={onSearch} showSuggestions={showSuggestions} />
              </div>
            </div>
          ) : helpMirrorVariant === "conversational" ? (
            <div
              className="rounded-[6px] px-[24px] py-[20px]"
              style={{ background: host.searchCta }}
            >
              <h2 className="text-[24px] font-bold text-white mb-[12px]">
                {pathways?.searchHeading || "Search our help options and FAQs"}
              </h2>
              <div className="text-left -mx-[4px]">
                <SearchBar
                  onSearch={onSearch}
                  sharedLayout
                  showSuggestions={showSuggestions}
                  showEscalation={showEscalation}
                />
              </div>
            </div>
          ) : (
            <div
              className="rounded-[6px] px-[24px] pt-[16px] pb-[24px]"
              style={{ background: host.searchCta }}
            >
              <h2 className="text-[30px] font-bold text-white leading-[36px]">
                {pathways?.searchHeading || "Search our help options and FAQs"}
              </h2>
              <div className="mt-[16px] flex items-stretch gap-[8px] rounded-[4px] bg-white p-[8px]">
                <button
                  type="button"
                  onClick={() => onSearch?.(tokens.searchBar?.suggestions?.[0] ?? "Help")}
                  className="flex-1 min-w-0 text-left px-[10px] text-[16px] opacity-55"
                  style={{ color: dt.colors.ui.body }}
                >
                  {tokens.searchBar?.placeholder ?? "Search our help options and FAQs"}
                </button>
                <button
                  type="button"
                  onClick={() => onSearch?.(tokens.searchBar?.suggestions?.[0] ?? "Help")}
                  className="shrink-0 h-[40px] px-[18px] rounded-[4px] text-[15px] font-bold"
                  style={{
                    background: host.searchCtaAlt,
                    color: dt.colors.brand.navy,
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          )}
        </section>

        {additional.length > 0 && (
          <section className="max-w-[1120px] mx-auto px-[24px] pb-[48px]">
            <h2
              className="text-[22px] font-bold mb-[18px]"
              style={{ color: dt.colors.brand.navy }}
            >
              {pathways?.additionalHeading || "Additional topics"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              {visibleAdditional.map((tile) => (
                <PathwayTile
                  key={tile.title}
                  title={tile.title}
                  summary={tile.summary}
                  accent={host.link}
                />
              ))}
            </div>
            {additional.length > 4 && (
              <div className="mt-[20px] flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllAdditional((v) => !v)}
                  className="h-[36px] px-[16px] rounded-[4px] border text-[14px] font-semibold"
                  style={{
                    borderColor: host.link,
                    color: host.link,
                    background: "#ffffff",
                  }}
                >
                  {showAllAdditional ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </section>
        )}
      </motion.div>
    );
  }

  if (helpMirror) {
    const host = dt.colors.host;
    const popularArticles =
      popular.length >= 6
        ? popular.slice(0, 6)
        : (tokens.searchBar?.allSuggestions ?? popular).slice(0, 6);

    const submitHeroSearch = (raw?: string) => {
      const q = (raw ?? heroDraft).trim();
      if (q) onSearch?.(q);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="h-full min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ fontFamily: dt.fonts.families.body, background: "#ffffff" }}
      >
        <div
          className="relative text-white"
          style={{ background: dt.gradients.theme.skyPeriwinkle }}
        >
          <div className="px-[24px] sm:px-[40px] pt-[48px] pb-[64px] mx-auto text-center max-w-[920px]">
            <p className="mb-[10px] text-[18px] font-medium leading-[24px] text-[#8ec8d6]">
              {essence && personalizedSubheader
                ? tokens.hero?.welcomeSubtext || SITE_EYEBROW
                : SITE_EYEBROW}
            </p>
            <h1 className="text-[40px] sm:text-[52px] font-bold tracking-[-0.03em] leading-[1.08] mb-[28px]">
              {essence && personalizedHeader
                ? tokens.hero?.welcomeHeading || SITE_HEADING
                : SITE_HEADING}
            </h1>

            {helpMirrorVariant === "search-enhanced" ? (
              <div className="text-left w-full">
                <SearchFirstPromptBar onSearch={onSearch} showSuggestions={showSuggestions} />
              </div>
            ) : helpMirrorVariant === "conversational" ? (
              <div className="text-left w-full">
                <SearchBar
                  onSearch={onSearch}
                  sharedLayout
                  showSuggestions={showSuggestions}
                  showEscalation={showEscalation}
                />
              </div>
            ) : (
              <form
                className="w-full flex items-center gap-[12px] h-[56px] px-[18px] rounded-[12px] bg-white text-left shadow-[0_10px_32px_rgba(0,0,0,0.28)]"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitHeroSearch();
                }}
              >
                <button
                  type="submit"
                  className="shrink-0 text-[#9ca3af] hover:text-[#4b5563] transition-colors"
                  aria-label="Search"
                >
                  <Search className="size-[20px]" strokeWidth={2.2} />
                </button>
                <input
                  type="search"
                  value={heroDraft}
                  onChange={(e) => setHeroDraft(e.target.value)}
                  placeholder={tokens.searchBar?.placeholder ?? "Enter a question or topic"}
                  className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[16px] placeholder:text-[#9ca3af]"
                  style={{ color: dt.colors.brand.navy }}
                  aria-label="Search help articles"
                />
              </form>
            )}
          </div>
        </div>

        <section className="max-w-[1080px] mx-auto px-[24px] sm:px-[40px] pt-[48px] pb-[40px]">
          <h2 className="text-[28px] font-bold mb-[22px]" style={{ color: "#0b0c0f" }}>
            Popular help articles
          </h2>
          <ul className="grid sm:grid-cols-2 gap-[14px]">
            {popularArticles.map((title) => (
              <li key={title}>
                <button
                  type="button"
                  onClick={() => onSearch?.(title)}
                  className="w-full flex items-center justify-between gap-[12px] min-h-[56px] px-[18px] py-[14px] rounded-[4px] border bg-white text-left transition-colors hover:bg-[#f8fafc]"
                  style={{ borderColor: "#d7dbe2" }}
                >
                  <span className="text-[15px] font-medium leading-[20px]" style={{ color: host.link }}>
                    {title}
                  </span>
                  <ChevronRight className="size-[16px] shrink-0" style={{ color: host.link }} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {topics.length > 0 && (
          <section className="max-w-[1080px] mx-auto px-[24px] sm:px-[40px] pb-[48px]">
            <h2 className="text-[28px] font-bold mb-[22px]" style={{ color: "#0b0c0f" }}>
              All topics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[14px]">
              {topics.map((label, i) => {
                const Icon = TOPIC_ICONS[i % TOPIC_ICONS.length];
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onSearch?.(label)}
                    className="flex flex-col items-start gap-[14px] min-h-[112px] rounded-[4px] border bg-white px-[18px] py-[18px] text-left transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                    style={{ borderColor: "#d7dbe2" }}
                  >
                    <Icon className="size-[28px] shrink-0" style={{ color: host.link }} strokeWidth={1.75} />
                    <span className="text-[15px] font-bold leading-[20px]" style={{ color: "#0b0c0f" }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="bg-[#f3f4f6] px-[24px] sm:px-[40px] py-[56px]">
          <div className="max-w-[1080px] mx-auto">
            <div className="text-center mb-[28px]">
              <h2 className="text-[28px] font-bold mb-[8px]" style={{ color: "#0b0c0f" }}>
                Need more help?
              </h2>
              <p className="text-[15px] leading-[22px]" style={{ color: "#4b5563" }}>
                We are available for live support 24 hours a day 7 days a week
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-[16px]">
              <button
                type="button"
                onClick={() => onSearch?.(`Get in touch with ${tokens.brandName} support`)}
                className="flex items-start gap-[14px] rounded-[8px] border bg-white p-[22px] text-left shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
                style={{ borderColor: "#e5e7eb" }}
              >
                <Headphones className="size-[24px] mt-[2px] shrink-0" style={{ color: host.link }} />
                <span>
                  <span className="block text-[16px] font-bold mb-[6px]" style={{ color: host.link }}>
                    Get in touch
                  </span>
                  <span className="text-[14px] leading-[20px]" style={{ color: "#4b5563" }}>
                    Need to chat with us? We&apos;re happy to assist you.
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => onSearch?.(`Give feedback about ${tokens.brandName}`)}
                className="flex items-start gap-[14px] rounded-[8px] border bg-white p-[22px] text-left shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
                style={{ borderColor: "#e5e7eb" }}
              >
                <NotebookPen className="size-[24px] mt-[2px] shrink-0" style={{ color: host.link }} />
                <span>
                  <span className="block text-[16px] font-bold mb-[6px]" style={{ color: host.link }}>
                    Give feedback
                  </span>
                  <span className="text-[14px] leading-[20px]" style={{ color: "#4b5563" }}>
                    How can we improve {tokens.brandName}? Let us know through our feedback form!
                  </span>
                </span>
              </button>
            </div>
          </div>
        </section>

        <footer className="bg-[#1a1b1e] text-white px-[24px] sm:px-[40px] pt-[48px] pb-[36px]">
          <div className="max-w-[1080px] mx-auto flex flex-col items-center gap-[28px]">
            <p className="text-[28px] font-bold tracking-tight">{tokens.brandName}</p>
            <nav className="flex flex-wrap items-center justify-center gap-x-[18px] gap-y-[10px]">
              {FOOTER_LINKS.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="text-[12px] text-white/85 hover:text-white hover:underline"
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="text-center text-[11px] leading-[18px] text-white/55 max-w-[720px]">
              <p>©Disney. All Rights Reserved.</p>
              <p className="mt-[6px]">
                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service
                apply.
              </p>
            </div>
          </div>
        </footer>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="relative flex flex-col items-center w-full max-w-[1200px] mx-auto px-[40px] gap-[32px] py-[80px] pb-[48px]"
      style={{ fontFamily: dt.fonts.families.body }}
    >
      <div className="flex flex-col gap-[12px] items-center text-center w-full max-w-[720px] mx-auto mb-[10px] mt-[70px]">
        <h1
          className="font-bold leading-[60px] text-[60px] tracking-[-1.5px]"
          style={{ color: dt.colors.brand.navyDeep }}
        >
          {heading}
        </h1>
        <p
          className="font-light leading-[28px] text-[20px] tracking-[-0.4492px] max-w-[560px]"
          style={{ color: dt.colors.brand.navyDeep }}
        >
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
