import { Building2, Search, MessageSquare } from "lucide-react";

export type MaturityMode = "current" | "search-enhanced" | "conversational";

interface MaturityToggleProps {
  mode: MaturityMode;
  onChange: (mode: MaturityMode) => void;
  /** Vertical rail on the left of the stage. */
  orientation?: "horizontal" | "vertical";
}

/** Top-level maturity spectrum tabs. */
export function MaturityToggle({
  mode,
  onChange,
  orientation = "horizontal",
}: MaturityToggleProps) {
  const options: {
    id: MaturityMode;
    label: string;
    icon: typeof Building2;
  }[] = [
    {
      id: "current",
      label: "Current contact center",
      icon: Building2,
    },
    {
      id: "search-enhanced",
      label: "Search enhanced",
      icon: Search,
    },
    {
      id: "conversational",
      label: "Fully conversational",
      icon: MessageSquare,
    },
  ];

  const vertical = orientation === "vertical";

  return (
    <div
      className={`flex rounded-[14px] bg-[#e8e8ed] border border-[#d8d8e0] shrink-0 ${
        vertical
          ? "flex-col items-stretch gap-[4px] p-[5px] w-full"
          : "flex-row items-center gap-[4px] p-[4px] sm:gap-[6px] sm:p-[5px]"
      }`}
    >
      {options.map(({ id, label, icon: Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex items-center gap-[8px] rounded-[10px] transition-all text-left ${
              vertical
                ? "w-full px-[12px] py-[10px]"
                : "px-[10px] sm:px-[16px] py-[8px] sm:py-[9px]"
            } ${
              active
                ? "bg-white text-[#1a1a2e] shadow-[0px_1px_3px_rgba(0,0,0,0.08)]"
                : "text-[#6b7280] hover:text-[#374151]"
            }`}
          >
            <Icon className="size-[14px] shrink-0" strokeWidth={2.2} />
            <span
              className={`font-['Plus_Jakarta_Sans',sans-serif] font-semibold ${
                vertical
                  ? "text-[12px] leading-[16px] whitespace-normal"
                  : "text-[12px] sm:text-[13px] whitespace-nowrap"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
