import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, BookOpen, FileText, Send, Users, ChevronLeft, CheckCircle, Mail } from "lucide-react";
import content from "../content";
import { useDesignTokens } from "../DesignTokensContext";

const v6 = content.vignette6;

type Phase = "lock" | "summary" | "notify" | "sent";

function PhoneStatusBar() {
  return (
    <div className="flex items-center justify-between px-[20px] pt-[14px] pb-[6px] shrink-0">
      <span className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-white">9:41</span>
      <div className="w-[80px] h-[20px] bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-0" />
      <div className="flex items-center gap-[5px]">
        {/* signal bars */}
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <rect x="0" y="6" width="2.5" height="4" rx="1" fill="white"/>
          <rect x="3.5" y="4" width="2.5" height="6" rx="1" fill="white"/>
          <rect x="7" y="2" width="2.5" height="8" rx="1" fill="white"/>
          <rect x="10.5" y="0" width="2.5" height="10" rx="1" fill="white"/>
        </svg>
        {/* wifi */}
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M7 8.5a1 1 0 100-2 1 1 0 000 2z" fill="white"/>
          <path d="M4.5 6.2A3.5 3.5 0 017 5.1a3.5 3.5 0 012.5 1.1" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M2.2 4A6 6 0 017 2a6 6 0 014.8 2" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        {/* battery */}
        <div className="flex items-center gap-[1px]">
          <div className="w-[20px] h-[10px] rounded-[3px] border border-white/60 p-[1.5px]">
            <div className="w-[70%] h-full bg-white rounded-[1.5px]" />
          </div>
          <div className="w-[1.5px] h-[4px] bg-white/60 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function PhoneHomeBar() {
  return (
    <div className="flex justify-center pb-[8px] pt-[4px] shrink-0">
      <div className="w-[100px] h-[4px] bg-white/30 rounded-full" />
    </div>
  );
}

// Lock screen
function LockScreen({ onTap }: { onTap: () => void }) {
  const { dt } = useDesignTokens();
  return (
    <div className="flex flex-col h-full" style={{ background: dt.gradients.phone.lock }}>
      <PhoneStatusBar />

      {/* Time */}
      <div className="flex flex-col items-center mt-[30px] mb-[24px]">
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-light text-[64px] text-white leading-none tracking-[-2px]">9:41</p>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-white/70 mt-[4px]">{v6.lockScreen.date}</p>
      </div>

      {/* Push notification */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.5 }}
        className="mx-[14px]"
      >
        <button
          onClick={onTap}
          className="w-full text-left bg-white/20 backdrop-blur-md rounded-[18px] px-[16px] py-[14px] border border-white/20 shadow-lg active:scale-[0.98] transition-transform"
        >
          <div className="flex items-start gap-[10px]">
            <div className="size-[36px] rounded-[10px] bg-[#8200db] flex items-center justify-center shrink-0">
              <BookOpen className="size-[18px] text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-[2px]">
                <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[12px] text-white">{v6.brandName}</p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-white/50">now</p>
              </div>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-white leading-[17px]">
                {v6.lockScreen.notificationTitle}
              </p>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-white/75 leading-[16px] mt-[2px]">
                {v6.lockScreen.notificationBody}
              </p>
            </div>
          </div>
        </button>
        <p className="text-center font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-white/40 mt-[12px]">
          {v6.lockScreen.tapHint}
        </p>
      </motion.div>

      <div className="flex-1" />
      <PhoneHomeBar />
    </div>
  );
}

