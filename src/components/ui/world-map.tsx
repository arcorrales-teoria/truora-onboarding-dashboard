"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import DottedMap from "dotted-map";

/**
 * Mapa de puntos con conexiones animadas (base: Aceternity world-map),
 * extendido para: recortar a una región (p. ej. LATAM), repetir la
 * animación en loop, etiquetar puntos y respetar prefers-reduced-motion.
 */

export interface MapRegion {
  lat: { min: number; max: number };
  lng: { min: number; max: number };
}

interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
  /** Lado de la etiqueta para evitar solapes. */
  labelSide?: "left" | "right";
}

interface MapDot {
  start: MapPoint;
  end: MapPoint;
}

interface MapProps {
  dots?: MapDot[];
  lineColor?: string;
  dotColor?: string;
  /** Región a dibujar; sin ella se dibuja el mundo completo. */
  region?: MapRegion;
  /** Repite el trazado de las líneas en loop. */
  loop?: boolean;
  showLabels?: boolean;
}

export default function WorldMap({
  dots = [],
  lineColor = "#4F46E5",
  dotColor = "#00000040",
  region,
  loop = false,
  showLabels = false,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  const { svgMap, viewBox, project } = useMemo(() => {
    const map = new DottedMap({
      height: region ? 90 : 100,
      grid: "diagonal",
      ...(region ? { region } : {}),
    });
    const rendered = map.getSVG({
      radius: 0.24,
      color: dotColor,
      shape: "circle",
      backgroundColor: "transparent",
    });
    const vb = rendered.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 800 400";
    const projectFn = region
      ? (lat: number, lng: number) => {
          const pin = map.getPin({ lat, lng });
          return { x: pin?.x ?? 0, y: pin?.y ?? 0 };
        }
      : (lat: number, lng: number) => ({
          x: (lng + 180) * (800 / 360),
          y: (90 - lat) * (400 / 180),
        });
    return { svgMap: rendered, viewBox: vb, project: projectFn };
  }, [region, dotColor]);

  const [, , vbWidth] = viewBox.split(" ").map(Number);
  /** Escala tipográfica y de radios relativa al viewBox. */
  const unit = vbWidth / 100;

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
  ) => {
    const midX = (start.x + end.x) / 2;
    const lift = Math.max(
      6 * unit,
      Math.hypot(end.x - start.x, end.y - start.y) * 0.25,
    );
    const midY = Math.min(start.y, end.y) - lift;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  // Puntos únicos (para pines y etiquetas sin duplicados).
  const uniquePoints = useMemo(() => {
    const seen = new Map<
      string,
      { x: number; y: number; label?: string; labelSide?: "left" | "right" }
    >();
    for (const dot of dots) {
      for (const point of [dot.start, dot.end]) {
        const projected = project(point.lat, point.lng);
        const key = `${projected.x.toFixed(1)}-${projected.y.toFixed(1)}`;
        const existing = seen.get(key);
        if (!existing || (!existing.label && point.label)) {
          seen.set(key, {
            ...projected,
            label: point.label,
            labelSide: point.labelSide,
          });
        }
      }
    }
    return [...seen.values()];
  }, [dots, project]);

  return (
    <div className="relative w-full select-none font-sans">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-auto w-full select-none"
        alt=""
        aria-hidden
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        role="img"
        aria-label="Mapa de LATAM con conexiones animadas entre países"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="8%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="92%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = project(dot.start.lat, dot.start.lng);
          const endPoint = project(dot.end.lat, dot.end.lng);
          return (
            <motion.path
              key={`path-${i}`}
              d={createCurvedPath(startPoint, endPoint)}
              fill="none"
              stroke="url(#path-gradient)"
              strokeWidth={0.45 * unit}
              initial={{ pathLength: reduced ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: 1.3,
                      delay: 0.35 * i,
                      ease: "easeOut",
                      ...(loop ? { repeat: Infinity, repeatDelay: 2.2 } : {}),
                    }
              }
            />
          );
        })}

        {uniquePoints.map((point, i) => (
          <g key={`point-${i}`}>
            <circle cx={point.x} cy={point.y} r={0.8 * unit} fill={lineColor} />
            {!reduced && (
              <circle
                cx={point.x}
                cy={point.y}
                r={0.8 * unit}
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from={0.8 * unit}
                  to={3 * unit}
                  dur="1.6s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.6s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            {showLabels && point.label && (
              <text
                x={
                  point.labelSide === "left"
                    ? point.x - 1.4 * unit
                    : point.x + 1.4 * unit
                }
                y={point.y + 0.5 * unit}
                textAnchor={point.labelSide === "left" ? "end" : "start"}
                fontSize={2.4 * unit}
                fontFamily="var(--font-geist-mono), monospace"
                fill="#3F3F46"
                stroke="#FFFFFF"
                strokeWidth={0.5 * unit}
                paintOrder="stroke"
              >
                {point.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
