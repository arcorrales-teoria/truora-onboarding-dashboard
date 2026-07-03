"use client";

import * as React from "react";

import { TextureCardStyled } from "@/components/ui/texture-card";
import { conversionSeries } from "@/data/conversion";

const VIEW_W = 620;
const VIEW_H = 232;
const PAD = { top: 26, right: 24, bottom: 30, left: 42 };
const Y_MIN = 70;
const Y_MAX = 92;
const GRID_STEPS = [70, 75, 80, 85, 90];

function scaleX(index: number) {
  const innerW = VIEW_W - PAD.left - PAD.right;
  return PAD.left + (index / (conversionSeries.length - 1)) * innerW;
}

function scaleY(value: number) {
  const innerH = VIEW_H - PAD.top - PAD.bottom;
  return PAD.top + ((Y_MAX - value) / (Y_MAX - Y_MIN)) * innerH;
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

export function ConversionChart() {
  const [hover, setHover] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const points = conversionSeries.map((p, i) => ({
    x: scaleX(i),
    y: scaleY(p.value),
  }));
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    VIEW_H - PAD.bottom
  } L ${points[0].x} ${VIEW_H - PAD.bottom} Z`;

  const last = points[points.length - 1];
  const active = hover ?? conversionSeries.length - 1;
  const activePoint = points[active];

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
          <div>
            <h3 className="text-[15px] font-semibold text-neutral-900">
              Conversión del flujo
            </h3>
            <p className="mt-0.5 text-[12.5px] text-neutral-500">
              Validaciones completadas sobre iniciadas, por mes.
            </p>
          </div>
          <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] text-neutral-500">
            Ene - Jun 2026
          </span>
        </div>

        <div className="relative mt-4 flex-1">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full touch-none select-none"
            role="img"
            aria-label={`Conversión mensual del flujo, de ${conversionSeries[0].value}% en ${conversionSeries[0].month} a ${conversionSeries.at(-1)?.value}% en ${conversionSeries.at(-1)?.month}`}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setHover(null)}
          >
            <defs>
              <linearGradient id="conv-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
              </linearGradient>
            </defs>

            {GRID_STEPS.map((step) => (
              <g key={step}>
                <line
                  x1={PAD.left}
                  x2={VIEW_W - PAD.right}
                  y1={scaleY(step)}
                  y2={scaleY(step)}
                  stroke="#E4E7EF"
                  strokeDasharray="2 5"
                />
                <text
                  x={PAD.left - 8}
                  y={scaleY(step) + 3.5}
                  textAnchor="end"
                  className="fill-neutral-400 font-mono text-[10px]"
                >
                  {step}%
                </text>
              </g>
            ))}

            {conversionSeries.map((p, i) => (
              <text
                key={p.month}
                x={scaleX(i)}
                y={VIEW_H - 8}
                textAnchor="middle"
                className={
                  i === active
                    ? "fill-indigo-600 font-mono text-[10.5px] font-medium"
                    : "fill-neutral-400 font-mono text-[10.5px]"
                }
              >
                {p.month}
              </text>
            ))}

            <path d={areaPath} fill="url(#conv-area)" />
            <path
              d={linePath}
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Guía vertical del punto activo */}
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
                key={conversionSeries[i].month}
                cx={p.x}
                cy={p.y}
                r={i === active ? 4.5 : 3}
                fill="#fff"
                stroke="#4F46E5"
                strokeWidth="2"
              />
            ))}

            {/* Punto final siempre marcado, estilo Yuno */}
            <circle cx={last.x} cy={last.y} r="7" fill="#4F46E5" opacity="0.15" />
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
            <div className="rounded-full bg-neutral-900 px-2.5 py-1 font-mono text-[11px] text-white shadow-sm">
              {conversionSeries[active].value}%
            </div>
          </div>
        </div>
      </div>
    </TextureCardStyled>
  );
}
