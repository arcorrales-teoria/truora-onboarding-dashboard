"use client";

import * as React from "react";
import { motion } from "motion/react";

import { TextureCardStyled } from "@/components/ui/texture-card";

/**
 * Gráfica de tendencia de seis meses. Genérica: recibe la serie, la
 * unidad y los textos; el dominio y las líneas guía se calculan solos.
 */

const VIEW_W = 620;
const VIEW_H = 232;
const PAD = { top: 26, right: 24, bottom: 30, left: 46 };

interface TrendChartProps {
  title: string;
  hint: string;
  months: string[];
  values: number[];
  unit: "%" | "s";
}

function niceDomain(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max((max - min) * 0.25, 1);
  const lo = Math.floor(min - pad);
  const hi = Math.ceil(max + pad * 0.6);
  const step = Math.max(1, Math.ceil((hi - lo) / 4));
  const start = Math.floor(lo / step) * step;
  const ticks: number[] = [];
  for (let t = start; t <= hi; t += step) ticks.push(t);
  return { lo: ticks[0], hi: Math.max(hi, ticks[ticks.length - 1]), ticks };
}

/** Curva suave (Catmull–Rom convertida a segmentos Bézier). */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function TrendChart({ title, hint, months, values, unit }: TrendChartProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const { lo, hi, ticks } = niceDomain(values);
  const scaleX = (index: number) =>
    PAD.left +
    (index / (values.length - 1)) * (VIEW_W - PAD.left - PAD.right);
  const scaleY = (value: number) =>
    PAD.top + ((hi - value) / (hi - lo)) * (VIEW_H - PAD.top - PAD.bottom);

  const points = values.map((v, i) => ({ x: scaleX(i), y: scaleY(v) }));
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${VIEW_H - PAD.bottom} L ${points[0].x} ${VIEW_H - PAD.bottom} Z`;

  const last = points[points.length - 1];
  const active = hover ?? values.length - 1;
  const activePoint = points[active];
  const format = (v: number) => (unit === "%" ? `${v}%` : `${v} s`);

  function onPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * VIEW_W;
    let nearest = 0;
    let best = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setHover(nearest);
  }

  return (
    <TextureCardStyled className="h-full">
      <div className="flex h-full flex-col rounded-[20px] bg-white p-5">
        <div className="flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <motion.h3
              key={title}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="truncate text-[15px] font-semibold text-neutral-900"
            >
              {title}
            </motion.h3>
            <p className="mt-0.5 text-[12.5px] text-neutral-500">{hint}</p>
          </div>
          <span className="shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] text-neutral-500">
            Ene - Jun 2026
          </span>
        </div>

        <div className="relative mt-4 flex-1">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full touch-none select-none"
            role="img"
            aria-label={`${title}: de ${format(values[0])} en ${months[0]} a ${format(values[values.length - 1])} en ${months[months.length - 1]}`}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setHover(null)}
          >
            <defs>
              <linearGradient id="trend-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
              </linearGradient>
            </defs>

            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  x2={VIEW_W - PAD.right}
                  y1={scaleY(tick)}
                  y2={scaleY(tick)}
                  stroke="#E4E7EF"
                  strokeDasharray="2 5"
                />
                <text
                  x={PAD.left - 8}
                  y={scaleY(tick) + 3.5}
                  textAnchor="end"
                  className="fill-neutral-500 font-mono text-[10px]"
                >
                  {format(tick)}
                </text>
              </g>
            ))}

            {months.map((month, i) => (
              <text
                key={month}
                x={scaleX(i)}
                y={VIEW_H - 8}
                textAnchor="middle"
                className={
                  i === active
                    ? "fill-indigo-600 font-mono text-[10.5px] font-medium"
                    : "fill-neutral-500 font-mono text-[10.5px]"
                }
              >
                {month}
              </text>
            ))}

            <motion.g
              key={title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              <path d={areaPath} fill="url(#trend-area)" />
              <path
                d={linePath}
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <line
                x1={activePoint.x}
                x2={activePoint.x}
                y1={activePoint.y + 4}
                y2={VIEW_H - PAD.bottom}
                stroke="#4F46E5"
                strokeOpacity="0.35"
                strokeDasharray="2 4"
              />

              {points.map((p, i) => (
                <circle
                  key={months[i]}
                  cx={p.x}
                  cy={p.y}
                  r={i === active ? 4.5 : 3}
                  fill="#fff"
                  stroke="#4F46E5"
                  strokeWidth="2"
                />
              ))}
              <circle cx={last.x} cy={last.y} r="7" fill="#4F46E5" opacity="0.15" />
            </motion.g>
          </svg>

          {/* Píldora de valor sobre el punto activo */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(activePoint.x / VIEW_W) * 100}%`,
              top: `${(activePoint.y / VIEW_H) * 100}%`,
              marginTop: "-10px",
            }}
          >
            <div className="whitespace-nowrap rounded-full bg-neutral-900 px-2.5 py-1 font-mono text-[11px] text-white shadow-sm">
              {format(values[active])}
            </div>
          </div>
        </div>
      </div>
    </TextureCardStyled>
  );
}
