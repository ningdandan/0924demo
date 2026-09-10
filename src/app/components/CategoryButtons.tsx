import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Lightbulb, Zap, Users, MessageSquare } from "lucide-react";
import { useTokens } from "../TokensContext";

const ICONS = [
  <Lightbulb size={20} color="#4b5563" />,
  <Zap size={20} color="#4b5563" />,
  <Users size={20} color="#4b5563" />,
  <MessageSquare size={20} color="#4b5563" />,
];

interface CategoryButtonProps {
  icon: React.ReactNode;
  label: string;
  menuItems: string[];
  index?: number;
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: (item: string, itemIndex: number) => void;
}

function CategoryButton({ icon, label, menuItems, index = 0, isOpen, onToggle, onItemClick }: CategoryButtonProps) {
  return (
    <div className="relative">
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: isOpen ? 1 : 0.8, scale: 1, y: 0 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 0.3, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={onToggle}
        className="bg-white/60 border border-gray-200 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.06)] rounded-full flex gap-[6px] items-center px-[16px] py-[9px] hover:bg-white/90 transition-colors"
      >
        {icon}
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-normal leading-[20px] text-[14px] tracking-[-0.1504px] text-[#364153]">
          {label}
        </p>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+8px)] left-0 min-w-[280px] backdrop-blur-[12px] bg-white/90 rounded-[16px] shadow-[0px_8px_30px_0px_rgba(0,0,0,0.15)] overflow-hidden z-50"
          >
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onItemClick?.(item, idx)}
                className="w-full text-left px-[16px] py-[12px] hover:bg-white/80 transition-colors border-b border-white/40 last:border-b-0"
              >
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[20px] text-[#364153]">
                  {item}
                </p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CategoryButtonsProps {
  onSearch?: (query: string) => void;
}

export function CategoryButtons({ onSearch }: CategoryButtonsProps) {
  const { tokens } = useTokens();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleItemClick = (_categoryIndex: number, _itemIndex: number, item: string) => {
    if (onSearch) {
      setOpenDropdown(null);
      onSearch(item);
    }
  };

  return (
    <div ref={containerRef} className="flex gap-[12px] items-start justify-center flex-wrap max-w-[896px] mx-auto">
      {tokens.categories.map((category, index) => (
        <CategoryButton
          key={index}
          icon={ICONS[index % ICONS.length]}
          label={category.label}
          menuItems={category.menuItems}
          index={index}
          isOpen={openDropdown === index}
          onToggle={() => handleToggle(index)}
          onItemClick={(item, itemIndex) => handleItemClick(index, itemIndex, item)}
        />
      ))}
    </div>
  );
}
