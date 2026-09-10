import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Users, Send, ChevronRight, Calendar, MessageCircle } from "lucide-react";
import { AssignModuleCard } from "./AssignModuleCard";
import { ExtendDeadlineCard } from "./ExtendDeadlineCard";
import { SpecialistChatCard } from "./SpecialistChatCard";
import type { ActionTileItem, ChatCard } from "../chatTypes";
import content from "../content";

interface ActionTilesProps {
  title: string;
  tiles: ActionTileItem[];
  onTileClick?: (tileLabel: string) => void;
}

const TILE_ICONS: Record<string, typeof BookOpen> = {
  "Assign Next Module":         BookOpen,
  "Provide Targeted Support":   Users,
  "Send Encouragement Message": Send,
  "Extend Deadline":            Calendar,
  "Grant Individual Extension": Users,
  "Chat with a Specialist":     MessageCircle,
  "Review Knowledge Articles":  BookOpen,
};

const TILE_META: Record<string, { icon: typeof BookOpen; desc: string }> = Object.fromEntries(
  Object.entries(content.actionTiles.tileMeta).map(([label, { desc }]) => [
    label,
    { icon: TILE_ICONS[label] ?? BookOpen, desc },
  ])
);

function getTileMeta(label: string) {
  return TILE_META[label] ?? { icon: BookOpen, desc: "" };
}

export function ActionTiles({ title, tiles, onTileClick }: ActionTilesProps) {
  const [expandedCard, setExpandedCard] = useState<ChatCard | null>(null);

  const handleTileClick = (tile: ActionTileItem) => {
    onTileClick?.(tile.label);
    if (tile.expandCard) {
      setExpandedCard(tile.expandCard);
    }
  };

  return (
    <div className="mt-[16px] w-full">
      <AnimatePresence mode="wait">
        {expandedCard ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {expandedCard.type === "assign_module" && (
              <AssignModuleCard card={expandedCard} />
            )}
            {expandedCard.type === "extend_deadline" && (
              <ExtendDeadlineCard card={expandedCard} />
            )}
            {expandedCard.type === "specialist_chat" && (
              <SpecialistChatCard card={expandedCard} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="tiles"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] leading-[22px] text-[#364153] mb-[14px]">
              {title}
            </p>
            <div className="flex flex-col gap-[10px]">
              {tiles.map((tile, index) => {
                const { icon: Icon, desc } = getTileMeta(tile.label);
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    onClick={() => handleTileClick(tile)}
                    className={`group flex items-center gap-[16px] w-full rounded-[14px] px-[18px] py-[14px] text-left border transition-all ${
                      tile.recommended
                        ? "bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300 shadow-sm"
                        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`flex items-center justify-center rounded-[10px] size-[42px] shrink-0 ${
                      tile.recommended ? "bg-purple-100" : "bg-gray-100"
                    }`}>
                      <Icon className={`size-[20px] ${tile.recommended ? "text-[#8200db]" : "text-gray-500"}`} />
                    </div>

                    {/* Label + desc */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-[8px]">
                        <span className={`font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[14px] leading-[20px] ${
                          tile.recommended ? "text-[#8200db]" : "text-[#364153]"
                        }`}>
                          {tile.label}
                        </span>
                        {tile.recommended && (
                          <span className="px-[8px] py-[2px] bg-[#8200db] text-white font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[10px] rounded-full leading-none">
                            {content.actionTiles.recommendedLabel}
                          </span>
                        )}
                      </div>
                      {desc && (
                        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-400 mt-[2px] leading-[16px]">
                          {desc}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <ChevronRight className={`size-[16px] shrink-0 transition-transform group-hover:translate-x-[2px] ${
                      tile.recommended ? "text-[#8200db]" : "text-gray-300"
                    }`} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
