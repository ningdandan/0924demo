# Skill: Design Spec Sheet

Build a scrollable, single-page design specification document with animated widget demos for each section. Each section spotlights one interaction pattern — inactive sections dim out, the active one lights up and plays its animation loop.

---

## Input format

The caller provides a list of sections as bullet points:

```
- Section title | tag label | one-sentence description
  • bullet about the behavior
  • bullet about the behavior
  • bullet about the behavior
```

Each section gets a looping animated widget on the right and explanatory text on the left.

---

## Architecture

### 1. Page structure

```
DesignSpecsPage
├── Header  (title, subtitle, mono label)
└── Section list  (one row per section)
    ├── Left col  — number badge, tag chip, title, description, bullet list
    └── Right col — animated Widget component
```

The page uses a dark background (`#0E0E0D`). Sections are separated by hairline borders (`rgba(255,255,255,0.05)`). Each section row has generous vertical padding (`py-20`) and a 2-column grid with a wide gap.

---

### 2. Scroll-highlight system

Track which section is active by finding the one whose vertical midpoint is geometrically closest to the viewport center. Update on every scroll tick.

```tsx
const [activeIdx, setActiveIdx] = useState(-1);
const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

useEffect(() => {
  const update = () => {
    const mid = window.innerHeight / 2;
    let best = -1;
    let bestDist = Infinity;
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dist = Math.abs(r.top + r.height / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    setActiveIdx(best);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  return () => window.removeEventListener("scroll", update);
}, []);
```

Apply to each section row:
- **Active**: `opacity: 1`, no filter, widget springs up to `scale(1)`
- **Inactive**: `opacity: 0.12`, `filter: blur(0.5px)`, widget at `scale(0.97) translateY(6px)`
- **Initial state** (`activeIdx === -1`): all sections at full opacity so page doesn't look broken before scroll

Text colors also transition: number/tag/title brighten when active, collapse to near-invisible when inactive.

```tsx
style={{
  opacity: activeIdx === -1 || active ? 1 : 0.12,
  filter: active ? "none" : "blur(0.5px)",
  transition: "opacity 0.55s ease, filter 0.55s ease",
}}
```

---

### 3. Animation loop hook

Drives all widget animations. Takes a total cycle duration and an array of timestamps (ms) that define when to advance to each step. Resets to step 0 when `inView` is false.

```tsx
function useAnimLoop(inView: boolean, totalMs: number, timestamps: number[]) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) { setStep(0); return; }
    const start = Date.now();
    const last = { s: -1 };
    let raf: number;
    const tick = () => {
      const t = (Date.now() - start) % totalMs;
      let s = 0;
      for (let i = 0; i < timestamps.length; i++) { if (t >= timestamps[i]) s = i; }
      if (last.s !== s) { last.s = s; setStep(s); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);
  return step;
}
```

Usage:
```tsx
// 0:idle  1:hover  2:click  3:response  4:settle  5:reset
const step = useAnimLoop(inView, 7000, [0, 1200, 2100, 3000, 4800, 6200]);
```

---

### 4. Widget pattern

Each widget accepts `inView: boolean` as its only prop. The parent (`DesignSpecsPage`) controls which widget is active and passes the prop. Widgets never self-observe.

```tsx
function MyWidget({ inView }: { inView: boolean }) {
  const step = useAnimLoop(inView, totalMs, timestamps);
  // derive named booleans from step
  const hovered = step === 1;
  const expanded = step >= 2 && step < 5;
  // render
}
```

**Widget shell** — use a browser chrome wrapper for realism:

```tsx
function SpecBrowserChrome({ url }: { url: string }) {
  return (
    <div style={{ background: "#2A2A28", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      className="px-3 py-1.5 flex items-center gap-2">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
        <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
        <div className="w-2 h-2 rounded-full bg-[#28C840]" />
      </div>
      <div className="flex-1 max-w-[200px] mx-auto bg-black/20 rounded px-2 py-0.5 flex items-center gap-1">
        <span className="text-[8px] text-[#5A5A58] truncate">{url}</span>
      </div>
    </div>
  );
}
```

Wrap with:
```tsx
<div className="rounded-xl overflow-hidden"
  style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
  <SpecBrowserChrome url="..." />
  {/* content */}
</div>
```

---

### 5. Stencil helper

Use placeholder blocks instead of real copy to reduce visual noise and keep focus on the interaction being demonstrated.

```tsx
function Stencil({ w, h = 7, opacity = 1 }: { w: string | number; h?: number; opacity?: number }) {
  return <div style={{ width: w, height: h, background: "#E8E8E6", borderRadius: 3, opacity }} />;
}
```

Use for: article body text, AI responses, breadcrumbs, form fields, metadata. Render the actual interactive elements (pills, buttons, inputs) normally — they are the subject.

---

### 6. Section data structure

