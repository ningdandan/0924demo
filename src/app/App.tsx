import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence } from "motion/react";
import { Header } from "@/app/components/Header";
import { Sidebar } from "@/app/components/Sidebar";
import { HeroSection } from "@/app/components/HeroSection";
import { ChatScreen } from "@/app/components/ChatScreen";
import { SearchResultsScreen, type SearchBridgeContext } from "@/app/components/SearchResultsScreen";
import {
  KnowledgeArticleScreen,
  ArticleLayoutSwitch,
  type ArticleBridgeContext,
  type ArticleDetails,
  type ArticleLayoutVariant,
} from "@/app/components/KnowledgeArticleScreen";
import { GoogleSearchScreen } from "@/app/components/GoogleSearchScreen";
import { TextEditorPanel } from "@/app/components/TextEditorPanel";
import { TokensProvider, useTokens } from "@/app/TokensContext";
import { ThemeProvider } from "@/app/ThemeContext";
import { DesignTokensProvider, useDesignTokens } from "@/app/DesignTokensContext";
import {
  ExperienceModeToggle,
  type ExperienceMode,
} from "@/app/components/ExperienceModeToggle";

type HomepageView = "home" | "results" | "chat";
type GoogleView = "serp" | "article";

function AppInner() {
  const { tokens } = useTokens();
  const { dt } = useDesignTokens();
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>("homepage");
  const [homepageView, setHomepageView] = useState<HomepageView>("home");
  const [googleView, setGoogleView] = useState<GoogleView>("serp");
  const [searchQuery, setSearchQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [chatAnimateBar, setChatAnimateBar] = useState(false);
  const [chatInitialLearner, setChatInitialLearner] = useState<string | null>(null);
  const [homeKey, setHomeKey] = useState(0);
  const [searchBridge, setSearchBridge] = useState<SearchBridgeContext | null>(null);
  const [articleBridge, setArticleBridge] = useState<ArticleDetails | null>(null);
  const [navSearch, setNavSearch] = useState("");
  const [activeArticle, setActiveArticle] = useState<ArticleDetails | null>(null);
  const [instantAgent, setInstantAgent] = useState(false);
  const [articleLayout, setArticleLayout] = useState<ArticleLayoutVariant>("inline");

  const articles = tokens.articles.learning as ArticleDetails[];

  const resolvedArticle = useMemo(() => {
    if (activeArticle) return activeArticle;
    return articles[0] ?? null;
  }, [activeArticle, articles]);

  const resetHomepageSession = () => {
    flushSync(() => setChatAnimateBar(false));
    setSearchQuery("");
    setChatInitialLearner(null);
    setSearchBridge(null);
    setArticleBridge(null);
    setNavSearch("");
    setInstantAgent(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setChatAnimateBar(false);
    setChatInitialLearner(null);
    setSearchBridge(null);
    setArticleBridge(null);
    setInstantAgent(false);
    setHomepageView("results");
  };

  const handleGoHome = () => {
    flushSync(() => setChatAnimateBar(false));
    setInstantAgent(false);
    if (experienceMode === "google") {
      setGoogleView("serp");
      setActiveArticle(null);
      return;
    }
    resetHomepageSession();
    setHomepageView("home");
    setHomeKey((k) => k + 1);
  };

  const handleModeChange = (mode: ExperienceMode) => {
    setExperienceMode(mode);
    resetHomepageSession();
    setActiveArticle(null);

    if (mode === "google") {
      setGoogleView("serp");
      return;
    }

    setHomepageView("home");
    setHomeKey((k) => k + 1);
  };

  const handleStartConversation = (ctx: SearchBridgeContext) => {
    setSearchBridge(ctx);
    setArticleBridge(null);
    setSearchQuery(ctx.query);
    setChatInitialLearner(null);
    setChatAnimateBar(true);
    setHomepageView("chat");
  };

  const handleArticleBridge = (ctx: ArticleBridgeContext) => {
    // From article AI → keep user in Google tab article variants; bridge into homepage chat
    setArticleBridge(ctx.article);
    setSearchBridge(null);
    setSearchQuery(ctx.query);
    setChatInitialLearner(null);
    setChatAnimateBar(false);
    setExperienceMode("homepage");
    setHomepageView("chat");
  };

  const handleChatWithAgent = () => {
    setSearchBridge(null);
    setArticleBridge(null);
    setChatInitialLearner(null);
    setSearchQuery("Hi — I’d like to chat with an agent.");
    setChatAnimateBar(false);
    setInstantAgent(true);
    setHomepageView("chat");
  };

  const handleNavArticleSearch = (query: string) => {
    setNavSearch(query);
    setSearchQuery(query);
    setSearchBridge(null);
    setArticleBridge(null);
    setChatInitialLearner(null);
    setChatAnimateBar(false);
    setExperienceMode("homepage");
    setHomepageView("results");
  };

  const handleGoogleArticleSelect = (article: ArticleDetails) => {
    setActiveArticle(article);
    setGoogleView("article");
  };

  const brandName = tokens.brandName;
  const brandHost = `${brandName.toLowerCase().replace(/\s+/g, "")}.com`;
  const onGoogleSerp = experienceMode === "google" && googleView === "serp";
  const onGoogleArticle = experienceMode === "google" && googleView === "article";
  const showProductChrome = !onGoogleSerp;
  const showSidebar = experienceMode === "homepage" && homepageView === "chat";
  const showNavSearch = onGoogleArticle;
  const showChatEntry = experienceMode === "homepage" && homepageView !== "chat";

  const addressBar = onGoogleSerp
    ? `www.google.com/search?q=${encodeURIComponent(
        (tokens.searchBar?.suggestions?.[0] as string | undefined) ?? brandName
      )}`
    : onGoogleArticle
      ? `support.${brandHost}/article`
      : brandHost;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center gap-[16px] px-[24px] py-[20px] bg-[#c8c8d0]">
      <div className="flex flex-col items-center gap-[8px]">
        <ExperienceModeToggle mode={experienceMode} onChange={handleModeChange} />
        {experienceMode === "google" && (
          <ArticleLayoutSwitch value={articleLayout} onChange={setArticleLayout} />
        )}
      </div>

      <div className="w-full max-w-[1280px] flex-1 min-h-0 flex flex-col rounded-[16px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.28)] border border-[#a8a8b0] bg-[#f0f0f4]">
        <div className="flex items-center gap-[12px] px-[14px] h-[40px] bg-[#e4e4ea] border-b border-[#d0d0d8] flex-shrink-0">
          <div className="flex items-center gap-[7px]">
            <span className="size-[10px] rounded-full bg-[#ff5f57]" />
            <span className="size-[10px] rounded-full bg-[#febc2e]" />
            <span className="size-[10px] rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center min-w-0">
            <div className="max-w-[520px] w-full h-[24px] rounded-full bg-white/80 border border-[#d0d0d8] flex items-center justify-center px-[12px]">
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#6b7280] truncate">
                {addressBar}
              </p>
            </div>
          </div>
          <div className="w-[52px]" />
        </div>

        <div
          className="flex-1 min-h-0 flex flex-col relative"
          style={{
            background: onGoogleSerp ? "#ffffff" : dt.gradients.pageBackground,
            ["--color-navy" as string]: dt.colors.brand.navy,
            ["--color-body" as string]: dt.colors.ui.body,
            ["--color-muted" as string]: dt.colors.ui.muted,
            ["--color-icon" as string]: dt.colors.ui.iconStroke,
            ["--color-accent" as string]: dt.colors.accent.indigo,
          }}
        >
          <div className="flex h-full min-h-0">
            {showSidebar && (
              <Sidebar
                onLearnerSelect={(name) => {
                  setChatInitialLearner(name);
                  setChatAnimateBar(false);
                  setSearchBridge(null);
                  setArticleBridge(null);
                  setHomepageView("chat");
                }}
              />
            )}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              {showProductChrome && (
                <Header
                  onLogoClick={handleGoHome}
                  showSearch={showNavSearch}
                  searchValue={navSearch}
                  onSearchChange={setNavSearch}
                  onSearchSubmit={handleNavArticleSearch}
                  showChatEntry={showChatEntry}
                  onChatWithAgent={handleChatWithAgent}
                />
              )}
              <div className="flex flex-1 min-h-0">
                <main
                  className={`flex-1 flex flex-col min-h-0 ${
                    (experienceMode === "homepage" && homepageView === "home") || onGoogleSerp
                      ? "overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      : "overflow-hidden"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {experienceMode === "google" ? (
                      googleView === "serp" ? (
                        <GoogleSearchScreen
                          key="google-serp"
                          onSelectArticle={handleGoogleArticleSelect}
                        />
                      ) : (
                        <KnowledgeArticleScreen
                          key={`google-article-${resolvedArticle?.title ?? "none"}-${articleLayout}`}
                          article={resolvedArticle}
                          layoutVariant={articleLayout}
                          onEnableAi={handleArticleBridge}
                        />
                      )
                    ) : homepageView === "home" ? (
                      <HeroSection
                        key={`home-${homeKey}`}
                        onSearch={handleSearch}
                        sharedBarLayout={false}
                        searchFirst
                      />
                    ) : homepageView === "results" ? (
                      <SearchResultsScreen
                        key={`results-${searchQuery}`}
                        initialQuery={searchQuery}
                        onSearch={handleSearch}
                        onStartConversation={handleStartConversation}
                      />
                    ) : (
                      <ChatScreen
                        key={
                          instantAgent
                            ? "instant-agent"
                            : articleBridge
                              ? `article-bridge-${articleBridge.title}`
                              : searchBridge
                                ? `bridge-${searchBridge.query}`
                                : (chatInitialLearner ?? "chat")
                        }
                        initialQuery={searchQuery}
                        animateBar={chatAnimateBar}
                        initialLearner={chatInitialLearner}
                        searchContext={searchBridge}
                        initialArticle={articleBridge}
                        instantAgent={instantAgent}
                        scriptOverride={
                          searchQuery.toLowerCase().includes("best practices for structuring")
                            ? tokens.chatScriptBestPractices.messages
                            : undefined
                        }
                      />
                    )}
                  </AnimatePresence>
                </main>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {editorOpen && (
              <div
                className="absolute inset-0 z-[195] bg-black/20 backdrop-blur-[2px]"
                onClick={() => setEditorOpen(false)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {editorOpen && <TextEditorPanel onClose={() => setEditorOpen(false)} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DesignTokensProvider>
      <ThemeProvider>
        <TokensProvider>
          <AppInner />
        </TokensProvider>
      </ThemeProvider>
    </DesignTokensProvider>
  );
}
