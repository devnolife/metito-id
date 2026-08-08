import type { SeriesPoint } from "@/types/portal";
import { cn } from "@/lib/utils";

/** Tiny inline sparkline for KPI cards. Pure SVG, no dependency. */
export function Sparkline({
  data,
  className,
  stroke = "currentColor",
  width = 96,
  height = 32,
}: {
  data: number[];
  className?: string;
  stroke?: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / span) * (height - 4) - 2]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${d} L${width} ${height} L0 ${height} Z`;
  const id = `spark-${data.join("-").slice(0, 12)}-${data.length}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Area / line chart with grid + axis labels. */
export function AreaChart({
  series,
  height = 240,
  unit = "",
  valuePrefix = "",
  color = "var(--ac-brand)",
  className,
}: {
  series: SeriesPoint[];
  height?: number;
  unit?: string;
  valuePrefix?: string;
  color?: string;
  className?: string;
}) {
  const W = 720;
  const H = height;
  const padL = 52;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const values = series.map((s) => s.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = min - (max - min) * 0.15;
  const hi = max + (max - min) * 0.15;
  const span = hi - lo || 1;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const x = (i: number) => padL + (i / (series.length - 1)) * innerW;
  const y = (v: number) => padT + innerH - ((v - lo) / span) * innerH;

  const line = series.map((s, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(s.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(series.length - 1).toFixed(1)} ${padT + innerH} L${padL} ${padT + innerH} Z`;
  const ticks = 4;
  const gridVals = Array.from({ length: ticks + 1 }, (_, i) => lo + (span * i) / ticks);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full", className)} role="img" aria-label="Trend chart">
      <defs>
        <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridVals.map((v, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="var(--ac-line)" strokeWidth="1" opacity="0.5" />
          <text x={padL - 10} y={y(v) + 4} textAnchor="end" className="fill-tag" style={{ fontSize: 11 }}>
            {valuePrefix}
            {Math.round(v)}
            {unit}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#area-fill)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {series.map((s, i) => (
        <g key={s.label}>
          <circle cx={x(i)} cy={y(s.value)} r="3" fill="var(--ac-bg)" stroke={color} strokeWidth="2" />
          <text x={x(i)} y={H - 8} textAnchor="middle" className="fill-tag" style={{ fontSize: 11 }}>
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Vertical bar chart. */
export function BarChart({
  series,
  height = 240,
  unit = "",
  color = "var(--ac-brand)",
  className,
}: {
  series: SeriesPoint[];
  height?: number;
  unit?: string;
  color?: string;
  className?: string;
}) {
  const W = 720;
  const H = height;
  const padL = 52;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const values = series.map((s) => s.value);
  const max = Math.max(...values) * 1.12;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const band = innerW / series.length;
  const barW = Math.min(band * 0.5, 46);
  const y = (v: number) => padT + innerH - (v / max) * innerH;
  const ticks = 4;
  const gridVals = Array.from({ length: ticks + 1 }, (_, i) => (max * i) / ticks);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full", className)} role="img" aria-label="Bar chart">
      {gridVals.map((v, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="var(--ac-line)" strokeWidth="1" opacity="0.5" />
          <text x={padL - 10} y={y(v) + 4} textAnchor="end" className="fill-tag" style={{ fontSize: 11 }}>
            {Math.round(v)}
            {unit}
          </text>
        </g>
      ))}
      {series.map((s, i) => {
        const cx = padL + band * i + band / 2;
        const top = y(s.value);
        return (
          <g key={s.label}>
            <rect
              x={cx - barW / 2}
              y={top}
              width={barW}
              height={padT + innerH - top}
              rx="3"
              fill={color}
              opacity={i === series.length - 1 ? 1 : 0.55}
            />
            <text x={cx} y={H - 8} textAnchor="middle" className="fill-tag" style={{ fontSize: 11 }}>
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Donut for category / utilisation splits. */
export function DonutChart({
  segments,
  size = 180,
  thickness = 22,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;

  // pre-compute each segment's length and start offset without any mutation
  const lengths = segments.map((s) => (s.value / total) * circ);
  const arcs = segments.map((seg, i) => ({
    seg,
    len: lengths[i],
    offset: lengths.slice(0, i).reduce((sum, l) => sum + l, 0),
  }));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Distribution">
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--ac-line)" strokeWidth={thickness} opacity="0.4" />
      {arcs.map(({ seg, len, offset }) => (
        <circle
          key={seg.label}
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={thickness}
          strokeDasharray={`${len} ${circ - len}`}
          strokeDashoffset={-offset}
          transform={`rotate(-90 ${c} ${c})`}
          strokeLinecap="butt"
        />
      ))}
      {centerValue ? (
        <text x={c} y={c - 2} textAnchor="middle" className="fill-navy" style={{ fontSize: 22, fontWeight: 600 }}>
          {centerValue}
        </text>
      ) : null}
      {centerLabel ? (
        <text x={c} y={c + 16} textAnchor="middle" className="fill-tag" style={{ fontSize: 11 }}>
          {centerLabel}
        </text>
      ) : null}
    </svg>
  );
}
