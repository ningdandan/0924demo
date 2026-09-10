import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Trash2, ChevronDown, ChevronRight, User, Bot,
  GripVertical, RotateCcw, Check,
} from "lucide-react";
import { useTokens } from "../TokensContext";
import { defaultTokens } from "../tokens";
import type {
  ChatMessage, ChatCard, CardType, MessageRole,
  AssignModuleCard, SendNotificationCard, ActionTilesCard, LearnerProgressCard,
} from "../chatTypes";

// ── helpers ───────────────────────────────────────────────────────────────────

function deepClone<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }
function uid() { return Math.random().toString(36).slice(2, 8); }

// ── Field primitive ───────────────────────────────────────────────────────────

function Field({ label, value, onChange, multiline, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-[3px]">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
          className="w-full px-[8px] py-[6px] bg-gray-50 border border-gray-200 rounded-[6px] text-[12px] text-[#364153] focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none leading-[17px]" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-[8px] py-[6px] bg-gray-50 border border-gray-200 rounded-[6px] text-[12px] text-[#364153] focus:outline-none focus:ring-1 focus:ring-purple-400" />
      )}
    </div>
  );
}

// ── Card type selector ────────────────────────────────────────────────────────

const CARD_TYPE_OPTIONS: { value: CardType | "none"; label: string }[] = [
  { value: "none", label: "No card" },
  { value: "action_tiles", label: "Action Tiles" },
  { value: "assign_module", label: "Assign Module" },
  { value: "send_notification", label: "Send Notification" },
  { value: "learner_progress", label: "Learner Progress" },
];

function buildDefaultCard(type: CardType): ChatCard {
  const base = {
    title: "",
    statusLabel: "",
    statusColor: "gray" as const,
    footerNote: "",
    buttons: [] as { label: string; variant: "primary" | "secondary" }[],
  };
  if (type === "action_tiles") {
    return { ...base, type: "action_tiles", tilesTitle: "What would you like to do?", tiles: [{ label: "Option 1", recommended: true }] } as ActionTilesCard;
  }
  if (type === "assign_module") {
    return {
      ...base, type: "assign_module",
      statusLabel: "REVIEW & CONFIRM", statusColor: "purple",
      buttons: [{ label: "Assign Module", variant: "primary" }, { label: "Cancel", variant: "secondary" }],
      footerNote: "Assignment will be delivered immediately",
      doneStatusLabel: "Complete",
      doneStatusColor: "green",
      doneMessage: "Module successfully assigned",
      doneDescription: "All qualified learners will be notified.",
      doneFooterNote: "Just now",
    } as AssignModuleCard;
  }
  if (type === "send_notification") {
    return {
      ...base, type: "send_notification",
      statusLabel: "DRAFT MESSAGE", statusColor: "blue",
      buttons: [{ label: "Send Notification", variant: "primary" }, { label: "Cancel", variant: "secondary" }],
      sentStatusLabel: "Complete", sentStatusColor: "green",
      sentMessage: "Notifications sent successfully",
      footerNote: "Message will be sent via email and in-app notification",
    } as SendNotificationCard;
  }
  // learner_progress
  return {
    ...base, type: "learner_progress",
    statusLabel: "PROGRESS",
    modules: [{ name: "Module 1", status: "not_started" }],
  } as LearnerProgressCard;
}

// ── Card editor sections ──────────────────────────────────────────────────────

