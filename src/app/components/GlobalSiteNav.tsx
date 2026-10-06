import type { ReactNode } from "react";

type SiteSection = "demo" | "components";

export function GlobalSiteNav({
  section,
  onChange,
  trailing,
}: {
  section: SiteSection;
  onChange: (section: SiteSection) => void;
  trailing?: ReactNode;
}) {
  return (
    <header className="shrink-0 h-[48px] flex items-center justify-between gap-[16px] px-[clamp(12px,2vw,20px)] border-b border-[#d0d0d8] bg-[#e4e4ea]">
      <nav className="flex items-center gap-[2px] rounded-full bg-[#d8d8e0] p-[3px]">
        <button
          type="button"
          onClick={() => onChange("demo")}
          className={`rounded-full px-[14px] py-[6px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] transition-colors ${
            section === "demo"
              ? "bg-white text-[#1a1a2e] font-semibold shadow-sm"
              : "text-[#6b7280] font-medium hover:text-[#1a1a2e]"
          }`}
        >
          Demo
        </button>
        <button
          type="button"
          onClick={() => onChange("components")}
          className={`rounded-full px-[14px] py-[6px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] transition-colors ${
            section === "components"
              ? "bg-white text-[#1a1a2e] font-semibold shadow-sm"
              : "text-[#6b7280] font-medium hover:text-[#1a1a2e]"
          }`}
        >
          Components
        </button>
      </nav>
      {trailing ? <div className="min-w-0">{trailing}</div> : <span />}
    </header>
  );
}
