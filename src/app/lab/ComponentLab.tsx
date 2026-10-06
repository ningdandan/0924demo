import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Highlighter,
  Layers,
  ListTree,
  MessageSquareMore,
  Search,
  Sparkles,
} from "lucide-react";
import { DesignSpec } from "./dynamic-card/DesignSpec";
import { DynamicCardGallery } from "./dynamic-card/DynamicCardGallery";
import SpecSheet from "./in-chat-recommendations/SpecSheet";
import ChatDemo from "./in-chat-recommendations/ChatDemo";
import {
  RecommendationChips,
  type RecommendationChip,
} from "./in-chat-recommendations/RecommendationChips";
import {
  NudgePills,
  SAMPLE_NUDGE_PILLS,
} from "./nudge-ha/NudgePills";
import { NudgeHaPrototype, NudgeHaSpec } from "./nudge-ha/NudgeHaDesignSource";
import {
  DynamicCard,
  CardActions,
  CardPrimaryButton,
  CardSecondaryButton,
} from "./dynamic-card/DynamicCard";
import { PromptBarSpec } from "./prompt-bar/PromptBarSpec";
import { CategoryButtonsSpec } from "./category-buttons/CategoryButtonsSpec";
import { SearchSuggestionsSpec } from "./search-suggestions/SearchSuggestionsSpec";
import { SearchSummarySpec } from "./search-summary/SearchSummarySpec";

type ComponentId =
  | "prompt-bar"
  | "category-buttons"
  | "search-suggestions"
  | "search-summary"
  | "dynamic-card"
  | "in-chat"
  | "nudge-ha";
type DetailTab = "specs" | "demo";

type ComponentEntry = {
  id: ComponentId;
  name: string;
  tag: string;
  summary: string;
  status: "Ready" | "Prep";
  icon: ReactNode;
  tabs: DetailTab[];
};

const COMPONENTS: ComponentEntry[] = [
  {
    id: "prompt-bar",
    name: "Prompt bar",
    tag: "Home · Results",
    summary:
      "The primary ask control — glowing idle pill, expand on focus, submit into results, and follow-up under the summary.",
    status: "Prep",
    icon: <Search className="size-[18px]" />,
    tabs: ["specs"],
  },
  {
    id: "category-buttons",
    name: "Category buttons",
    tag: "Home · Topics",
    summary:
      "Frosted topic pills under the home prompt — open a short menu and hand the chosen intent to search.",
    status: "Prep",
    icon: <Layers className="size-[18px]" />,
    tabs: ["specs"],
  },
  {
    id: "search-suggestions",
    name: "Search bar suggestions",
    tag: "Home · Chat",
    summary:
      "Grouped list inside the expanded prompt — past searches, objects, and FAQs that filter as you type.",
    status: "Prep",
    icon: <ListTree className="size-[18px]" />,
    tabs: ["specs"],
  },
  {
    id: "search-summary",
    name: "Search summary",
    tag: "Results · Answer",
    summary:
      "Smart summary on search results — highlighted direct answer, inline citations, expand/collapse, feedback, and follow-up chips.",
    status: "Prep",
    icon: <Highlighter className="size-[18px]" />,
    tabs: ["specs"],
  },
  {
    id: "dynamic-card",
    name: "Dynamic cards",
    tag: "Chat · Actions",
    summary:
      "Structured action cards for guided tasks, receipts, and urgent insights inside conversation.",
    status: "Ready",
    icon: <CreditCard className="size-[18px]" />,
    tabs: ["specs", "demo"],
  },
  {
    id: "in-chat",
    name: "In-chat recommendations",
    tag: "Chat · Suggestions",
    summary:
      "AI suggestion chips below the composer — ranked, contextual actions the agent can send in one tap.",
    status: "Ready",
    icon: <MessageSquareMore className="size-[18px]" />,
    tabs: ["specs", "demo"],
  },
  {
    id: "nudge-ha",
    name: "Nudge pills · HA",
    tag: "Help · Discovery",
    summary:
      "Blue topic pills with optional dropdowns — home, article, and chat placements for the help agent.",
    status: "Prep",
    icon: <Sparkles className="size-[18px]" />,
    tabs: ["specs", "demo"],
  },
];

