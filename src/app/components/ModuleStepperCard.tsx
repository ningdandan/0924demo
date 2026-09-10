import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { ModuleStepperCard as ModuleStepperCardType } from "../chatTypes";
import { CARD_WRAP, CARD_DONE_WRAP, CARD_HEADER, CARD_TITLE, CARD_FOOTER, CHIP, BTN_PRIMARY, BTN_SECONDARY } from "./cardStyles";
import { useTheme } from "../ThemeContext";
import content from "../content";

const msc = content.moduleStepperCard;
const STEPS = msc.steps;

export function ModuleStepperCard({ card }: { card: ModuleStepperCardType }) {
  const { theme } = useTheme();
  const accentStyle = { backgroundImage: theme.gradient };
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) setActiveStep((s) => s + 1);
    else setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className={`mt-[16px] ${CARD_DONE_WRAP}`}>
        <div className={CARD_HEADER}>
          <h3 className={CARD_TITLE}>{card.title}</h3>
          <span className={CHIP.amber}>{msc.underReviewLabel}</span>
        </div>
        <div className="px-[24px] py-[20px] flex items-start gap-[12px]">
          <div className="size-[36px] rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <Loader2 className="size-[16px] text-amber-500 animate-spin" />
          </div>
          <div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[14px] text-[#364153]">{msc.submittedHeading}</p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-500 mt-[3px]">
              {msc.submittedBody}
            </p>
          </div>
        </div>
        <div className={CARD_FOOTER}>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">{msc.submittedFooter}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className={`mt-[16px] ${CARD_WRAP}`}>
      <div className={CARD_HEADER}>
        <h3 className={CARD_TITLE}>{card.title}</h3>
        <span className={CHIP.purple}>IN PROGRESS</span>
      </div>

      {/* Stepper */}
      <div className="px-[24px] py-[20px]">
        <div className="flex items-center gap-0 mb-[24px]">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-[6px] flex-shrink-0">
                <div className={`size-[28px] rounded-full flex items-center justify-center border-2 transition-all ${
                  i < activeStep ? "bg-[#096] border-[#096]" :
                  i === activeStep ? "bg-[#8200db] border-[#8200db]" :
                  "bg-white border-gray-200"
                }`}>
                  {i < activeStep
                    ? <CheckCircle2 className="size-[16px] text-white" />
                    : i === activeStep
                    ? <span className="text-white font-bold text-[11px]">{i + 1}</span>
                    : <Circle className="size-[12px] text-gray-300" />
                  }
                </div>
                <span className={`font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-center w-[60px] leading-[13px] ${
                  i === activeStep ? "text-[#8200db] font-semibold" : i < activeStep ? "text-[#096]" : "text-gray-400"
                }`}>{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] mb-[18px] mx-[4px] transition-all ${i < activeStep ? "bg-[#096]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-gray-50 border border-gray-100 rounded-[12px] px-[20px] py-[16px]">
          {activeStep === 0 && (
            <div className="flex flex-col gap-[12px]">
              <div className="flex flex-col gap-[4px]">
                <label className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[11px] text-gray-500 uppercase tracking-wider">{msc.step0.moduleTitleLabel}</label>
                <input defaultValue={msc.step0.moduleTitleDefault} className="px-[12px] py-[8px] bg-white border border-gray-200 rounded-[8px] text-[13px] font-['Plus_Jakarta_Sans',sans-serif] text-[#364153] focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div className="flex flex-col gap-[4px]">
                <label className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[11px] text-gray-500 uppercase tracking-wider">{msc.step0.courseLabel}</label>
                <input defaultValue={msc.step0.courseDefault} className="px-[12px] py-[8px] bg-white border border-gray-200 rounded-[8px] text-[13px] font-['Plus_Jakarta_Sans',sans-serif] text-[#364153] focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
            </div>
          )}
          {activeStep === 1 && (
            <div className="flex flex-col gap-[10px]">
              {msc.step1.contentItems.map((item, i) => (
                <div key={i} className="flex items-center gap-[10px] bg-white border border-gray-100 rounded-[8px] px-[12px] py-[10px]">
                  <CheckCircle2 className="size-[14px] text-[#096] shrink-0" />
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153]">{item}</span>
                </div>
              ))}
            </div>
          )}
          {activeStep === 2 && (
            <div className="flex flex-col gap-[8px]">
              <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-[#364153]">{msc.step2.heading}</p>
              {msc.step2.rows.map(({ key: k, value: v }) => (
                <div key={k} className="flex justify-between">
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-500">{k}</span>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium text-[#364153]">{v}</span>
                </div>
              ))}
            </div>
          )}
          {activeStep === 3 && (
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-gray-600">
              {msc.step3.description}
            </p>
          )}
        </div>
      </div>

      <div className={`${CARD_FOOTER} flex justify-between items-center`}>
        <button onClick={() => setActiveStep((s) => Math.max(0, s - 1))} disabled={activeStep === 0}
          className={`${BTN_SECONDARY} disabled:opacity-30 disabled:cursor-not-allowed`}>
          {msc.backButton}
        </button>
        <button onClick={handleNext} className={BTN_PRIMARY} style={accentStyle}>
          {activeStep === STEPS.length - 1 ? msc.submitButton : msc.nextButton}
        </button>
      </div>
    </motion.div>
  );
}
