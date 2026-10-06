import { useState, useRef, useEffect } from "react";
import { PhoneForwarded, Gift, Calendar, FileText, Bot, Mic, Sparkles, ArrowLeft } from "lucide-react";

type Message = {
  id: string;
  role: "customer" | "agent";
  name: string;
  avatar?: string;
  text: string;
  time: string;
};

type Chip = { id: string; icon: typeof PhoneForwarded; label: string };

const initialMessages: Message[] = [
  {
    id: "m1", role: "customer", name: "Marcus Webb", avatar: "MW",
    text: "Hi, I placed an order 6 days ago and it still hasn't shipped. I need it by Saturday — that's 2 days away.",
    time: "2:14 PM",
  },
  {
    id: "m2", role: "agent", name: "You",
    text: "Hi Marcus, I completely understand — that's a tight deadline and you deserved to be kept in the loop. Let me pull up your order right now.",
    time: "2:15 PM",
  },
  {
    id: "m3", role: "agent", name: "You",
    text: "I can see order #TRK-88432 is flagged for a warehouse hold due to a stock verification issue. I'm sorry you weren't notified — that shouldn't have happened.",
    time: "2:16 PM",
  },
  {
    id: "m4", role: "customer", name: "Marcus Webb", avatar: "MW",
    text: "A warehouse hold? No one told me anything about this. Will it still arrive before Saturday?",
    time: "2:17 PM",
  },
];

const defaultChips: Chip[] = [
  { id: "r1", icon: PhoneForwarded, label: "Release hold on #TRK-88432" },
  { id: "r2", icon: Gift, label: "Apply goodwill credit for missed update" },
  { id: "r3", icon: Calendar, label: "Call Marcus Fri with shipping update" },
  { id: "r4", icon: FileText, label: "Send express shipping options for Sat" },
];

const followUpFlows: Record<string, { agentReply: string; chips: Chip[] }> = {
  r1: {
    agentReply: "On it — I've escalated #TRK-88432 to fulfillment as a priority release. The hold should clear within the hour and you'll get a shipping confirmation by end of day.",
    chips: [
      { id: "f1", icon: Gift, label: "Apply goodwill credit" },
      { id: "f2", icon: Calendar, label: "Schedule Fri callback to confirm" },
      { id: "f3", icon: FileText, label: "Email tracking update to Marcus" },
    ],
  },
  r2: {
    agentReply: "A $20 goodwill credit has been applied to your account, Marcus. It'll show up within 24 hours. I sincerely apologize for the lack of communication.",
    chips: [
      { id: "f1", icon: PhoneForwarded, label: "Release hold on #TRK-88432" },
      { id: "f2", icon: Calendar, label: "Schedule Fri callback" },
      { id: "f3", icon: FileText, label: "Send shipping options for Sat" },
    ],
  },
  r3: {
    agentReply: "A callback is scheduled for Friday 9 AM — I'll personally call Marcus with a full shipping status update and next steps.",
    chips: [
      { id: "f1", icon: PhoneForwarded, label: "Release hold now" },
      { id: "f2", icon: Gift, label: "Apply goodwill credit" },
      { id: "f3", icon: FileText, label: "Send express options for Sat" },
    ],
  },
  r4: {
    agentReply: "I've sent Marcus the express shipping options that could still get the order to him before Saturday. He'll get an email in the next few minutes.",
    chips: [
      { id: "f1", icon: PhoneForwarded, label: "Release hold on #TRK-88432" },
      { id: "f2", icon: Gift, label: "Apply goodwill credit" },
      { id: "f3", icon: Calendar, label: "Schedule Fri callback" },
    ],
  },
};

export default function ChatDemo({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [chips, setChips] = useState<Chip[]>(defaultChips);
  const [chipsRefreshing, setChipsRefreshing] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, agentTyping]);

  const handleChipClick = (chip: Chip) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages(m => [...m, {
      id: `c-${Date.now()}`, role: "agent", name: "You",
      text: chip.label, time,
    }]);
    setChipsRefreshing(true);

    setTimeout(() => setAgentTyping(true), 400);

    setTimeout(() => {
      const flow = followUpFlows[chip.id] ?? followUpFlows.r1;
      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setAgentTyping(false);
      setMessages(m => [...m, {
        id: `a-${Date.now()}`, role: "agent", name: "You",
        text: flow.agentReply, time: replyTime,
      }]);
      setTimeout(() => {
        setChips(flow.chips);
        setChipsRefreshing(false);
      }, 300);
    }, 2200);
  };

  return (
    <div className="h-screen bg-[#F4F6F9] flex flex-col overflow-hidden" style={{ fontFamily: "'Geist', sans-serif" }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
            MW
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827] leading-none">Marcus Webb</p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5">Order #TRK-88432</p>
          </div>
        </div>
        <button onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[#6B7280] hover:text-[#374151] transition-colors"
          style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)" }}>
          <ArrowLeft size={11} />
          Specs
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === "agent" ? "flex-row-reverse" : ""}`}>
            {msg.role === "customer"
              ? <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {msg.avatar}
                </div>
              : <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                  <Bot size={13} className="text-slate-400" />
                </div>}
            <div className={`flex flex-col gap-1 max-w-[72%] ${msg.role === "agent" ? "items-end" : "items-start"}`}>
              <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed
                ${msg.role === "customer"
                  ? "bg-white text-[#111827] rounded-tl-sm shadow-sm"
                  : "bg-[#2563EB] text-white rounded-tr-sm"}`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-[#9CA3AF]">{msg.time}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {agentTyping && (
          <div className="flex gap-2.5 flex-row-reverse">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
              <Bot size={13} className="text-slate-400" />
            </div>
            <div className="bg-[#2563EB] rounded-2xl rounded-tr-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 150, 300].map((d, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce"
                  style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 pt-2 pb-3 shrink-0">
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3.5 shadow-sm">
          <span className="text-[#9CA3AF] text-lg leading-none shrink-0">+</span>
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type a reply…"
            className="flex-1 bg-transparent text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none"
          />
          <Mic size={15} className="text-[#9CA3AF] shrink-0" />
        </div>
      </div>

      {/* Chips */}
      <div className="px-4 pb-6 shrink-0 space-y-2">
        <div className="flex items-center gap-1.5">
          <Sparkles size={10} className="text-[#2563EB]" />
          <span className="text-[10px] font-mono font-medium text-[#2563EB] uppercase tracking-wide">AI Assist</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {chipsRefreshing
            ? [150, 185, 155, 120].map((w, i) => (
                <div key={i} className="flex-shrink-0 h-9 rounded-full bg-white overflow-hidden relative" style={{ width: w }}>
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]
                    bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
                </div>
              ))
            : chips.map(chip => {
                const Icon = chip.icon;
                return (
                  <button key={chip.id} onClick={() => handleChipClick(chip)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-medium
                      bg-white border-[#E5E7EB] text-[#374151] hover:bg-blue-50 hover:border-[#2563EB]/30 hover:text-[#2563EB]
                      active:scale-95 transition-all duration-150">
                    <Icon size={13} className="text-[#9CA3AF]" />
                    {chip.label}
                  </button>
                );
              })}
        </div>
      </div>
    </div>
  );
}
