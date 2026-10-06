import { useSkin, type CompanySkinId } from "../SkinContext";
import { COMPANY_SKINS } from "../skins";

const SKIN_FILL: Record<CompanySkinId, string> = {
  default: "#5B5FC7",
  "disney-plus": "#0040E5",
  southwest: "#304CB2",
};

export function CompanySkins() {
  const { skinId, setSkinId } = useSkin();

  return (
    <div className="shrink-0 rounded-[14px] bg-[#e8e8ed] border border-[#d8d8e0] px-[10px] py-[12px]">
      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280] mb-[8px] px-[4px]">
        Company skins
      </p>
      <div className="flex flex-wrap gap-[6px]">
        {COMPANY_SKINS.map((skin) => {
          const on = skinId === skin.id;
          const fill = SKIN_FILL[skin.id as CompanySkinId];
          return (
            <button
              key={skin.id}
              type="button"
              title={skin.hint}
              onClick={() => setSkinId(skin.id as CompanySkinId)}
              className={`rounded-full px-[12px] py-[7px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-semibold leading-none transition-all ${
                on
                  ? "text-white shadow-sm"
                  : "bg-white text-[#6b7280] border border-[#c8c8d0] hover:border-[#a8a8b0] hover:text-[#1a1a2e]"
              }`}
              style={on ? { backgroundColor: fill } : undefined}
            >
              {skin.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
