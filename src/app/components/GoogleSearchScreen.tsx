import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Mic, Camera, MoreVertical } from "lucide-react";
import { useTokens } from "../TokensContext";
import type { ArticleDetails } from "./KnowledgeArticleScreen";

interface GoogleSearchScreenProps {
  onSelectArticle: (article: ArticleDetails) => void;
}

function GoogleMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 74 24" aria-label="Google" role="img">
      <path
        fill="#4285F4"
        d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.14 11.98.2 9.24.2 4.28.2.11 4.41.11 9.36s4.17 9.16 9.13 9.16c2.68 0 4.7-.89 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.57H9.24z"
      />
      <path
        fill="#EA4335"
        d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.82 0 3.34 2.62 5.82 5.83 5.82 3.21 0 5.83-2.48 5.83-5.82 0-3.38-2.62-5.82-5.83-5.82zm0 9.33c-1.85 0-3.22-1.5-3.22-3.51 0-2.05 1.37-3.51 3.22-3.51s3.22 1.46 3.22 3.51c0 2.01-1.37 3.51-3.22 3.51z"
      />
      <path
        fill="#FBBC05"
        d="M53.58 7.49h-.14c-.55-.66-1.6-1.3-2.92-1.3-2.78 0-5.26 2.48-5.26 5.82 0 3.3 2.48 5.82 5.26 5.82 1.32 0 2.38-.64 2.92-1.34h.14v.81c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.52-1.12-2.91-2.07l-2.27.94c.64 1.54 2.33 3.43 5.22 3.43 3.03 0 5.6-1.79 5.6-6.15V6.55h-2.54v.94zm-2.72 8.03c-1.85 0-3.19-1.52-3.19-3.51 0-2.01 1.34-3.51 3.19-3.51 1.82 0 3.19 1.54 3.19 3.51 0 1.99-1.37 3.51-3.19 3.51z"
      />
      <path fill="#4285F4" d="M38 2.24v16.82h2.54V2.24z" />
      <path
        fill="#34A853"
        d="M64.78 17.65l2.03 1.35c-1.27 1.88-4.34 3.22-6.91 3.22-4.69 0-8.19-3.21-8.19-7.82 0-4.65 3.54-7.82 7.86-7.82 4.36 0 6.59 3.46 6.59 7.27v1.03h-11.04c.32 1.84 1.92 3.02 3.98 3.02 1.71 0 2.92-.85 3.68-2.25zm-8.42-4.33h8.42c-.09-2.04-1.54-3.56-3.59-3.56-2.18 0-3.71 1.52-4.83 3.56z"
      />
      <path
        fill="#EA4335"
        d="M59.65 3.56l-2.27 1.7c.64.48 1.54.91 2.7.91 1.32 0 2.52-.64 3.19-1.64l-2.27-1.7c-.41.41-.96.73-1.35.73z"
      />
      <path
        fill="#EA4335"
        d="M41.93 17.83h2.54V6.55h-2.54v11.28zm1.27-12.91c.81 0 1.47-.66 1.47-1.47s-.66-1.47-1.47-1.47-1.47.66-1.47 1.47.66 1.47 1.47 1.47z"
      />
    </svg>
  );
}

function resultUrl(brandSlug: string, title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `https://support.${brandSlug}.com/article/${slug}`;
}

function snippetFor(article: ArticleDetails) {
  if (article.summary) {
    return article.summary.length > 160
      ? `${article.summary.slice(0, 157).trim()}…`
      : article.summary;
  }
  const first = article.content.split("\n\n")[0] ?? article.subtitle;
  return first.length > 160 ? `${first.slice(0, 157).trim()}…` : first;
}

