import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ThumbsUp, ThumbsDown, Plus, Mic, Phone, CheckCheck, ChevronRight } from "lucide-react";
import { useDesignTokens } from "../DesignTokensContext";
import { TypingIndicator } from "./TypingIndicator";
import { ArticlePanel } from "./ArticlePanel";
import { useSkin } from "../SkinContext";
import { LearnerProfilePanel } from "./LearnerProfilePanel";
import { CitationChips } from "./CitationChips";
import { ActionTiles } from "./ActionTiles";
import { AssignModuleCard } from "./AssignModuleCard";
import { SendNotificationCard } from "./SendNotificationCard";
import { LearnerProgressCard } from "./LearnerProgressCard";
import { ModuleStepperCard } from "./ModuleStepperCard";
import { ExtendDeadlineCard } from "./ExtendDeadlineCard";
import { SpecialistChatCard } from "./SpecialistChatCard";
import { StudentReadinessCard } from "./StudentReadinessCard";
import { FeedbackFormCard } from "./FeedbackFormCard";
import {
  RecommendationChips,
  buildInChatRecommendationChips,
  buildFollowUpRecommendationChips,
  type RecommendationChip,
} from "./RecommendationChips";
import {
  ChatDynamicCard,
  buildChatDynamicScenario,
  type DynamicCardPhase,
} from "./ChatDynamicCard";
import {
  buildSuggestionGroups,
  suggestionGroupsHaveItems,
  SuggestionGroupList,
} from "./SuggestionGroups";
import avatarImage from "../../imports/avatar-logo.png";
import userAvatar from "figma:asset/29430ecde91fa3edf6e8c948dcd5e35351d6faf7.png";
import { useTokens } from "../TokensContext";
import type { ChatCard, ChatMessage } from "../chatTypes";
import { useTheme } from "../ThemeContext";
import content from "../content";

function HelpChatBotAvatar({ size = 36, bg }: { size?: number; bg: string }) {
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center text-white"
      style={{
        width: size,
        height: size,
        background: bg,
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: size * 0.52,
        fontWeight: 700,
        fontStyle: "italic",
        lineHeight: 1,
      }}
      aria-hidden
    >
      D
    </div>
  );
}

function formatChatClock(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
}

function formatChatStarted(date: Date) {
  return date.toLocaleString([], {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

interface ArticleDetails {
  title: string;
  subtitle: string;
  category: string;
  lastUpdated: string;
  content: string;
}

interface RuntimeMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  citations?: string[];
  card?: ChatCard;
  timestamp: Date;
}

function InlineContent({ text, articles, onArticleClick }: { text: string; articles: ArticleDetails[]; onArticleClick: (a: ArticleDetails) => void }) {
  const { theme } = useTheme();
  const { dt } = useDesignTokens();
  const paragraphs = text.split("\n\n");

  // Collect ordered unique footnotes across all paragraphs
  const footnotes: { label: string; article: ArticleDetails | undefined }[] = [];
  const getFootnoteIndex = (label: string, article: ArticleDetails | undefined) => {
    const existing = footnotes.findIndex((f) => f.label === label);
    if (existing !== -1) return existing + 1;
    footnotes.push({ label, article });
    return footnotes.length;
  };

  // First pass: collect footnotes in order
  paragraphs.forEach((para) => {
    para.split(/(\[[^\]]+\])/g).forEach((part) => {
      const match = part.match(/^\[(.+)\]$/);
      if (!match) return;
      const label = match[1];
      const article = articles.find((a) => a.title.toLowerCase().includes(label.toLowerCase()) || a.category.toLowerCase().includes(label.toLowerCase()));
      getFootnoteIndex(label, article);
    });
  });

  // Reset and re-collect during render
  const renderFootnotes: { label: string; article: ArticleDetails | undefined }[] = [];
  const getRenderIndex = (label: string, article: ArticleDetails | undefined) => {
    const existing = renderFootnotes.findIndex((f) => f.label === label);
    if (existing !== -1) return existing + 1;
    renderFootnotes.push({ label, article });
    return renderFootnotes.length;
  };

  const renderedParagraphs = paragraphs.map((para, pIdx) => {
    const parts = para.split(/(\[[^\]]+\])/g);
    return (
      <p key={pIdx} className={`font-['Plus_Jakarta_Sans',sans-serif] text-[15px] leading-[22px] ${pIdx > 0 ? "mt-[10px]" : ""}`} style={{ color: "var(--color-body, #364153)" }}>
        {parts.map((part, i) => {
          const match = part.match(/^\[(.+)\]$/);
          if (!match) return <span key={i}>{part}</span>;
          const label = match[1];
          const article = articles.find((a) => a.title.toLowerCase().includes(label.toLowerCase()) || a.category.toLowerCase().includes(label.toLowerCase()));
          const n = getRenderIndex(label, article);
          return (
            <span key={i}>
              <span>{label}</span>
              <button
                onClick={() => article && onArticleClick(article)}
                className="inline-flex items-center justify-center align-super text-[9px] font-semibold rounded-full size-[14px] ml-[2px] cursor-pointer hover:opacity-70 transition-opacity"
                style={{ backgroundImage: theme.gradient, color: dt.colors.brand.navy, lineHeight: 1 }}
              >
                {n}
              </button>
            </span>
          );
        })}
      </p>
    );
  });

  return (
    <>
      {renderedParagraphs}
    </>
  );
}

