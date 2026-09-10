import { motion } from "motion/react";
import { useState } from "react";
import { Users, Mail } from "lucide-react";
import { useTokens } from "../TokensContext";

interface NotificationCardProps {
  onSend: () => void;
  onCancel?: () => void;
}

export function NotificationCard({ onSend, onCancel }: NotificationCardProps) {
  const { tokens } = useTokens();
  const t = tokens.notificationCard;

  const [recipients, setRecipients] = useState(t.defaultRecipients);
  const [message, setMessage] = useState(t.defaultMessage);
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    setIsSent(true);
    onSend();
  };

  if (isSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-[16px] bg-white border border-green-200 rounded-[16px] shadow-sm overflow-hidden max-w-[800px]"
      >
        <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-gray-200">
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] leading-[24px] text-[#364153]">
            {t.sentHeading}
          </h3>
          <span className="px-[10px] py-[4px] bg-green-100 text-[#096] font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[11px] rounded-full uppercase tracking-wider">
            {t.sentBadge}
          </span>
        </div>
        <div className="px-[24px] py-[16px]">
          <div className="bg-green-50 border border-green-100 rounded-[10px] px-[12px] py-[8px] flex items-center gap-[8px]">
            <svg className="size-[16px] text-[#096] shrink-0" fill="none" viewBox="0 0 16 16">
              <path d="M13.3333 4L6 11.3333L2.66666 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[20px] text-[#096]">
              {t.sentMessage}
            </p>
          </div>
        </div>
        <div className="px-[24px] py-[16px] border-t border-gray-200">
          <p className="text-[12px] text-gray-500 font-['Plus_Jakarta_Sans',sans-serif]">
            {t.sentFooterNote}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-[16px] bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden max-w-[800px]"
    >
      <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-gray-200">
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] leading-[24px] text-[#364153]">
          {t.heading}
        </h3>
        <span className="px-[10px] py-[4px] bg-blue-100 text-blue-600 font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[11px] rounded-full">
          {t.draftBadge}
        </span>
      </div>

      <div className="px-[24px] py-[16px]">
        <div className="flex flex-col gap-[14px]">
          <div className="flex flex-col gap-[6px]">
            <label className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[12px] text-gray-600 flex items-center gap-[6px]">
              <Users className="size-[14px]" />
              {t.recipientsLabel}
            </label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="w-full px-[14px] py-[10px] bg-gray-50 border border-gray-200 rounded-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t.recipientsPlaceholder}
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[12px] text-gray-600 flex items-center gap-[6px]">
              <Mail className="size-[14px]" />
              {t.messageLabel}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-[14px] py-[10px] bg-gray-50 border border-gray-200 rounded-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={t.messagePlaceholder}
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-[10px] p-[12px]">
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[11px] text-blue-700 uppercase tracking-wider mb-[6px]">
              {t.previewLabel}
            </p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[18px] text-gray-700">
              {message}
            </p>
          </div>
        </div>
      </div>

      <div className="px-[24px] py-[16px] border-t border-gray-200">
        <div className="flex gap-[12px]">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-[20px] py-[12px] bg-white hover:bg-gray-50 text-[#364153] border border-gray-300 font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[13px] rounded-[8px] transition-colors"
            >
              {t.cancelButton}
            </button>
          )}
          <button
            onClick={handleSend}
            className="flex-1 bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] px-[20px] py-[12px] rounded-[8px] transition-colors"
          >
            {t.sendButton}
          </button>
        </div>
        <p className="mt-[10px] text-[12px] text-gray-500 font-['Plus_Jakarta_Sans',sans-serif]">
          {t.footerNote}
        </p>
      </div>
    </motion.div>
  );
}
