import { motion } from "motion/react";
import { useState } from "react";
import { Users, Mail } from "lucide-react";
import type { SendNotificationCard as SendNotificationCardType } from "../chatTypes";
import { CARD_WRAP, CARD_DONE_WRAP, CARD_HEADER, CARD_TITLE, CARD_BODY, CARD_FOOTER, FOOTER_NOTE, FIELD_LABEL, FIELD_INPUT, FIELD_TEXTAREA, CHIP, BTN_PRIMARY, BTN_SECONDARY } from "./cardStyles";
import { useTheme } from "../ThemeContext";

const DEFAULT_RECIPIENTS = "Sarah Chen, Michael Rodriguez, Emma Thompson (12 learners)";
const DEFAULT_MESSAGE = "We've noticed you may be falling behind in this module. This is a gentle reminder to log in and complete the upcoming assignments. Reach out if you need any support!";

export function SendNotificationCard({ card }: { card: SendNotificationCardType }) {
  const { theme } = useTheme();
  const accentStyle = { backgroundImage: theme.gradient };
  const [recipients, setRecipients] = useState(DEFAULT_RECIPIENTS);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [isSent, setIsSent] = useState(false);

  const primaryBtn = card.buttons.find((b) => b.variant === "primary");
  const secondaryBtn = card.buttons.find((b) => b.variant === "secondary");

  if (isSent) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className={`mt-[16px] ${CARD_DONE_WRAP}`}>
        <div className={CARD_HEADER}>
          <h3 className={CARD_TITLE}>{card.title}</h3>
          <span className={CHIP[card.sentStatusColor] ?? CHIP.green}>{card.sentStatusLabel}</span>
        </div>
        <div className={CARD_BODY}>
          <div className="bg-green-50 border border-green-100 rounded-[10px] px-[12px] py-[8px] flex items-center gap-[8px]">
            <svg className="size-[16px] text-[#096] shrink-0" fill="none" viewBox="0 0 16 16">
              <path d="M13.3333 4L6 11.3333L2.66666 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#096]">{card.sentMessage}</p>
          </div>
        </div>
        <div className={CARD_FOOTER}>
          <p className={FOOTER_NOTE}>Just now</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className={`mt-[16px] ${CARD_WRAP}`}>
      <div className={CARD_HEADER}>
        <h3 className={CARD_TITLE}>{card.title}</h3>
        {card.statusLabel && <span className={CHIP[card.statusColor] ?? CHIP.blue}>{card.statusLabel}</span>}
      </div>

      <div className={CARD_BODY}>
        <div className="flex flex-col gap-[14px]">
          <div className="flex flex-col gap-[6px]">
            <label className={`${FIELD_LABEL} flex items-center gap-[6px]`}>
              <Users className="size-[14px]" /> Recipients
            </label>
            <input type="text" value={recipients} onChange={(e) => setRecipients(e.target.value)} className={FIELD_INPUT} />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className={`${FIELD_LABEL} flex items-center gap-[6px]`}>
              <Mail className="size-[14px]" /> Message
            </label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className={FIELD_TEXTAREA} />
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-[10px] p-[12px]">
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[11px] text-blue-700 uppercase tracking-wider mb-[6px]">Preview</p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[18px] text-gray-700">{message}</p>
          </div>
        </div>
      </div>

      <div className={CARD_FOOTER}>
        <div className="flex gap-[12px]">
          {secondaryBtn && <button className={BTN_SECONDARY}>{secondaryBtn.label}</button>}
          {primaryBtn && (
            <button onClick={() => setIsSent(true)} className={`flex-1 ${BTN_PRIMARY}`} style={accentStyle}>
              {primaryBtn.label}
            </button>
          )}
        </div>
        {card.footerNote && <p className={`mt-[10px] ${FOOTER_NOTE}`}>{card.footerNote}</p>}
      </div>
    </motion.div>
  );
}
