import type { ReactNode } from "react";
import { clamp } from "@/lib/engine";
import { round } from "@/lib/utils";

const COLORS = ["var(--color-cyan)", "var(--color-violet)", "#ff4fd8", "var(--color-green)"];

export function LineChart({
  series,
  labels,
  max = 100,
  min = 0,
  width = 760,
  height = 250,
}: {
  series: number[][];
  labels: string[];
  max?: number;
  min?: number;
  width?: number;
  height?: number;
}) {
  const pad = { l: 36, r: 15, t: 16, b: 28 };
  const cw = width - pad.l - pad.r;
  const ch = height - pad.t - pad.b;
  return (
    <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {Array.from({ length: 5 }, (_, i) => {
        const y = pad.t + (ch / 4) * i;
        return (
          <g key={i}>
            <line x1={pad.l} x2={width - pad.r} y1={y} y2={y} className="chart-grid" />
            <text x={4} y={y + 4} className="chart-label">
              {Math.round(max - ((max - min) * i) / 4)}
            </text>
          </g>
        );
      })}
      {labels.map((lab, i) => {
        const x = pad.l + (cw / (labels.length - 1 || 1)) * i;
        return (
          <text key={lab + i} x={x} y={height - 6} textAnchor="middle" className="chart-label">
            {lab}
          </text>
        );
      })}
      {series.map((vals, si) => {
        const pts = vals.map((v, i) => {
          const x = pad.l + (cw / (vals.length - 1 || 1)) * i;
          const y = pad.t + ch - clamp((v - min) / (max - min), 0, 1) * ch;
          return [x, y] as const;
        });
        const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
        const color = COLORS[si % COLORS.length];
        return (
          <g key={si}>
            <path d={d} className="chart-line" stroke={color} />
            {pts.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function BarChart({
  rows,
  max = 100,
}: {
  rows: [string, number][];
  max?: number;
}) {
  return (
    <div className="bar-chart">
      {rows.map(([label, value]) => (
        <div className="bar-group" key={label}>
          <span className="bar-value">{round(value)}</span>
          <div className="bar" style={{ height: `${clamp((value / max) * 100)}%` }} />
          <span className="bar-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function HBarChart({ rows }: { rows: [string, number][] }) {
  return (
    <div className="bar-chart horizontal">
      {rows.map(([label, value]) => (
        <div className="hbar-row" key={label}>
          <span>{label}</span>
          <div className="hbar-track">
            <i style={{ width: `${clamp(value)}%` }} />
          </div>
          <strong>{round(value)}</strong>
        </div>
      ))}
    </div>
  );
}

export function RiskBars({ rows }: { rows: [string, number][] }) {
  return (
    <div className="risk-bars">
      {rows.map(([label, value]) => (
        <div className="risk-row" key={label}>
          <span>{label}</span>
          <div className="risk-track">
            <i style={{ width: `${clamp(value)}%` }} />
          </div>
          <strong>{round(value)}</strong>
        </div>
      ))}
    </div>
  );
}

export function Donut({
  value,
  className = "",
  from = "var(--color-cyan)",
  to = "var(--color-violet)",
  children,
}: {
  value: number;
  className?: string;
  from?: string;
  to?: string;
  children: ReactNode;
}) {
  const deg = clamp(value) * 3.6;
  return (
    <div
      className={`donut ${className}`}
      style={{
        background: `conic-gradient(${from} 0deg, ${to} ${deg}deg, rgb(89 106 138 / 12%) ${deg}deg)`,
      }}
    >
      <div>{children}</div>
    </div>
  );
}

export function RadarChart({
  axes,
  values,
}: {
  axes: string[];
  values: number[];
}) {
  const cx = 230;
  const cy = 178;
  const R = 130;
  const n = axes.length;
  const levels = [1, 2, 3, 4];
  const pts = values.map((v, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const r = R * (v / 100);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });
  return (
    <div className="radar-wrap">
      <svg viewBox="0 0 500 360">
        {levels.map((level) => {
          const poly = axes
            .map((_, i) => {
              const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
              const r = R * (level / 4);
              return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
            })
            .join(" ");
          return <polygon key={level} points={poly} className="radar-grid" />;
        })}
        {axes.map((label, i) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          const x = cx + Math.cos(a) * R;
          const y = cy + Math.sin(a) * R;
          return (
            <g key={label}>
              <line x1={cx} y1={cy} x2={x} y2={y} className="radar-axis" />
              <text
                x={cx + Math.cos(a) * (R + 28)}
                y={cy + Math.sin(a) * (R + 24)}
                textAnchor="middle"
                className="chart-label"
              >
                {label}
              </text>
            </g>
          );
        })}
        <polygon points={pts.map((p) => p.join(",")).join(" ")} className="radar-shape" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={4} className="radar-point" />
        ))}
      </svg>
      <div className="radar-legend">
        {axes.map((a, i) => (
          <div key={a}>
            <span>{a}</span>
            <strong>{round(values[i] ?? 0)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ForecastBars({ values }: { values: number[] }) {
  return (
    <div className="forecast-chart" style={{ height: 92, marginTop: 12 }}>
      {values.map((v, i) => (
        <div
          key={i}
          className="forecast-bar"
          data-value={round(v)}
          style={{ height: `${35 + v * 0.7}%` }}
        />
      ))}
    </div>
  );
}

export function Axes3D() {
  return (
    <svg className="axes-art" viewBox="0 0 160 110" aria-hidden="true">
      <defs>
        <linearGradient id="axX" x1="0" x2="1">
          <stop offset="0%" stopColor="#29e7ff" />
          <stop offset="100%" stopColor="#4d7dff" />
        </linearGradient>
        <linearGradient id="axY" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#29e7ff" />
          <stop offset="100%" stopColor="#9b5cff" />
        </linearGradient>
      </defs>
      <line x1="22" y1="88" x2="148" y2="88" stroke="url(#axX)" strokeWidth="1.6" />
      <line x1="22" y1="88" x2="22" y2="14" stroke="url(#axY)" strokeWidth="1.6" />
      <line x1="22" y1="88" x2="78" y2="48" stroke="#40e5a1" strokeWidth="1.4" opacity="0.85" />
      <path
        d="M22 88 L22 30 L78 8 L148 8 L148 66 L78 88 Z"
        fill="none"
        stroke="rgb(41 231 255 / 22%)"
        strokeWidth="1"
      />
      <path d="M22 30 L78 8 L78 66 L22 88 Z" fill="rgb(41 231 255 / 6%)" />
      <circle cx="86" cy="46" r="6" fill="#29e7ff" opacity="0.95" />
      <circle cx="86" cy="46" r="12" fill="none" stroke="#29e7ff" opacity="0.35" />
      <text x="150" y="92" fill="#6d819d" fontSize="9">
        X
      </text>
      <text x="8" y="16" fill="#6d819d" fontSize="9">
        Y
      </text>
      <text x="80" y="46" fill="#6d819d" fontSize="9">
        Z
      </text>
    </svg>
  );
}
