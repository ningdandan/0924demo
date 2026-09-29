import { Check } from "lucide-react";
import { useSkin, type CompanySkinId } from "../SkinContext";
import { COMPANY_SKINS } from "../skins";

export function CompanySkins() {
  const { skinId, setSkinId } = useSkin();

  return (
    <div className="shrink-0 rounded-[14px] bg-[#e8e8ed] border border-[#d8d8e0] px-[10px] py-[12px]">
      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280] mb-[8px] px-[4px]">
        Company skins
      </p>
      <ul className="flex flex-col gap-[2px]">
        {COMPANY_SKINS.map((skin) => {
          const on = skinId === skin.id;
          return (
            <li key={skin.id}>
              <button
                type="button"
                onClick={() => setSkinId(skin.id as CompanySkinId)}
                className="w-full flex items-start gap-[8px] rounded-[8px] px-[6px] py-[7px] text-left hover:bg-black/[0.04] transition-colors"
              >
                <span
                  className={`mt-[1px] size-[14px] rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    on
                      ? "bg-[#1a1a2e] border-[#1a1a2e] text-white"
                      : "bg-white border-[#b0b0bc]"
                  }`}
                >
                  {on && <Check className="size-[9px]" strokeWidth={3} />}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[15px] ${
                      on ? "text-[#1a1a2e] font-semibold" : "text-[#6b7280]"
                    }`}
                  >
                    {skin.label}
                  </span>
                  <span className="block font-['Plus_Jakarta_Sans',sans-serif] text-[10px] leading-[13px] text-[#9ca3af] mt-[2px]">
                    {skin.hint}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
