"use client";

import * as React from "react";
import { CircleCheck } from "lucide-react";

import { TextureCardStyled, TextureSeparator } from "@/components/ui/texture-card";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  flowEdges,
  flowNodes,
  type FlowNode,
  type FlowStatusTone,
} from "@/data/flow";
import { cn } from "@/lib/utils";

import { flowIcons } from "./icons";

interface EdgeGeometry {
  key: string;
  path: string;
  parallel: boolean;
  share?: string;
  midX: number;
  midY: number;
}

const toneDot: Record<FlowStatusTone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

function cubicMidpoint(
  x1: number,
  y1: number,
  c1x: number,
  c1y: number,
  c2x: number,
  c2y: number,
  x2: number,
  y2: number,
) {
  return {
    x: (x1 + 3 * c1x + 3 * c2x + x2) / 8,
    y: (y1 + 3 * c1y + 3 * c2y + y2) / 8,
  };
}

/** Escala mínima antes de permitir scroll horizontal (legibilidad). */
const MIN_SCALE = 0.55;

export interface RoutingCanvasProps {
  /** Nodo que está procesando la simulación (pulsa en índigo). */
  activeNodeId?: string | null;
  /** Nodos ya recorridos por la simulación. */
  visitedNodeIds?: string[];
  /** Conexiones ya recorridas, como llaves "from-to". */
  traversedEdges?: string[];
  /** true mientras corre una simulación: atenúa lo no recorrido. */
  simulating?: boolean;
}

