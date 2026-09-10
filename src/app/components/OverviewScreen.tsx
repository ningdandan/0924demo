import { motion } from "motion/react";
import { MessageSquare, Search, BookOpen, ArrowRight, Gauge } from "lucide-react";

export type OverviewExploreTarget = "conversational" | "search" | "article";

interface OverviewScreenProps {
  onExplore?: (target: OverviewExploreTarget) => void;
}

const SPECTRUM_MARKERS = [
  {
    pct: 8,
    label: "Claims &\norders",
    hint: "Multi-step",
  },
  {
    pct: 32,
    label: "Account\nchanges",
    hint: "Guided",
  },
  {
    pct: 55,
    label: "Mixed\ncontact center",
    hint: "Hybrid",
  },
  {
    pct: 78,
    label: "Help &\npolicy hubs",
    hint: "Find fast",
  },
  {
    pct: 94,
    label: "Known\narticle",
    hint: "Destination",
  },
] as const;

const POLES = [
  {
    id: "conversational" as const,
    icon: MessageSquare,
    title: "Conversational-first",
    subtitle: "Order-based · longer journeys",
    body: "The customer doesn’t know the next step — the AI walks them through a process: disputes, returns, enrollment, payouts. Turns build context. Success is completing the workflow, not finding a page.",
    signals: ["Multi-turn dialogue", "State & case context", "Guided next actions", "Human handoff when needed"],
    fit: "Banks, marketplaces, telco, logistics — anything where the path is a sequence.",
  },
  {
    id: "search" as const,
    icon: Search,
    title: "Search-first",
    subtitle: "Knowledge-heavy · self-serve",
    body: "The customer already knows what they need — a policy, a how-to, a status definition. They want the right document fast, then optional AI to clarify. Success is finding and understanding, then getting out.",
    signals: ["Intent → results", "Smart summary", "Taxonomy & filters", "Chat as escalation"],
    fit: "SaaS help centers, compliance, education ops — dense knowledge bases.",
  },
] as const;

