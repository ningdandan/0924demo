import { motion } from "motion/react";
import { useState } from "react";
import { CheckCircle, Users, Send } from "lucide-react";
import type { AssignModuleCard as AssignModuleCardType } from "../chatTypes";
import { CARD_WRAP, CARD_DONE_WRAP, CARD_HEADER, CARD_TITLE, CARD_BODY, CARD_FOOTER, FOOTER_NOTE, FIELD_LABEL, FIELD_INPUT, FIELD_SELECT, CHIP, BTN_PRIMARY, BTN_SECONDARY } from "./cardStyles";
import { useTheme } from "../ThemeContext";
import content from "../content";

const amc = content.assignModuleCard;
const MODULE_OPTIONS = amc.moduleOptions;
const DEFAULT_RECIPIENTS = amc.defaultRecipients;

export function AssignModuleCard({ card }: { card: AssignModuleCardType }) {
  const { theme } = useTheme();
  const accentStyle = { backgroundImage: theme.gradient };
  const nextFriday = new Date();
  const d = (5 - nextFriday.getDay() + 7) % 7 || 7;
  nextFriday.setDate(nextFriday.getDate() + d);

  const [recipients, setRecipients] = useState(DEFAULT_RECIPIENTS);
  const [module, setModule] = useState(amc.defaultModule);
  const [dueDate, setDueDate] = useState(nextFriday.toISOString().split("T")[0]);
  const [isDone, setIsDone] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [messageText, setMessageText] = useState(amc.defaultMessage);

  const primaryBtn = card.buttons.find((b) => b.variant === "primary");
  const secondaryBtn = card.buttons.find((b) => b.variant === "secondary");

  if (isDone) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className={`mt-[16px] w-full ${CARD_DONE_WRAP}`}>
        <div className={CARD_HEADER}>
          <h3 className={CARD_TITLE}>{card.title}</h3>
          <span className={CHIP[card.doneStatusColor] ?? CHIP.green}>{card.doneStatusLabel}</span>
        </div>
        <div className={CARD_BODY}>
          {/* Success confirmation */}
          <div className="bg-green-50 border border-green-100 rounded-[10px] px-[12px] py-[10px] flex items-center gap-[10px]">
            <CheckCircle className="size-[18px] text-[#096] shrink-0" />
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-[#096]">{card.doneMessage}</p>
          </div>
          <div className="mt-[8px]" />
          {/* Message learners */}
          {messageSent ? (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
              className="bg-green-50 border border-green-100 rounded-[10px] px-[12px] py-[10px] flex items-center gap-[10px]">
              <CheckCircle className="size-[18px] text-[#096] shrink-0" />
              <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-[#096]">
                {amc.messageSentPrefix}{recipients}
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-[10px]">
              <label className={`${FIELD_LABEL} flex items-center gap-[6px]`}>
                <Send className="size-[13px]" /> {amc.messageLearnerLabel}
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={3}
                className="w-full px-[14px] py-[10px] bg-gray-50 border border-gray-200 rounded-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] focus:outline-none focus:ring-2 focus:ring-[#101C86]/20 resize-none"
              />
              <button
                onClick={() => setMessageSent(true)}
                disabled={!messageText.trim()}
                className={`w-full ${BTN_PRIMARY}`}
                style={accentStyle}
              >
                {amc.sendMessageButton}
              </button>
            </div>
          )}
        </div>
        <div className={CARD_FOOTER}>
          <p className={FOOTER_NOTE}>{card.doneFooterNote}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className={`mt-[16px] w-full ${CARD_WRAP}`}>
      <div className={CARD_HEADER}>
        <h3 className={CARD_TITLE}>{card.title}</h3>
        {card.statusLabel && <span className={CHIP[card.statusColor] ?? CHIP.gray}>{card.statusLabel}</span>}
      </div>

      <div className={CARD_BODY}>
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className={`${FIELD_LABEL} flex items-center gap-[6px]`}>
              <Users className="size-[14px]" /> {amc.recipientsLabel}
            </label>
            <input type="text" value={recipients} onChange={(e) => setRecipients(e.target.value)} className={FIELD_INPUT} />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className={FIELD_LABEL}>{amc.moduleLabel}</label>
            <select value={module} onChange={(e) => setModule(e.target.value)} className={FIELD_SELECT}>
              {MODULE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className={FIELD_LABEL}>{amc.dueDateLabel}</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={FIELD_INPUT} />
          </div>
        </div>
      </div>

      <div className={CARD_FOOTER}>
        <div className="flex gap-[12px]">
          {primaryBtn && (
            <button onClick={() => setIsDone(true)} disabled={!recipients.trim()}
              className={`flex-1 ${BTN_PRIMARY}`} style={accentStyle}>
              {primaryBtn.label}
            </button>
          )}
          {secondaryBtn && <button className={BTN_SECONDARY}>{secondaryBtn.label}</button>}
        </div>
        {card.footerNote && <p className={`mt-[10px] ${FOOTER_NOTE}`}>{card.footerNote}</p>}
      </div>
    </motion.div>
  );
}
