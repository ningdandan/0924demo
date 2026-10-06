import { AnimatePresence, motion } from "motion/react";
import { Lightbulb, MessageSquare, Users, Zap } from "lucide-react";
import {
  SpecCanvas,
  SpecPage,
  SpecShell,
  SpecStencil,
  useAnimLoop,
  type SpecSection,
} from "../shared/SpecPage";

const CATS = [
  { label: "Getting Started", icon: Lightbulb, items: ["Set up workspace", "Invite teammates", "Connect integrations"] },
  { label: "Billing & Subscriptions", icon: Users, items: ["View current plan", "Update payment", "Download invoices"] },
  { label: "Support", icon: MessageSquare, items: ["Contact support", "Status page", "Community forum"] },
  { label: "Features", icon: Zap, items: ["Automations", "API access", "Reporting"] },
];

function PillRow({
  openIndex,
  hoverIndex,
  dimOthers,
}: {
  openIndex?: number | null;
  hoverIndex?: number | null;
  dimOthers?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2.5 justify-center items-start">
      {CATS.map((c, i) => {
        const Icon = c.icon;
        const open = openIndex === i;
        const hover = hoverIndex === i;
        const opacity =
          dimOthers && openIndex != null && openIndex !== i ? 0.45 : hover || open ? 1 : 0.8;
        return (
          <div key={c.label} className="relative">
            <motion.div
              animate={{ opacity, scale: hover ? 1.05 : 1 }}
              transition={{ duration: 0.25 }}
              className="bg-white/60 border border-gray-200 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.06)] rounded-full flex gap-[6px] items-center px-[14px] py-[8px]"
            >
              <Icon size={16} color="#4b5563" />
              <span
                className="text-[12px] tracking-[-0.15px] whitespace-nowrap"
                style={{ color: "#364153", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {c.label}
              </span>
            </motion.div>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute top-[calc(100%+8px)] left-0 min-w-[200px] z-10 rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                  }}
                >
                  {c.items.map((item, idx) => (
                    <div
                      key={item}
                      className="px-3.5 py-2.5 text-[11px] border-b last:border-b-0"
                      style={{
                        color: "#364153",
                        borderColor: "rgba(255,255,255,0.4)",
                        background: idx === 1 ? "rgba(255,255,255,0.8)" : "transparent",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/** 01 — Rest under the prompt */
function WIdle({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 5200, [0, 800, 2800, 4200]);
  const show = step >= 1;
  return (
    <SpecShell url="help.acme.com">
      <SpecCanvas minH={240} bg="linear-gradient(180deg, #EEF0F8 0%, #F5F5F3 100%)">
        <div className="px-5 pt-8 pb-6 flex flex-col items-center gap-5">
          <div
            className="w-full max-w-[300px] h-10 rounded-full"
            style={{
              backgroundImage: "linear-gradient(135deg, #c7d2fe 0%, #ddd6fe 45%, #fbcfe8 100%)",
              padding: 3,
              boxShadow: "0 8px 24px rgba(6,106,254,0.12)",
            }}
          >
            <div className="h-full rounded-full bg-white" />
          </div>
          <AnimatePresence>
            {show && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <PillRow />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 02 — Stagger in + hover lift */
function WHover({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 6400, [0, 600, 1400, 2200, 3200, 4800]);
  const visibleCount = Math.min(4, step);
  const hover = step === 4 ? 1 : step === 5 ? 2 : null;
  return (
    <SpecShell url="help.acme.com">
      <SpecCanvas minH={220} bg="linear-gradient(180deg, #EEF0F8 0%, #F5F5F3 100%)">
        <div className="px-5 pt-10 pb-8 flex justify-center">
          <div className="flex flex-wrap gap-2.5 justify-center">
            {CATS.map((c, i) => {
              const Icon = c.icon;
              const on = i < visibleCount;
              const isHover = hover === i;
              return (
                <motion.div
                  key={c.label}
                  initial={false}
                  animate={{
                    opacity: on ? (isHover ? 1 : 0.8) : 0,
                    scale: on ? (isHover ? 1.05 : 1) : 0.85,
                    y: on ? 0 : 12,
                  }}
                  transition={{ duration: 0.28 }}
                  className="bg-white/60 border border-gray-200 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.06)] rounded-full flex gap-[6px] items-center px-[14px] py-[8px]"
                >
                  <Icon size={16} color="#4b5563" />
                  <span className="text-[12px]" style={{ color: "#364153" }}>
                    {c.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 03 — Open menu */
function WOpen({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 6000, [0, 1200, 3600, 5200]);
  const open = step === 1 || step === 2 ? 1 : null;
  return (
    <SpecShell url="help.acme.com">
      <SpecCanvas minH={280} bg="linear-gradient(180deg, #EEF0F8 0%, #F5F5F3 100%)">
        <div className="px-5 pt-10 pb-16 flex justify-center">
          <PillRow openIndex={open} dimOthers />
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 04 — Pick item → search */
function WSelect({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 7000, [0, 1000, 2400, 3400, 5800]);
  const open = step === 1 ? 1 : null;
  const picked = step >= 2;
  const landed = step >= 3;
  return (
    <SpecShell url={landed ? "help.acme.com/search" : "help.acme.com"}>
      <SpecCanvas
        minH={280}
        bg={landed ? "#F8F8FA" : "linear-gradient(180deg, #EEF0F8 0%, #F5F5F3 100%)"}
      >
        <AnimatePresence mode="wait">
          {!landed ? (
            <motion.div key="home" className="px-5 pt-10 pb-16 flex flex-col items-center gap-4">
              <div
                className="w-full max-w-[280px] h-9 rounded-full bg-white px-3 flex items-center text-[11px]"
                style={{ border: "1px solid #E5E7EB", color: picked ? "#111827" : "#9CA3AF" }}
              >
                {picked ? "Update payment" : "Ask anything…"}
              </div>
              {!picked && <PillRow openIndex={open} dimOthers />}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 pt-4 pb-5 space-y-3"
            >
              <div
                className="h-8 rounded-full bg-white px-3 flex items-center text-[10px]"
                style={{ border: "1px solid #E5E7EB", color: "#111827" }}
              >
                Update payment
              </div>
              <div className="rounded-xl bg-white p-3 space-y-2" style={{ border: "1px solid #E8E8ED" }}>
                <SpecStencil w="88%" h={8} opacity={0.22} />
                <SpecStencil w="64%" h={8} opacity={0.12} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SpecCanvas>
    </SpecShell>
  );
}

/** 05 — Outside click closes */
function WDismiss({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, 5600, [0, 900, 2800, 4200]);
  const open = step === 1 ? 1 : null;
  const clickOutside = step === 2;
  return (
    <SpecShell url="help.acme.com">
      <SpecCanvas minH={280} bg="linear-gradient(180deg, #EEF0F8 0%, #F5F5F3 100%)">
        <div className="px-5 pt-10 pb-16 relative flex justify-center">
          <PillRow openIndex={open} dimOthers />
          {clickOutside && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-10 top-8 size-7 rounded-full bg-[#1a1a2e] text-white text-[10px] flex items-center justify-center"
            >
              ✕
            </motion.div>
          )}
        </div>
      </SpecCanvas>
    </SpecShell>
  );
}

const SECTIONS: SpecSection[] = [
  {
    num: "01",
    tag: "Placement",
    title: "Category pills sit under the prompt on home",
    desc: "Below the search / prompt bar, a centered wrap of frosted pills offers topic entry points without competing with the primary ask.",
    bullets: [
      "Max width aligns with the prompt (~896px)",
      "Frosted white pill + light border + soft shadow",
      "Icon + label; wraps on smaller widths",
    ],
    Widget: WIdle,
  },
  {
    num: "02",
    tag: "Motion",
    title: "Staggered entrance and hover lift",
    desc: "Pills enter with a light stagger, rest at 80% opacity, and lift to full opacity + slight scale on hover so the row feels alive but quiet.",
    bullets: [
      "Entrance: fade + scale + rise with index delay",
      "Hover: opacity 1 and scale ~1.05",
      "Only one interaction language across the set",
    ],
    Widget: WHover,
  },
  {
    num: "03",
    tag: "Menu",
    title: "Tap opens a frosted dropdown of intents",
    desc: "Each pill owns a short menu of concrete asks. Opening one dropdown closes others — accordion behavior so the home canvas stays clean.",
    bullets: [
      "Menu anchors under the pill with 8px gap",
      "Blurred white panel, rounded 16px, soft shadow",
      "Toggle again on the same pill to close",
    ],
    Widget: WOpen,
  },
  {
    num: "04",
    tag: "Select",
    title: "Choosing an item runs a search",
    desc: "A menu item closes the dropdown and submits that string as the query — the same path as typing in the prompt and searching.",
    bullets: [
      "onSearch(item) hands off to the results flow",
      "Dropdown closes immediately on select",
      "No separate route — same search pipeline",
    ],
    Widget: WSelect,
  },
  {
    num: "05",
    tag: "Dismiss",
    title: "Outside click clears the open menu",
    desc: "Clicking anywhere outside the category row dismisses the open dropdown so the home state returns to a quiet pill strip.",
    bullets: [
      "Document mousedown listener on the row container",
      "Does not affect the prompt bar focus state",
      "Ready for the next category without a reload",
    ],
    Widget: WDismiss,
  },
];

export function CategoryButtonsSpec() {
  return (
    <SpecPage
      monoLabel="Design Specs · Category buttons"
      title="Category buttons"
      subtitle="Frosted topic pills under the home prompt — stagger in, open a short menu, and hand the chosen intent to search."
      sections={SECTIONS}
    />
  );
}
