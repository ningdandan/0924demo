import { Home, Search } from "lucide-react";

export type ExperienceMode = "homepage" | "google";

interface ExperienceModeToggleProps {
  mode: ExperienceMode;
  onChange: (mode: ExperienceMode) => void;
}

/** Top-level demo tabs: homepage entry vs Google search entry. */
export function ExperienceModeToggle({ mode, onChange }: ExperienceModeToggleProps) {
  const options: {
    id: ExperienceMode;
    label: string;
    icon: typeof Home;
  }[] = [
    {
      id: "homepage",
      label: "Enter from homepage",
      icon: Home,
    },
    {
      id: "google",
      label: "Enter from Google search",
      icon: Search,
    },
  ];

  return (
    <div className="flex items-center gap-[6px] p-[5px] rounded-[14px] bg-[#e8e8ed] border border-[#d8d8e0]">
      {options.map(({ id, label, icon: Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex items-center gap-[8px] rounded-[10px] px-[16px] py-[9px] transition-all ${
              active
                ? "bg-white text-[#1a1a2e] shadow-[0px_1px_3px_rgba(0,0,0,0.08)]"
                : "text-[#6b7280] hover:text-[#374151]"
            }`}
          >
            <Icon className="size-[14px]" strokeWidth={2.2} />
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-semibold whitespace-nowrap">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
