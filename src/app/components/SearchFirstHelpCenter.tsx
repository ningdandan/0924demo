import { motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  CircleHelp,
  Clock,
  CreditCard,
  FileText,
  Headphones,
  Layers,
  Shield,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { useTokens } from "../TokensContext";

const CATEGORY_ICONS = [Shield, Wallet, CreditCard, Sparkles];
const CATEGORY_DOT = ["bg-indigo-500", "bg-emerald-500", "bg-sky-500", "bg-violet-500"];

interface SearchFirstHelpCenterProps {
  onSearch?: (query: string) => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-ui-muted">
      {children}
    </p>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[14px] border border-ui-border-faint/80 bg-white overflow-hidden">
      <div className="flex items-center gap-[8px] px-[20px] py-[14px] border-b border-ui-border-faint/60">
        <Icon className="size-[15px] text-ui-muted-dark" />
        <h3 className="font-body font-semibold text-[14px] text-navy-deep">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function RowButton({
  title,
  subtitle,
  meta,
  onClick,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-[20px] py-[14px] border-b border-ui-border-faint/50 last:border-b-0 hover:bg-[#fafbfc] transition-colors group flex items-start justify-between gap-[12px]"
    >
      <div className="min-w-0">
        <p className="font-body text-[14px] text-ui-body leading-[1.45] group-hover:text-navy-deep">
          {title}
        </p>
        {subtitle && (
          <p className="font-body text-[12px] text-ui-muted-dark mt-[4px] line-clamp-2 leading-[1.5]">
            {subtitle}
          </p>
        )}
        {meta && (
          <p className="font-body text-[11px] text-ui-muted mt-[6px]">{meta}</p>
        )}
      </div>
      <ChevronRight className="size-[16px] shrink-0 text-ui-border mt-[2px] group-hover:text-ui-muted-dark transition-colors" />
    </button>
  );
}

export function SearchFirstHelpCenter({ onSearch }: SearchFirstHelpCenterProps) {
  const { tokens } = useTokens();
  const categories = tokens.categories ?? [];
  const quickAnswers = tokens.searchBarDropdown?.quickAnswers ?? [];
  const allSuggestions = tokens.searchBar?.allSuggestions ?? tokens.searchBar?.suggestions ?? [];
  const suggestions = tokens.searchBar?.suggestions ?? [];
  const articles = (tokens.articles?.learning ?? []) as {
    title: string;
    category: string;
    subtitle?: string;
    lastUpdated?: string;
  }[];
  const sidebarActions = tokens.sidebar?.actions ?? [];

  const faqs = [
    ...quickAnswers.map((q) => ({ question: q.question, answer: q.answer })),
    ...allSuggestions.map((question) => ({ question, answer: undefined })),
  ];

  const popularArticles = [
    ...articles,
    ...categories.flatMap((cat) =>
      (cat.menuItems ?? []).map((title) => ({
        title,
        category: cat.label,
        subtitle: `Guidance under ${cat.label}.`,
        lastUpdated: "April 2026",
      })),
    ),
  ].slice(0, 10);

  const workflowItems = categories.flatMap((cat) =>
    (cat.menuItems ?? []).map((item) => ({ title: item, category: cat.label })),
  );

  const gettingStarted = [
    {
      step: "01",
      title: "Find your topic",
      body: "Search or browse categories to locate the guide that matches your issue.",
      query: suggestions[0] ?? "How do I get started?",
    },
    {
      step: "02",
      title: "Follow the steps",
      body: "Open an article for checklists, timelines, and what to prepare before you act.",
      query: popularArticles[0]?.title ?? "Getting started guide",
    },
    {
      step: "03",
      title: "Escalate if needed",
      body: "Start a conversation with an agent when deadlines are tight or status hasn't changed.",
      query: "Hi — I’d like to chat with an agent.",
    },
  ];

  const handleClick = (query: string) => {
    onSearch?.(query);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="w-full max-w-[896px] mx-auto flex flex-col gap-[40px] pb-[48px]"
    >
      {/* Categories */}
      <div className="flex flex-col gap-[12px]">
        <SectionLabel>Browse by category</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
          {categories.map((category, index) => {
            const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
            const dot = CATEGORY_DOT[index % CATEGORY_DOT.length];

            return (
              <button
                key={category.label}
                type="button"
                onClick={() => handleClick(category.menuItems?.[0] ?? category.label)}
                className="group text-left rounded-[14px] border border-ui-border-faint/80 bg-white px-[18px] py-[16px] hover:border-ui-border transition-colors"
              >
                <div className="flex items-start gap-[12px]">
                  <div className="relative shrink-0 flex items-center justify-center size-[38px] rounded-[10px] bg-[#f8f9fb]">
                    <Icon className="size-[18px] text-navy-deep/70" />
                    <span className={`absolute -top-[3px] -right-[3px] size-[8px] rounded-full ${dot}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-[8px]">
                      <p className="font-body font-semibold text-[14px] text-navy-deep">
                        {category.label}
                      </p>
                      <ArrowUpRight className="size-[14px] text-ui-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <p className="font-body text-[12px] text-ui-muted-dark mt-[4px]">
                      {(category.menuItems ?? []).length} articles
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Getting started */}
      <div className="flex flex-col gap-[12px]">
        <SectionLabel>Getting started</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
          {gettingStarted.map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => handleClick(item.query)}
              className="text-left rounded-[14px] border border-ui-border-faint/80 bg-white p-[18px] hover:border-ui-border transition-colors group"
            >
              <p className="font-body text-[11px] font-semibold text-ui-muted tracking-[0.06em]">
                STEP {item.step}
              </p>
              <p className="font-body font-semibold text-[14px] text-navy-deep mt-[8px]">
                {item.title}
              </p>
              <p className="font-body text-[12px] text-ui-muted-dark mt-[6px] leading-[1.5]">
                {item.body}
              </p>
              <span className="inline-flex items-center gap-[4px] mt-[12px] font-body text-[12px] text-accent-indigo group-hover:gap-[6px] transition-all">
                Learn more
                <ChevronRight className="size-[14px]" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ + Popular */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[10px]">
        <Panel title="Frequently asked" icon={CircleHelp}>
          {faqs.slice(0, 8).map((faq, i) => (
            <RowButton
              key={i}
              title={faq.question}
              subtitle={faq.answer}
              onClick={() => handleClick(faq.question)}
            />
          ))}
        </Panel>

        <Panel title="Popular articles" icon={FileText}>
          {popularArticles.slice(0, 8).map((article, i) => (
            <RowButton
              key={`${article.title}-${i}`}
              title={article.title}
              meta={`${article.category} · ${article.lastUpdated ?? "Updated recently"}`}
              onClick={() => handleClick(article.title)}
            />
          ))}
        </Panel>
      </div>

      {/* Common workflows */}
      <div className="flex flex-col gap-[12px]">
        <SectionLabel>Common workflows</SectionLabel>
        <Panel title="Step-by-step guides" icon={Layers}>
          {workflowItems.slice(0, 10).map((item, i) => (
            <RowButton
              key={`${item.title}-${i}`}
              title={item.title}
              meta={item.category}
              onClick={() => handleClick(item.title)}
            />
          ))}
        </Panel>
      </div>

      {/* Recently updated + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-[10px]">
        <Panel title="Recently updated" icon={Clock}>
          {articles.slice(0, 6).map((article, i) => (
            <RowButton
              key={`${article.title}-recent-${i}`}
              title={article.title}
              subtitle={article.subtitle}
              meta={`${article.category} · ${article.lastUpdated ?? "Updated this month"}`}
              onClick={() => handleClick(article.title)}
            />
          ))}
        </Panel>

        <div className="flex flex-col gap-[10px]">
          <Panel title="Quick actions" icon={Zap}>
            {sidebarActions.slice(0, 5).map((action, i) => (
              <RowButton
                key={i}
                title={action.label}
                onClick={() => handleClick(action.label)}
              />
            ))}
          </Panel>

          <div className="rounded-[14px] border border-ui-border-faint/80 bg-[#f8f9fb] p-[18px]">
            <div className="flex items-center gap-[8px]">
              <Headphones className="size-[16px] text-navy-deep/70" />
              <p className="font-body font-semibold text-[13px] text-navy-deep">Still need help?</p>
            </div>
            <p className="font-body text-[12px] text-ui-muted-dark mt-[8px] leading-[1.5]">
              Chat with an agent from the header, or search for your case number to pick up where you left off.
            </p>
            <button
              type="button"
              onClick={() => handleClick("Hi — I’d like to chat with an agent.")}
              className="mt-[12px] w-full py-[10px] rounded-[10px] bg-white border border-ui-border-faint/80 font-body text-[13px] text-navy-deep hover:border-ui-border transition-colors"
            >
              Start a conversation
            </button>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="flex flex-wrap items-center justify-center gap-x-[20px] gap-y-[8px] pt-[8px] border-t border-ui-border-faint/60">
        {[
          { label: "Documentation", query: "View documentation" },
          { label: "API reference", query: "API reference" },
          { label: "Status page", query: "System status" },
          { label: "Contact support", query: "Contact support" },
        ].map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => handleClick(link.query)}
            className="font-body text-[12px] text-ui-muted-dark hover:text-navy-deep transition-colors inline-flex items-center gap-[4px]"
          >
            <BookOpen className="size-[12px]" />
            {link.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
