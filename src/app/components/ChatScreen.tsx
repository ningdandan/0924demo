import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, BookOpen, Users, FileText, Search, ThumbsUp, ThumbsDown, Plus, Mic, Phone } from "lucide-react";
import { useDesignTokens } from "../DesignTokensContext";
import { TypingIndicator } from "./TypingIndicator";
import { ArticlePanel } from "./ArticlePanel";
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
import { AiNudgeChips, type AiNudge } from "./AiNudgeChips";
import avatarImage from "../../imports/avatar-logo.png";
import userAvatar from "figma:asset/29430ecde91fa3edf6e8c948dcd5e35351d6faf7.png";
import { useTokens } from "../TokensContext";
import type { ChatCard, ChatMessage } from "../chatTypes";
import { useTheme } from "../ThemeContext";
import content from "../content";

const SUGGESTION_ICONS = [GraduationCap, GraduationCap, BookOpen, FileText, Users];

/** Follow-up pills under the chat input — same tone as search-results ask suggestions. */
function followUpNudgesForQuery(query: string, categoryHint = ""): AiNudge[] {
  const q = query.toLowerCase();
  const cat = categoryHint.toLowerCase();
  let questions: string[];

  if (q.includes("dispute") || q.includes("chargeback") || cat.includes("dispute")) {
    questions = [
      "How long do I have to respond?",
      "What evidence do I need to submit?",
      "Where do I upload this in the Dashboard?",
    ];
  } else if (q.includes("payout") || q.includes("hold") || cat.includes("payout")) {
    questions = [
      "Why was my payout put on hold?",
      "How do I get the hold lifted?",
      "How long do holds usually last?",
    ];
  } else if (
    q.includes("billing") ||
    q.includes("subscription") ||
    q.includes("invoice") ||
    q.includes("proration") ||
    cat.includes("billing")
  ) {
    questions = [
      "Why was I charged mid-cycle?",
      "How do I view my invoice?",
      "Can I get a prorated refund?",
    ];
  } else {
    questions = [
      "Can you summarize the key steps?",
      "What should I do next?",
      "Which article is most relevant?",
    ];
  }

  return questions.map((label) => ({ label, kind: "question" as const }));
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
}

