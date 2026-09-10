import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, Check, BookOpen, Target, MessageCircle, type LucideIcon } from "lucide-react";
import type { StudentReadinessCard as StudentReadinessCardType, ChatCard } from "../chatTypes";
import { CARD_WRAP, CARD_HEADER, CARD_TITLE, CHIP } from "./cardStyles";
import { useTheme } from "../ThemeContext";
import { AssignModuleCard } from "./AssignModuleCard";
import content from "../content";

const TILE_DESC: Record<string, string> = content.studentReadinessCard.tileDescriptions as Record<string, string>;

const TILE_ICON: Record<string, LucideIcon> = {
  "Assign Next Module":         BookOpen,
  "Provide Targeted Support":   Target,
  "Send Encouragement Message": MessageCircle,
};


interface StudentReadinessCardProps {
  card: StudentReadinessCardType;
  onStudentClick?: (name: string) => void;
}

export function StudentReadinessCard({ card, onStudentClick }: StudentReadinessCardProps) {
  const { theme } = useTheme();
  const accentStyle = { backgroundImage: theme.gradient };
  const [expandedCard, setExpandedCard] = useState<ChatCard | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set(card.students.map((s) => s.name)));

  const toggleStudent = (name: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  if (expandedCard?.type === "assign_module") {
    return (
      <motion.div
        key="expanded"
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full"
      >
        <AssignModuleCard card={expandedCard} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`mt-[12px] mb-[4px] ${CARD_WRAP}`}
    >
      {/* Header */}
      <div className={CARD_HEADER}>
        <h3 className={CARD_TITLE}>{card.title}</h3>
        {card.statusLabel && <span className={CHIP[card.statusColor] ?? CHIP.purple}>{card.statusLabel}</span>}
      </div>

      {/* Student tiles */}
      <div className="px-[16px] pt-[16px] pb-[14px] flex flex-row gap-[10px]">
        {card.students.map((s, i) => {
          const isSelected = selectedStudents.has(s.name);
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.07 }}
              className={`relative flex-1 flex flex-col rounded-[12px] border-2 overflow-hidden text-center transition-all cursor-pointer ${
                isSelected ? "border-[#A3D9F6] shadow-sm" : "border-gray-200 hover:shadow-sm"
              }`}
              onClick={() => toggleStudent(s.name)}
            >
              {/* Face — full-width rectangular top half */}
              <div className="w-full aspect-[4/3] overflow-hidden shrink-0">
                <img src={s.photo} alt={s.name}
                  className="w-full h-full object-cover object-top" />
              </div>

              {/* Selection checkmark */}
              {isSelected && (
                <div className="absolute top-[8px] right-[8px] size-[18px] rounded-full flex items-center justify-center" style={accentStyle}>
                  <Check className="size-[10px] text-white" strokeWidth={3} />
                </div>
              )}

              {/* Name + CTA */}
              <div className={`flex flex-col items-center gap-[3px] px-[12px] py-[10px] ${isSelected ? "bg-gray-50" : "bg-white"}`}>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-[#364153] leading-tight">{s.name}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); onStudentClick?.(s.name); }}
                  className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 hover:text-gray-600 transition-colors mt-[2px]"
                >
                  {content.studentReadinessCard.viewProfileButton}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-[20px] border-t border-gray-100" />

      {/* Action tiles */}
      {card.tiles && card.tiles.length > 0 && (
        <div className="px-[20px] pt-[14px] pb-[16px] flex flex-col gap-[8px]">
          {card.tilesTitle && (
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-gray-500 mb-[4px]">{card.tilesTitle}</p>
          )}
          {card.tiles.map((tile, i) => {
            const desc = TILE_DESC[tile.label] ?? "";
            const Icon = TILE_ICON[tile.label];
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.07 }}
                onClick={() => tile.expandCard && setExpandedCard(tile.expandCard)}
                className="group flex items-center gap-[14px] w-full rounded-[12px] px-[16px] py-[12px] text-left border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-all"
              >
                {Icon && (
                  <div className="size-[34px] rounded-[8px] flex items-center justify-center flex-shrink-0" style={accentStyle}>
                    <Icon className="size-[15px] text-[#1e1b4b]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[8px]">
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-[#364153]">
                      {tile.label}
                    </span>
                    {tile.recommended && (
                      <span className="px-[10px] py-[4px] bg-gray-100 text-gray-600 font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[11px] rounded-full uppercase tracking-wider">
                        {content.studentReadinessCard.recommendedLabel}
                      </span>
                    )}
                  </div>
                  {desc && (
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-400 mt-[1px]">{desc}</p>
                  )}
                </div>
                <ChevronRight className="size-[15px] shrink-0 transition-transform group-hover:translate-x-[2px] text-[#364153]" />
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
