import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SpecPage } from "../shared/SpecPage";

// === Shared helpers ===========================================================

function useAnimLoop(inView: boolean, totalMs: number, timestamps: number[]) {
  const [step, setStep] = useState(0);
  const tsRef = useRef(timestamps);
  tsRef.current = timestamps;

  useEffect(() => {
    if (!inView) { setStep(0); return; }
    const start = Date.now();
    const last = { s: -1 };
    let raf: number;
    const tick = () => {
      const t = (Date.now() - start) % totalMs;
      let s = 0;
      for (let i = 0; i < tsRef.current.length; i++) {
        if (t >= tsRef.current[i]) s = i;
      }
      if (last.s !== s) { last.s = s; setStep(s); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, totalMs]);

  return step;
}

function Stencil({ w, h = 7, opacity = 0.18 }: { w: string | number; h?: number; opacity?: number }) {
  return <div style={{ width: w, height: h, background: "#888", borderRadius: 3, opacity }} />;
}

function Chrome({ url }: { url: string }) {
  return (
    <div className="px-3 py-2 flex items-center gap-2" style={{ background: "#1A1A18", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex gap-1">
        {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
          <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
        ))}
      </div>
      <div className="flex-1 max-w-[200px] mx-auto rounded px-2 py-0.5" style={{ background: "rgba(0,0,0,0.25)" }}>
        <span className="block truncate text-[9px]" style={{ color: "#555553" }}>{url}</span>
      </div>
    </div>
  );
}

function Shell({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)", background: "#141412" }}>
      <Chrome url={url} />
      {children}
    </div>
  );
}

function ChatWrap({ children, minH = 230 }: { children: ReactNode; minH?: number }) {
  return (
    <div style={{ background: "#F5F5F3", minHeight: minH, position: "relative" }}>
      {children}
    </div>
  );
}

function AgentAvatar({ letter, color = "#1D4ED8" }: { letter: string; color?: string }) {
  return (
    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-bold" style={{ background: color, color: "#fff", marginTop: 2 }}>
      {letter}
    </div>
  );
}

function CardShell({ children, border, shadow, bg = "#fff" }: { children: ReactNode; border?: string; shadow?: string; bg?: string }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: bg, border: border ?? "1px solid rgba(0,0,0,0.08)", boxShadow: shadow ?? "0 2px 12px rgba(0,0,0,0.08)" }}>
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: ReactNode }) {
  return (
    <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      {children}
    </div>
  );
}

function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: bg, color }}>{label}</span>
  );
}

// === Widget 1: Contextual Appearing ==========================================
// Story: empty chat → typing dots → card springs into existence

function W1({ inView }: { inView: boolean }) {
  // 0=empty  1=typing  2=card-entering  3=settled  4=fading-out
  const step = useAnimLoop(inView, 7200, [0, 1000, 2100, 3100, 5900]);
  const typing = step === 1;
  const cardVisible = step >= 2 && step <= 3;

  return (
    <Shell url="agent-ui.internal/securbot">
      <ChatWrap>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex justify-end">
            <div className="px-3 py-2 rounded-2xl rounded-tr-sm text-[11px] font-medium" style={{ background: "#1D4ED8", color: "#fff", maxWidth: "72%" }}>
              Reset my Salesforce password
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AgentAvatar letter="S" />
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {typing && !cardVisible && (
                  <motion.div
                    key="dots"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-2xl rounded-tl-sm"
                    style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    {[0, 0.18, 0.36].map((d, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#9CA3AF", animation: `w1dot 1.1s ease-in-out ${d}s infinite` }} />
                    ))}
                  </motion.div>
                )}
                {cardVisible && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, y: 12, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <CardShell>
                      <CardHeader>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#1D4ED8" }} />
                          <span className="text-[10px] font-semibold" style={{ color: "#111" }}>SecurBot · Password Reset</span>
                        </div>
                        <Pill label="Active" color="#1D4ED8" bg="#EFF6FF" />
                      </CardHeader>
                      <div className="p-3 flex flex-col gap-2">
                        {[
                          { done: true, label: "Identity verified", w: 90 },
                          { done: false, active: true, label: "Sending reset link", w: 100 },
                          { done: false, active: false, label: "Confirm new password", w: 110 },
                        ].map((s, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: s.done ? "#DCFCE7" : s.active ? "#EFF6FF" : "#F3F4F6" }}>
                              {s.done && <svg width="7" height="7" viewBox="0 0 7 7"><path d="M1 3.5L2.8 5.5L6 2" stroke="#16A34A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                              {s.active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#1D4ED8", animation: "w1dot 1.1s ease-in-out infinite" }} />}
                            </div>
                            <Stencil w={s.w} h={6} opacity={s.done ? 0.4 : s.active ? 0.32 : 0.14} />
                          </div>
                        ))}
                      </div>
                    </CardShell>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <style>{`@keyframes w1dot{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}`}</style>
      </ChatWrap>
    </Shell>
  );
}

