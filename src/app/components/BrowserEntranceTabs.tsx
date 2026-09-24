import { Home, Search } from "lucide-react";

export type EntranceTab = "homepage" | "google";

interface BrowserEntranceTabsProps {
  value: EntranceTab;
  onChange: (value: EntranceTab) => void;
}

/** Browser-chrome entrance tabs: homepage vs Google search. */
export function BrowserEntranceTabs({ value, onChange }: BrowserEntranceTabsProps) {
  const tabs: { id: EntranceTab; label: string; icon: typeof Home }[] = [
    { id: "homepage", label: "Homepage", icon: Home },
    { id: "google", label: "Google search", icon: Search },
  ];

  return (
    <div className="flex items-end gap-[2px] min-w-0 flex-1 overflow-hidden">
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex items-center gap-[6px] max-w-[160px] h-[28px] px-[10px] rounded-t-[8px] border border-b-0 transition-colors shrink min-w-0 ${
              active
                ? "bg-[#f0f0f4] border-[#d0d0d8] text-[#1a1a2e]"
                : "bg-[#d8d8e0]/70 border-transparent text-[#6b7280] hover:bg-[#dedee6]"
            }`}
          >
            <Icon className="size-[11px] shrink-0" strokeWidth={2.2} />
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold truncate">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