function CardMeta({ card, onChange }: { card: ChatCard; onChange: (c: ChatCard) => void }) {
  const STATUS_COLORS = ["purple", "green", "blue", "gray"] as const;

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8200db] mb-[2px]">Card Metadata</div>
      <Field label="Title" value={card.title} onChange={(v) => onChange({ ...card, title: v })} />
      <div className="grid grid-cols-2 gap-[8px]">
        <Field label="Status chip text" value={card.statusLabel} onChange={(v) => onChange({ ...card, statusLabel: v })} />
        <div className="flex flex-col gap-[3px]">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Status color</label>
          <select value={card.statusColor} onChange={(e) => onChange({ ...card, statusColor: e.target.value as any })}
            className="w-full px-[8px] py-[6px] bg-gray-50 border border-gray-200 rounded-[6px] text-[12px] text-[#364153] focus:outline-none focus:ring-1 focus:ring-purple-400">
            {STATUS_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <Field label="Footer note" value={card.footerNote} onChange={(v) => onChange({ ...card, footerNote: v })} />

      {/* Buttons */}
      <div className="flex flex-col gap-[6px]">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Buttons</div>
        {card.buttons.map((btn, i) => (
          <div key={i} className="flex gap-[6px] items-center">
            <input type="text" value={btn.label}
              onChange={(e) => {
                const btns = [...card.buttons];
                btns[i] = { ...btns[i], label: e.target.value };
                onChange({ ...card, buttons: btns });
              }}
              className="flex-1 px-[8px] py-[5px] bg-gray-50 border border-gray-200 rounded-[6px] text-[12px] text-[#364153] focus:outline-none focus:ring-1 focus:ring-purple-400"
              placeholder="Button label"
            />
            <select value={btn.variant}
              onChange={(e) => {
                const btns = [...card.buttons];
                btns[i] = { ...btns[i], variant: e.target.value as "primary" | "secondary" };
                onChange({ ...card, buttons: btns });
              }}
              className="px-[6px] py-[5px] bg-gray-50 border border-gray-200 rounded-[6px] text-[11px] text-[#364153] focus:outline-none">
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
            <button onClick={() => onChange({ ...card, buttons: card.buttons.filter((_, j) => j !== i) })}
              className="p-[4px] hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="size-[12px]" />
            </button>
          </div>
        ))}
        <button onClick={() => onChange({ ...card, buttons: [...card.buttons, { label: "Button", variant: "secondary" }] })}
          className="flex items-center gap-[4px] text-[11px] text-[#8200db] hover:text-[#6b00b8] transition-colors">
          <Plus className="size-[11px]" /> Add button
        </button>
      </div>
    </div>
  );
}

