import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import type { LearnerProgressCard as LearnerProgressCardType } from "../chatTypes";
import { CARD_WRAP, CARD_HEADER, CARD_TITLE, CARD_FOOTER, FOOTER_NOTE, CHIP, BTN_PRIMARY } from "./cardStyles";
import { useTheme } from "../ThemeContext";
import content from "../content";

const lpc = content.learnerProgressCard;
const performanceHistory = lpc.performanceHistory;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length && payload[0].value !== null) {
    return (
      <div className="bg-white border border-gray-200 rounded-[8px] px-[10px] py-[6px] shadow-md">
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[12px] text-[#364153]">{label}</p>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-500">{payload[0].value}/10</p>
      </div>
    );
  }
  return null;
};

export function LearnerProgressCard({ card, onViewDetails }: { card: LearnerProgressCardType; onViewDetails?: () => void }) {
  const { theme } = useTheme();
  const accentStyle = { backgroundImage: theme.gradient };
  const completedModules = card.modules.filter((m) => m.status === "completed");
  const totalModules = card.modules.length;
  const completionPct = Math.round((completedModules.length / totalModules) * 100);

  const radius = 22;
  const stroke = 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-[16px] w-full ${CARD_WRAP}`}
    >
      {/* Header */}
      <div className={CARD_HEADER}>
        <h3 className={CARD_TITLE}>{card.title}</h3>
        {card.statusLabel && <span className={CHIP[card.statusColor] ?? CHIP.gray}>{card.statusLabel}</span>}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        {/* Donut */}
        <div className="flex flex-col items-center justify-center py-[12px] gap-[4px]">
          <div className="relative w-[56px] h-[56px]">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r={radius} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
              <motion.circle
                cx="28" cy="28" r={radius} fill="none" stroke="#374151" strokeWidth={stroke}
                strokeLinecap="round"
                pathLength={1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: completionPct / 100 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                transform="rotate(-90 28 28)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[12px] text-[#364153]">
                {completionPct}%
              </span>
            </div>
          </div>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-gray-400 text-center leading-[14px]">
            Module<br />Completion
          </p>
        </div>

        {/* Avg score */}
        <div className="flex flex-col items-center justify-center py-[12px] gap-[4px]">
          <div className="flex items-end gap-[2px]">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[20px] leading-none text-[#364153]">{lpc.avgScoreValue}</span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 mb-[1px]">/10</span>
          </div>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-gray-400 text-center leading-[14px]">
            Avg. Score<br />Completed
          </p>
        </div>

        {/* Modules done */}
        <div className="flex flex-col items-center justify-center py-[12px] gap-[4px]">
          <div className="flex items-end gap-[2px]">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[20px] leading-none text-[#364153]">
              {completedModules.length}
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 mb-[1px]">/ {totalModules}</span>
          </div>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-gray-400 text-center leading-[14px]">
            Modules<br />Completed
          </p>
        </div>
      </div>

      {/* Score trend */}
      <div className="px-[16px] pt-[10px] pb-[10px]">
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[10px] text-gray-400 uppercase tracking-wider mb-[6px]">
          {lpc.scoreTrendLabel}
        </p>
        <div className="h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceHistory} margin={{ top: 2, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b7280" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 8, fill: "#9ca3af", fontFamily: "Plus Jakarta Sans, sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 8, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="score" stroke="#6b7280" strokeWidth={2}
                fill="url(#scoreGrad)" connectNulls={false}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.score === null) return <g key={`dot-${cx}`} />;
                  return <circle key={`dot-${cx}`} cx={cx} cy={cy} r={3} fill="#374151" stroke="white" strokeWidth={2} />;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CTA */}
      <div className="px-[16px] pb-[14px]">
        <button onClick={onViewDetails} className={`w-full ${BTN_PRIMARY}`} style={accentStyle}>
          {lpc.viewFullProfileButton}
        </button>
      </div>

      {card.footerNote && (
        <div className={CARD_FOOTER}>
          <p className={FOOTER_NOTE}>{card.footerNote}</p>
        </div>
      )}
    </motion.div>
  );
}
