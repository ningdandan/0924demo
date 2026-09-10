import { motion } from "motion/react";
import { X, CheckCircle2, Clock, Calendar, MessageSquare } from "lucide-react";
import learnerSophia from "../../imports/students/learner-sophia.png";
import learnerNoah from "../../imports/students/learner-noah.png";
import learnerIsabella from "../../imports/students/learner-isabella.png";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { BTN_PRIMARY, BTN_PRIMARY_STYLE, BTN_SECONDARY } from "./cardStyles";
import content from "../content";

const lp = content.learnerProfile;

const STUDENT_PHOTOS: Record<string, string> = {
  "Sophia Patel":  learnerSophia,
  "Noah Kim":      learnerNoah,
  "Alex Thompson": learnerIsabella,
};

const LEARNER_DATA: Record<string, LearnerData> = Object.fromEntries(
  Object.entries(content.learners).map(([name, d]) => [
    name,
    { ...d, photo: STUDENT_PHOTOS[name] ?? "" },
  ])
);

// ── Types ─────────────────────────────────────────────────────────────────────

interface ModuleEntry {
  name: string;
  status: "completed" | "not_started";
  score?: string;
  completedDate?: string;
  dueDate?: string;
}

interface StatEntry {
  label: string; value: string; sub: string;
}

interface LearnerData {
  photo: string;
  subject: string;
  topPercent: string;
  stats: StatEntry[];
  avgScore: string;
  vsClass: string;
  performanceHistory: { label: string; score: number | null }[];
  modules: ModuleEntry[];
  note: string;
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length && payload[0].value !== null) {
    return (
      <div className="bg-white border border-gray-200 rounded-[8px] px-[10px] py-[6px] shadow-md">
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[12px] text-[#364153]">{label}</p>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-500">{payload[0].value}/10</p>
      </div>
    );
  }
  return null;
};

// ── Main panel ────────────────────────────────────────────────────────────────

interface LearnerProfilePanelProps {
  studentName: string;
  onClose: () => void;
}

