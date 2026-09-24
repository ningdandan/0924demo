import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { useTokens } from "../TokensContext";

type TreeNode = {
  id: string;
  label: string;
  kind: "category" | "topic" | "article";
  children?: TreeNode[];
};

const BOT_REPLIES = [
  "Thanks for reaching out. A support agent will review your request shortly.",
  "I’ve logged your message. Typical reply time is under 1 business day.",
  "You can also browse the topic tree below while you wait.",
];

/** Expandable knowledge tree for the legacy contact-center homepage. */
export function ContactCenterTopicTree({
  onOpenArticle,
}: {
  onOpenArticle: (title: string) => void;
}) {
  const { tokens } = useTokens();
  const categories = tokens.categories ?? [];
  const articles = (tokens.articles?.learning ?? []) as {
    title: string;
    category: string;
  }[];

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const first = categories[0]?.label;
    return first ? { [`cat::${first}`]: true } : {};
  });

  const tree = useMemo<TreeNode[]>(() => {
    return categories.map((cat) => {
      const catArticles = articles.filter((a) => a.category === cat.label);
      const topics = (cat.menuItems ?? []).map((topic) => ({
        id: `${cat.label}::${topic}`,
        label: topic,
        kind: "topic" as const,
        children: [
          {
            id: `topic-doc::${topic}`,
            label: `${topic} overview`,
            kind: "article" as const,
          },
          ...catArticles
            .filter((a) =>
              a.title.toLowerCase().includes(topic.toLowerCase().split(" ")[0] ?? ""),
            )
            .slice(0, 2)
            .map((a) => ({
              id: `article::${a.title}`,
              label: a.title,
              kind: "article" as const,
            })),
        ],
      }));

      const articleNodes = catArticles.map((a) => ({
        id: `article::${a.title}`,
        label: a.title,
        kind: "article" as const,
      }));

      return {
        id: `cat::${cat.label}`,
        label: cat.label,
        kind: "category" as const,
        children: [
          ...topics,
          ...articleNodes.filter(
            (a) => !topics.some((t) => t.children?.some((c) => c.label === a.label)),
          ),
        ],
      };
    });
  }, [categories, articles]);

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: TreeNode, depth = 0) => {
    const isOpen = !!expanded[node.id];
    const hasChildren = (node.children?.length ?? 0) > 0;

    if (node.kind === "article") {
      return (
        <button
          key={node.id}
          type="button"
          onClick={() => onOpenArticle(node.label)}
          className="w-full flex items-center gap-[8px] text-left py-[7px] px-[8px] rounded-[6px] hover:bg-[#f3f4f6] transition-colors"
          style={{ paddingLeft: 8 + depth * 16 }}
        >
          <FileText className="size-[13px] text-[#9ca3af] shrink-0" />
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#374151] truncate">
            {node.label}
          </span>
        </button>
      );
    }

    return (
      <div key={node.id}>
        <button
          type="button"
          onClick={() => (hasChildren ? toggle(node.id) : undefined)}
          className="w-full flex items-center gap-[8px] text-left py-[8px] px-[8px] rounded-[6px] hover:bg-[#f3f4f6] transition-colors"
          style={{ paddingLeft: 8 + depth * 16 }}
        >
          {hasChildren ? (
            isOpen ? (
              <ChevronDown className="size-[13px] text-[#9ca3af] shrink-0" />
            ) : (
              <ChevronRight className="size-[13px] text-[#9ca3af] shrink-0" />
            )
          ) : (
            <span className="size-[13px]" />
          )}
          {isOpen ? (
            <FolderOpen className="size-[14px] text-[#6b7280] shrink-0" />
          ) : (
            <Folder className="size-[14px] text-[#6b7280] shrink-0" />
          )}
          <span
            className={`font-['Plus_Jakarta_Sans',sans-serif] text-[13px] truncate ${
              node.kind === "category" ? "font-semibold text-[#1a1a2e]" : "font-medium text-[#374151]"
            }`}
          >
            {node.label}
          </span>
          {hasChildren && (
            <span className="ml-auto font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#9ca3af] tabular-nums">
              {node.children!.length}
            </span>
          )}
        </button>
        {isOpen && hasChildren && (
          <div>{node.children!.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[896px] mx-auto mt-[48px] rounded-[12px] border border-[#e4e4ea] bg-white overflow-hidden">
      <div className="px-[16px] py-[12px] border-b border-[#ececf1] flex items-center justify-between">
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-semibold text-[#1a1a2e]">
          Browse topics
        </p>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#9ca3af]">
          {categories.length} categories
        </p>
      </div>
      <div className="p-[8px] max-h-[360px] overflow-y-auto [scrollbar-width:thin]">
        {tree.map((node) => renderNode(node))}
      </div>
    </div>
  );
}

/** Floating scripted bot — current contact center only. */
export function ContactCenterBotFab() {
  const { tokens } = useTokens();
  const brandName = tokens.brandName as string;
  const [botOpen, setBotOpen] = useState(false);
  const [botInput, setBotInput] = useState("");
  const [botMessages, setBotMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    {
      role: "bot",
      text: `Hi — I’m the ${brandName} help bot. Ask a question or browse topics on the page.`,
    },
  ]);

  const sendBot = () => {
    const text = botInput.trim();
    if (!text) return;
    const reply =
      BOT_REPLIES[botMessages.filter((m) => m.role === "user").length % BOT_REPLIES.length];
    setBotMessages((prev) => [...prev, { role: "user", text }, { role: "bot", text: reply }]);
    setBotInput("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setBotOpen(true)}
        className="absolute bottom-[24px] right-[24px] z-20 flex items-center gap-[8px] h-[48px] px-[16px] rounded-full bg-[#374151] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:bg-[#1f2937] transition-colors"
      >
        <MessageCircle className="size-[18px]" strokeWidth={2.2} />
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-semibold">
          Chat with bot
        </span>
      </button>

      <AnimatePresence>
        {botOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-[24px] right-[24px] z-30 w-[340px] h-[420px] rounded-[16px] bg-white border border-[#e4e4ea] shadow-[0_16px_48px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-[14px] py-[12px] bg-[#374151] text-white">
              <div>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-semibold">
                  Help bot
                </p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-white/70">
                  Scripted replies · not generative
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBotOpen(false)}
                className="size-[28px] rounded-full flex items-center justify-center hover:bg-white/10"
                aria-label="Close bot"
              >
                <X className="size-[14px]" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-[12px] py-[12px] flex flex-col gap-[8px] bg-[#f7f7f8]">
              {botMessages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-[12px] px-[12px] py-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[18px] ${
                    m.role === "user"
                      ? "self-end bg-[#374151] text-white"
                      : "self-start bg-white border border-[#e8e8ed] text-[#374151]"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="p-[10px] border-t border-[#ececf1] flex items-center gap-[8px]">
              <input
                value={botInput}
                onChange={(e) => setBotInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendBot();
                  }
                }}
                placeholder="Type a message…"
                className="flex-1 min-w-0 h-[36px] px-[12px] rounded-full border border-[#e4e4ea] bg-[#fafafb] outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[13px]"
              />
              <button
                type="button"
                onClick={sendBot}
                className="size-[36px] rounded-full bg-[#374151] text-white flex items-center justify-center hover:bg-[#1f2937]"
                aria-label="Send"
              >
                <Send className="size-[14px]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