function CardRenderer({ card, onStudentClick }: { card: ChatCard; onStudentClick?: (name: string) => void }) {
  if (card.type === "action_tiles") {
    return <ActionTiles title={card.tilesTitle} tiles={card.tiles} onTileClick={() => {}} />;
  }
  if (card.type === "assign_module") return <AssignModuleCard card={card} />;
  if (card.type === "send_notification") return <SendNotificationCard card={card} />;
  if (card.type === "learner_progress") return <LearnerProgressCard card={card} onViewDetails={() => onStudentClick?.("Sophia Patel")} />;
  if (card.type === "module_stepper") return <ModuleStepperCard card={card} />;
  if (card.type === "extend_deadline") return <ExtendDeadlineCard card={card} />;
  if (card.type === "specialist_chat") return <SpecialistChatCard card={card} />;
  if (card.type === "student_readiness") return <StudentReadinessCard card={card} onStudentClick={onStudentClick} />;
  if (card.type === "feedback_form") return <FeedbackFormCard card={card} />;
  return null;
}

interface ChatScreenProps {
  initialQuery: string;
  animateBar?: boolean;
  scriptOverride?: ChatMessage[];
  initialLearner?: string | null;
  searchContext?: {
    query: string;
    summary: string;
    results: { title: string; category: string; subtitle: string }[];
  } | null;
  /** Open with this article already in the right panel (article → chat bridge). */
  initialArticle?: ArticleDetails | null;
  /** Skip agent typing delay (instant entry). */
  instantAgent?: boolean;
  showSuggestions?: boolean;
  showEscalation?: boolean;
  /** In-chat recommendation chips under the composer (AI Assist). */
  showInChatRecommendations?: boolean;
  /** Interactive dynamic action cards inside agent turns. */
  showDynamicCards?: boolean;
}

