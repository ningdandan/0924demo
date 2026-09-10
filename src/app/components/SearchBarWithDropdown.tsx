import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lightbulb, GraduationCap, Users, TrendingUp, BookOpen } from "lucide-react";
import { useTokens } from "../TokensContext";
import { useTheme } from "../ThemeContext";

const OBJECT_ICONS = [GraduationCap, BookOpen, TrendingUp, Users];

interface SearchBarWithDropdownProps {
  onSearch?: (query: string) => void;
}

export function SearchBarWithDropdown({ onSearch }: SearchBarWithDropdownProps) {
  const { tokens } = useTokens();
  const t = tokens.searchBarDropdown;
  const { theme } = useTheme();
  const accentStyle = { backgroundImage: theme.gradient };

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredObjectIndex, setHoveredObjectIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
      setShowDropdown(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleFocus = () => {
    setShowDropdown(true);
    if (searchQuery === "") {
      setSearchQuery(t.demoTypingText);
    }
  };

  const handleQuickAnswerClick = (question: string) => {
    setSearchQuery(question);
    if (onSearch) onSearch(question);
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-[896px] mx-auto relative h-[108px] px-[40px]">
      <div
        className="absolute left-0 top-0 w-full h-[108px] rounded-[100px] flex flex-col items-start pl-[20px] pr-[92px] pt-[20px]"
        style={accentStyle}
      >
        <div className="bg-white h-[68px] w-full rounded-[89px] shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] flex flex-col items-start px-[20px] py-[14px]">
          <div className="flex-1 w-full">
            <div className="flex gap-[12px] items-center relative size-full">
              <button className="relative rounded-full shrink-0 size-[40px] border-2 border-[#e5e7eb] flex items-center justify-center hover:bg-gray-50 transition-colors">
                <div className="relative shrink-0 size-[20px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <g>
                      <path d="M4.16667 10H15.8333" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d="M10 4.16667V15.8333" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    </g>
                  </svg>
                </div>
              </button>

              <div className="flex-1 h-[24px]">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={handleFocus}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder={t.placeholder}
                  className="w-full h-full bg-transparent border-0 outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[16px] text-[#364153] placeholder:text-[#99a1af] tracking-[-0.3125px]"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      <button className="absolute right-[20px] top-[25px] bg-white flex items-center justify-center rounded-full shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] size-[58px] hover:bg-gray-50 transition-colors">
        <svg className="block" width="26" height="22" viewBox="0 0 26 22" fill="none">
          <circle cx="9" cy="12" r="6" stroke="#4A5565" strokeWidth="1.8"/>
          <path d="M13.5 16.5L17 20" stroke="#4A5565" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 1L22.1 4.4L25.5 5.5L22.1 6.6L21 10L19.9 6.6L16.5 5.5L19.9 4.4L21 1Z" fill="#4A5565"/>
        </svg>
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-[40px] top-[120px] w-[calc(100%-80px)] bg-white rounded-[20px] shadow-[0px_12px_40px_0px_rgba(0,0,0,0.15)] p-[24px] z-50"
          >
            {/* Quick Answers */}
            <div className="mb-[24px]">
              <div className="flex items-center gap-[8px] mb-[12px]">
                <Lightbulb className="size-[16px] text-[#8200db]" />
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-[#364153]">
                  {t.quickAnswersHeading}
                </h3>
              </div>
              <div className="flex flex-col gap-[8px]">
                {t.quickAnswers.map((qa, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAnswerClick(qa.question)}
                    className="text-left p-[12px] rounded-[12px] hover:bg-purple-50 transition-colors group"
                  >
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[13px] text-[#8200db] mb-[4px] group-hover:text-[#6b00b8]">
                      {qa.question}
                    </p>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-600">
                      {qa.answer}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Related Objects */}
            <div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-[#364153] mb-[12px]">
                {t.relatedHeading}
              </h3>
              <div className="grid grid-cols-2 gap-[12px]">
                {t.relatedObjects.map((obj, index) => {
                  const Icon = OBJECT_ICONS[index % OBJECT_ICONS.length];
                  return (
                    <div
                      key={index}
                      className="relative"
                      onMouseEnter={() => setHoveredObjectIndex(index)}
                      onMouseLeave={() => setHoveredObjectIndex(null)}
                    >
                      <button className="w-full text-left p-[14px] rounded-[12px] border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group">
                        <div className="flex items-start gap-[12px]">
                          <div className="p-[8px] rounded-[8px] bg-purple-100 group-hover:bg-purple-200 transition-colors shrink-0">
                            <Icon className="size-[16px] text-[#8200db]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-[6px] mb-[2px]">
                              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                {obj.type}
                              </span>
                            </div>
                            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] text-[#364153] mb-[2px] truncate">
                              {obj.title}
                            </p>
                            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-gray-600 truncate">
                              {obj.subtitle}
                            </p>
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {hoveredObjectIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full mt-[8px] w-[320px] bg-white border border-purple-200 rounded-[12px] shadow-lg p-[16px] z-50"
                          >
                            <div className="flex items-start gap-[12px] mb-[12px]">
                              <div className="p-[10px] rounded-[10px] bg-purple-100">
                                <Icon className="size-[20px] text-[#8200db]" />
                              </div>
                              <div className="flex-1">
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-[4px]">
                                  {obj.type}
                                </span>
                                <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[14px] text-[#364153] mb-[2px]">
                                  {obj.title}
                                </p>
                                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-600">
                                  {obj.subtitle}
                                </p>
                              </div>
                            </div>
                            <div className="pt-[12px] border-t border-gray-100">
                              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[18px] text-gray-700">
                                {obj.details}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
