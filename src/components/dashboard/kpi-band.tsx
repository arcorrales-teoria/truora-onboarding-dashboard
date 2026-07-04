import { TrendingDown, TrendingUp } from "lucide-react";

import { TextureCardStyled } from "@/components/ui/texture-card";
import { kpis } from "@/data/kpis";
import { cn } from "@/lib/utils";

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

export function KpiBand() {
  return (
    <TextureCardStyled className="h-full">
      <div className="grid h-full grid-cols-1 overflow-hidden rounded-[20px] sm:grid-cols-2">
        {kpis.map((kpi, index) => {
          const DeltaIcon = kpi.direction === "up" ? TrendingUp : TrendingDown;
          return (
            <div
              key={kpi.id}
              className={cn(
                "flex flex-col justify-between gap-5 p-5",
                kpi.highlight
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-neutral-900",
                !kpi.highlight && index % 2 === 1 && "sm:border-l",
                !kpi.highlight && index >= 2 && "sm:border-t",
                "border-neutral-200/80",
              )}
            >
              <p
                className={cn(
                  "text-[13px] leading-snug",
                  kpi.highlight ? "text-indigo-100" : "text-neutral-500",
                )}
              >
                {kpi.label}
              </p>
              <div className="flex items-end justify-between gap-3">
                <div className="space-y-1.5">
                  <p className="text-[28px] font-semibold leading-none tracking-tight tabular-nums">
                    {kpi.value}
                  </p>
                  <p
                    className={cn(
                      "flex items-center gap-1 text-[12px] tabular-nums",
                      kpi.highlight ? "text-indigo-100" : "text-emerald-700",
                    )}
                  >
                    <DeltaIcon className="size-3.5" aria-hidden />
                    {kpi.delta}
                  </p>
                </div>
                <Sparkline values={kpi.trend} onHighlight={!!kpi.highlight} />
              </div>
            </div>
          );
        })}
      </div>
    </TextureCardStyled>
  );
}