function MiniPromptPreview() {
  return (
    <div className="pt-[36px] px-[8px] pointer-events-none">
      <div
        className="rounded-full px-[4px] py-[4px]"
        style={{
          backgroundImage: "linear-gradient(135deg, #c7d2fe 0%, #ddd6fe 45%, #fbcfe8 100%)",
          boxShadow: "0 8px 24px rgba(6,106,254,0.12)",
        }}
      >
        <div className="rounded-full bg-white h-[40px] px-[14px] flex items-center gap-[8px]">
          <Search className="size-[14px] text-[#9ca3af]" />
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#9ca3af]">
            Ask anything…
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniSummaryPreview() {
  return (
    <div className="pointer-events-none rounded-[12px] bg-white border border-[#e8e8ed] p-[12px] shadow-sm">
      <div className="flex items-center gap-[6px] mb-[8px]">
        <Sparkles className="size-[11px] text-[#001769]" />
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-semibold text-[#6b7280]">
          Smart summary
        </span>
      </div>
      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[17px] text-[#1a1a2e]">
        Most holds are caused by{" "}
        <mark className="bg-[#dce8ff] text-[#001769] font-semibold px-[2px] rounded-[2px]">
          incomplete verification
        </mark>
        .
      </p>
    </div>
  );
}

function MiniDynamicPreview() {
  return (
    <div className="scale-[0.72] origin-top-left w-[138%] pointer-events-none">
      <DynamicCard
        accent="success"
        title="Password reset complete"
        badge={{ label: "Complete", tone: "success" }}
        footer={
          <CardActions
            secondary={<CardSecondaryButton>Undo</CardSecondaryButton>}
            primary={<CardPrimaryButton>View audit log</CardPrimaryButton>}
          />
        }
      >
        <div className="flex items-center gap-[8px] rounded-[10px] bg-green-50 border border-green-100 px-[12px] py-[8px]">
          <CheckCircle2 className="size-[14px] text-[#096] shrink-0" />
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#096]">
            Password reset successfully
          </span>
        </div>
      </DynamicCard>
    </div>
  );
}

function MiniChipsPreview() {
  const chips: RecommendationChip[] = [
    { id: "1", label: "Release hold" },
    { id: "2", label: "Goodwill credit" },
    { id: "3", label: "Schedule callback" },
  ];
  return (
    <div className="pointer-events-none pt-[8px]">
      <RecommendationChips chips={chips} />
    </div>
  );
}

function MiniNudgePreview() {
  return (
    <div className="pointer-events-none pt-[4px]">
      <NudgePills pills={SAMPLE_NUDGE_PILLS.slice(0, 3)} onSelect={() => {}} compact />
    </div>
  );
}

function MiniSuggestionsPreview() {
  return (
    <div className="pointer-events-none rounded-[14px] bg-white border border-[#e8e8ed] overflow-hidden shadow-sm">
      <div className="h-[36px] px-[12px] flex items-center gap-[8px] border-b border-[#f3f4f6]">
        <Search className="size-[12px] text-[#9ca3af]" />
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#9ca3af]">
          Ask anything…
        </span>
      </div>
      <div className="px-[12px] py-[8px] space-y-[6px]">
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
          Past searches
        </p>
        <div className="flex items-center gap-[8px]">
          <span className="size-[22px] rounded-[6px] bg-[#F3F4F6]" />
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#374151]">
            Login issues
          </span>
        </div>
        <div className="flex items-center gap-[8px]">
          <span className="size-[22px] rounded-[6px] bg-[#F3F4F6]" />
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#374151]">
            Update payment
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniCategoryPreview() {
  return (
    <div className="pt-[48px] px-[8px] pointer-events-none flex flex-wrap gap-[8px] justify-center">
      {["Getting Started", "Billing & Subscriptions"].map((label) => (
        <span
          key={label}
          className="bg-white/80 border border-gray-200 shadow-sm rounded-full px-[12px] py-[7px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#364153]"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function ComponentPreviewThumb({ id }: { id: ComponentId }) {
  if (id === "prompt-bar") return <MiniPromptPreview />;
  if (id === "category-buttons") return <MiniCategoryPreview />;
  if (id === "search-suggestions") return <MiniSuggestionsPreview />;
  if (id === "search-summary") return <MiniSummaryPreview />;
  if (id === "dynamic-card") return <MiniDynamicPreview />;
  if (id === "in-chat") return <MiniChipsPreview />;
  return <MiniNudgePreview />;
}

/**
 * Components library body — global Demo/Components nav lives in App.
 */
export function ComponentLab() {
  const [active, setActive] = useState<ComponentId | null>(null);
  const [tab, setTab] = useState<DetailTab>("specs");

  const entry = COMPONENTS.find((c) => c.id === active) ?? null;
  const onSpecs = Boolean(entry && tab === "specs");

  const openComponent = (id: ComponentId) => {
    setActive(id);
    setTab("specs");
  };

  return (
    <div
      className={`h-full min-h-0 w-full overflow-hidden flex flex-col ${
        onSpecs ? "bg-[#0E0E0D]" : "bg-[#f7f7f9]"
      }`}
    >
      <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>

      {!entry && (
        <main className="flex-1 min-h-0 overflow-y-auto max-w-[1120px] w-full mx-auto px-[24px] pt-[48px] pb-[80px]">
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af] mb-[12px]">
            Design guidelines
          </p>
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-[44px] font-bold leading-[1.05] tracking-[-0.035em] text-[#1a1a2e] mb-[12px]">
            Components
          </h1>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] leading-[24px] text-[#6b7280] max-w-[540px] mb-[40px]">
            Building blocks for the search-enhanced and conversational experiences.
            Open a card to read its design spec or try the interactive demo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[20px]">
            {COMPONENTS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => openComponent(c.id)}
                className="group text-left rounded-[20px] border border-[#e4e4ea] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-[#c8c8d0] hover:shadow-[0_12px_40px_rgba(26,26,46,0.08)] transition-all"
              >
                <div className="h-[168px] bg-[#f0f0f4] border-b border-[#ececf1] px-[18px] pt-[18px] overflow-hidden relative">
                  <ComponentPreviewThumb id={c.id} />
                  <div className="absolute inset-x-0 bottom-0 h-[48px] bg-gradient-to-t from-[#f0f0f4] to-transparent pointer-events-none" />
                </div>
                <div className="p-[18px]">
                  <div className="flex items-center justify-between gap-[8px] mb-[8px]">
                    <span className="inline-flex items-center gap-[6px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
                      <span className="text-[#1a1a2e]">{c.icon}</span>
                      {c.tag}
                    </span>
                    <span className="rounded-full bg-[#f0f0f4] px-[8px] py-[2px] font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-semibold text-[#6b7280]">
                      {c.status}
                    </span>
                  </div>
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-bold tracking-[-0.02em] text-[#1a1a2e] mb-[6px] group-hover:underline underline-offset-2">
                    {c.name}
                  </h2>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[19px] text-[#6b7280] mb-[14px]">
                    {c.summary}
                  </p>
                  <span className="inline-flex items-center gap-[6px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-semibold text-[#1a1a2e]">
                    View specs
                    <ArrowRight className="size-[12px] transition-transform group-hover:translate-x-[2px]" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {entry && (
        <main className="flex-1 min-h-0 flex flex-col">
          <div
            className={`shrink-0 h-[48px] px-[20px] flex items-center justify-between gap-[12px] ${
              onSpecs
                ? "bg-[#0E0E0D] border-b border-white/[0.06]"
                : "bg-[#f7f7f9] border-b border-[#e4e4ea]"
            }`}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className={`inline-flex items-center gap-[6px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium transition-colors ${
                onSpecs
                  ? "text-[#6b6b68] hover:text-[#F0F0EE]"
                  : "text-[#6b7280] hover:text-[#1a1a2e]"
              }`}
            >
              <ArrowLeft className="size-[12px]" />
              All components
            </button>

            {entry.tabs.length > 1 && (
              <div
                className={`flex items-center gap-[3px] rounded-[10px] p-[3px] ${
                  onSpecs ? "bg-white/[0.06]" : "bg-[#ececf1]"
                }`}
              >
                {entry.tabs.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`rounded-[8px] px-[12px] py-[5px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold transition-colors ${
                      tab === t
                        ? onSpecs
                          ? "bg-white/[0.12] text-[#F0F0EE]"
                          : "bg-[#1a1a2e] text-white"
                        : onSpecs
                          ? "text-[#5a5a58] hover:text-[#c8c8c4]"
                          : "text-[#6b7280] hover:text-[#1a1a2e]"
                    }`}
                  >
                    {t === "specs" ? "Specs" : "Demo"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {entry.id === "prompt-bar" && tab === "specs" && <PromptBarSpec />}
            {entry.id === "category-buttons" && tab === "specs" && <CategoryButtonsSpec />}
            {entry.id === "search-suggestions" && tab === "specs" && (
              <SearchSuggestionsSpec />
            )}
            {entry.id === "search-summary" && tab === "specs" && <SearchSummarySpec />}
            {entry.id === "dynamic-card" && tab === "specs" && <DesignSpec />}
            {entry.id === "dynamic-card" && tab === "demo" && <DynamicCardGallery />}

            {entry.id === "in-chat" && tab === "specs" && (
              <SpecSheet onViewDemo={() => setTab("demo")} />
            )}
            {entry.id === "in-chat" && tab === "demo" && (
              <ChatDemo onBack={() => setTab("specs")} />
            )}

            {entry.id === "nudge-ha" && tab === "specs" && <NudgeHaSpec />}
            {entry.id === "nudge-ha" && tab === "demo" && <NudgeHaPrototype />}
          </div>
        </main>
      )}
    </div>
  );
}
