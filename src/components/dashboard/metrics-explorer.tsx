"use client";

import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { TextureCardStyled } from "@/components/ui/texture-card";
import { conversionSeries } from "@/data/conversion";
import { kpis, type Kpi } from "@/data/kpis";
import { cn } from "@/lib/utils";

import { TrendChart } from "./trend-chart";

/**
 * Banda de KPIs + gráfica principal conectadas: al seleccionar un
 * indicador, la gráfica muestra su serie de los últimos seis meses.
 */

const months = conversionSeries.map((p) => p.month);

const SPARK_W = 92;
const SPARK_H = 34;
const SPARK_PAD = 4;

function Sparkline({
  values,
  onHighlight,
}: {
  values: number[];
  onHighlight: boolean;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((value, index) => ({
    x: SPARK_PAD + (index / (values.length - 1)) * (SPARK_W - SPARK_PAD * 2),
    y: SPARK_PAD + ((max - value) / range) * (SPARK_H - SPARK_PAD * 2),
  }));
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const area = `${line} L ${points[points.length - 1].x} ${SPARK_H} L ${points[0].x} ${SPARK_H} Z`;
  const last = points[points.length - 1];
  const stroke = onHighlight ? "#FFFFFF" : "#4F46E5";

  return (
    <svg
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      width={SPARK_W}
      height={SPARK_H}
      aria-hidden
      className="shrink-0"
    >
      <path d={area} fill={stroke} opacity={onHighlight ? 0.22 : 0.1} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={last.x}
        cy={last.y}
        r="3"
        fill={onHighlight ? "#4F46E5" : "#FFFFFF"}
        stroke={stroke}
        strokeWidth="1.75"
      />
    </svg>
  );
}

function KpiCell({
  kpi,
  index,
  selected,
  onSelect,
}: {
  kpi: Kpi;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const DeltaIcon = kpi.direction === "up" ? TrendingUp : TrendingDown;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Ver la gráfica de ${kpi.label}`}
      className={cn(
        "flex flex-col justify-between gap-5 p-5 text-left transition-colors duration-300",
        selected
          ? "bg-indigo-600 text-white"
          : "bg-white text-neutral-900 hover:bg-indigo-50/40",
        index % 2 === 1 && "sm:border-l",
        index >= 2 && "sm:border-t",
        "border-neutral-200/80 focus-visible:z-10",
      )}
    >
      <span
        className={cn(
          "text-[13px] leading-snug",
          selected ? "text-indigo-100" : "text-neutral-500",
        )}
      >
        {kpi.label}
      </span>
      <span className="flex items-end justify-between gap-3">
        <span className="space-y-1.5">
          <span className="block text-[28px] font-semibold leading-none tracking-tight tabular-nums">
            {kpi.value}
          </span>
          <span
            className={cn(
              "flex items-center gap-1 text-[12px] tabular-nums",
              selected ? "text-indigo-100" : "text-emerald-700",
            )}
          >
            <DeltaIcon className="size-3.5" aria-hidden />
            {kpi.delta}
          </span>
        </span>
        <Sparkline values={kpi.trend} onHighlight={selected} />
      </span>
    </button>
  );
}

export function MetricsExplorer() {
  const [selectedId, setSelectedId] = React.useState(kpis[0].id);
  const selected = kpis.find((k) => k.id === selectedId) ?? kpis[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <TextureCardStyled className="h-full">
        <div className="grid h-full grid-cols-1 overflow-hidden rounded-[20px] sm:grid-cols-2">
          {kpis.map((kpi, index) => (
            <KpiCell
              key={kpi.id}
              kpi={kpi}
              index={index}
              selected={kpi.id === selectedId}
              onSelect={() => setSelectedId(kpi.id)}
            />
          ))}
        </div>
      </TextureCardStyled>

      <TrendChart
        title={selected.label}
        hint={selected.chartHint}
        months={months}
        values={selected.trend}
        unit={selected.unit}
      />
    </div>
  );
}
