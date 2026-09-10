import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, Star } from "lucide-react";
import type { FeedbackFormCard as FeedbackFormCardType } from "../chatTypes";
import { CARD_WRAP, CARD_DONE_WRAP, CARD_HEADER, CARD_TITLE, CARD_BODY, CARD_FOOTER, FOOTER_NOTE, FIELD_LABEL, FIELD_TEXTAREA, CHIP, BTN_PRIMARY, BTN_SECONDARY } from "./cardStyles";
import { useTheme } from "../ThemeContext";
import content from "../content";

const ffc = content.feedbackFormCard;

export function FeedbackFormCard({ card }: { card: FeedbackFormCardType }) {
  const { theme } = useTheme();
  const accentStyle = { backgroundImage: theme.gradient };

  const [rating, setRating] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [solved, setSolved] = useState<"yes" | "no" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`mt-[16px] w-full ${CARD_DONE_WRAP}`}
      >
        <div className={CARD_HEADER}>
          <h3 className={CARD_TITLE}>{card.title}</h3>
          <span className={CHIP.green}>{ffc.submittedChipLabel}</span>
        </div>
        <div className={`${CARD_BODY} flex items-center gap-[10px]`}>
          <CheckCircle className="size-[18px] text-[#096] shrink-0" />
          <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-[#096]">
            {ffc.submittedMessage}
          </p>
        </div>
        <div className={CARD_FOOTER}>
          <p className={FOOTER_NOTE}>{ffc.submittedFooter}</p>
        </div>
      </motion.div>
    );
  }

  const displayRating = hovered ?? rating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-[16px] w-full ${CARD_WRAP}`}
    >
      <div className={CARD_HEADER}>
        <h3 className={CARD_TITLE}>{card.title}</h3>
        <span className={CHIP.gray}>FEEDBACK</span>
      </div>

      <div className={`${CARD_BODY} flex flex-col gap-[16px]`}>
        {/* Overall rating */}
        <div className="flex flex-col gap-[8px]">
          <label className={FIELD_LABEL}>{ffc.ratingLabel}</label>
          <div className="flex gap-[6px]">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setRating(n)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className="size-[24px] transition-colors"
                  fill={displayRating && n <= displayRating ? "#f59e0b" : "none"}
                  stroke={displayRating && n <= displayRating ? "#f59e0b" : "#d1d5db"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Solved? */}
        <div className="flex flex-col gap-[8px]">
          <label className={FIELD_LABEL}>{ffc.solvedLabel}</label>
          <div className="flex gap-[8px]">
            {(["yes", "no"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setSolved(v)}
                className={`px-[16px] py-[8px] rounded-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] border transition-colors ${
                  solved === v
                    ? "border-[#A3D9F6] bg-[#f0f9ff] text-[#1e1b4b] font-semibold"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {v === "yes" ? ffc.solvedYesLabel : ffc.solvedNoLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="flex flex-col gap-[6px]">
          <label className={FIELD_LABEL}>{ffc.commentLabel} <span className="text-gray-400 font-normal">{ffc.commentOptional}</span></label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder={ffc.commentPlaceholder}
            className={FIELD_TEXTAREA}
          />
        </div>
      </div>

      <div className={CARD_FOOTER}>
        <div className="flex gap-[12px]">
          <button
            onClick={() => setSubmitted(true)}
            disabled={rating === null || solved === null}
            className={`flex-1 ${BTN_PRIMARY}`}
            style={accentStyle}
          >
            {ffc.submitButton}
          </button>
          <button onClick={() => setSubmitted(true)} className={BTN_SECONDARY}>
            {ffc.skipButton}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
