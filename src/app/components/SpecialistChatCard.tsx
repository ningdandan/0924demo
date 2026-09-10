import { useState } from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";
import type { SpecialistChatCard as SpecialistChatCardType } from "../chatTypes";
import { useTheme } from "../ThemeContext";
import content from "../content";

const SPECIALIST_REPLIES = content.specialistChatCard.replies;

export function SpecialistChatCard({ card }: { card: SpecialistChatCardType }) {
  const { theme } = useTheme();
  const accentStyle = { backgroundImage: theme.gradient, color: theme.textColor };
  const [messages, setMessages] = useState([
    { role: "agent" as const, text: card.introMessage },
  ]);
  const [input, setInput] = useState("");
  const [replyIndex, setReplyIndex] = useState(0);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user" as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const reply = SPECIALIST_REPLIES[replyIndex % SPECIALIST_REPLIES.length];
    setReplyIndex((i) => i + 1);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "agent", text: reply }]);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-[16px] bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden max-w-[800px] w-full"
    >
      <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-gray-100">
        <div className="flex items-center gap-[10px]">
          <div className="relative shrink-0">
            <img src="https://i.pravatar.cc/80?img=33" alt={card.specialistName} className="size-[32px] rounded-full object-cover" />
            <div className="absolute bottom-0 right-0 size-[9px] bg-[#00c950] border-2 border-white rounded-full" />
          </div>
          <div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[14px] text-[#364153] leading-tight">{card.specialistName}</p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">{card.specialistRole}</p>
          </div>
        </div>
        <span className="px-[10px] py-[4px] bg-green-100 text-[#096] font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[11px] rounded-full">{content.specialistChatCard.liveLabel}</span>
      </div>

      <div className="px-[20px] py-[16px] flex flex-col gap-[12px] max-h-[240px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-[12px] px-[14px] py-[10px] ${
              msg.role === "user"
                ? ""
                : "bg-gray-50 border border-gray-100 text-[#364153]"
            }`} style={msg.role === "user" ? accentStyle : {}}>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[19px]">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-[20px] py-[14px] border-t border-gray-100">
        <div className="flex gap-[8px] items-center bg-gray-50 border border-gray-200 rounded-[10px] px-[14px] py-[8px]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={content.specialistChatCard.inputPlaceholder}
            className="flex-1 bg-transparent border-0 outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] placeholder:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="size-[28px] bg-[#8200db] disabled:bg-gray-200 rounded-full flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="size-[13px] text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