// === Widget 2: Real-time Composition =========================================
// Story: one card shell, three automation steps complete in sequence

function W2({ inView }: { inView: boolean }) {
  // 0=s1-active  1=s2-active  2=s3-active  3=all-done  4=reset
  const step = useAnimLoop(inView, 8500, [0, 1700, 3400, 5100, 7700]);

  const stepsState = [
    { done: step >= 1, active: step === 0 },
    { done: step >= 2, active: step === 1 },
    { done: step >= 3, active: step === 2 },
  ];
  const allDone = step === 3;
  const pct = (Math.min(step, 3) / 3) * 100;

  return (
    <Shell url="agent-ui.internal/securbot">
      <ChatWrap>
        <div className="p-4">
          <CardShell
            border={allDone ? "1px solid rgba(22,163,74,0.2)" : undefined}
            shadow={allDone ? "0 0 0 2px rgba(22,163,74,0.06)" : undefined}
          >
            <CardHeader>
              <span className="text-[10px] font-semibold" style={{ color: "#111" }}>SecurBot · Password Reset</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded-full transition-all duration-500"
                style={{ background: allDone ? "#DCFCE7" : "#EFF6FF", color: allDone ? "#16A34A" : "#1D4ED8" }}>
                {allDone ? "Complete" : "Running…"}
              </span>
            </CardHeader>
            <div className="p-3 flex flex-col gap-3">
              {[
                { label: "Verifying identity", detail: "employee@company.com" },
                { label: "Sending OTP code", detail: "SMS ••4821" },
                { label: "Updating password", detail: "Salesforce CRM" },
              ].map((s, i) => {
                const { done, active } = stepsState[i];
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-400"
                      style={{ background: done ? "#DCFCE7" : active ? "#EFF6FF" : "#F3F4F6", marginTop: 1 }}>
                      {done
                        ? <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4L3.5 6L6.5 2.5" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        : active
                        ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D4ED8", animation: "w2pulse 1.2s ease-in-out infinite" }} />
                        : <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D1D5DB" }} />
                      }
                    </div>
                    <div>
                      <div className="text-[10px] font-medium transition-colors duration-400"
                        style={{ color: done ? "#111" : active ? "#1D4ED8" : "#C4C4C4" }}>
                        {s.label}
                      </div>
                      <div className="text-[8px]" style={{ color: "#B4B4B4" }}>{s.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mx-3 mb-3 h-0.5 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
              <div className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ background: allDone ? "#16A34A" : "#1D4ED8", width: `${pct}%` }} />
            </div>
          </CardShell>
          <AnimatePresence>
            {allDone && (
              <motion.div key="note" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-center mt-2.5">
                <span className="text-[8px] px-2.5 py-1 rounded-full" style={{ background: "rgba(22,163,74,0.1)", color: "#16A34A" }}>
                  same card shell — content composed in real-time
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <style>{`@keyframes w2pulse{0%,100%{opacity:.5;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}`}</style>
      </ChatWrap>
    </Shell>
  );
}

// === Widget 3: Hot Zone Activation ============================================
// Story: card with line items → one item glows → tap → blade slides in

function W3({ inView }: { inView: boolean }) {
  // 0=idle  1=hover  2=click  3=blade-open  4=reset
  const step = useAnimLoop(inView, 7800, [0, 1300, 2300, 2900, 6400]);
  const hovered = step === 1;
  const clicked = step === 2;
  const bladeOpen = step === 3;

  const items = [
    { date: "Jul 14", amt: "$24.50", label: "HQ → Airport", hot: false },
    { date: "Jul 16", amt: "$18.20", label: "Client Office", hot: true },
    { date: "Jul 19", amt: "$31.00", label: "Conference Ctr", hot: false },
  ];

  return (
    <Shell url="agent-ui.internal/expensebot">
      <ChatWrap>
        <div className="p-4">
          <CardShell>
            <CardHeader>
              <span className="text-[10px] font-semibold" style={{ color: "#111" }}>ExpenseBot · Uber Receipts</span>
              <Pill label="3 found" color="#6B7280" bg="#F3F4F6" />
            </CardHeader>
            <div className="p-2 flex flex-col gap-0.5"
              style={{ filter: bladeOpen ? "brightness(0.82)" : "none", transition: "filter 0.35s" }}>
              {items.map((item, i) => (
                <div key={i} className="px-2 py-2 rounded-lg flex items-center justify-between transition-all duration-300"
                  style={{
                    background: item.hot && clicked ? "rgba(29,78,216,0.1)" : item.hot && hovered ? "rgba(29,78,216,0.05)" : "transparent",
                    border: `1px solid ${item.hot && (hovered || clicked) ? "rgba(29,78,216,0.22)" : "transparent"}`,
                    boxShadow: item.hot && hovered ? "0 0 0 3px rgba(29,78,216,0.08)" : "none",
                  }}>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px]" style={{ color: "#9CA3AF" }}>{item.date}</span>
                    <span className="text-[10px] font-medium transition-colors duration-300"
                      style={{ color: item.hot && (hovered || clicked) ? "#1D4ED8" : "#111" }}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold" style={{ color: "#111" }}>{item.amt}</span>
                    {item.hot && (hovered || clicked) && (
                      <div className="w-2 h-2 rounded-full" style={{ background: "#1D4ED8", opacity: 0.7 }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardShell>
        </div>

        {/* Blade */}
        <motion.div
          animate={{ x: bladeOpen ? "0%" : "105%" }}
          initial={{ x: "105%" }}
          transition={{ type: "spring", stiffness: 340, damping: 34 }}
          className="absolute inset-y-0 right-0 w-[52%]"
          style={{ background: "#fff", borderLeft: "1px solid rgba(0,0,0,0.1)", boxShadow: "-6px 0 24px rgba(0,0,0,0.16)" }}
        >
          <div className="p-3 h-full flex flex-col gap-2">
            <div>
              <div className="text-[10px] font-semibold" style={{ color: "#111" }}>Jul 16 · Uber</div>
              <div className="text-[8px]" style={{ color: "#6B7280" }}>Client Office · $18.20</div>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <Stencil w="100%" h={6} opacity={0.2} />
              <Stencil w="72%" h={6} opacity={0.15} />
              <Stencil w="86%" h={6} opacity={0.18} />
            </div>
            <div className="py-1.5 rounded-lg text-center text-[9px] font-semibold" style={{ background: "#1D4ED8", color: "#fff" }}>
              Send back to Agent
            </div>
          </div>
        </motion.div>
      </ChatWrap>
    </Shell>
  );
}

// === Widget 4: Object-Aware Blade =============================================
// Story: blade zones cycle — header, body, footer each light up to show they adapt

function W4({ inView }: { inView: boolean }) {
  // 0=neutral  1=header-lit  2=body-lit  3=footer-lit  4=reset
  const step = useAnimLoop(inView, 8200, [0, 1600, 3200, 5000, 7200]);

  const zoneStyle = (active: boolean) => ({
    background: active ? "rgba(29,78,216,0.04)" : "transparent",
    boxShadow: active ? "inset 0 0 0 1.5px rgba(29,78,216,0.2)" : "inset 0 0 0 0px transparent",
    transition: "all 0.45s ease",
  });

  const zones = [
    { label: "Header", active: step === 1 },
    { label: "Body", active: step === 2 },
    { label: "Footer", active: step === 3 },
  ];

  return (
    <Shell url="agent-ui.internal/procuremate">
      <ChatWrap>
        <div className="p-4 flex flex-col gap-2">
          <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            {/* Header zone */}
            <div className="px-3 py-2.5 flex items-center justify-between" style={{ ...zoneStyle(step === 1), borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div>
                <div className="text-[11px] font-semibold" style={{ color: "#111" }}>MacBook Pro 14"</div>
                <div className="text-[8px]" style={{ color: "#6B7280" }}>Product · Procurement request</div>
              </div>
              <AnimatePresence>
                {step === 1 && (
                  <motion.span key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[7px] px-1.5 py-0.5 rounded-full" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>
                    Header
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Body zone */}
            <div className="px-3 py-2.5 flex flex-col gap-1.5" style={zoneStyle(step === 2)}>
              <AnimatePresence>
                {step === 2 && (
                  <motion.span key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[7px] px-1.5 py-0.5 rounded-full self-start" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>
                    Body
                  </motion.span>
                )}
              </AnimatePresence>
              {[{ l: "CPU", w: 55 }, { l: "RAM", w: 40 }, { l: "Storage", w: 46 }, { l: "Price", w: 50 }].map(r => (
                <div key={r.l} className="flex items-center justify-between">
                  <span className="text-[8px]" style={{ color: "#9CA3AF" }}>{r.l}</span>
                  <Stencil w={r.w} h={5} opacity={0.28} />
                </div>
              ))}
            </div>

            {/* Footer zone */}
            <div className="px-3 py-2" style={{ ...zoneStyle(step === 3), borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <AnimatePresence>
                {step === 3 && (
                  <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[7px] mb-1.5" style={{ color: "#1D4ED8" }}>
                    Footer · object-specific actions
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex gap-1.5">
                <div className="flex-1 py-1.5 rounded text-center text-[8px]" style={{ background: "#F3F4F6", color: "#6B7280" }}>Compare</div>
                <div className="flex-1 py-1.5 rounded text-center text-[8px] font-semibold" style={{ background: "#1D4ED8", color: "#fff" }}>Request Quote</div>
              </div>
            </div>
          </div>

          {/* Zone legend */}
          <div className="flex gap-1.5">
            {zones.map(z => (
              <div key={z.label} className="flex-1 py-1 rounded-lg text-center text-[8px] transition-all duration-400"
                style={{
                  background: z.active ? "rgba(29,78,216,0.1)" : "rgba(0,0,0,0.05)",
                  color: z.active ? "#1D4ED8" : "#9CA3AF",
                  border: `1px solid ${z.active ? "rgba(29,78,216,0.2)" : "transparent"}`,
                  fontWeight: z.active ? 600 : 400,
                }}>
                {z.label}
              </div>
            ))}
          </div>
        </div>
      </ChatWrap>
    </Shell>
  );
}

// === Widget 5: Bi-directional Loop ============================================
// Story: blade → "Send back" click → blade closes → agent replies → card updates

function W5({ inView }: { inView: boolean }) {
  // 0=blade-open  1=btn-hover  2=btn-click  3=blade-closing  4=agent-msg  5=card-update  6=reset
  const step = useAnimLoop(inView, 9200, [0, 1100, 2300, 2900, 3700, 4900, 8000]);
  const bladeVisible = step <= 2;
  const btnHovered = step === 1;
  const btnClicked = step === 2;
  const agentMsg = step >= 4;
  const cardUpdated = step >= 5;

  return (
    <Shell url="agent-ui.internal/procuremate">
      <ChatWrap minH={240}>
        <div className="p-4 flex flex-col gap-2.5">
          {/* Card */}
          <div className="rounded-xl overflow-hidden transition-all duration-500"
            style={{
              background: "#fff",
              border: cardUpdated ? "1px solid rgba(29,78,216,0.2)" : "1px solid rgba(0,0,0,0.08)",
              boxShadow: cardUpdated ? "0 0 0 2px rgba(29,78,216,0.07)" : "0 2px 12px rgba(0,0,0,0.08)",
              filter: bladeVisible ? "brightness(0.84)" : "none",
            }}>
            <CardHeader>
              <span className="text-[10px] font-semibold" style={{ color: "#111" }}>ProcureMate · Quote #4421</span>
            </CardHeader>
            <div className="p-3 flex flex-col gap-1.5">
              <Stencil w="100%" h={6} opacity={cardUpdated ? 0.35 : 0.2} />
              <Stencil w="65%" h={6} opacity={cardUpdated ? 0.25 : 0.14} />
              <AnimatePresence>
                {cardUpdated && (
                  <motion.div key="pill" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="px-2 py-1 rounded-lg text-[8px] font-medium self-start"
                    style={{ background: "#EFF6FF", color: "#1D4ED8" }}>
                    Updated with your selection
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Agent reply */}
          <AnimatePresence>
            {agentMsg && (
              <motion.div key="msg" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="flex items-start gap-2">
                <AgentAvatar letter="P" />
                <div className="px-2.5 py-1.5 rounded-2xl rounded-tl-sm text-[9px] leading-relaxed"
                  style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", color: "#374151" }}>
                  Got it — updating the quote with the Dell XPS 15.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Blade */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: bladeVisible ? 0 : "110%" }}
          transition={{ type: "spring", stiffness: 310, damping: 30 }}
          className="absolute inset-y-0 right-0 w-[54%]"
          style={{ background: "#fff", borderLeft: "1px solid rgba(0,0,0,0.1)", boxShadow: "-6px 0 24px rgba(0,0,0,0.18)" }}>
          <div className="p-3 h-full flex flex-col gap-2">
            <div>
              <div className="text-[10px] font-semibold" style={{ color: "#111" }}>Dell XPS 15</div>
              <div className="text-[8px]" style={{ color: "#6B7280" }}>Selected · comparison view</div>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <Stencil w="100%" h={5} opacity={0.2} />
              <Stencil w="76%" h={5} opacity={0.15} />
              <Stencil w="88%" h={5} opacity={0.18} />
            </div>
            <button
              className="py-2 rounded-lg text-[9px] font-semibold text-center transition-all duration-200"
              style={{
                background: btnClicked ? "#1E3A8A" : "#1D4ED8",
                color: "#fff",
                transform: btnClicked ? "scale(0.96)" : "scale(1)",
                boxShadow: btnHovered ? "0 0 0 3px rgba(29,78,216,0.28)" : "none",
              }}>
              Send back to Agent
            </button>
          </div>
        </motion.div>
      </ChatWrap>
    </Shell>
  );
}

// === Widget 6: Terminal Resolution ============================================
// Story: in-progress → processing → success state → input bar locks

function W6({ inView }: { inView: boolean }) {
  // 0=ready  1=processing  2=success  3=locked  4=reset
  const step = useAnimLoop(inView, 7800, [0, 1500, 2900, 4100, 6700]);
  const processing = step === 1;
  const success = step >= 2 && step <= 3;
  const locked = step === 3;

  return (
    <Shell url="agent-ui.internal/expensebot">
      <ChatWrap>
        <div className="p-4 flex flex-col gap-2">
          {/* Card */}
          <div className="rounded-xl overflow-hidden transition-all duration-500"
            style={{
              background: "#fff",
              border: success ? "1px solid rgba(22,163,74,0.22)" : "1px solid rgba(0,0,0,0.08)",
              boxShadow: success ? "0 0 0 2px rgba(22,163,74,0.07)" : "0 2px 12px rgba(0,0,0,0.08)",
            }}>
            <div className="px-3 py-2 flex items-center justify-between transition-all duration-500"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: success ? "rgba(22,163,74,0.03)" : "#fff" }}>
              <span className="text-[10px] font-semibold" style={{ color: "#111" }}>ExpenseBot · Bulk Submit</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded-full transition-all duration-500"
                style={{
                  background: success ? "#DCFCE7" : processing ? "#FEF3C7" : "#EFF6FF",
                  color: success ? "#16A34A" : processing ? "#D97706" : "#1D4ED8",
                }}>
                {success ? "Submitted" : processing ? "Processing…" : "Ready"}
              </span>
            </div>

            <div className="p-3 flex items-center justify-center" style={{ minHeight: 108 }}>
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.78 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "#DCFCE7" }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 9L7.5 12.5L14 5.5" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="text-[11px] font-semibold" style={{ color: "#111" }}>3 receipts submitted</div>
                    <div className="text-[8px] text-center" style={{ color: "#6B7280" }}>Total $73.70 · Report #882</div>
                  </motion.div>
                ) : (
                  <motion.div key="list" className="w-full flex flex-col gap-2">
                    {[
                      { l: "Jul 14 · HQ → Airport", a: "$24.50" },
                      { l: "Jul 16 · Client Office", a: "$18.20" },
                      { l: "Jul 19 · Conference Ctr", a: "$31.00" },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full transition-all duration-400"
                            style={{ background: processing && i < 2 ? "#DCFCE7" : processing && i === 2 ? "#EFF6FF" : "#F3F4F6" }} />
                          <span className="text-[9px]" style={{ color: "#374151" }}>{r.l}</span>
                        </div>
                        <span className="text-[9px] font-medium" style={{ color: "#111" }}>{r.a}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Input bar */}
          <div className="rounded-xl px-3 py-2 flex items-center gap-2 transition-all duration-600"
            style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", opacity: locked ? 0.32 : 1 }}>
            <Stencil w="100%" h={6} opacity={0.15} />
            <div className="w-6 h-6 rounded-full flex-shrink-0 transition-all duration-500"
              style={{ background: locked ? "#E5E7EB" : "#1D4ED8" }} />
          </div>

          <AnimatePresence>
            {locked && (
              <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex justify-center">
                <span className="text-[7px] tracking-wide" style={{ color: "#555553" }}>task complete · input locked</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ChatWrap>
    </Shell>
  );
}

// === Section data =============================================================

const SECTIONS = [
  {
    num: "01", tag: "Lifecycle", title: "Contextual Appearing",
    desc: "A DynamicCard doesn't exist until the agent begins a task. The moment automation starts, the card materializes mid-conversation — not pre-loaded, not a placeholder. It is born from task context.",
    bullets: [
      "Card is absent from the DOM before the task is invoked",
      "Materializes with a spring entrance inside the agent's chat bubble",
      "Never appears for passive, informational, or acknowledgment replies",
    ],
    Widget: W1,
  },
  {
    num: "02", tag: "Sequencing", title: "Real-time Composition",
    desc: "One card shell hosts a full automation sequence. As each step completes, the card's interior updates in-place — no new bubble, no reload. The card is a living document, not a snapshot.",
    bullets: [
      "A single card instance persists across all steps of a task",
      "Interior content (steps, status, progress bar) updates reactively",
      "The card header phase label changes without re-mounting the shell",
    ],
    Widget: W2,
  },
  {
    num: "03", tag: "Interactivity", title: "Hot Zone Activation",
    desc: "Specific regions within a card carry semantic weight — they are hot zones. Tapping one summons the side blade with context scoped to that exact element. The rest dims to focus attention.",
    bullets: [
      "Hot zones signal affordance with glow, border, and cursor change on hover",
      "Non-hot content (metadata, stencil rows) is passive and non-interactive",
      "The surrounding card dims on activation so the blade gets full visual focus",
    ],
    Widget: W3,
  },
  {
    num: "04", tag: "Blade", title: "Object-Aware Blade",
    desc: "The side blade isn't a generic drawer. Its Header, Body, and Footer each adapt their structure and actions based on the type of object tapped — a product, a receipt, a config item.",
    bullets: [
      "Header surfaces the object's identity, name, and semantic type",
      "Body renders details specific to that object class — specs, line items, routing tables",
      "Footer exposes only the actions relevant to that object, not a generic action bar",
    ],
    Widget: W4,
  },
  {
    num: "05", tag: "Agent Loop", title: "Bi-directional Loop",
    desc: "\"Send back to Agent\" closes the cycle. A decision made in the blade flows back into chat as agent input, the blade closes, and the originating card may update to reflect the new state.",
    bullets: [
      "Blade closes immediately on send, returning focus to the conversation",
      "Agent acknowledges the input as a new, visible chat turn",
      "The originating card updates if the agent's new state affects it",
    ],
    Widget: W5,
  },
  {
    num: "06", tag: "End State", title: "Terminal Resolution",
    desc: "Every card sequence ends in a definitive closing state — a receipt downloaded, a form submitted, a config applied. The card locks and the input bar dims to signal the task is complete.",
    bullets: [
      "Success state renders inside the existing card shell with a spring animation",
      "The chat input bar dims and becomes non-interactive on resolution",
      "Terminal cards show a confirmation ID, receipt total, or impact summary",
    ],
    Widget: W6,
  },
];

// === Page =====================================================================

export function DesignSpec() {
  return (
    <SpecPage
      monoLabel="Design Specs · Dynamic cards"
      title="DynamicCard interaction system"
      subtitle="Six interaction patterns that define how DynamicCard behaves — from the moment a task begins to the moment it resolves."
      sections={SECTIONS}
    />
  );
}
