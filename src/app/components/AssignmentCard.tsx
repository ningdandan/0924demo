import { motion } from "motion/react";
import { useState } from "react";
import { useTokens } from "../TokensContext";

interface AssignmentCardProps {
  onAssign: () => void;
  onCancel?: () => void;
}

export function AssignmentCard({ onAssign, onCancel }: AssignmentCardProps) {
  const { tokens } = useTokens();
  const t = tokens.assignmentCard;

  const nextFriday = new Date();
  const daysUntilFriday = (5 - nextFriday.getDay() + 7) % 7 || 7;
  nextFriday.setDate(nextFriday.getDate() + daysUntilFriday);
  const formattedDate = nextFriday.toISOString().split("T")[0];

  const [recipients, setRecipients] = useState(t.defaultRecipients);
  const [module, setModule] = useState(t.defaultModule);
  const [dueDate, setDueDate] = useState(formattedDate);

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
        <span className="px-[10px] py-[4px] bg-purple-100 text-[#8200db] font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[11px] rounded-full">
          {t.badge}
        </span>
      </div>

      <div className="px-[24px] py-[16px]">
        <div className="flex flex-col gap-[14px]">
          <div className="flex flex-col gap-[6px]">
            <label className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[12px] text-gray-600">
              {t.recipientsLabel}
            </label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="w-full px-[14px] py-[10px] bg-gray-50 border border-gray-200 rounded-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={t.recipientsPlaceholder}
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[12px] text-gray-600">
              {t.moduleLabel}
            </label>
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full px-[14px] py-[10px] bg-gray-50 border border-gray-200 rounded-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23364153%22%20d%3D%22M6%208L2%204h8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[center_right_14px] bg-no-repeat"
            >
              {t.moduleOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[12px] text-gray-600">
              {t.dueDateLabel}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-[14px] py-[10px] bg-gray-50 border border-gray-200 rounded-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="px-[24px] py-[16px] border-t border-gray-200">
        <div className="flex gap-[12px]">
          <button
            onClick={onAssign}
            className="flex-1 bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] px-[20px] py-[12px] rounded-[8px] transition-colors"
          >
            {t.assignButton}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-[20px] py-[12px] bg-white hover:bg-gray-50 text-[#364153] border border-gray-300 font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[13px] rounded-[8px] transition-colors"
            >
              {t.cancelButton}
            </button>
          )}
        </div>
        <p className="mt-[10px] text-[12px] text-gray-500 font-['Plus_Jakarta_Sans',sans-serif]">
          {t.footerNote}
        </p>
      </div>
    </motion.div>
  );
}