// Summary + action tiles
function SummaryScreen({ onNotifyTap }: { onNotifyTap: () => void }) {
  const { dt } = useDesignTokens();
  return (
    <div className="flex flex-col h-full bg-[#f5f5f7]">
      <div style={{ background: dt.gradients.phone.header }}>
        <PhoneStatusBar />
        <div className="px-[18px] pb-[18px] pt-[4px]">
          <div className="flex items-center gap-[8px] mb-[4px]">
            <div className="size-[28px] rounded-[8px] bg-white/20 flex items-center justify-center">
              <BookOpen className="size-[14px] text-white" />
            </div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[14px] text-white">{v6.brandName}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[14px] py-[16px] flex flex-col gap-[14px]">
        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-[16px] p-[16px] shadow-sm border border-gray-100"
        >
          <div className="flex items-start gap-[10px] mb-[10px]">
            <div className="size-[40px] rounded-[12px] bg-purple-100 flex items-center justify-center shrink-0">
              <BookOpen className="size-[20px] text-[#8200db]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[6px]">
                <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[14px] text-[#364153] leading-tight">{v6.moduleName}</p>
              </div>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 mt-[1px]">{v6.moduleSubtitle}</p>
            </div>
            <span className="px-[8px] py-[3px] bg-green-100 text-[#096] font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[10px] rounded-full shrink-0">{v6.liveLabel}</span>
          </div>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-500 leading-[17px]">
            {v6.summaryScreen.moduleDescription}
          </p>
        </motion.div>

        {/* Action tiles */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-col gap-[8px]"
        >
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-[2px]">
            {v6.summaryScreen.actionsHeading}
          </p>

          {[
            { icon: BookOpen,   ...v6.summaryScreen.actions[0], onTap: undefined         },
            { icon: Bell,       ...v6.summaryScreen.actions[1], onTap: onNotifyTap       },
            { icon: FileText,   ...v6.summaryScreen.actions[2], onTap: undefined         },
          ].map(({ icon: Icon, label, desc, suggested, onTap }) => (
            <button
              key={label}
              onClick={onTap}
              className={`flex items-center gap-[12px] w-full text-left rounded-[14px] border px-[14px] py-[12px] transition-all active:scale-[0.98] ${
                suggested ? "bg-purple-50 border-purple-200" : "bg-white border-gray-100"
              }`}
            >
              <div className={`size-[36px] rounded-[10px] flex items-center justify-center shrink-0 ${suggested ? "bg-purple-100" : "bg-gray-100"}`}>
                <Icon className={`size-[17px] ${suggested ? "text-[#8200db]" : "text-gray-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] ${suggested ? "text-[#8200db]" : "text-[#364153]"}`}>{label}</p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 mt-[1px]">{desc}</p>
              </div>
              {suggested && (
                <span className="px-[7px] py-[2px] bg-[#8200db] text-white font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[9px] rounded-full shrink-0">
                  {v6.suggestedLabel}
                </span>
              )}
            </button>
          ))}
        </motion.div>
      </div>

      <PhoneHomeBar />
    </div>
  );
}

// Notify screen
function NotifyScreen({ onSend }: { onSend: () => void }) {
  const { dt } = useDesignTokens();
  const [message, setMessage] = useState(v6.notifyScreen.defaultMessage);

  return (
    <div className="flex flex-col h-full bg-[#f5f5f7]">
      <div style={{ background: dt.gradients.phone.header }}>
        <PhoneStatusBar />
        <div className="px-[18px] pb-[14px] pt-[4px] flex items-center gap-[10px]">
          <div className="size-[28px] rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft className="size-[16px] text-white" />
          </div>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[15px] text-white flex-1">{v6.notifyScreen.title}</p>
          <span className="px-[8px] py-[3px] bg-blue-400/30 text-white font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-semibold rounded-full">{v6.notifyScreen.draftLabel}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[14px] py-[14px] flex flex-col gap-[12px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-[12px]"
        >
          {/* Recipients */}
          <div className="bg-white rounded-[14px] border border-gray-100 p-[14px]">
            <div className="flex items-center gap-[8px] mb-[8px]">
              <Users className="size-[14px] text-[#8200db]" />
              <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[12px] text-gray-500 uppercase tracking-wider">{v6.notifyScreen.recipientsLabel}</p>
            </div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153]">{v6.notifyScreen.recipientsValue}</p>
            <div className="flex -space-x-[6px] mt-[8px]">
              {[47, 11, 48, 15, 56].map((img) => (
                <img key={img} src={`https://i.pravatar.cc/40?img=${img}`} className="size-[24px] rounded-full ring-2 ring-white object-cover" alt="" />
              ))}
              <div className="size-[24px] rounded-full ring-2 ring-white bg-purple-100 flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#8200db]">+19</span>
              </div>
            </div>
          </div>

          {/* Channel */}
          <div className="bg-white rounded-[14px] border border-gray-100 p-[14px]">
            <div className="flex items-center gap-[8px] mb-[8px]">
              <Mail className="size-[14px] text-[#8200db]" />
              <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[12px] text-gray-500 uppercase tracking-wider">{v6.notifyScreen.channelLabel}</p>
            </div>
            <div className="flex gap-[6px]">
              {v6.notifyScreen.channels.map((ch) => (
                <span key={ch} className="px-[10px] py-[4px] bg-purple-50 border border-purple-200 rounded-full font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#8200db] font-medium">
                  {ch}
                </span>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-[14px] border border-gray-100 p-[14px]">
            <div className="flex items-center gap-[8px] mb-[8px]">
              <Send className="size-[14px] text-[#8200db]" />
              <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[12px] text-gray-500 uppercase tracking-wider">{v6.notifyScreen.messageLabel}</p>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full text-[13px] font-['Plus_Jakarta_Sans',sans-serif] text-[#364153] bg-gray-50 border border-gray-100 rounded-[10px] px-[12px] py-[10px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 leading-[19px]"
            />
          </div>
        </motion.div>
      </div>

      {/* Send button */}
      <div className="px-[14px] pb-[8px] shrink-0">
        <button
          onClick={onSend}
          className="w-full py-[14px] rounded-[14px] font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[15px] text-white transition-all active:scale-[0.98]"
          style={{ background: dt.gradients.button.send }}
        >
          {v6.notifyScreen.sendButton}
        </button>
      </div>
      <PhoneHomeBar />
    </div>
  );
}

// Success screen
function SuccessScreen() {
  const { dt } = useDesignTokens();
  return (
    <div className="flex flex-col h-full bg-[#f5f5f7]">
      <div style={{ background: dt.gradients.phone.success }}>
        <PhoneStatusBar />
        <div className="px-[18px] pb-[14px] pt-[4px]">
          <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[15px] text-white">{v6.successScreen.headerTitle}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-[24px] gap-[16px]">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 14, stiffness: 200 }}
          className="size-[72px] rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center"
        >
          <CheckCircle className="size-[36px] text-[#096]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-center"
        >
          <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[20px] text-[#364153]">{v6.successScreen.heading}</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-gray-500 mt-[6px] leading-[18px]">
            {v6.successScreen.body}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="w-full bg-white rounded-[14px] border border-gray-100 p-[14px] flex flex-col gap-[8px]"
        >
          {v6.successScreen.summary.map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-400">{label}</span>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium text-[#364153]">{value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <PhoneHomeBar />
    </div>
  );
}

export function Vignette6Screen() {
  const { dt } = useDesignTokens();
  const [phase, setPhase] = useState<Phase>("lock");

  return (
    // Full area black backdrop (fills the main column, not fixed, so nav bar stays on top)
    <div className="h-screen w-full bg-black flex items-center justify-center">

      {/* Phone frame */}
      <div className="relative" style={{ width: 375, height: 780 }}>
        {/* Outer shell */}
        <div
          className="absolute inset-0 rounded-[52px]"
          style={{ background: dt.gradients.phone.frame, padding: 3, boxShadow: dt.shadows.phoneDrop }}
        >
          {/* Side buttons */}
          <div className="absolute -left-[3px] top-[120px] w-[3px] h-[32px] bg-[#333] rounded-l-[2px]" />
          <div className="absolute -left-[3px] top-[170px] w-[3px] h-[56px] bg-[#333] rounded-l-[2px]" />
          <div className="absolute -left-[3px] top-[240px] w-[3px] h-[56px] bg-[#333] rounded-l-[2px]" />
          <div className="absolute -right-[3px] top-[160px] w-[3px] h-[72px] bg-[#333] rounded-r-[2px]" />

          {/* Screen */}
          <div className="w-full h-full rounded-[50px] overflow-hidden relative bg-black">
            {/* Dynamic island */}
            <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[110px] h-[34px] bg-black rounded-full z-20" />

            <AnimatePresence mode="wait">
              {phase === "lock" && (
                <motion.div key="lock" className="absolute inset-0"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <LockScreen onTap={() => setPhase("summary")} />
                </motion.div>
              )}
              {phase === "summary" && (
                <motion.div key="summary" className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <SummaryScreen onNotifyTap={() => setPhase("notify")} />
                </motion.div>
              )}
              {phase === "notify" && (
                <motion.div key="notify" className="absolute inset-0"
                  initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.3 }}>
                  <NotifyScreen onSend={() => setPhase("sent")} />
                </motion.div>
              )}
              {phase === "sent" && (
                <motion.div key="sent" className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <SuccessScreen />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
