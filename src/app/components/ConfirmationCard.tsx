import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { useTokens } from "../TokensContext";

interface ConfirmationCardProps {
  onConfirm: () => void;
  onDecline?: () => void;
}

export function ConfirmationCard({ onConfirm, onDecline }: ConfirmationCardProps) {
  const { tokens } = useTokens();
  const t = tokens.confirmationCard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-[16px] bg-white border border-green-200 rounded-[16px] shadow-sm overflow-hidden max-w-[800px]"
    >
      <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-gray-200">
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] leading-[24px] text-[#364153]">
          {t.heading}
        </h3>
        <span className="px-[10px] py-[4px] bg-green-100 text-[#096] font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[11px] rounded-full uppercase tracking-wider">
          {t.badge}
        </span>
      </div>

      <div className="px-[24px] py-[16px]">
        <div className="flex flex-col gap-[8px]">
          <div className="bg-green-50 border border-green-100 rounded-[10px] px-[12px] py-[8px] flex items-center gap-[8px]">
            <CheckCircle className="size-[16px] text-[#096] shrink-0" />
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[20px] text-[#096]">
              {t.successMessage}
            </p>
          </div>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[20px] text-gray-500">
            {t.description}
          </p>
        </div>
      </div>

      <div className="px-[24px] py-[16px] border-t border-gray-200">
        <div className="flex gap-[12px]">
          {onDecline && (
            <button
              onClick={onDecline}
              className="flex-1 px-[20px] py-[12px] bg-white hover:bg-gray-50 text-[#364153] border border-gray-300 font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[13px] rounded-[8px] transition-colors"
            >
              {t.declineLabel}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] px-[20px] py-[12px] rounded-[8px] transition-colors"
          >
            {t.confirmLabel}
          </button>
        </div>
        <p className="mt-[10px] text-[12px] text-gray-500 font-['Plus_Jakarta_Sans',sans-serif]">
          {t.footerNote}
        </p>
      </div>
    </motion.div>
  );
}