export function GoogleSearchScreen({ onSelectArticle }: GoogleSearchScreenProps) {
  const { tokens } = useTokens();
  const brandName = tokens.brandName as string;
  const brandSlug = brandName.toLowerCase().replace(/\s+/g, "");
  const articles = (tokens.articles.learning ?? []) as ArticleDetails[];

  const defaultQuery =
    (tokens.searchBar?.suggestions?.[0] as string | undefined) ??
    `${brandName} help center`;

  const [query, setQuery] = useState(defaultQuery);

  const results = useMemo(() => {
    return articles.map((article) => ({
      title: article.title,
      displayUrl: resultUrl(brandSlug, article.title),
      snippet: snippetFor(article),
      article,
    }));
  }, [articles, brandSlug]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="h-full w-full overflow-y-auto bg-white [scrollbar-width:thin]"
    >
      {/* SERP header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#ebebeb]">
        <div className="flex items-center gap-[28px] px-[24px] pt-[18px] pb-[12px] max-w-[1100px]">
          <GoogleMark className="h-[30px] w-[92px] shrink-0" />
          <div className="flex-1 max-w-[690px] flex items-center gap-[12px] h-[44px] px-[16px] rounded-full border border-[#dfe1e5] shadow-[0_1px_6px_rgba(32,33,36,0.18)] bg-white">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-0 font-['Arial',sans-serif] text-[16px] text-[#202124] outline-none bg-transparent"
              aria-label="Search"
            />
            <div className="h-[24px] w-px bg-[#dfe1e5]" />
            <Mic className="size-[18px] text-[#4285f4] shrink-0" strokeWidth={1.8} />
            <Camera className="size-[18px] text-[#4285f4] shrink-0" strokeWidth={1.8} />
            <Search className="size-[18px] text-[#4285f4] shrink-0" strokeWidth={2.2} />
          </div>
          <div className="ml-auto size-[32px] rounded-full bg-[#1a73e8] flex items-center justify-center text-white font-['Arial',sans-serif] text-[14px] font-medium shrink-0">
            M
          </div>
        </div>

        <div className="flex items-center gap-[24px] px-[144px] pb-[0] max-w-[1100px]">
          {["All", "Images", "Videos", "News", "Shopping", "More"].map((tab, i) => (
            <span
              key={tab}
              className={`font-['Arial',sans-serif] text-[13px] pb-[10px] border-b-[3px] ${
                i === 0
                  ? "text-[#1a73e8] border-[#1a73e8] font-medium"
                  : "text-[#5f6368] border-transparent"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="w-full max-w-[652px] pl-[144px] pr-[24px] pt-[14px] pb-[64px]">
        <p className="font-['Arial',sans-serif] text-[14px] text-[#70757a] mb-[18px]">
          About {(results.length * 1847).toLocaleString()} results (0.38 seconds)
        </p>

        <div className="flex flex-col gap-[28px]">
          {results.map((result) => (
            <div key={result.title} className="group">
              <div className="flex items-center gap-[10px] mb-[4px]">
                <div className="size-[28px] rounded-full bg-[#f1f3f4] flex items-center justify-center shrink-0 overflow-hidden">
                  <span className="font-['Arial',sans-serif] text-[12px] font-bold text-[#5f6368]">
                    {brandName.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-['Arial',sans-serif] text-[14px] text-[#202124] leading-[18px] truncate">
                    {brandName}
                  </p>
                  <p className="font-['Arial',sans-serif] text-[12px] text-[#4d5156] leading-[16px] truncate">
                    {result.displayUrl}
                  </p>
                </div>
                <MoreVertical className="size-[16px] text-[#70757a] opacity-0 group-hover:opacity-100" />
              </div>

              <button
                type="button"
                onClick={() => onSelectArticle(result.article)}
                className="text-left w-full"
              >
                <h3 className="font-['Arial',sans-serif] text-[20px] leading-[26px] text-[#1a0dab] hover:underline tracking-[-0.2px]">
                  {result.title}
                </h3>
              </button>

              <p className="font-['Arial',sans-serif] text-[14px] leading-[22px] text-[#4d5156] mt-[4px]">
                {result.snippet}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-[40px] font-['Arial',sans-serif] text-[13px] text-[#70757a]">
          Click any article title to open it on {brandName}.
        </p>
      </div>
    </motion.div>
  );
}
