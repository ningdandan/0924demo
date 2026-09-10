import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, FileText, MessageSquare } from "lucide-react";
import avatarLogo from "figma:asset/29430ecde91fa3edf6e8c948dcd5e35351d6faf7.png";
import { useTokens } from "../TokensContext";
import { useTheme } from "../ThemeContext";

interface HeaderProps {
  onLogoClick?: () => void;
  /** Show nav search between brand and user (article mode). */
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (query: string) => void;
  /** Compact AI chat entry — Search-first only. */
  showChatEntry?: boolean;
  onChatWithAgent?: () => void;
}

export function Header({
  onLogoClick,
  showSearch = false,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  showChatEntry = false,
  onChatWithAgent,
}: HeaderProps) {
  const { tokens } = useTokens();
  const { theme } = useTheme();
  const t = tokens.header;
  const brandName = tokens.brandName;
  const [localQuery, setLocalQuery] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const query = searchValue ?? localQuery;
  const setQuery = onSearchChange ?? setLocalQuery;

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const prompts: string[] = tokens.searchBar?.allSuggestions ?? tokens.searchBar?.suggestions ?? [];
    const articles = (tokens.articles?.learning ?? []).map((a: { title: string }) => a.title);
    const pool = [...new Set([...prompts, ...articles])];
    if (!q) return pool.slice(0, 5);
    return pool.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
  }, [query, tokens.searchBar, tokens.articles]);

  const submit = (value: string) => {
    const next = value.trim();
    if (!next) return;
    setOpen(false);
    onSearchSubmit?.(next);
  };

  return (
    <header className="w-full relative z-40">
      <div className="flex items-center gap-3 p-2">
        <button
          onClick={onLogoClick}
          className="flex items-center px-2 hover:opacity-80 transition-opacity cursor-pointer shrink-0"
        >
          <span className="font-body font-bold text-xl tracking-tight" style={{ color: theme.textColor }}>
            {brandName}
          </span>
        </button>

        {showSearch && (
          <div className="flex-1 min-w-0 max-w-[480px] mx-auto relative">
            <div className="flex items-center gap-[8px] h-[36px] px-[12px] rounded-full bg-white/70 border border-ui-border-faint">
              <Search className="size-[14px] text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => {
                  if (blurTimer.current) clearTimeout(blurTimer.current);
                  setOpen(true);
                }}
                onBlur={() => {
                  blurTimer.current = setTimeout(() => setOpen(false), 150);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    e.preventDefault();
                    submit(query);
                  }
                  if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Search knowledge articles…"
                className="flex-1 min-w-0 bg-transparent border-0 outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[13px] placeholder:text-[#99a1af]"
                style={{ color: "var(--color-body, #364153)" }}
              />
            </div>

            <AnimatePresence>
              {open && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-[14px] border border-gray-200 shadow-[0_12px_32px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                >
                  <div className="px-[12px] pt-[10px] pb-[6px]">
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Suggestions
                    </p>
                  </div>
                  {suggestions.map((text) => {
                    const isArticle = (tokens.articles?.learning ?? []).some(
                      (a: { title: string }) => a.title === text,
                    );
                    return (
                      <button
                        key={text}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setQuery(text);
                          submit(text);
                        }}
                        className="w-full flex items-center gap-[10px] px-[12px] py-[10px] text-left hover:bg-gray-50 transition-colors"
                      >
                        {isArticle ? (
                          <FileText className="size-[14px] text-gray-400 shrink-0" />
                        ) : (
                          <MessageSquare className="size-[14px] text-gray-400 shrink-0" />
                        )}
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#364153] leading-snug">
                          {text}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {!showSearch && <div className="flex-1" />}

        <div className="flex gap-2 items-center px-3 shrink-0">
          {showChatEntry && (
            <button
              type="button"
              onClick={onChatWithAgent}
              className="flex items-center gap-[6px] h-8 px-[12px] rounded-full transition-opacity hover:opacity-90 shrink-0"
              style={{ backgroundImage: theme.gradient, color: theme.textColor }}
              title="Chat with an agent · Available now"
            >
              <MessageSquare className="size-[13px]" strokeWidth={2.2} />
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-semibold whitespace-nowrap">
                Chat with agent
              </span>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-medium opacity-70 whitespace-nowrap">
                · 0s
              </span>
            </button>
          )}
          <div className="relative shrink-0 size-[34px]">
            <img
              alt={t.userProfileAlt}
              className="block max-w-none size-full rounded-full object-cover"
              height="34"
              src={avatarLogo}
              width="34"
            />
          </div>
          <div className="h-8 flex items-center justify-center">
            <button className="flex gap-2 h-8 items-center justify-center px-4 py-px rounded-chip border border-ui-border-faint hover:bg-black/5 transition-colors bg-white/70">
              <p className="font-body font-semibold leading-chat text-[14px] text-center text-navy">
                {t.loginButton}
              </p>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