```tsx
const SPEC_SECTIONS: {
  num: string;
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
  Widget: (props: { inView: boolean }) => ReactNode;
}[] = [
  {
    num: "01",
    tag: "Context label",        // short, shown as a chip
    title: "Human-readable title",
    desc: "One or two sentences explaining the behavior and why it matters.",
    bullets: [
      "Short factual statement about the behavior",
      "Another specific detail",
      "Edge case or reset condition",
    ],
    Widget: MyWidget,
  },
  // ...
];
```

---

### 7. Section row rendering

```tsx
{SPEC_SECTIONS.map((s, i) => {
  const active = activeIdx === i;
  return (
    <div
      key={s.num}
      ref={el => { rowRefs.current[i] = el; }}
      className="py-20 grid grid-cols-2 gap-16 items-center"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        opacity: activeIdx === -1 || active ? 1 : 0.12,
        filter: active ? "none" : "blur(0.5px)",
        transition: "opacity 0.55s ease, filter 0.55s ease",
      }}
    >
      {/* Left: text */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span style={{ color: active ? "#2563EB" : "#2D2D2B", fontFamily: "monospace" }}>{s.num}</span>
          <span style={{
            background: active ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.04)",
            color: active ? "#5585FF" : "#3A3A38",
            border: `1px solid ${active ? "rgba(37,99,235,0.22)" : "rgba(255,255,255,0.06)"}`,
            transition: "all 0.4s",
          }} className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
            {s.tag}
          </span>
        </div>
        <h3 style={{ color: active ? "#ECECEA" : "#2C2C2A", transition: "color 0.4s" }}>{s.title}</h3>
        <p style={{ color: active ? "#4A4A48" : "#242422", transition: "color 0.4s" }}>{s.desc}</p>
        <ul>
          {s.bullets.map(b => (
            <li key={b} className="flex items-start gap-2.5">
              <span style={{ background: active ? "#2563EB" : "#2A2A28", transition: "all 0.4s" }} />
              <span style={{ color: active ? "#484846" : "#252523", transition: "color 0.4s" }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: widget */}
      <div style={{
        transition: "transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
        transform: active ? "scale(1) translateY(0)" : "scale(0.97) translateY(6px)",
      }}>
        <s.Widget inView={active} />
      </div>
    </div>
  );
})}
```

---

## Designing a widget

For each section, work through these steps:

**1. Define the story** — what user action happens, what the system does in response, what the reset looks like.

**2. List the steps** with rough timings:
```
0 (0ms)     idle / initial state
1 (1000ms)  hover / focus state
2 (1800ms)  action triggered
3 (2600ms)  system responds
4 (4200ms)  settled / hold
5 (5800ms)  reset begins
Total: 6500ms
```

**3. Derive booleans** from the step integer so the JSX stays readable:
```tsx
const hovered = step === 1;
const open = step >= 2 && step < 5;
const closing = step === 5;
```

**4. Use `AnimatePresence` + `motion.div`** for elements that enter/exit. Use CSS `transition` on style props for continuous changes (color, background, opacity on non-mount transitions).

**5. Stencil everything that isn't the focus.** If demonstrating a pill, stencil the article body. If demonstrating a panel, stencil the chat messages. Keep the interactive element fully rendered.

---

## Timing guidelines

| Moment | Duration |
|---|---|
| Hover highlight | Held for 800–1200ms |
| Action → response | 600–900ms gap (feels deliberate) |
| Settled hold | 1500–2500ms (let it breathe) |
| Reset pause | 600–1000ms before restarting |
| Total cycle | 6000–9000ms |

Keep cycles between 6–9 seconds. Shorter feels rushed; longer loses attention.

---

## Page header

```tsx
<div className="max-w-[1060px] mx-auto px-10 pt-14 pb-6">
  <p style={{ color: "#333331", fontFamily: "monospace" }} className="text-[10px] uppercase tracking-[0.15em] mb-3">
    Design Specs · {ComponentName}
  </p>
  <h2 className="text-[34px] font-bold mb-4" style={{ color: "#F0F0EE" }}>
    {PageTitle}
  </h2>
  <p className="text-[14px] leading-[1.8] max-w-[500px]" style={{ color: "#484846" }}>
    {One or two sentences: what the component is, the core insight about it.}
  </p>
</div>
```

---

## Checklist for a new spec sheet

- [ ] One widget per section — each tells exactly one story
- [ ] Stencil everything that isn't the interaction being demonstrated
- [ ] `inView` resets to `step 0` — animation always replays from the start
- [ ] Timings: hover holds long enough to read, response gap feels real, settle holds 1.5s+
- [ ] Section `desc` explains the *why*, bullets cover the *what*
- [ ] Tag label is 1–2 words, matches the context (page name, component name, state name)
- [ ] Number badges are zero-padded strings: `"01"`, `"02"`, etc.
- [ ] Sections ordered by user journey: earliest touchpoint first
