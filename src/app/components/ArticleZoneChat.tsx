import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Mic, Plus, Send } from "lucide-react";
import { TypingIndicator } from "./TypingIndicator";
import { useTokens } from "../TokensContext";
import { useTheme } from "../ThemeContext";
import avatarImage from "../../imports/avatar-logo.png";
import userAvatar from "figma:asset/29430ecde91fa3edf6e8c948dcd5e35351d6faf7.png";
import content from "../content";

interface ArticleZoneChatProps {
  initialQuery: string;
  onBack?: () => void;
}

/**
 * Compact conversational UI for the Direct-to-article AI zone.
 * Reuses the same chat script / bubble patterns as ChatScreen, sized for the side panel.
 */
export function ArticleZoneChat({ initialQuery, onBack }: ArticleZoneChatProps) {
  const { tokens } = useTokens();
  const { theme } = useTheme();
  const tc = tokens.chatUI;
  const scriptMessages = tokens.chatScript.messages;

  const bubbleStyle = {
    background: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), ${theme.gradient}`,
    color: theme.textColor,
  };

  const runtimeMessages = scriptMessages.map((m, i) => ({
    id: m.id,
    role: m.role as "user" | "agent",
    content: i === 0 && m.role === "user" ? initialQuery || m.content : m.content,
    timestamp: new Date(),
  }));

  const [visibleCount, setVisibleCount] = useState(1);
  const [isThinking, setIsThinking] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleMessages = runtimeMessages.slice(0, visibleCount);
  const nextMessage = runtimeMessages[visibleCount] ?? null;
  const canAdvance = visibleCount < runtimeMessages.length;
  const showSpacebar = canAdvance && !isThinking && nextMessage?.role === "user";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [visibleCount, isThinking]);

  useEffect(() => {
    if (!canAdvance || nextMessage?.role !== "agent") return;
    setIsThinking(true);
    const timer = setTimeout(() => {
      setIsThinking(false);
      setVisibleCount((n) => n + 1);
    }, 1200);
    return () => clearTimeout(timer);
  }, [visibleCount, canAdvance, nextMessage?.role]);

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
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      <div className="px-[8px] pt-[14px] pb-[10px] flex-shrink-0 flex items-center gap-[8px]">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="size-[28px] rounded-full flex items-center justify-center hover:bg-black/[0.04] transition-colors"
            aria-label="Back to AI zone"
          >
            <ArrowLeft className="size-[14px] text-[#6b7280]" />
          </button>
        )}
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[13px] text-[#6b7280]">
          Chat
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-[8px] pb-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <AnimatePresence mode="popLayout">
          {visibleMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-[14px]`}
            >
              {message.role === "user" ? (
                <div className="flex gap-[8px] items-start max-w-[95%]">
                  <div className="flex flex-col gap-[3px] items-end flex-1 min-w-0">
                    <div className="rounded-[14px] px-[12px] py-[10px]" style={bubbleStyle}>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[19px]">
                        {message.content}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 size-[28px] rounded-full overflow-hidden">
                    <img src={userAvatar} alt="User" className="block size-full object-cover" />
                  </div>
                </div>
              ) : (
                <div className="flex gap-[8px] items-start max-w-[95%] w-full">
                  <div className="relative rounded-full shrink-0 size-[28px]">
                    <img
                      src={avatarImage}
                      alt={tc.avatarAlt}
                      className="block size-full rounded-full object-cover"
                    />
                    <div className="absolute bg-[#00c950] border-2 border-white left-[18px] rounded-full size-[9px] top-[18px]" />
                  </div>
                  <div className="flex flex-col gap-[3px] items-start flex-1 min-w-0">
                    <div className="rounded-[14px] px-[2px] py-[2px]">
                      {message.content.split("\n\n").map((para, i) => (
                        <p
                          key={i}
                          className={`font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[19px] text-[#364153] ${
                            i > 0 ? "mt-[8px]" : ""
                          }`}
                        >
                          {para.replace(/\[[^\]]+\]/g, "").trim()}
                        </p>
                      ))}
                    </div>
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-gray-400 px-[2px]">
                      {content.chat.agentName}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {isThinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-[8px] items-start mb-[14px]"
            >
              <div className="relative rounded-full shrink-0 size-[28px]">
                <img
                  src={avatarImage}
                  alt={tc.avatarAlt}
                  className="block size-full rounded-full object-cover"
                />
                <div className="absolute bg-[#00c950] border-2 border-white left-[18px] rounded-full size-[9px] top-[18px]" />
              </div>
              <div className="scale-[0.85] origin-left">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showSpacebar && (
          <p className="text-center font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 py-[8px]">
            Press <span className="font-semibold text-gray-500">Space</span> to continue
          </p>
        )}
      </div>

      {/* Compact prompt bar — same affordances as chat */}
      <div className="px-[8px] pb-[10px] flex-shrink-0">
        <div
          className="flex items-center gap-[6px] bg-white border border-gray-200 rounded-full px-[6px] py-[6px]"
          style={{ boxShadow: "0 0 8px 2px rgba(200, 225, 255, 0.25)" }}
        >
          <button
            type="button"
            className="flex items-center justify-center rounded-full size-[30px] border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <Plus className="size-[14px]" style={{ color: "var(--color-icon, #4A5565)" }} />
          </button>
          <input
            type="text"
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && promptValue.trim() && showSpacebar) {
                setVisibleCount((n) => n + 1);
                setPromptValue("");
              }
            }}
            placeholder={tc.searchPlaceholder}
            className="flex-1 min-w-0 bg-transparent border-0 outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[13px] placeholder:text-[#99a1af]"
            style={{ color: "var(--color-body, #364153)" }}
          />
          <button
            type="button"
            className="flex items-center justify-center rounded-full size-[30px] bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <Mic className="size-[14px]" style={{ color: "var(--color-icon, #4A5565)" }} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (showSpacebar) setVisibleCount((n) => n + 1);
            }}
            className="flex items-center justify-center rounded-full size-[30px] bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0"
            aria-label="Send"
          >
            <Send className="size-[13px]" style={{ color: "var(--color-icon, #4A5565)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