export function OverviewScreen({ onExplore }: OverviewScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="h-full min-h-0 w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="relative min-h-full">
        {/* Atmosphere — cool navy wash, not flat gray */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% -10%, rgba(0, 23, 105, 0.10), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 80%, rgba(6, 106, 254, 0.06), transparent 50%), linear-gradient(180deg, #eef0f7 0%, #f4f5f8 40%, #eceef4 100%)",
          }}
        />

        <div className="relative max-w-[1080px] mx-auto px-[48px] pt-[48px] pb-[56px]">
          {/* Intro */}
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-center mb-[48px]"
          >
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-semibold tracking-[0.14em] uppercase text-[#6b7280] mb-[14px]">
              Experience framing
            </p>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[40px] leading-[1.15] tracking-[-0.03em] text-[#001769] mb-[16px]">
              Support AI sits on a spectrum
            </h1>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[17px] leading-[26px] text-[#364153] max-w-[620px] mx-auto">
              Some contact centers need a conversation that carries an order or case from start
              to finish. Others need knowledge retrieval first — find the right answer, then
              talk only if needed. Most businesses sit somewhere in between.
            </p>
          </motion.header>

          {/* Spectrum visual */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
            className="mb-[56px]"
            aria-label="Conversation to search spectrum"
          >
            <div className="flex items-end justify-between mb-[18px] px-[4px]">
              <div>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold tracking-[0.12em] uppercase text-[#6b7280] mb-[4px]">
                  Conversation
                </p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-semibold text-[#001769]">
                  Order-based · long
                </p>
              </div>
              <div className="text-right">
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold tracking-[0.12em] uppercase text-[#6b7280] mb-[4px]">
                  Search
                </p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-semibold text-[#001769]">
                  Knowledge-heavy
                </p>
              </div>
            </div>

            <div className="relative h-[72px] mb-[8px]">
              {/* Track */}
              <div
                className="absolute left-0 right-0 top-[28px] h-[10px] rounded-full overflow-hidden"
                style={{
                  background:
                    "linear-gradient(90deg, #001769 0%, #066afe 48%, #7eb6ff 100%)",
                  boxShadow: "0 8px 28px rgba(0, 23, 105, 0.18)",
                }}
              />
              {/* Soft sheen */}
              <div
                className="absolute left-0 right-0 top-[28px] h-[10px] rounded-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.35), transparent 60%)",
                }}
              />

              {SPECTRUM_MARKERS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.18 + i * 0.05 }}
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${m.pct}%` }}
                >
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-medium text-[#9ca3af] mb-[4px] whitespace-pre text-center leading-[12px]">
                    {m.label}
                  </span>
                  <span className="size-[12px] rounded-full bg-white border-[2.5px] border-[#001769] shadow-[0_2px_6px_rgba(0,0,0,0.12)]" />
                </motion.div>
              ))}
            </div>

            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#6b7280] text-center mt-[20px] max-w-[640px] mx-auto">
              Not a binary choice — a design dial. Where your volume, complexity, and knowledge
              density sit determines how “chatty” vs “find-first” the experience should feel.
            </p>
          </motion.section>

          {/* Two poles */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-[20px] mb-[40px]">
            {POLES.map((pole, i) => {
              const Icon = pole.icon;
              return (
                <motion.article
                  key={pole.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
                  className="rounded-[20px] bg-white/75 border border-white/80 px-[28px] py-[26px]"
                  style={{ boxShadow: "0 12px 40px rgba(0, 23, 105, 0.06)" }}
                >
                  <div className="flex items-center gap-[10px] mb-[14px]">
                    <div className="size-[36px] rounded-[10px] bg-[#001769]/[0.06] flex items-center justify-center">
                      <Icon className="size-[18px] text-[#001769]" strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[18px] text-[#001769] leading-tight">
                        {pole.title}
                      </h2>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium text-[#6b7280]">
                        {pole.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#364153] mb-[16px]">
                    {pole.body}
                  </p>

                  <ul className="flex flex-col gap-[8px] mb-[18px]">
                    {pole.signals.map((s) => (
                      <li
                        key={s}
                        className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#374151] flex items-center gap-[8px]"
                      >
                        <span className="size-[5px] rounded-full bg-[#066afe] shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[18px] text-[#6b7280] mb-[18px]">
                    <span className="font-semibold text-[#4b5563]">Typical fit: </span>
                    {pole.fit}
                  </p>

                  <button
                    type="button"
                    onClick={() => onExplore?.(pole.id)}
                    className="inline-flex items-center gap-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-semibold text-[#001769] hover:opacity-80 transition-opacity"
                  >
                    Open this experience
                    <ArrowRight className="size-[14px]" />
                  </button>
                </motion.article>
              );
            })}
          </section>

          {/* Starting point / perceived speed */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.32 }}
            className="mb-[40px]"
          >
            <div className="text-center mb-[22px]">
              <div className="inline-flex items-center gap-[8px] mb-[10px]">
                <Gauge className="size-[15px] text-[#001769]" strokeWidth={2} />
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold tracking-[0.12em] uppercase text-[#6b7280]">
                  Starting point
                </p>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[22px] leading-[28px] text-[#001769] mb-[10px]">
                Where you start sets how fast the experience feels
              </h3>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#6b7280] max-w-[580px] mx-auto">
                Same AI, same answers — different entry points create different patience.
                The first screen trains the user on what “done” should feel like.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div className="rounded-[18px] border border-[#f0c7c0] bg-[#fff8f6] px-[24px] py-[22px]">
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold tracking-[0.1em] uppercase text-[#b4533c] mb-[8px]">
                  Friction path
                </p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px] text-[#001769] mb-[6px]">
                  Search → forced into conversation
                </p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[20px] text-[#4b5563] mb-[14px]">
                  They came to find something. Turning that into a multi-turn chat feels
                  drastically slower — even when the bot is “helping.” Expectation was
                  retrieval; they got dialogue.
                </p>
                <div className="flex items-center gap-[8px] flex-wrap">
                  <span className="rounded-full bg-white border border-[#f0c7c0] px-[10px] py-[4px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-medium text-[#9a3412]">
                    Search box
                  </span>
                  <ArrowRight className="size-[12px] text-[#c4a09a]" />
                  <span className="rounded-full bg-white border border-[#f0c7c0] px-[10px] py-[4px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-medium text-[#9a3412]">
                    Chat thread
                  </span>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold text-[#b4533c]">
                    = feels slow
                  </span>
                </div>
              </div>

              <div className="rounded-[18px] border border-[#c8d9f0] bg-[#f5f8fd] px-[24px] py-[22px]">
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold tracking-[0.1em] uppercase text-[#066afe] mb-[8px]">
                  Aligned path
                </p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px] text-[#001769] mb-[6px]">
                  Start in conversation (ChatGPT, Claude…)
                </p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[20px] text-[#4b5563] mb-[14px]">
                  They arrived expecting a dialogue. Multi-turn is fine — the pace matches
                  the mental model. Conversation isn’t a detour; it is the product.
                </p>
                <div className="flex items-center gap-[8px] flex-wrap">
                  <span className="rounded-full bg-white border border-[#c8d9f0] px-[10px] py-[4px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-medium text-[#001769]">
                    Chat surface
                  </span>
                  <ArrowRight className="size-[12px] text-[#9db4d4]" />
                  <span className="rounded-full bg-white border border-[#c8d9f0] px-[10px] py-[4px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-medium text-[#001769]">
                    More turns
                  </span>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold text-[#066afe]">
                    = feels natural
                  </span>
                </div>
              </div>
            </div>

            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[20px] text-[#6b7280] text-center mt-[18px] max-w-[620px] mx-auto">
              Design implication: don’t bait with search and switch to chat as the only path.
              Keep search outcomes findable; offer conversation as an escalation — or start
              conversational when the journey is meant to be long.
            </p>
          </motion.section>

          {/* Third mode callout + how to use demo */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.36 }}
            className="rounded-[20px] border border-[#d8dce8] bg-[#001769] px-[32px] py-[28px] mb-[36px] text-white"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-[24px]">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[8px] mb-[10px]">
                  <BookOpen className="size-[16px] text-white/70" />
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold tracking-[0.12em] uppercase text-white/60">
                    Beyond the poles
                  </p>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[20px] leading-[26px] mb-[10px]">
                  Direct to article
                </h3>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-white/80 max-w-[520px]">
                  When the destination is already known — a policy page, a how-to — land on the
                  article and layer AI beside or inside it. Same spectrum, farther toward
                  knowledge: less discovery, more comprehension and next steps.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onExplore?.("article")}
                className="shrink-0 self-start inline-flex items-center gap-[8px] rounded-full bg-white text-[#001769] px-[16px] py-[10px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-semibold hover:bg-white/90 transition-colors"
              >
                Open Direct to article
                <ArrowRight className="size-[14px]" />
              </button>
            </div>
          </motion.section>

          {/* Decision cues */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.42 }}
          >
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px] text-[#001769] mb-[16px] text-center">
              How to place your business on the dial
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
              {[
                {
                  q: "Is the hard part deciding what to do?",
                  a: "Lean conversational — guide the sequence and carry case state.",
                },
                {
                  q: "Is the hard part finding the right answer?",
                  a: "Lean search-first — surface documents, summarize, then escalate.",
                },
                {
                  q: "Do people already arrive with a known page?",
                  a: "Lean direct-to-article — AI clarifies and suggests next steps in place.",
                },
              ].map((item) => (
                <div
                  key={item.q}
                  className="rounded-[14px] bg-white/60 border border-[#e2e5ee] px-[18px] py-[16px]"
                >
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-semibold text-[#001769] mb-[8px] leading-[18px]">
                    {item.q}
                  </p>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[18px] text-[#6b7280]">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}
