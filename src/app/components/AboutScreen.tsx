import { motion } from "motion/react";
import { Home, Search, ArrowRight, MessageSquare, PanelRight, FileText } from "lucide-react";
import type { ExperienceMode } from "./ExperienceModeToggle";

interface AboutScreenProps {
  onExplore?: (mode: Exclude<ExperienceMode, "about">) => void;
}

const PATHS = [
  {
    id: "conversational" as const,
    icon: MessageSquare,
    title: "Conversational",
    subtitle: "Homepage → chat",
    body: "Start from a conversational prompt on the homepage and go straight into a guided multi-turn chat, with sidebar context and agent handoff when needed.",
    steps: [
      { icon: MessageSquare, label: "Conversational prompt" },
      { icon: MessageSquare, label: "Chat thread" },
      { icon: PanelRight, label: "Side panels" },
      { icon: FileText, label: "Article / learner context" },
    ],
  },
  {
    id: "homepage" as const,
    icon: Home,
    title: "Enter from homepage",
    subtitle: "Search → results → chat",
    body: "Start on the product homepage, run a search, review results with an AI summary, open an article in the side panel, and escalate into chat when you need more help.",
    steps: [
      { icon: Search, label: "Homepage search" },
      { icon: FileText, label: "Results + summary" },
      { icon: PanelRight, label: "Article side panel" },
      { icon: MessageSquare, label: "Chat handoff" },
    ],
  },
  {
    id: "google" as const,
    icon: Search,
    title: "Enter from Google search",
    subtitle: "SERP → knowledge article",
    body: "Arrive from a Google results page, click into a help article, and explore two AI layouts — in-article assistance or a dedicated AI zone beside the content.",
    steps: [
      { icon: Search, label: "Google SERP" },
      { icon: FileText, label: "Direct to article" },
      { icon: MessageSquare, label: "In-article AI" },
      { icon: PanelRight, label: "AI zone split" },
    ],
  },
] as const;

export function AboutScreen({ onExplore }: AboutScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="h-full min-h-0 w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="relative min-h-full">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% -10%, rgba(0, 23, 105, 0.10), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 80%, rgba(6, 106, 254, 0.06), transparent 50%), linear-gradient(180deg, #eef0f7 0%, #f4f5f8 40%, #eceef4 100%)",
          }}
        />

        <div className="relative max-w-[920px] mx-auto px-[48px] pt-[56px] pb-[64px]">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-center mb-[48px]"
          >
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-semibold tracking-[0.14em] uppercase text-[#6b7280] mb-[14px]">
              About this demo
            </p>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[40px] leading-[1.15] tracking-[-0.03em] text-[#001769] mb-[16px]">
              Support AI across entry paths
            </h1>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[17px] leading-[26px] text-[#364153] max-w-[640px] mx-auto">
              This prototype explores conversational and search-first support —
              from guided chat, to homepage search with results, to landing from Google
              on a knowledge article. Use the tabs above to walk through each path.
            </p>
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06, ease: "easeOut" }}
            className="mb-[40px] rounded-[16px] border border-[#e0e2ea] bg-white/80 px-[28px] py-[24px]"
          >
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold tracking-[0.12em] uppercase text-[#6b7280] mb-[10px]">
              What we’re testing
            </p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] leading-[24px] text-[#364153]">
              How search, knowledge articles, AI summaries, and chat work together —
              without forcing every customer into a conversation. The flows below show
              self-serve first, with chat as a natural next step.
            </p>
          </motion.section>

          <div className="flex flex-col gap-[20px]">
            {PATHS.map((path, i) => {
              const Icon = path.icon;
              return (
                <motion.article
                  key={path.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: "easeOut" }}
                  className="rounded-[16px] border border-[#e0e2ea] bg-white px-[28px] py-[26px] shadow-[0_4px_24px_rgba(0,23,105,0.04)]"
                >
                  <div className="flex items-start gap-[16px] mb-[18px]">
                    <div className="size-[40px] rounded-[12px] bg-[#eef1f8] flex items-center justify-center shrink-0">
                      <Icon className="size-[18px] text-[#001769]" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[20px] tracking-[-0.02em] text-[#001769]">
                        {path.title}
                      </h2>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-medium text-[#6b7280] mt-[2px]">
                        {path.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] leading-[24px] text-[#364153] mb-[20px]">
                    {path.body}
                  </p>

                  <div className="flex flex-wrap items-center gap-[8px] mb-[22px]">
                    {path.steps.map((step, stepIndex) => {
                      const StepIcon = step.icon;
                      return (
                        <div key={step.label} className="flex items-center gap-[8px]">
                          {stepIndex > 0 && (
                            <ArrowRight className="size-[12px] text-[#c4c7d0] shrink-0" />
                          )}
                          <span className="inline-flex items-center gap-[6px] rounded-full border border-[#e4e4ea] bg-[#fafafb] px-[11px] py-[5px]">
                            <StepIcon className="size-[12px] text-[#6b7280]" strokeWidth={2.2} />
                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium text-[#4b5563] whitespace-nowrap">
                              {step.label}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => onExplore?.(path.id)}
                    className="inline-flex items-center gap-[8px] rounded-[10px] bg-[#001769] px-[16px] py-[10px] text-white transition-opacity hover:opacity-90"
                  >
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-semibold">
                      Explore this path
                    </span>
                    <ArrowRight className="size-[14px]" strokeWidth={2.4} />
                  </button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