function CardTypeFields({ card, onChange }: { card: ChatCard; onChange: (c: ChatCard) => void }) {
  if (card.type === "action_tiles") {
    const c = card as ActionTilesCard;
    return (
      <div className="flex flex-col gap-[8px]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#8200db] mb-[2px]">Action Tiles</div>
        <Field label="Section title" value={c.tilesTitle} onChange={(v) => onChange({ ...c, tilesTitle: v })} />
        {c.tiles.map((tile, i) => (
          <div key={i} className="flex gap-[6px] items-center pl-[8px] border-l-2 border-purple-100">
            <input type="text" value={tile.label}
              onChange={(e) => {
                const tiles = [...c.tiles];
                tiles[i] = { ...tiles[i], label: e.target.value };
                onChange({ ...c, tiles });
              }}
              className="flex-1 px-[8px] py-[5px] bg-gray-50 border border-gray-200 rounded-[6px] text-[12px] text-[#364153] focus:outline-none focus:ring-1 focus:ring-purple-400"
              placeholder="Tile label"
            />
            <label className="flex items-center gap-[4px] text-[11px] text-gray-500 cursor-pointer">
              <input type="checkbox" checked={!!tile.recommended}
                onChange={(e) => {
                  const tiles = [...c.tiles];
                  tiles[i] = { ...tiles[i], recommended: e.target.checked };
                  onChange({ ...c, tiles });
                }} className="accent-purple-600" />
              Rec.
            </label>
            <button onClick={() => onChange({ ...c, tiles: c.tiles.filter((_, j) => j !== i) })}
              className="p-[4px] hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
              <Trash2 className="size-[12px]" />
            </button>
          </div>
        ))}
        <button onClick={() => onChange({ ...c, tiles: [...c.tiles, { label: "New action", recommended: false }] })}
          className="flex items-center gap-[4px] text-[11px] text-[#8200db] hover:text-[#6b00b8] transition-colors">
          <Plus className="size-[11px]" /> Add tile
        </button>
      </div>
    );
  }

  if (card.type === "assign_module") {
    const c = card as AssignModuleCard;
    const DONE_COLORS = ["purple", "green", "blue", "gray"] as const;
    return (
      <div className="flex flex-col gap-[8px]">
        <div className="border-t border-gray-100 pt-[8px] mt-[4px]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#096] mb-[6px]">Complete state</div>
          <div className="flex flex-col gap-[6px]">
            <div className="grid grid-cols-2 gap-[6px]">
              <Field label="Status chip text" value={c.doneStatusLabel} onChange={(v) => onChange({ ...c, doneStatusLabel: v })} />
              <div className="flex flex-col gap-[3px]">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Status color</label>
                <select value={c.doneStatusColor} onChange={(e) => onChange({ ...c, doneStatusColor: e.target.value as any })}
                  className="w-full px-[8px] py-[6px] bg-gray-50 border border-gray-200 rounded-[6px] text-[12px] text-[#364153] focus:outline-none focus:ring-1 focus:ring-purple-400">
                  {DONE_COLORS.map((col) => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>
            </div>
            <Field label="Success message" value={c.doneMessage} onChange={(v) => onChange({ ...c, doneMessage: v })} multiline />
            <Field label="Description" value={c.doneDescription} onChange={(v) => onChange({ ...c, doneDescription: v })} multiline />
            <Field label="Footer note" value={c.doneFooterNote} onChange={(v) => onChange({ ...c, doneFooterNote: v })} />
          </div>
        </div>
      </div>
    );
  }

  if (card.type === "send_notification") {
    const c = card as SendNotificationCard;
    return (
      <div className="flex flex-col gap-[8px]">
        <div className="border-t border-gray-100 pt-[8px] mt-[4px]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#096] mb-[6px]">Sent state</div>
          <div className="flex flex-col gap-[6px]">
            <Field label="Sent status chip" value={c.sentStatusLabel} onChange={(v) => onChange({ ...c, sentStatusLabel: v })} />
            <Field label="Sent message" value={c.sentMessage} onChange={(v) => onChange({ ...c, sentMessage: v })} multiline />
          </div>
        </div>
      </div>
    );
  }

  if (card.type === "learner_progress") {
    const c = card as LearnerProgressCard;
    return (
      <div className="flex flex-col gap-[8px]">
        <div className="flex flex-col gap-[4px]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Modules</div>
          {c.modules.map((mod, i) => (
            <div key={i} className="flex gap-[6px] items-center">
              <input type="text" value={mod.name}
                onChange={(e) => {
                  const mods = [...c.modules];
                  mods[i] = { ...mods[i], name: e.target.value };
                  onChange({ ...c, modules: mods });
                }}
                className="flex-1 px-[8px] py-[5px] bg-gray-50 border border-gray-200 rounded-[6px] text-[12px] text-[#364153] focus:outline-none focus:ring-1 focus:ring-purple-400"
                placeholder="Module name"
              />
              <select value={mod.status}
                onChange={(e) => {
                  const mods = [...c.modules];
                  mods[i] = { ...mods[i], status: e.target.value as "not_started" | "completed" };
                  onChange({ ...c, modules: mods });
                }}
                className="px-[6px] py-[5px] bg-gray-50 border border-gray-200 rounded-[6px] text-[11px] text-[#364153] focus:outline-none">
                <option value="not_started">Not started</option>
                <option value="completed">Completed</option>
              </select>
              <input type="text" value={mod.score ?? ""}
                onChange={(e) => {
                  const mods = [...c.modules];
                  mods[i] = { ...mods[i], score: e.target.value || undefined };
                  onChange({ ...c, modules: mods });
                }}
                className="w-[56px] px-[8px] py-[5px] bg-gray-50 border border-gray-200 rounded-[6px] text-[12px] text-[#364153] focus:outline-none focus:ring-1 focus:ring-purple-400"
                placeholder="Score"
              />
              <button onClick={() => onChange({ ...c, modules: c.modules.filter((_, j) => j !== i) })}
                className="p-[4px] hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                <Trash2 className="size-[12px]" />
              </button>
            </div>
          ))}
          <button onClick={() => onChange({ ...c, modules: [...c.modules, { name: "New module", status: "not_started" }] })}
            className="flex items-center gap-[4px] text-[11px] text-[#8200db] hover:text-[#6b00b8]">
            <Plus className="size-[11px]" /> Add module
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ── Message row ───────────────────────────────────────────────────────────────

function MessageRow({ msg, index, total, onChange, onDelete, onMoveUp, onMoveDown }: {
  msg: ChatMessage; index: number; total: number;
  onChange: (m: ChatMessage) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cardType = msg.card?.type ?? "none";

  const handleCardTypeChange = (val: string) => {
    if (val === "none") {
      const { card: _, ...rest } = msg;
      onChange(rest as ChatMessage);
    } else {
      onChange({ ...msg, card: buildDefaultCard(val as CardType) });
    }
  };

  const roleIcon = msg.role === "user"
    ? <User className="size-[12px]" />
    : <Bot className="size-[12px]" />;

  const roleBg = msg.role === "user" ? "bg-indigo-100 text-indigo-700" : "bg-purple-100 text-purple-700";

  return (
    <div className="border border-gray-200 rounded-[10px] bg-white">
      {/* Row header */}
      <div className="flex items-center gap-[6px] px-[10px] py-[8px] bg-gray-50">
        <GripVertical className="size-[14px] text-gray-300 cursor-grab shrink-0" />
        <span className="text-[11px] text-gray-400 w-[16px] shrink-0">#{index + 1}</span>

        {/* Role toggle */}
        <button
          onClick={() => onChange({ ...msg, role: msg.role === "user" ? "agent" : "user" })}
          className={`flex items-center gap-[4px] px-[6px] py-[3px] rounded-full text-[10px] font-semibold transition-colors ${roleBg}`}
        >
          {roleIcon}
          {msg.role === "user" ? "User" : "Agent"}
        </button>

        {/* Content preview */}
        <span className="flex-1 text-[11px] text-gray-500 truncate">
          {msg.content || (msg.card ? `[${msg.card.type}]` : "(empty)")}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-[2px] shrink-0">
          <button onClick={onMoveUp} disabled={index === 0}
            className="p-[4px] hover:bg-gray-200 rounded disabled:opacity-30 transition-colors">
            <ChevronRight className="size-[12px] text-gray-500 -rotate-90" />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1}
            className="p-[4px] hover:bg-gray-200 rounded disabled:opacity-30 transition-colors">
            <ChevronRight className="size-[12px] text-gray-500 rotate-90" />
          </button>
          <button onClick={onDelete}
            className="p-[4px] hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="size-[12px]" />
          </button>
          <button onClick={() => setExpanded(!expanded)}
            className="p-[4px] hover:bg-gray-200 rounded transition-colors">
            {expanded ? <ChevronDown className="size-[12px] text-gray-500" /> : <ChevronRight className="size-[12px] text-gray-500" />}
          </button>
        </div>
      </div>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-[12px] py-[12px] flex flex-col gap-[12px] border-t border-gray-100">

              {/* Role selector (full) */}
              <div className="flex gap-[8px]">
                {(["user", "agent"] as MessageRole[]).map((r) => (
                  <button key={r} onClick={() => onChange({ ...msg, role: r })}
                    className={`flex items-center gap-[5px] px-[10px] py-[5px] rounded-full text-[11px] font-medium border transition-colors ${msg.role === r ? "bg-[#8200db] text-white border-[#8200db]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                    {r === "user" ? <User className="size-[12px]" /> : <Bot className="size-[12px]" />}
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              {/* Content */}
              <Field label="Message text" value={msg.content} onChange={(v) => onChange({ ...msg, content: v })} multiline placeholder="Leave empty if message only contains a card" />

              {/* Citations (agent only) */}
              {msg.role === "agent" && (
                <Field
                  label="Citations (comma-separated)"
                  value={(msg.citations ?? []).join(", ")}
                  onChange={(v) => onChange({ ...msg, citations: v.split(",").map((s) => s.trim()).filter(Boolean) })}
                  placeholder="Assessment Results, Engagement Metrics"
                />
              )}

              {/* Card type selector */}
              <div className="flex flex-col gap-[3px]">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Card</label>
                <select value={cardType} onChange={(e) => handleCardTypeChange(e.target.value)}
                  className="w-full px-[8px] py-[6px] bg-gray-50 border border-gray-200 rounded-[6px] text-[12px] text-[#364153] focus:outline-none focus:ring-1 focus:ring-purple-400">
                  {CARD_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Card fields */}
              {msg.card && (
                <div className="flex flex-col gap-[8px] pl-[8px] border-l-2 border-purple-200">
                  <CardMeta card={msg.card} onChange={(c) => onChange({ ...msg, card: c })} />
                  <CardTypeFields card={msg.card} onChange={(c) => onChange({ ...msg, card: c })} />
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── ChatBuilder (main) ────────────────────────────────────────────────────────

export function ChatBuilder() {
  const { tokens, setTokens } = useTokens();
  const [messages, setMessages] = useState<ChatMessage[]>(
    deepClone(tokens.chatScript.messages) as ChatMessage[]
  );
  const [isDirty, setIsDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const touch = () => { setIsDirty(true); setSaved(false); };

  const updateMessage = (index: number, msg: ChatMessage) => {
    setMessages((prev) => prev.map((m, i) => (i === index ? msg : m)));
    touch();
  };

  const deleteMessage = (index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
    touch();
  };

  const addMessage = () => {
    setMessages((prev) => [...prev, { id: uid(), role: "agent", content: "", citations: [] }]);
    touch();
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setMessages((prev) => {
      const a = [...prev];
      [a[index - 1], a[index]] = [a[index], a[index - 1]];
      return a;
    });
    touch();
  };

  const moveDown = (index: number) => {
    setMessages((prev) => {
      if (index === prev.length - 1) return prev;
      const a = [...prev];
      [a[index], a[index + 1]] = [a[index + 1], a[index]];
      return a;
    });
    touch();
  };

  const handleApply = () => {
    setTokens({ ...tokens, chatScript: { messages } });
    setIsDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const orig = deepClone(defaultTokens.chatScript.messages) as ChatMessage[];
    setMessages(orig);
    setTokens({ ...tokens, chatScript: { messages: orig } });
    setIsDirty(false);
    setSaved(false);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-[14px] py-[12px] flex flex-col gap-[8px]">
        <p className="text-[11px] text-gray-400 mb-[4px]">
          Build the chat sequence. Spacebar advances messages in the demo. Timestamps are auto-generated.
        </p>

        {messages.map((msg, i) => (
          <MessageRow
            key={msg.id}
            msg={msg}
            index={i}
            total={messages.length}
            onChange={(m) => updateMessage(i, m)}
            onDelete={() => deleteMessage(i)}
            onMoveUp={() => moveUp(i)}
            onMoveDown={() => moveDown(i)}
          />
        ))}

        <button
          onClick={addMessage}
          className="flex items-center justify-center gap-[6px] w-full py-[10px] border-2 border-dashed border-gray-200 rounded-[10px] text-[12px] text-gray-400 hover:text-[#8200db] hover:border-purple-300 transition-colors mt-[4px]"
        >
          <Plus className="size-[14px]" /> Add message
        </button>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-gray-100 px-[14px] py-[12px] flex gap-[8px] bg-white">
        <button onClick={handleReset}
          className="flex items-center gap-[6px] px-[12px] py-[9px] border border-gray-200 rounded-[8px] text-[12px] font-medium text-gray-500 hover:bg-gray-50 transition-colors">
          <RotateCcw className="size-[12px]" /> Reset
        </button>
        <button
          onClick={handleApply}
          disabled={!isDirty && !saved}
          className={`flex-1 flex items-center justify-center gap-[6px] px-[12px] py-[9px] rounded-[8px] text-[13px] font-semibold transition-all ${
            saved
              ? "bg-green-600 text-white"
              : isDirty
              ? "bg-[#8200db] hover:bg-[#6b00b8] text-white shadow-[0_0_0_3px_rgba(130,0,219,0.2)]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saved ? <><Check className="size-[14px]" /> Saved</> : "Apply to Chat"}
        </button>
      </div>
    </>
  );
}
