// The hero's one visual: a full-precision signal and the same signal quantized
// to a handful of levels — model compression, drawn.
const W = 960
const H = 180
const N = 240
const LEVELS = 8 // 3-bit

function f(x: number) {
  // A few overlapping waves so it reads as "real data", not a textbook sine.
  return (
    0.55 * Math.sin(x * 2.1) +
    0.28 * Math.sin(x * 5.3 + 0.7) +
    0.17 * Math.sin(x * 11.7 + 1.9)
  )
}

const pts = Array.from({ length: N + 1 }, (_, i) => {
  const t = i / N
  return { x: t * W, y: f(t * Math.PI * 2.4) }
})
const toY = (v: number) => H / 2 - v * (H / 2 - 12)

const smooth = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${toY(p.y).toFixed(1)}`).join(' ')

const step = 2 / (LEVELS - 1)
const STRIDE = 8 // sample-and-hold every few points
let quant = ''
for (let i = 0; i <= N; i += STRIDE) {
  const p = pts[i]
  const q = Math.round((p.y + 1) / step) * step - 1
  const y = toY(Math.max(-1, Math.min(1, q))).toFixed(1)
  const x0 = p.x.toFixed(1)
  const x1 = Math.min(W, p.x + (STRIDE / N) * W).toFixed(1)
  quant += `${i ? 'V' : `M${x0},`}${y} H${x1} `
}

export default function QuantizedSignal() {
  return (
    <figure className="mt-14">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="A smooth signal and its 3-bit quantized version drawn as steps"
      >
        {Array.from({ length: LEVELS }, (_, i) => (
          <line
            key={i}
            x1={0}
            x2={W}
            y1={toY(-1 + i * step)}
            y2={toY(-1 + i * step)}
            className="stroke-line"
            strokeWidth={1}
            strokeDasharray="2 6"
          />
        ))}
        <path d={smooth} fill="none" className="stroke-muted/60" strokeWidth={1.5} />
        <path
          d={quant}
          fill="none"
          className="stroke-signal quant-path"
          strokeWidth={2.5}
          strokeLinejoin="round"
          pathLength={1}
        />
      </svg>
      <figcaption className="mt-3 text-sm text-muted flex flex-wrap gap-x-6 gap-y-1">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-5 h-px bg-muted" aria-hidden /> full precision
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-5 h-0.5 bg-signal" aria-hidden /> quantized to 3 bits
        </span>
        <span>Model compression in one picture: the same signal stored with only 8 levels keeps its shape while using far fewer bits.</span>
      </figcaption>
      <style>{`
        .quant-path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: quant-draw 2.2s 0.3s cubic-bezier(.6,0,.2,1) forwards; }
        @keyframes quant-draw { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) { .quant-path { animation: none; stroke-dashoffset: 0; } }
      `}</style>
    </figure>
  )
}