export function LearnerProfilePanel({ studentName, onClose }: LearnerProfilePanelProps) {
  const d = LEARNER_DATA[studentName];
  if (!d) return null;

  const completedCount = d.modules.filter((m) => m.status === "completed").length;
  const completionPct = Math.round((completedCount / d.modules.length) * 100);
  const ringRadius = 28;
  const ringStroke = 6;

  const gradId = `sgPnl-${studentName.replace(/\s/g, "")}`;

  return (
    <div className="backdrop-blur-[12px] bg-white/80 rounded-[33px] flex flex-col shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] h-full min-h-0 overflow-hidden">
      {/* Header */}
      <div className="px-[24px] pt-[36px] pb-[20px] border-b border-gray-100 flex-shrink-0 bg-gray-50">
        <div className="flex items-start justify-between gap-[12px]">
          <div className="flex items-center gap-[16px] flex-1 min-w-0">
            <div className="relative shrink-0">
              <img src={d.photo} alt={studentName}
                className="size-[64px] rounded-full object-cover ring-4 ring-white shadow-md" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[20px] text-[#1e1b4b] leading-tight">
                {studentName}
              </h2>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-gray-500 mt-[2px]">{d.subject}</p>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 mt-[3px]">{d.topPercent}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-[8px] hover:bg-gray-100 rounded-[8px] transition-colors flex-shrink-0">
            <X className="w-[20px] h-[20px] text-[#364153]" />
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-[8px] mt-[16px]">
          {d.stats.map((s) => (
            <div key={s.label} className="bg-white rounded-[10px] px-[10px] py-[8px] border border-gray-100">
              <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px] text-[#364153]">{s.value}</p>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-gray-400 leading-[13px]">{s.label}<br />{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-[24px] py-[20px] flex flex-col gap-[20px]">

        {/* Ring + avg score */}
        <div className="grid grid-cols-2 gap-[12px]">
          <div className="bg-white border border-gray-100 rounded-[14px] p-[16px] flex flex-col items-center gap-[6px] shadow-sm">
            <div className="relative size-[72px]">
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={ringRadius} fill="none" stroke="#f3f4f6" strokeWidth={ringStroke} />
                <motion.circle
                  cx="36" cy="36" r={ringRadius} fill="none" stroke="#374151" strokeWidth={ringStroke}
                  strokeLinecap="round"
                  pathLength={1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: completionPct / 100 }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
                  transform="rotate(-90 36 36)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[15px] text-[#364153]">{completionPct}%</span>
              </div>
            </div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 text-center leading-[15px]">Module<br />Completion</p>
            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-[8px] py-[2px] rounded-full">
              {completedCount}/{d.modules.length} {lp.statusLabels.doneSuffix}
            </span>
          </div>

          <div className="bg-white border border-gray-100 rounded-[14px] p-[16px] flex flex-col items-center gap-[6px] shadow-sm">
            <div className="flex items-end gap-[3px] mt-[6px]">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[32px] text-[#364153] leading-none">{d.avgScore}</span>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-gray-400 mb-[4px]">/10</span>
            </div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 text-center leading-[15px]">Average<br />Score</p>
            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-[8px] py-[2px] rounded-full">
              {d.vsClass}
            </span>
          </div>
        </div>

        {/* Score trend */}
        <div className="bg-white border border-gray-100 rounded-[14px] px-[16px] pt-[14px] pb-[10px] shadow-sm">
          <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[11px] text-gray-400 uppercase tracking-wider mb-[10px]">{lp.labels.scoreTrend}</p>
          <div className="h-[90px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.performanceHistory} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9ca3af", fontFamily: "Plus Jakarta Sans, sans-serif" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#6b7280" strokeWidth={2}
                  fill={`url(#${gradId})`} connectNulls={false}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (payload.score === null) return <g key={`d${cx}`} />;
                    return <circle key={`d${cx}`} cx={cx} cy={cy} r={4} fill="#374151" stroke="white" strokeWidth={2} />;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module history */}
        <div>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[11px] text-gray-400 uppercase tracking-wider mb-[10px]">{lp.labels.moduleHistory}</p>
          <div className="flex flex-col gap-[8px]">
            {d.modules.map((mod, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.06 }}
                className="rounded-[12px] border border-gray-100 bg-white px-[14px] py-[11px]"
              >
                <div className="flex items-start gap-[10px]">
                  <div className="mt-[1px] shrink-0 rounded-full size-[20px] flex items-center justify-center bg-gray-100">
                    {mod.status === "completed"
                      ? <CheckCircle2 className="size-[12px] text-gray-500" />
                      : <Clock className="size-[12px] text-gray-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[17px] font-medium text-[#364153]">
                      {mod.name}
                    </p>
                    <div className="flex items-center gap-[6px] mt-[4px]">
                      {mod.status === "completed" ? (
                        <>
                          <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] text-[#364153]">{mod.score}</span>
                          <span className="text-gray-300">·</span>
                          <span className="flex items-center gap-[3px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">
                            <Calendar className="size-[9px]" />{mod.completedDate}
                          </span>
                        </>
                      ) : (
                        <span className="flex items-center gap-[3px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">
                          <Calendar className="size-[9px]" />{lp.statusLabels.duePrefix}{mod.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 px-[7px] py-[2px] bg-gray-100 text-gray-500 font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[10px] rounded-full">
                    {mod.status === "completed" ? lp.statusLabels.done : lp.statusLabels.assigned}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instructor note */}
        <div className="bg-gray-50 border border-gray-200 rounded-[12px] px-[14px] py-[12px] flex gap-[10px]">
          <MessageSquare className="size-[15px] text-gray-400 shrink-0 mt-[1px]" />
          <div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[11px] text-gray-500 mb-[3px]">{lp.labels.instructorNote}</p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-500 leading-[17px]">{d.note}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
    </div>
  );
}