export function RoutingCanvas({
  activeNodeId = null,
  visitedNodeIds = [],
  traversedEdges = [],
  simulating = false,
}: RoutingCanvasProps) {
  const nodeRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = React.useRef<HTMLDivElement>(null);
  const outerRef = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState<EdgeGeometry[]>([]);
  const [scale, setScale] = React.useState(1);

  const measure = React.useCallback(() => {
    const next: EdgeGeometry[] = [];
    for (const edge of flowEdges) {
      const from = nodeRefs.current[edge.from];
      const to = nodeRefs.current[edge.to];
      if (!from || !to) continue;

      const x1 = from.offsetLeft + from.offsetWidth;
      const y1 = from.offsetTop + from.offsetHeight / 2;
      const x2 = to.offsetLeft;
      const y2 = to.offsetTop + to.offsetHeight / 2;
      const bend = Math.max(48, (x2 - x1) / 2.1);
      const c1x = x1 + bend;
      const c2x = x2 - bend;
      const mid = cubicMidpoint(x1, y1, c1x, y1, c2x, y2, x2, y2);

      next.push({
        key: `${edge.from}-${edge.to}`,
        path: `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`,
        parallel: Boolean(edge.parallel),
        share: edge.share,
        midX: mid.x,
        midY: mid.y,
      });
    }
    setEdges(next);
  }, []);

  React.useLayoutEffect(() => {
    measure();

    const outer = outerRef.current;
    const fit = () => {
      if (!outer) return;
      const available = outer.clientWidth;
      setScale(Math.max(MIN_SCALE, Math.min(1, available / CANVAS_WIDTH)));
    };
    fit();

    const observer = new ResizeObserver(() => {
      measure();
      fit();
    });
    if (outer) observer.observe(outer);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div
      ref={outerRef}
      className="overflow-x-auto rounded-[24px] border border-neutral-200/80 bg-white"
    >
      <div
        style={{
          width: CANVAS_WIDTH * scale,
          height: CANVAS_HEIGHT * scale,
        }}
      >
      <div
        ref={containerRef}
        className="dot-grid relative origin-top-left"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <svg
          className="pointer-events-none absolute inset-0"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          aria-hidden
        >
          {edges.map((edge) => {
            const traversed = traversedEdges.includes(edge.key);
            return (
              <g key={edge.key} opacity={simulating && !traversed ? 0.35 : 1}>
                <path
                  d={edge.path}
                  fill="none"
                  stroke={
                    traversed
                      ? "#4F46E5"
                      : edge.parallel
                        ? "#C7CBF4"
                        : "#B5BAF2"
                  }
                  strokeWidth={traversed ? 2 : 1.5}
                  strokeDasharray={
                    edge.parallel && !traversed ? "3 6" : undefined
                  }
                />
                {(traversed || (!edge.parallel && !simulating)) && (
                  <path
                    d={edge.path}
                    fill="none"
                    stroke={traversed ? "#818CF8" : "#4F46E5"}
                    strokeWidth="1.5"
                    strokeDasharray="5 16"
                    strokeLinecap="round"
                    className="route-flow"
                    opacity="0.9"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Insignias de porcentaje sobre las rutas */}
        {edges
          .filter((edge) => edge.share)
          .map((edge) => (
            <div
              key={`badge-${edge.key}`}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: edge.midX, top: edge.midY }}
            >
              <div className="flex size-11 items-center justify-center rounded-full border border-dashed border-indigo-400 bg-white font-mono text-[11px] font-medium text-indigo-600 shadow-sm">
                {edge.share}
              </div>
            </div>
          ))}

        {flowNodes.map((node) => {
          const state = simulating
            ? node.id === activeNodeId
              ? "active"
              : visitedNodeIds.includes(node.id)
                ? "visited"
                : "dim"
            : "idle";
          return (
            <FlowNodeCard
              key={node.id}
              node={node}
              state={state}
              ref={(el) => {
                nodeRefs.current[node.id] = el;
              }}
            />
          );
        })}
      </div>
      </div>
    </div>
  );
}

type NodeState = "idle" | "dim" | "visited" | "active";

const FlowNodeCard = React.forwardRef<
  HTMLDivElement,
  { node: FlowNode; state?: NodeState }
>(function FlowNodeCard({ node, state = "idle" }, ref) {
    const Icon = flowIcons[node.icon];
    const isWhatsApp = node.icon === "whatsapp";

    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-[280px] rounded-[24px] transition-all duration-300",
          state === "dim" && "opacity-45",
          state === "active" && "sim-active z-10",
          state === "visited" &&
            "shadow-[0_0_0_1.5px_rgb(129_140_248_/_0.9)]",
        )}
        style={{ left: node.x, top: node.y }}
      >
        <TextureCardStyled>
          <div className="rounded-[20px] bg-white">
            <div className="flex items-start gap-3 p-4">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-[10px]",
                  isWhatsApp
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-indigo-50 text-indigo-600",
                )}
              >
                <Icon className="size-4.5" strokeWidth={1.75} aria-hidden />
              </div>
              <div className="min-w-0">
                {node.kicker && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-neutral-500">
                    {node.kicker}
                  </p>
                )}
                <h4 className="text-[14px] font-semibold leading-snug text-neutral-900">
                  {node.title}
                </h4>
              </div>
            </div>

            {node.description && (
              <p className="px-4 pb-3 text-[12.5px] leading-relaxed text-neutral-500">
                {node.description}
              </p>
            )}

            {node.fields && (
              <>
                <TextureSeparator />
                <dl className="space-y-1.5 p-4">
                  {node.fields.map((field) => (
                    <div
                      key={field.label}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <dt className="text-[12px] text-neutral-500">
                        {field.label}
                      </dt>
                      <dd className="truncate font-mono text-[12px] text-neutral-800">
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {node.chips && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-4">
                {node.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}

            {node.list && (
              <>
                <TextureSeparator />
                <ul className="space-y-2.5 p-4">
                  {node.list.map((item) => (
                    <li key={item.label} className="flex items-center gap-2.5">
                      <span
                        className="size-1.5 rounded-full bg-indigo-500"
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-neutral-800">
                          {item.label}
                        </p>
                        <p className="truncate text-[11.5px] text-neutral-500">
                          {item.sublabel}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {node.statuses && (
              <>
                <TextureSeparator />
                <ul className="p-2">
                  {node.statuses.map((status) => (
                    <li
                      key={status.label}
                      className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-neutral-50"
                    >
                      <span className="flex items-center gap-2 text-[13px] text-neutral-700">
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            toneDot[status.tone],
                          )}
                          aria-hidden
                        />
                        {status.label}
                      </span>
                      {status.value && (
                        <span className="font-mono text-[12px] tabular-nums text-neutral-500">
                          {status.value}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {node.footnote && (
              <>
                <TextureSeparator />
                <p className="flex items-center gap-1.5 p-3.5 text-[12px] text-neutral-500">
                  <CircleCheck
                    className="size-3.5 text-emerald-500"
                    aria-hidden
                  />
                  {node.footnote}
                </p>
              </>
            )}
          </div>
        </TextureCardStyled>
      </div>
    );
  },
);
