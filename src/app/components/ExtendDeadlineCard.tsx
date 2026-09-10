import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, CheckCircle } from "lucide-react";
import type { ExtendDeadlineCard as ExtendDeadlineCardType } from "../chatTypes";
import { CARD_WRAP, CARD_DONE_WRAP, CARD_HEADER, CARD_TITLE, CARD_BODY, CARD_FOOTER, FOOTER_NOTE, FIELD_LABEL, CHIP, BTN_PRIMARY, BTN_SECONDARY } from "./cardStyles";
import { useTheme } from "../ThemeContext";
import content from "../content";

const edc = content.extendDeadlineCard;

export function ExtendDeadlineCard({ card }: { card: ExtendDeadlineCardType }) {
  const { theme } = useTheme();
  const accentStyle = { backgroundImage: theme.gradient };
  const [newDate, setNewDate] = useState(card.suggestedDeadline);
  const [isDone, setIsDone] = useState(false);

  if (isDone) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className={`mt-[16px] ${CARD_DONE_WRAP}`}>
        <div className={CARD_HEADER}>
          <h3 className={CARD_TITLE}>{card.title}</h3>
          <span className={CHIP.green}>{edc.updatedLabel}</span>
        </div>
        <div className={CARD_BODY + " flex items-start gap-[12px]"}>
          <CheckCircle className="size-[18px] text-[#096] shrink-0 mt-[1px]" />
          <div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[14px] text-[#096]">{edc.deadlineUpdatedHeading}</p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-500 mt-[2px]">
              "{card.assignment}" deadline updated to <span className="font-semibold text-[#364153]">{newDate}</span>{edc.deadlineUpdatedBodySuffix}
            </p>
          </div>
        </div>
        <div className={CARD_FOOTER}>
          <p className={FOOTER_NOTE}>{edc.footerJustNow}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className={`mt-[16px] ${CARD_WRAP}`}>
      <div className={CARD_HEADER}>
        <h3 className={CARD_TITLE}>{card.title}</h3>
        <span className={CHIP.blue}>REVIEW & CONFIRM</span>
      </div>

      <div className={CARD_BODY + " flex flex-col gap-[14px]"}>
        <div className="flex flex-col gap-[4px]">
          <label className={FIELD_LABEL}>{edc.assignmentLabel}</label>
          <div className="px-[14px] py-[10px] bg-gray-50 border border-gray-200 rounded-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153]">
            {card.assignment}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[12px]">
          <div className="flex flex-col gap-[4px]">
            <label className={`${FIELD_LABEL} flex items-center gap-[5px]`}>
              <Calendar className="size-[12px]" /> {edc.currentDeadlineLabel}
            </label>
            <div className="px-[14px] py-[10px] bg-gray-50 border border-gray-200 rounded-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-gray-400 line-through">
              {card.currentDeadline}
            </div>
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className={`${FIELD_LABEL} flex items-center gap-[5px]`}>
              <Calendar className="size-[12px]" /> {edc.newDeadlineLabel}
            </label>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
              className="px-[14px] py-[10px] bg-blue-50 border border-blue-200 rounded-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-[10px] px-[12px] py-[10px]">
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-amber-700">
            {edc.warningText}
          </p>
        </div>
      </div>

      <div className={`${CARD_FOOTER} flex gap-[10px]`}>
        <button className={BTN_SECONDARY}>{edc.cancelButton}</button>
        <button onClick={() => setIsDone(true)} className={`flex-1 ${BTN_PRIMARY}`} style={accentStyle}>
          {edc.confirmButton}
        </button>
      </div>
    </motion.div>
  );
}
