import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, RotateCcw, ChevronDown, ChevronRight, Settings2, MessageSquare, Check } from "lucide-react";
import { useTokens } from "../TokensContext";
import { defaultTokens, type Tokens } from "../tokens";
import { ChatBuilder } from "./ChatBuilder";

// ── helpers ───────────────────────────────────────────────────────────────────

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function setNested(obj: Record<string, unknown>, path: string[], value: unknown): Record<string, unknown> {
  const clone = deepClone(obj);
  let cursor: Record<string, unknown> = clone;
  for (let i = 0; i < path.length - 1; i++) {
    cursor = cursor[path[i]] as Record<string, unknown>;
  }
  cursor[path[path.length - 1]] = value;
  return clone;
}

// ── reusable field ────────────────────────────────────────────────────────────

function Field({ label, value, onChange, multiline }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="w-full px-[10px] py-[8px] bg-gray-50 border border-gray-200 rounded-[6px] text-[12px] text-[#364153] focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none leading-[18px]" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full px-[10px] py-[8px] bg-gray-50 border border-gray-200 rounded-[6px] text-[12px] text-[#364153] focus:outline-none focus:ring-2 focus:ring-purple-400" />
      )}
    </div>
  );
}

function Section({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-[10px] overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-[14px] py-[10px] bg-gray-50 hover:bg-gray-100 transition-colors">
        <span className="text-[12px] font-semibold text-[#364153]">{title}</span>
        {open ? <ChevronDown className="size-[14px] text-gray-400" /> : <ChevronRight className="size-[14px] text-gray-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-[14px] py-[12px] flex flex-col gap-[10px] bg-white">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Content tab ───────────────────────────────────────────────────────────────

function ContentTab() {
  const { tokens, setTokens, resetTokens } = useTokens();
  const [draft, setDraft] = useState<Tokens>(deepClone(tokens));
  const [isDirty, setIsDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const upd = (path: string[], value: string) => {
    setDraft((prev) => setNested(prev as Record<string, unknown>, path, value) as Tokens);
    setIsDirty(true);
    setSaved(false);
  };

  const updArr = (path: string[], index: number, key: string, value: string) => {
    setDraft((prev) => {
      const clone = deepClone(prev) as Record<string, unknown>;
      let cursor: Record<string, unknown> = clone;
      for (const seg of path) cursor = cursor[seg] as Record<string, unknown>;
      const arr = cursor as unknown as Record<string, unknown>[];
      arr[index] = { ...arr[index], [key]: value };
      return clone as Tokens;
    });
    setIsDirty(true);
    setSaved(false);
  };

  const handleApply = () => {
    setTokens(draft);
    setIsDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetTokens();
    setDraft(deepClone(defaultTokens));
    setIsDirty(false);
    setSaved(false);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-[16px] py-[14px] flex flex-col gap-[10px]">

        <Section title="Header" defaultOpen>
          <Field label="Login button" value={draft.header.loginButton} onChange={(v) => upd(["header", "loginButton"], v)} />
        </Section>

        <Section title="Home Hero" defaultOpen>
          <Field label="User name" value={draft.hero.userName} onChange={(v) => upd(["hero", "userName"], v)} />
          <Field label="Heading" value={draft.hero.welcomeHeading} onChange={(v) => upd(["hero", "welcomeHeading"], v)} />
          <Field label="Subtext" value={draft.hero.welcomeSubtext} onChange={(v) => upd(["hero", "welcomeSubtext"], v)} multiline />
        </Section>

        <Section title="Search Page Hero">
          <Field label="User name" value={draft.searchHero.userName} onChange={(v) => upd(["searchHero", "userName"], v)} />
          <Field label="Greeting prefix" value={draft.searchHero.greetingPrefix} onChange={(v) => upd(["searchHero", "greetingPrefix"], v)} />
          <Field label="Subtext" value={draft.searchHero.subtext} onChange={(v) => upd(["searchHero", "subtext"], v)} multiline />
        </Section>

        <Section title="Search Bar">
          <Field label="Placeholder" value={draft.searchBar.placeholder} onChange={(v) => upd(["searchBar", "placeholder"], v)} />
          <Field label="Demo typing text" value={draft.searchBar.demoTypingText} onChange={(v) => upd(["searchBar", "demoTypingText"], v)} multiline />
        </Section>

        <Section title="Search Dropdown">
          <Field label="Demo typing text" value={draft.searchBarDropdown.demoTypingText} onChange={(v) => upd(["searchBarDropdown", "demoTypingText"], v)} multiline />
          <Field label="Quick answers heading" value={draft.searchBarDropdown.quickAnswersHeading} onChange={(v) => upd(["searchBarDropdown", "quickAnswersHeading"], v)} />
          <Field label="Related heading" value={draft.searchBarDropdown.relatedHeading} onChange={(v) => upd(["searchBarDropdown", "relatedHeading"], v)} />
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-[4px]">Quick Answers</div>
          {draft.searchBarDropdown.quickAnswers.map((qa, i) => (
            <div key={i} className="flex flex-col gap-[6px] pl-[8px] border-l-2 border-purple-100">
              <Field label={`Q${i + 1} Question`} value={qa.question} onChange={(v) => updArr(["searchBarDropdown", "quickAnswers"], i, "question", v)} multiline />
              <Field label={`Q${i + 1} Answer`} value={qa.answer} onChange={(v) => updArr(["searchBarDropdown", "quickAnswers"], i, "answer", v)} />
            </div>
          ))}
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-[4px]">Related Objects</div>
          {draft.searchBarDropdown.relatedObjects.map((obj, i) => (
            <div key={i} className="flex flex-col gap-[6px] pl-[8px] border-l-2 border-purple-100">
              <Field label={`#${i + 1} Type`} value={obj.type} onChange={(v) => updArr(["searchBarDropdown", "relatedObjects"], i, "type", v)} />
              <Field label={`#${i + 1} Title`} value={obj.title} onChange={(v) => updArr(["searchBarDropdown", "relatedObjects"], i, "title", v)} />
              <Field label={`#${i + 1} Subtitle`} value={obj.subtitle} onChange={(v) => updArr(["searchBarDropdown", "relatedObjects"], i, "subtitle", v)} />
              <Field label={`#${i + 1} Details`} value={obj.details} onChange={(v) => updArr(["searchBarDropdown", "relatedObjects"], i, "details", v)} multiline />
            </div>
          ))}
        </Section>

        <Section title="Category Buttons">
          {draft.categories.map((cat, ci) => (
            <div key={ci} className="flex flex-col gap-[6px]">
              <Field label={`Category ${ci + 1} label`} value={cat.label} onChange={(v) => { setDraft((prev) => { const c = deepClone(prev); c.categories[ci].label = v; return c; }); }} />
              {cat.menuItems.map((item, mi) => (
                <Field key={mi} label={`  Item ${mi + 1}`} value={item} onChange={(v) => { setDraft((prev) => { const c = deepClone(prev); c.categories[ci].menuItems[mi] = v; return c; }); }} />
              ))}
            </div>
          ))}
        </Section>

        <Section title="Article Panel">
          <Field label="Open full article button" value={draft.articlePanel.openFullArticle} onChange={(v) => upd(["articlePanel", "openFullArticle"], v)} />
          <Field label="Share button" value={draft.articlePanel.share} onChange={(v) => upd(["articlePanel", "share"], v)} />
          <Field label="Click-to-view hint" value={draft.articlePanel.clickToView} onChange={(v) => upd(["articlePanel", "clickToView"], v)} />
        </Section>

        <Section title="Learning Articles">
          {draft.articles.learning.map((article, i) => (
            <div key={i} className="flex flex-col gap-[6px] pl-[8px] border-l-2 border-purple-100">
              <Field label={`#${i + 1} Category`} value={article.category} onChange={(v) => { setDraft((p) => { const c = deepClone(p); c.articles.learning[i].category = v; return c; }); }} />
              <Field label={`#${i + 1} Title`} value={article.title} onChange={(v) => { setDraft((p) => { const c = deepClone(p); c.articles.learning[i].title = v; return c; }); }} />
              <Field label={`#${i + 1} Subtitle`} value={article.subtitle} onChange={(v) => { setDraft((p) => { const c = deepClone(p); c.articles.learning[i].subtitle = v; return c; }); }} multiline />
              <Field label={`#${i + 1} Last updated`} value={article.lastUpdated} onChange={(v) => { setDraft((p) => { const c = deepClone(p); c.articles.learning[i].lastUpdated = v; return c; }); }} />
              <Field label={`#${i + 1} Content`} value={article.content} onChange={(v) => { setDraft((p) => { const c = deepClone(p); c.articles.learning[i].content = v; return c; }); }} multiline />
            </div>
          ))}
        </Section>

      </div>

      <div className="flex-shrink-0 border-t border-gray-100 px-[16px] py-[14px] flex gap-[10px] bg-white">
        <button onClick={handleReset}
          className="flex items-center gap-[6px] px-[14px] py-[10px] border border-gray-200 rounded-[8px] text-[12px] font-medium text-gray-500 hover:bg-gray-50 transition-colors">
          <RotateCcw className="size-[13px]" /> Reset
        </button>
        <button
          onClick={handleApply}
          disabled={!isDirty && !saved}
          className={`flex-1 flex items-center justify-center gap-[6px] px-[14px] py-[10px] rounded-[8px] text-[13px] font-semibold transition-all ${
            saved
              ? "bg-green-600 text-white"
              : isDirty
              ? "bg-[#8200db] hover:bg-[#6b00b8] text-white shadow-[0_0_0_3px_rgba(130,0,219,0.2)]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saved ? <><Check className="size-[14px]" /> Saved</> : "Apply Changes"}
        </button>
      </div>
    </>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

type Tab = "content" | "chat";

export function TextEditorPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("content");

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed top-0 right-0 h-full w-[420px] z-[200] flex flex-col shadow-[-8px_0_40px_rgba(0,0,0,0.18)] bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-[8px]">
          <Settings2 className="size-[16px] text-[#8200db]" />
          <span className="font-semibold text-[14px] text-[#364153]">Editor</span>
        </div>
        <button onClick={onClose} className="p-[6px] hover:bg-gray-100 rounded-[6px] transition-colors">
          <X className="size-[16px] text-gray-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 flex-shrink-0">
        <button
          onClick={() => setActiveTab("content")}
          className={`flex-1 py-[10px] text-[13px] font-medium transition-colors ${activeTab === "content" ? "text-[#8200db] border-b-2 border-[#8200db]" : "text-gray-500 hover:text-gray-700"}`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-[10px] text-[13px] font-medium transition-colors flex items-center justify-center gap-[6px] ${activeTab === "chat" ? "text-[#8200db] border-b-2 border-[#8200db]" : "text-gray-500 hover:text-gray-700"}`}
        >
          <MessageSquare className="size-[13px]" />
          Chat Builder
        </button>
      </div>

      {/* Tab body */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === "content" ? <ContentTab /> : <ChatBuilder />}
      </div>
    </motion.div>
  );
}
