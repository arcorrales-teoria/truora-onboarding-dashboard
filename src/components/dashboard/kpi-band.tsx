import { TrendingDown, TrendingUp } from "lucide-react";

import { TextureCardStyled } from "@/components/ui/texture-card";
import { kpis } from "@/data/kpis";
import { cn } from "@/lib/utils";

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
                "flex flex-col justify-between gap-6 p-5",
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
              <div className="space-y-1.5">
                <p className="text-[30px] font-semibold leading-none tracking-tight tabular-nums">
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
            </div>
          );
        })}
      </div>
    </TextureCardStyled>
  );
}