export function ChatScreen({
  initialQuery,
  animateBar,
  scriptOverride,
  initialLearner,
  searchContext,
  initialArticle = null,
  instantAgent = false,
}: ChatScreenProps) {
  const { tokens } = useTokens();
  const { theme } = useTheme();
  const accentStyle = { backgroundImage: theme.gradient, color: theme.textColor };
  const bubbleStyle = { background: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), ${theme.gradient}`, color: theme.textColor };
  const tc = tokens.chatUI;
  const scriptMessages = scriptOverride ?? tokens.chatScript.messages;
  const PROMPT_SUGGESTIONS = ((tokens.chat ?? content.chat).promptSuggestions ?? []).map((s: any, i: number) => ({
    icon: SUGGESTION_ICONS[i] ?? GraduationCap,
    label: s.label,
    sub: s.sub,
  }));

  const articles: ArticleDetails[] = tokens.articles.learning;

  // Build runtime messages (stamp timestamps, inject user query into first message)
  const runtimeMessages: RuntimeMessage[] = scriptMessages.map((m, i) => ({
    ...m,
    role: m.role as "user" | "agent",
    content: i === 0 && m.role === "user" ? initialQuery || m.content : m.content,
    citations: (m.citations ?? []) as string[],
    card: (m as any).card as ChatCard | undefined,
    timestamp: new Date(),
  }));

  const [visibleCount, setVisibleCount] = useState(1);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleDetails | null>(initialArticle ?? null);
  const [selectedLearner, setSelectedLearner] = useState<string | null>(initialLearner ?? null);
  const [feedback, setFeedback] = useState<Record<string, "up" | "down" | null>>({});
  const [promptValue, setPromptValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsReady, setSuggestionsReady] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ bottom: number; left: number; width: number } | null>(null);

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

  const visibleMessages = runtimeMessages.slice(0, visibleCount);
  const nextMessage = runtimeMessages[visibleCount] ?? null;
  const canAdvance = visibleCount < runtimeMessages.length;
  // Spacebar only shown when the next message to reveal is a user message
  const showSpacebar = canAdvance && !isThinking && nextMessage?.role === "user";

  const followUpNudges = useMemo(() => {
    const categoryHint = searchContext?.results?.[0]?.category
      ?? initialArticle?.category
      ?? "";
    return followUpNudgesForQuery(initialQuery || searchContext?.query || "", categoryHint);
  }, [initialQuery, searchContext, initialArticle]);

  const handleFollowUpNudge = (nudge: AiNudge) => {
    setPromptValue(nudge.label);
    setDropdownOpen(false);
    setSuggestionsReady(false);
    setSuggestionsLoading(false);
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
  }, [visibleCount, isThinking]);

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
      className="flex h-full w-full gap-[20px] overflow-hidden pl-[10px] pr-[20px] py-[10px]"
    >
      <motion.div
        className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden"
      >
        <div className="flex flex-col h-full w-full min-h-0 max-w-[800px] mx-auto">
          {/* Messages */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: animateBar ? 0.55 : 0, ease: "easeOut" }}
            className="relative flex-1 min-h-0"
          >
            <div ref={scrollRef} className="h-full overflow-y-auto px-[40px] pt-[24px] pb-[24px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {searchContext && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-[20px] rounded-[14px] border border-white/70 bg-white/70 backdrop-blur-[8px] px-[14px] py-[12px]"
              >
                <div className="flex items-center gap-[6px] mb-[8px]">
                  <Search className="size-[12px] text-gray-400" />
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold tracking-wider text-gray-400">
                    context from search
                  </p>
                </div>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-semibold text-[#364153] mb-[8px] line-clamp-2">
                  “{searchContext.query}”
                </p>
                <div className="flex flex-col gap-[6px]">
                  {searchContext.results.slice(0, 3).map((r) => (
                    <div key={r.title} className="flex items-start gap-[8px]">
                      <span className="mt-[6px] size-[4px] rounded-full bg-gray-300 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#4b5563] truncate">
                          {r.title}
                        </p>
                        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 truncate">
                          {r.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            <AnimatePresence mode="popLayout">
              {visibleMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-[20px]`}
                >
                  {message.role === "user" ? (
                    <div className="flex gap-[12px] items-start max-w-[70%]">
                      <div className="flex flex-col gap-[4px] items-end flex-1">
                        <div
                          className="rounded-[16px] px-[20px] py-[16px]"
                          style={bubbleStyle}
                        >
                          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] leading-[22px]">
                            {message.content}
                          </p>
                        </div>
                        <span className="text-[11px] px-[4px] text-gray-400">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="shrink-0 size-[40px] rounded-full overflow-hidden">
                        <img src={userAvatar} alt="User" className="block size-full object-cover" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-[12px] items-start max-w-[90%] w-[90%]">
                      <div className="relative rounded-full shrink-0 size-[40px]">
                        <img src={avatarImage} alt={tc.avatarAlt} className="block size-full rounded-full object-cover" />
                        <div className="absolute bg-[#00c950] border-2 border-solid border-white left-[30px] rounded-full size-[12px] top-[30px]" />
                      </div>
                      <div className="flex flex-col gap-[4px] items-start flex-1">
                        {message.content && (
                          <div className="rounded-[16px] px-[0.5px] py-[0.5px]">
                            <InlineContent text={message.content} articles={articles} onArticleClick={setSelectedArticle} />
                          </div>
                        )}
                        {message.citations && message.citations.length > 0 && (
                          <CitationChips
                            citations={message.citations}
                            articles={articles}
                            onArticleClick={setSelectedArticle}
                          />
                        )}
                        {message.card && <CardRenderer card={message.card} onStudentClick={handleStudentClick} />}
                        <div className="flex items-center gap-[6px] px-[4px] mt-[2px]">
                          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">{content.chat.agentName}</span>
                          <span className="text-gray-300">·</span>
                          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          <span className="text-gray-300">·</span>
                          {feedback[message.id] ? (
                            <motion.span
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25 }}
                              className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400"
                            >
                              {feedback[message.id] === "up" ? content.chat.feedbackPositive : content.chat.feedbackNegative}
                            </motion.span>
                          ) : (
                            <>
                              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">{content.chat.feedbackPrompt}</span>
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
                  className="flex gap-[12px] items-start mb-[20px]"
                >
                  <div className="relative rounded-full shrink-0 size-[40px]">
                    <img src={avatarImage} alt={tc.avatarAlt} className="block size-full rounded-full object-cover" />
                    <div className="absolute bg-[#00c950] border-2 border-solid border-white left-[30px] rounded-full size-[12px] top-[30px]" />
                  </div>
                  <div className="flex items-center h-[40px]">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
            </div>
          </motion.div>

          {/* Input + suggestion pills (same pattern as search-results ask bar) */}
          <div className="px-[40px] pb-[16px] flex-shrink-0">
            <div className="relative w-full flex items-center gap-[8px]" ref={inputBarRef}>
              <motion.div
                {...(animateBar ? { layout: true, layoutId: "prompt-bar" } : {})}
                style={{ borderRadius: "9999px" }}
                className="relative flex-1 flex items-center gap-[6px] bg-white border border-gray-200 px-[8px] py-[8px]"
              >
                {/* Upload button */}
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
                {/* Voice button */}
                <button className="flex items-center justify-center rounded-full size-[36px] bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0">
                  <Mic className="size-[16px]" style={{ color: "var(--color-icon, #4A5565)" }} />
                </button>
              </motion.div>
              {/* Phone button — outside the bar */}
              <button className="flex items-center justify-center rounded-full size-[44px] bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0">
                <Phone className="size-[18px]" style={{ color: "var(--color-icon, #4A5565)" }} />
              </button>
            </div>

            {followUpNudges.length > 0 && (
              <div className="mt-[10px]">
                <AiNudgeChips
                  subtle
                  nudges={followUpNudges}
                  onNudge={handleFollowUpNudge}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Prompt dropdown — fixed to escape overflow:hidden parents */}
      <AnimatePresence>
        {dropdownOpen && dropdownPos && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="fixed bg-white rounded-[20px] shadow-[0px_12px_40px_rgba(0,0,0,0.12)] overflow-hidden z-[200]"
            style={{ bottom: dropdownPos.bottom, left: dropdownPos.left, width: dropdownPos.width }}
          >
            {/* First row: search query */}
            <div className="flex items-center gap-[12px] px-[16px] py-[12px] border-b border-gray-100">
              <div className="size-[32px] rounded-[8px] bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Search className="size-[14px] text-gray-500" />
              </div>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] truncate" style={{ color: "var(--color-body, #364153)" }}>{promptValue}</p>
            </div>
            {/* Suggestions */}
            <div className="py-[6px]">
              {suggestionsLoading ? (
                PROMPT_SUGGESTIONS.map((_, i) => (
                  <div key={i} className="flex items-center gap-[12px] px-[16px] py-[10px]">
                    <div className="size-[32px] rounded-[8px] bg-gray-100 animate-pulse flex-shrink-0" />
                    <div className="flex flex-col gap-[6px] flex-1">
                      <div className="h-[12px] bg-gray-100 rounded animate-pulse w-[55%]" />
                      <div className="h-[10px] bg-gray-100 rounded animate-pulse w-[35%]" />
                    </div>
                  </div>
                ))
              ) : suggestionsReady ? (
                PROMPT_SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.04 }}
                    className="flex items-center gap-[12px] px-[16px] py-[10px] w-full text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="size-[32px] rounded-[8px] flex items-center justify-center flex-shrink-0" style={accentStyle}>
                      <s.icon className="size-[14px]" style={{ color: "var(--color-navy, #1e1b4b)" }} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] truncate" style={{ color: "var(--color-body, #364153)" }}>{s.label}</p>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 truncate">{s.sub}</p>
                    </div>
                  </motion.button>
                ))
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
                <LearnerProfilePanel studentName={selectedLearner} onClose={() => setSelectedLearner(null)} />
              ) : (
                <ArticlePanel article={selectedArticle} onClose={() => setSelectedArticle(null)} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
