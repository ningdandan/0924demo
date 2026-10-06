import { useState, useEffect, useRef, type ReactNode } from "react";

/** Looping step driver used by animated spec widgets. */
export function useAnimLoop(inView: boolean, totalMs: number, timestamps: number[]) {
  const [step, setStep] = useState(0);
  const tsRef = useRef(timestamps);
  tsRef.current = timestamps;

  useEffect(() => {
    if (!inView) {
      setStep(0);
      return;
    }
    const start = Date.now();
    const last = { s: -1 };
    let raf: number;
    const tick = () => {
      const t = (Date.now() - start) % totalMs;
      let s = 0;
      for (let i = 0; i < tsRef.current.length; i++) {
        if (t >= tsRef.current[i]) s = i;
      }
      if (last.s !== s) {
        last.s = s;
        setStep(s);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, totalMs]);

  return step;
}

export function SpecStencil({
  w,
  h = 7,
  opacity = 0.18,
}: {
  w: string | number;
  h?: number;
  opacity?: number;
}) {
  return (
    <div style={{ width: w, height: h, background: "#888", borderRadius: 3, opacity }} />
  );
}

export function SpecChrome({ url }: { url: string }) {
  return (
    <div
      className="px-3 py-2 flex items-center gap-2"
      style={{ background: "#1A1A18", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex gap-1">
        {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
          <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
        ))}
      </div>
      <div
        className="flex-1 max-w-[220px] mx-auto rounded px-2 py-0.5"
        style={{ background: "rgba(0,0,0,0.25)" }}
      >
        <span className="block truncate text-[9px]" style={{ color: "#555553" }}>
          {url}
        </span>
      </div>
    </div>
  );
}

export function SpecShell({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        background: "#141412",
      }}
    >
      <SpecChrome url={url} />
      {children}
    </div>
  );
}

export function SpecCanvas({
  children,
  minH = 240,
  bg = "#F5F5F3",
}: {
  children: ReactNode;
  minH?: number;
  bg?: string;
}) {
  return (
    <div style={{ background: bg, minHeight: minH, position: "relative" }}>{children}</div>
  );
}

export type SpecSection = {
  num: string;
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
  Widget: (props: { inView: boolean }) => ReactNode;
};

/** Scroll-highlight design-spec page used across the Components library. */
export function SpecPage({
  monoLabel,
  title,
  subtitle,
  sections,
}: {
  monoLabel: string;
  title: string;
  subtitle: string;
  sections: SpecSection[];
}) {
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const cRect = container.getBoundingClientRect();
      const mid = cRect.top + cRect.height / 2;
      let best = -1;
      let bestDist = Infinity;
      rowRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveIdx(best);
    };
    update();
    container.addEventListener("scroll", update, { passive: true });
    return () => container.removeEventListener("scroll", update);
  }, []);

  return (
    <div ref={containerRef} className="h-full min-h-0 overflow-y-auto" style={{ background: "#0E0E0D" }}>
      <div className="max-w-[1080px] mx-auto px-10 pt-14 pb-10">
        <p
          className="text-[10px] uppercase tracking-[0.18em] mb-4 font-mono"
          style={{ color: "#2E2E2C" }}
        >
          {monoLabel}
        </p>
        <h2 className="text-[36px] font-bold mb-4 leading-tight" style={{ color: "#F0F0EE" }}>
          {title}
        </h2>
        <p className="text-[14px] leading-[1.85] max-w-[520px]" style={{ color: "#484846" }}>
          {subtitle}
        </p>
      </div>

      <div className="max-w-[1080px] mx-auto px-10 pb-32">
        {sections.map((s, i) => {
          const active = activeIdx === i;
          return (
            <div
              key={s.num}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="py-24 grid grid-cols-2 gap-20 items-center"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                opacity: activeIdx === -1 || active ? 1 : 0.1,
                filter: active ? "none" : "blur(0.4px)",
                transition: "opacity 0.5s ease, filter 0.5s ease",
              }}
            >
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="text-[11px] font-mono transition-colors duration-400"
                    style={{ color: active ? "#2563EB" : "#272725" }}
                  >
                    {s.num}
                  </span>
                  <span
                    className="text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full transition-all duration-400"
                    style={{
                      background: active ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.04)",
                      color: active ? "#6B94FF" : "#363634",
                      border: `1px solid ${
                        active ? "rgba(37,99,235,0.24)" : "rgba(255,255,255,0.06)"
                      }`,
                    }}
                  >
                    {s.tag}
                  </span>
                </div>
                <h3
                  className="text-[26px] font-bold mb-4 leading-tight transition-colors duration-400"
                  style={{ color: active ? "#ECECEA" : "#242422" }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-[13px] leading-[1.9] mb-6 transition-colors duration-400"
                  style={{ color: active ? "#5A5A58" : "#222220" }}
                >
                  {s.desc}
                </p>
                <ul className="flex flex-col gap-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <div
                        className="w-1 h-1 rounded-full flex-shrink-0 mt-[7px] transition-all duration-400"
                        style={{ background: active ? "#2563EB" : "#2A2A28" }}
                      />
                      <span
                        className="text-[12px] leading-relaxed transition-colors duration-400"
                        style={{ color: active ? "#4A4A48" : "#202020" }}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  transition: "transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: active
                    ? "scale(1) translateY(0)"
                    : "scale(0.97) translateY(6px)",
                }}
              >
                <s.Widget inView={active} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
