import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Mic, Send, Search } from "lucide-react";
import { useTokens } from "../TokensContext";
import { useTheme } from "../ThemeContext";
import { useDesignTokens } from "../DesignTokensContext";

/**
 * Search-first prompt bar — duplicate of SearchBar with upload/call removed.
 * Typing + submit only (paper plane). Does not share conversational affordances.
 */
interface SearchFirstPromptBarProps {
  onSearch?: (query: string) => void;
  /** Prefill the input (e.g. results page). */
  initialQuery?: string;
  showSuggestions?: boolean;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <strong className="font-semibold text-[#1a1a2e]">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </span>
  );
}

export function SearchFirstPromptBar({
  onSearch,
  initialQuery = "",
  showSuggestions = true,
}: SearchFirstPromptBarProps) {
  const { tokens } = useTokens();
  const t = tokens.searchBar;
  const { theme } = useTheme();
  const { dt } = useDesignTokens();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const autoResize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    if (el.scrollHeight > 28) setIsOpen(true);
  };

  const handleSearch = useCallback(() => {
    if (searchQuery.trim() && onSearch) onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  const handleFocus = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    setIsOpen(true);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  const handleSuggestionClick = (text: string) => {
    setSearchQuery(text);
    setIsOpen(false);
    if (inputRef.current) inputRef.current.style.height = "auto";
    if (onSearch) onSearch(text);
  };

  const displayedSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return t.suggestions;
    return (t.allSuggestions ?? t.suggestions)
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 3);
  }, [searchQuery, t.suggestions, t.allSuggestions]);

  const GLOW = dt.shadows.searchGlow;

  const inputWrapperStyle: React.CSSProperties = isOpen
    ? { borderRadius: "16px" }
    : { borderRadius: "100px" };

  return (
    <div className="w-full max-w-[896px] mx-auto px-[40px]">
      <div>
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            borderRadius: isOpen ? 20 : 100,
            padding: isOpen ? "4px 4px 14px 4px" : "4px 10px 4px 4px",
            backgroundImage: isOpen ? "none" : theme.gradient,
            backgroundColor: isOpen ? "#ffffff" : "transparent",
            boxShadow: GLOW,
            overflow: "hidden",
            transition:
              "border-radius 200ms cubic-bezier(0.4,0,0.2,1), padding 200ms cubic-bezier(0.4,0,0.2,1), background-color 200ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isOpen ? "0" : "6px",
              transition: "gap 180ms cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <div
              className="flex-1 flex flex-col gap-[8px]"
              style={{
                ...inputWrapperStyle,
                background: "white",
                padding: "14px 20px",
                transition: "border-radius 200ms cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <div className="flex items-center gap-[12px]">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    autoResize();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder={t.placeholder}
                  style={{
                    fontFamily: "inherit",
                    resize: "none",
                    overflow: "hidden",
                    lineHeight: "24px",
                    color: "var(--color-body, #364153)",
                  }}
                  className="flex-1 bg-transparent border-0 outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[16px] placeholder:text-[#99a1af] tracking-[-0.3125px]"
                />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleSearch}
                  className="shrink-0 flex items-center justify-center size-[36px] rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Voice search"
                >
                  <Mic className="size-[18px]" style={{ color: "var(--color-icon, #4A5565)" }} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSearch}
              className="shrink-0 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 transition-colors"
              style={{ width: "64px", height: "64px", borderRadius: "9999px", marginRight: "6px" }}
              aria-label="Search"
            >
              <Send className="size-[18px]" style={{ color: "var(--color-icon, #4A5565)" }} />
            </button>
          </div>

          <div
            style={{
              maxHeight: isOpen && showSuggestions && displayedSuggestions.length > 0 ? "400px" : "0",
              opacity: isOpen && showSuggestions && displayedSuggestions.length > 0 ? 1 : 0,
              marginTop: isOpen && showSuggestions && displayedSuggestions.length > 0 ? "16px" : "0",
              overflow: "hidden",
              transition: "all 200ms ease-in-out",
            }}
          >
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "8px" }}>
              {displayedSuggestions.map((text, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionClick(text)}
                  className="w-full px-6 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors rounded-[12px]"
                >
                  <Search style={{ flexShrink: 0 }} width="16" height="16" stroke="#6B7280" strokeWidth="2" />
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-[#6B7280] leading-snug">
                    {highlightMatch(text, searchQuery)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
