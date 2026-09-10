import { motion } from "motion/react";
import { X, CheckCircle2, Clock, TrendingUp, Award, BookOpen, Star, MessageSquare, Calendar } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  RadialBarChart, RadialBar,
} from "recharts";

const performanceHistory = [
  { label: "M1", score: 72 },
  { label: "M2", score: 85 },
  { label: "M3", score: 91 },
  { label: "Basics", score: 100 },
  { label: "Misc.", score: 100 },
  { label: "Adv. Bio 3", score: null },
];

const modules = [
  { name: "Advanced Biology instruction strategies for Module 3", status: "not_started" as const, dueDate: "May 9, 2026" },
  { name: "Common misconceptions in cellular biology", status: "completed" as const, score: "10/10", completedDate: "Apr 28, 2026" },
  { name: "Basics of biology mastery", status: "completed" as const, score: "10/10", completedDate: "Apr 14, 2026" },
  { name: "Intro to molecular biology", status: "completed" as const, score: "9/10", completedDate: "Mar 30, 2026" },
  { name: "Cell structure fundamentals", status: "completed" as const, score: "8/10", completedDate: "Mar 12, 2026" },
];

const engagementStats = [
  { label: "Assignments", value: "14/15", sub: "submitted", color: "text-[#8200db]", bg: "bg-purple-50" },
  { label: "Avg. Time", value: "3.2h", sub: "per module", color: "text-[#0369a1]", bg: "bg-blue-50" },
  { label: "Forum Posts", value: "12", sub: "this month", color: "text-[#096]", bg: "bg-green-50" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length && payload[0].value !== null) {
    return (
      <div className="bg-white border border-purple-100 rounded-[8px] px-[10px] py-[6px] shadow-md">
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[12px] text-[#364153]">{label}</p>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#8200db]">{payload[0].value}/10</p>
      </div>
    );
  }
  return null;
};

interface SophiaProfilePanelProps {
  onClose: () => void;
}

export function SophiaProfilePanel({ onClose }: SophiaProfilePanelProps) {
  const completedCount = modules.filter((m) => m.status === "completed").length;
  const completionPct = Math.round((completedCount / modules.length) * 100);
  const radialData = [
    { value: 100, fill: "#f3e8ff" },
    { value: completionPct, fill: "#8200db" },
  ];

  return (
    <div className="backdrop-blur-[12px] bg-white/80 rounded-[33px] flex flex-col shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] h-full min-h-0 overflow-hidden">
      {/* Header */}
      <div className="px-[24px] pt-[24px] pb-[20px] border-b border-white/20 flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)" }}
      >
        <div className="flex items-start justify-between mb-[16px]">
          <span className="px-[10px] py-[4px] bg-white/70 text-[#8200db] text-[11px] font-semibold font-['Plus_Jakarta_Sans',sans-serif] rounded-full border border-purple-200">
            BIOLOGY · FULL PROFILE
          </span>
          <button onClick={onClose} className="p-[8px] hover:bg-white/50 rounded-[8px] transition-colors">
            <X className="size-[18px] text-[#364153]" />
          </button>
        </div>

        <div className="flex items-center gap-[16px]">
          <div className="relative shrink-0">
            <img
              src="https://i.pravatar.cc/120?img=47"
              alt="Sophia"
              className="size-[64px] rounded-full object-cover ring-4 ring-white shadow-md"
            />
            <div className="absolute bottom-[1px] right-[1px] size-[16px] bg-[#00c950] border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[20px] text-[#1e1b4b] leading-tight">
              Sophia Chen
            </h2>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#8200db] font-medium mt-[2px]">
              Advanced Biology · Year 2
            </p>
            <div className="flex items-center gap-[6px] mt-[6px]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="size-[12px] fill-[#f59e0b] text-[#f59e0b]" />
              ))}
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-500 ml-[2px]">Top 5% of class</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-[8px] mt-[16px]">
          {engagementStats.map((s) => (
            <div key={s.label} className={`${s.bg} rounded-[10px] px-[10px] py-[8px]`}>
              <p className={`font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px] ${s.color}`}>{s.value}</p>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-gray-500 leading-[13px]">{s.label}<br />{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-[24px] py-[20px] flex flex-col gap-[20px]">

        {/* Progress ring + avg score */}
        <div className="grid grid-cols-2 gap-[12px]">
          <div className="bg-white border border-gray-100 rounded-[14px] p-[16px] flex flex-col items-center gap-[6px] shadow-sm">
            <div className="relative size-[72px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%"
                  startAngle={90} endAngle={-270} data={radialData} barSize={7}>
                  <RadialBar dataKey="value" cornerRadius={5} isAnimationActive={false} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[15px] text-[#8200db]">{completionPct}%</span>
              </div>
            </div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-500 text-center leading-[15px]">Module<br />Completion</p>
            <span className="text-[10px] font-semibold text-[#8200db] bg-purple-50 px-[8px] py-[2px] rounded-full">
              {completedCount}/{modules.length} done
            </span>
          </div>

          <div className="bg-white border border-gray-100 rounded-[14px] p-[16px] flex flex-col items-center gap-[6px] shadow-sm">
            <div className="flex items-end gap-[3px] mt-[6px]">
              <Award className="size-[20px] text-[#096] mb-[4px]" />
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[32px] text-[#364153] leading-none">9.4</span>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-gray-400 mb-[4px]">/10</span>
            </div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-500 text-center leading-[15px]">Average<br />Score</p>
            <span className="flex items-center gap-[3px] text-[10px] font-semibold text-[#096] bg-green-50 px-[8px] py-[2px] rounded-full">
              <TrendingUp className="size-[10px]" /> +18% vs class avg
            </span>
          </div>
        </div>

        {/* Score trend */}
        <div className="bg-white border border-gray-100 rounded-[14px] px-[16px] pt-[14px] pb-[10px] shadow-sm">
          <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[11px] text-gray-400 uppercase tracking-wider mb-[10px]">
            Score Trend
          </p>
          <div className="h-[90px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceHistory} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="sgPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8200db" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#8200db" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9ca3af", fontFamily: "Plus Jakarta Sans, sans-serif" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#8200db" strokeWidth={2}
                  fill="url(#sgPnl)" connectNulls={false}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (payload.score === null) return <g key={`d${cx}`} />;
                    return <circle key={`d${cx}`} cx={cx} cy={cy} r={4}
                      fill={payload.score >= 100 ? "#009966" : "#8200db"} stroke="white" strokeWidth={2} />;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module list */}
        <div>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[11px] text-gray-400 uppercase tracking-wider mb-[10px]">
            Module History
          </p>
          <div className="flex flex-col gap-[8px]">
            {modules.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.06 }}
                className={`rounded-[12px] border px-[14px] py-[11px] ${
                  mod.status === "not_started"
                    ? "bg-purple-50 border-purple-200"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-start gap-[10px]">
                  <div className={`mt-[1px] shrink-0 rounded-full size-[20px] flex items-center justify-center ${
                    mod.status === "completed" ? "bg-green-100" : "bg-purple-100"
                  }`}>
                    {mod.status === "completed"
                      ? <CheckCircle2 className="size-[12px] text-[#096]" />
                      : <Clock className="size-[12px] text-[#8200db]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[17px] font-medium ${
                      mod.status === "completed" ? "text-[#364153]" : "text-[#8200db]"
                    }`}>
                      {mod.name}
                    </p>
                    <div className="flex items-center gap-[6px] mt-[4px]">
                      {mod.status === "completed" ? (
                        <>
                          <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] text-[#096]">{mod.score}</span>
                          <span className="text-gray-300">·</span>
                          <span className="flex items-center gap-[3px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400">
                            <Calendar className="size-[9px]" />{mod.completedDate}
                          </span>
                        </>
                      ) : (
                        <span className="flex items-center gap-[3px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#8200db] font-medium">
                          <Calendar className="size-[9px]" />Due {mod.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                  {mod.status === "completed" ? (
                    <span className="shrink-0 px-[7px] py-[2px] bg-green-100 text-[#096] font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[10px] rounded-full">
                      Done
                    </span>
                  ) : (
                    <span className="shrink-0 px-[7px] py-[2px] bg-purple-100 text-[#8200db] font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[10px] rounded-full border border-purple-200">
                      Assigned
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Teacher note */}
        <div className="bg-amber-50 border border-amber-200 rounded-[12px] px-[14px] py-[12px] flex gap-[10px]">
          <MessageSquare className="size-[15px] text-amber-500 shrink-0 mt-[1px]" />
          <div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[11px] text-amber-700 mb-[3px]">Instructor Note</p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-amber-600 leading-[17px]">
              Sophia consistently exceeds expectations. Consider offering enrichment content or peer mentoring opportunities in Module 3.
            </p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-[24px] py-[16px] border-t border-white/20 flex gap-[10px] flex-shrink-0">
        <button className="flex-1 px-[16px] py-[10px] bg-[#8200db] text-white rounded-[10px] font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] hover:bg-[#6b00b8] transition-colors">
          View Full Report
        </button>
        <button className="px-[16px] py-[10px] border border-gray-200 text-[#364153] rounded-[10px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] hover:bg-gray-50 transition-colors">
          Message
        </button>
      </div>
    </div>
  );
}