export function ChatScreen({
  initialQuery,
  animateBar,
  scriptOverride,
  initialLearner,
  searchContext,
  initialArticle = null,
  instantAgent = false,
  showSuggestions = true,
  showEscalation = true,
  showInChatRecommendations = true,
  showDynamicCards = true,
}: ChatScreenProps) {
  const { tokens } = useTokens();
  const { skin } = useSkin();
  const { dt } = useDesignTokens();
  const helpChat = skin.layout.chat === "help-chat";
  const { theme } = useTheme();
  const bubbleStyle = { background: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), ${theme.gradient}`, color: theme.textColor };
  const tc = tokens.chatUI;
  const helpFont = dt.fonts.families.body;
  const chatUserBubble = dt.colors.host.chatUserBubble;
  const chatAgentBubble = dt.colors.host.chatAgentBubble;
  const chatAvatarBg = dt.colors.host.chatAvatarBg;
  const scriptMessages = scriptOverride ?? tokens.chatScript.messages;

  const articles: ArticleDetails[] = tokens.articles.learning;

  // Build runtime messages (stamp timestamps, inject user query into first message).
  // From search: treat the smart-summary as a prior agent turn, then the follow-up as the next user message.
  const runtimeMessages: RuntimeMessage[] = useMemo(() => {
    const stamped = (m: ChatMessage, content: string): RuntimeMessage => ({
      id: m.id,
      role: m.role as "user" | "agent",
      content,
      citations: (m.citations ?? []) as string[],
      card: (m as { card?: ChatCard }).card,
      timestamp: new Date(),
    });

    const scriptRuntime = scriptMessages.map((m, i) =>
      stamped(m, i === 0 && m.role === "user" ? initialQuery || m.content : m.content),
    );

    const summary = searchContext?.summary?.trim();
    if (!summary) return scriptRuntime;

    const priorAgent: RuntimeMessage = {
      id: "search-summary",
      role: "agent",
      content: summary,
      citations: [],
      timestamp: new Date(),
    };
    const followUp: RuntimeMessage = {
      id: "search-follow-up",
      role: "user",
      content: initialQuery || searchContext?.query || "",
      citations: [],
      timestamp: new Date(),
    };
    // Skip the script's opening user turn — the follow-up replaces it.
    const rest =
      scriptMessages[0]?.role === "user" ? scriptRuntime.slice(1) : scriptRuntime;

    return [priorAgent, followUp, ...rest];
  }, [scriptMessages, initialQuery, searchContext]);

  const [visibleCount, setVisibleCount] = useState(() =>
    searchContext?.summary?.trim() ? 2 : 1,
  );
  const [isThinking, setIsThinking] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleDetails | null>(initialArticle ?? null);
  const [selectedLearner, setSelectedLearner] = useState<string | null>(initialLearner ?? null);
  const [feedback, setFeedback] = useState<Record<string, "up" | "down" | null>>({});
  const [promptValue, setPromptValue] = useState("");
  const [chatStartedAt] = useState(() => new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsReady, setSuggestionsReady] = useState(false);
  const [recChips, setRecChips] = useState<RecommendationChip[]>(() => {
    const categoryHint =
      searchContext?.results?.[0]?.category ?? initialArticle?.category ?? "";
    return buildInChatRecommendationChips(
      initialQuery || searchContext?.query || "",
      categoryHint,
    );
  });
  const [recRefreshing, setRecRefreshing] = useState(false);
  const [recDimmed, setRecDimmed] = useState(false);
  const [liveMessages, setLiveMessages] = useState<RuntimeMessage[]>([]);
  const [dynamicPhase, setDynamicPhase] = useState<DynamicCardPhase>("review");
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ bottom: number; left: number; width: number } | null>(null);

  const dynamicScenario = useMemo(() => {
    if (!showDynamicCards) return null;
    const categoryHint =
      searchContext?.results?.[0]?.category ?? initialArticle?.category ?? "";
    return buildChatDynamicScenario(
      skin.id,
      initialQuery || searchContext?.query || "",
      categoryHint,
    );
  }, [
    showDynamicCards,
    skin.id,
    initialQuery,
    searchContext?.query,
    searchContext?.results,
    initialArticle?.category,
  ]);

  const dynamicAnchorId = useMemo(() => {
    if (!dynamicScenario) return null;
    const firstTaskAgent = runtimeMessages.find(
      (m) =>
        m.role === "agent" &&
        m.content.trim() &&
        m.id !== "search-summary",
    );
    const fallback = runtimeMessages.find(
      (m) => m.role === "agent" && m.content.trim(),
    );
    return (firstTaskAgent ?? fallback)?.id ?? null;
  }, [dynamicScenario, runtimeMessages]);

  const composerLocked = showDynamicCards && dynamicPhase === "complete";

  useEffect(() => {
    setDynamicPhase("review");
  }, [dynamicScenario?.id]);

  const suggestionGroups = useMemo(
    () => buildSuggestionGroups("conversational", tokens, promptValue),
    [tokens, promptValue],
  );
  const hasSuggestionGroups = suggestionGroupsHaveItems(suggestionGroups);

  const handlePromptChange = useCallback((val: string) => {
    setPromptValue(val);
    if (!val.trim()) {
      setDropdownOpen(false);
      setSuggestionsReady(false);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      return;
    }
    if (inputBarRef.current) {
      const rect = inputBarRef.current.getBoundingClientRect();
      setDropdownPos({ bottom: window.innerHeight - rect.top + 8, left: rect.left, width: rect.width });
    }
    setDropdownOpen(true);
    setSuggestionsReady(false);
    setSuggestionsLoading(true);
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => {
      setSuggestionsLoading(false);
      setSuggestionsReady(true);
    }, 800);
  }, []);

  const visibleMessages = [
    ...runtimeMessages.slice(0, visibleCount),
    ...liveMessages,
  ];
  const nextMessage = runtimeMessages[visibleCount] ?? null;
  const canAdvance = visibleCount < runtimeMessages.length;
  // Spacebar only shown when the next message to reveal is a user message
  const showSpacebar = canAdvance && !isThinking && nextMessage?.role === "user";

  const handleRecommendationSelect = (chip: RecommendationChip) => {
    if (recRefreshing) return;
    setPromptValue(chip.label);
    setDropdownOpen(false);
    setSuggestionsReady(false);
    setSuggestionsLoading(false);
    setRecDimmed(true);
    setRecRefreshing(true);
    if (recTimerRef.current) clearTimeout(recTimerRef.current);

    const userMsg: RuntimeMessage = {
      id: `rec-user-${Date.now()}`,
      role: "user",
      content: chip.label,
      citations: [],
      timestamp: new Date(),
    };
    // Brief beat so the label is visible in the input, then commit to the thread.
    recTimerRef.current = setTimeout(() => {
      setPromptValue("");
      setLiveMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);
      recTimerRef.current = setTimeout(() => {
        const reply: RuntimeMessage = {
          id: `rec-agent-${Date.now()}`,
          role: "agent",
          content: `Got it — I’ll take care of “${chip.label}” and keep you updated here.`,
          citations: [],
          timestamp: new Date(),
        };
        setLiveMessages((prev) => [...prev, reply]);
        setIsThinking(false);
        setRecChips(buildFollowUpRecommendationChips(chip.label));
        setRecRefreshing(false);
        setRecDimmed(false);
      }, instantAgent ? 0 : 1600);
    }, 320);
  };

  const handleStudentClick = (name: string) => {
    setSelectedArticle(null);
    setSelectedLearner(name);
  };

  // Refresh the side panel when the learner_progress card appears, only if panel is already open
  useEffect(() => {
    const lastVisible = runtimeMessages[visibleCount - 1];
    if (lastVisible?.card?.type === "learner_progress" && (selectedLearner !== null || selectedArticle !== null)) {
      setSelectedArticle(null);
      setSelectedLearner("Sophia Patel");
    }
  }, [visibleCount]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [visibleCount, isThinking, liveMessages.length]);

  useEffect(() => {
    return () => {
      if (recTimerRef.current) clearTimeout(recTimerRef.current);
    };
  }, []);

  // Auto-advance agent messages with a typing indicator delay
  useEffect(() => {
    if (!canAdvance || nextMessage?.role !== "agent") return;
    setIsThinking(true);
    const timer = setTimeout(() => {
      setIsThinking(false);
      setVisibleCount((n) => n + 1);
    }, instantAgent ? 0 : 1500);
    return () => clearTimeout(timer);
  }, [visibleCount, canAdvance, instantAgent]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (e.code === "Space" && !isInput && showSpacebar) {
        e.preventDefault();
        setVisibleCount((n) => n + 1);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showSpacebar]);

  return (
    <motion.div
      key="chat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex h-full w-full overflow-hidden ${
        helpChat ? "gap-0 bg-white" : "gap-[20px] pl-[10px] pr-[20px] py-[10px]"
      }`}
      style={helpChat ? { fontFamily: helpFont } : undefined}
    >
      <motion.div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        <div
          className={`flex flex-col h-full w-full min-h-0 mx-auto ${
            helpChat ? "max-w-[720px]" : "max-w-[800px]"
          }`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: animateBar ? 0.55 : 0, ease: "easeOut" }}
            className="relative flex-1 min-h-0"
          >
            <div
              ref={scrollRef}
              className={`h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                helpChat ? "px-[28px] pt-[20px] pb-[16px]" : "px-[40px] pt-[24px] pb-[24px]"
              }`}
            >
              {helpChat && (
                <div className="flex items-center gap-[12px] mb-[22px]">
                  <div className="flex-1 h-px bg-[#E4E7ED]" />
                  <p className="shrink-0 text-[12px] text-[#606266] whitespace-nowrap">
                    Chat started at {formatChatStarted(chatStartedAt)}
                  </p>
                  <div className="flex-1 h-px bg-[#E4E7ED]" />
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {visibleMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} ${
                      helpChat ? "mb-[18px]" : "mb-[20px]"
                    }`}
                  >
                    {message.role === "user" ? (
                      helpChat ? (
                        <div className="flex flex-col items-end max-w-[78%]">
                          <div
                            className="rounded-[18px] px-[16px] py-[12px] text-white"
                            style={{ background: chatUserBubble }}
                          >
                            <p className="text-[15px] leading-[22px]">{message.content}</p>
                          </div>
                          <div
                            className="mt-[6px] flex items-center gap-[6px] text-[11px]"
                            style={{ color: dt.colors.ui.mutedDark }}
                          >
                            <span>{formatChatClock(message.timestamp)}</span>
                            <CheckCheck className="size-[14px]" strokeWidth={2.2} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-[12px] items-start max-w-[70%]">
                          <div className="flex flex-col gap-[4px] items-end flex-1">
                            <div className="rounded-[16px] px-[20px] py-[16px]" style={bubbleStyle}>
                              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] leading-[22px]">
                                {message.content}
                              </p>
                            </div>
                            <span className="text-[11px] px-[4px] text-gray-400">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="shrink-0 size-[40px] rounded-full overflow-hidden">
                            <img src={userAvatar} alt="User" className="block size-full object-cover" />
                          </div>
                        </div>
                      )
                    ) : helpChat ? (
                      <div className="flex gap-[10px] items-end max-w-[88%]">
                        <HelpChatBotAvatar bg={chatAvatarBg} />
                        <div className="flex flex-col items-start min-w-0">
                          {message.content && (
                            <div
                              className="rounded-[16px] px-[16px] py-[12px]"
                              style={{
                                background: chatAgentBubble,
                                color: dt.colors.ui.body,
                              }}
                            >
                              <InlineContent
                                text={message.content}
                                articles={articles}
                                onArticleClick={setSelectedArticle}
                              />
                            </div>
                          )}
                          {message.citations && message.citations.length > 0 && (
                            <div className="mt-[8px]">
                              <CitationChips
                                citations={message.citations}
                                articles={articles}
                                onArticleClick={setSelectedArticle}
                              />
                            </div>
                          )}
                          {message.card && (
                            <div className="mt-[8px]">
                              <CardRenderer card={message.card} onStudentClick={handleStudentClick} />
                            </div>
                          )}
                          {showDynamicCards &&
                            dynamicScenario &&
                            message.id === dynamicAnchorId && (
                              <ChatDynamicCard
                                scenario={dynamicScenario}
                                instant={instantAgent}
                                onPhaseChange={setDynamicPhase}
                              />
                            )}
                          <span
                            className="mt-[6px] text-[11px]"
                            style={{ color: dt.colors.ui.mutedDark }}
                          >
                            {formatChatClock(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-[12px] items-start max-w-[90%] w-[90%]">
                        <div className="relative rounded-full shrink-0 size-[40px]">
                          <img
                            src={avatarImage}
                            alt={tc.avatarAlt}
                            className="block size-full rounded-full object-cover"
                          />
                          <div className="absolute bg-[#00c950] border-2 border-solid border-white left-[30px] rounded-full size-[12px] top-[30px]" />
                        </div>
                        <div className="flex flex-col gap-[4px] items-start flex-1">
                          {message.content && (
                            <div className="rounded-[16px] px-[0.5px] py-[0.5px]">
                              <InlineContent
                                text={message.content}
                                articles={articles}
                                onArticleClick={setSelectedArticle}
                              />
                            </div>
                          )}
                          {message.citations && message.citations.length > 0 && (
                            <CitationChips
                              citations={message.citations}
                              articles={articles}
                              onArticleClick={setSelectedArticle}
                            />
                          )}
                          {message.card && (
                            <CardRenderer card={message.card} onStudentClick={handleStudentClick} />
                          )}
                          {showDynamicCards &&
                            dynamicScenario &&
                            message.id === dynamicAnchorId && (
                              <ChatDynamicCard
                                scenario={dynamicScenario}
                                instant={instantAgent}
                                onPhaseChange={setDynamicPhase}
                              />
                            )}
                          <div className="flex items-center gap-[6px] px-[4px] mt-[2px]">
                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">
                              {content.chat.agentName}
                            </span>
                            <span className="text-gray-300">·</span>
                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span className="text-gray-300">·</span>
                            {feedback[message.id] ? (
                              <motion.span
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400"
                              >
                                {feedback[message.id] === "up"
                                  ? content.chat.feedbackPositive
                                  : content.chat.feedbackNegative}
                              </motion.span>
                            ) : (
                              <>
                                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">
                                  {content.chat.feedbackPrompt}
                                </span>
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => setFeedback((f) => ({ ...f, [message.id]: "up" }))}
                                  className="hover:text-gray-600 text-gray-400 transition-colors"
                                >
                                  <ThumbsUp className="size-[12px]" />
                                </motion.button>
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => setFeedback((f) => ({ ...f, [message.id]: "down" }))}
                                  className="hover:text-gray-600 text-gray-400 transition-colors"
                                >
                                  <ThumbsDown className="size-[12px]" />
                                </motion.button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {isThinking && (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-start mb-[18px] ${
                      helpChat ? "gap-[10px]" : "gap-[12px]"
                    }`}
                  >
                    {helpChat ? (
                      <>
                        <HelpChatBotAvatar bg={chatAvatarBg} />
                        <div
                          className="rounded-[16px] px-[16px] py-[14px]"
                          style={{ background: chatAgentBubble }}
                        >
                          <div className="flex gap-[5px] items-center">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="size-[7px] rounded-full"
                                style={{ background: chatUserBubble }}
                                animate={{ opacity: [0.25, 1, 0.25] }}
                                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative rounded-full shrink-0 size-[40px]">
                          <img
                            src={avatarImage}
                            alt={tc.avatarAlt}
                            className="block size-full rounded-full object-cover"
                          />
                          <div className="absolute bg-[#00c950] border-2 border-solid border-white left-[30px] rounded-full size-[12px] top-[30px]" />
                        </div>
                        <div className="flex items-center h-[40px]">
                          <TypingIndicator />
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div
            className={`flex-shrink-0 transition-opacity duration-300 ${
              helpChat ? "px-[28px] pb-[14px]" : "px-[40px] pb-[16px]"
            } ${composerLocked ? "opacity-40 pointer-events-none" : ""}`}
          >
            {helpChat ? (
              <>
                <div className="relative w-full" ref={inputBarRef}>
                  <div className="flex items-center gap-[8px] h-[48px] pl-[18px] pr-[8px] rounded-full border border-[#DCDFE6] bg-white">
                    <input
                      type="text"
                      value={promptValue}
                      onChange={(e) => handlePromptChange(e.target.value)}
                      onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                      onFocus={() => promptValue.trim() && setDropdownOpen(true)}
                      placeholder="Type your message..."
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[15px] text-[#1A1A1A] placeholder:text-[#909399]"
                    />
                    <button
                      type="button"
                      className="size-[34px] rounded-full bg-[#D1D5DB] text-white flex items-center justify-center shrink-0 hover:bg-[#9CA3AF] transition-colors"
                      aria-label="Send"
                    >
                      <ChevronRight className="size-[18px]" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
                {showInChatRecommendations && recChips.length > 0 && (
                  <div className="mt-[10px]">
                    <RecommendationChips
                      chips={recChips}
                      refreshing={recRefreshing}
                      dimmed={recDimmed}
                      onSelect={handleRecommendationSelect}
                    />
                  </div>
                )}
                <p className="mt-[12px] text-center text-[11px] leading-[15px] text-[#606266]">
                  Responses generated with the assistance of AI technology.
                  <br />
                  Avoid sharing personal information unless requested.
                </p>
              </>
            ) : (
              <>
                <div className="relative w-full flex items-center gap-[8px]" ref={inputBarRef}>
                  <motion.div
                    {...(animateBar ? { layout: true, layoutId: "prompt-bar" } : {})}
                    style={{ borderRadius: "9999px" }}
                    className="relative flex-1 flex items-center gap-[6px] bg-white border border-gray-200 px-[8px] py-[8px]"
                  >
                    <button className="flex items-center justify-center rounded-full size-[36px] border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex-shrink-0">
                      <Plus className="size-[16px]" style={{ color: "var(--color-icon, #4A5565)" }} />
                    </button>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={promptValue}
                        onChange={(e) => handlePromptChange(e.target.value)}
                        onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                        onFocus={() => promptValue.trim() && setDropdownOpen(true)}
                        placeholder={tc.searchPlaceholder}
                        className="w-full bg-transparent border-0 outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] placeholder:text-[#99a1af]"
                        style={{ color: "var(--color-body, #364153)" }}
                      />
                    </div>
                    <button className="flex items-center justify-center rounded-full size-[36px] bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0">
                      <Mic className="size-[16px]" style={{ color: "var(--color-icon, #4A5565)" }} />
                    </button>
                  </motion.div>
                  {showEscalation && (
                    <button className="flex items-center justify-center rounded-full size-[44px] bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0">
                      <Phone className="size-[18px]" style={{ color: "var(--color-icon, #4A5565)" }} />
                    </button>
                  )}
                </div>

                {showInChatRecommendations && recChips.length > 0 && (
                  <div className="mt-[10px]">
                    <RecommendationChips
                      chips={recChips}
                      refreshing={recRefreshing}
                      dimmed={recDimmed}
                      onSelect={handleRecommendationSelect}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Prompt dropdown — fixed to escape overflow:hidden parents */}
      <AnimatePresence>
        {showSuggestions && dropdownOpen && dropdownPos && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="fixed bg-white rounded-[20px] shadow-[0px_12px_40px_rgba(0,0,0,0.12)] overflow-hidden z-[200] max-h-[min(420px,50vh)] overflow-y-auto"
            style={{ bottom: dropdownPos.bottom, left: dropdownPos.left, width: dropdownPos.width }}
          >
            <div className="flex items-center gap-[12px] px-[16px] py-[12px] border-b border-gray-100">
              <div className="size-[32px] rounded-[8px] bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Search className="size-[14px] text-gray-500" />
              </div>
              <p
                className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] truncate"
                style={{ color: "var(--color-body, #364153)" }}
              >
                {promptValue}
              </p>
            </div>
            <div className="py-[6px]">
              {suggestionsLoading ? (
                [0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-[12px] px-[16px] py-[10px]">
                    <div className="size-[28px] rounded-[8px] bg-gray-100 animate-pulse flex-shrink-0" />
                    <div className="flex flex-col gap-[6px] flex-1">
                      <div className="h-[12px] bg-gray-100 rounded animate-pulse w-[55%]" />
                      <div className="h-[10px] bg-gray-100 rounded animate-pulse w-[35%]" />
                    </div>
                  </div>
                ))
              ) : suggestionsReady && hasSuggestionGroups ? (
                <SuggestionGroupList
                  compact
                  groups={suggestionGroups}
                  query={promptValue}
                  onSelect={(item) => {
                    setPromptValue(item.value);
                    setDropdownOpen(false);
                    setSuggestionsReady(false);
                    setSuggestionsLoading(false);
                  }}
                />
              ) : suggestionsReady ? (
                <p className="px-[16px] py-[14px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#9CA3AF]">
                  No matching suggestions
                </p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {(selectedArticle || selectedLearner) && (
          <motion.div
            key={selectedLearner ?? selectedArticle?.title}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 140, mass: 1.2 }}
            className="flex-1 h-full min-w-0"
          >
            <div className="h-full">
              {selectedLearner ? (
                <LearnerProfilePanel
                  studentName={selectedLearner}
                  onClose={() => setSelectedLearner(null)}
                />
              ) : (
                <ArticlePanel
                  article={selectedArticle}
                  onClose={() => setSelectedArticle(null)}
                  compact
                  onOpenArticle={setSelectedArticle}
                  showAiAssist
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
