import { TextureCardStyled } from "@/components/ui/texture-card";
import { MAP_COLS, mapMarkers, mapRows } from "@/data/map-data";
import { cn } from "@/lib/utils";

const CELL = 13;
const DOT_R = 2.2;
const CHILE_R = 2.7;

const MAP_W = MAP_COLS * CELL;
const MAP_H = mapRows.length * CELL;

export function LatamMap() {
  return (
    <TextureCardStyled className="h-full">
      <div className="flex h-full flex-col rounded-[20px] bg-white p-5">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-semibold text-neutral-900">
              Cobertura LATAM
            </h3>
            <p className="mt-0.5 text-[12.5px] text-neutral-500">
              El mismo flujo opera en toda la región; el demo corre en Chile.
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] text-neutral-600">
            <span className="size-1.5 rounded-full bg-indigo-600" aria-hidden />
            Chile
          </span>
        </div>

        <div className="relative mx-auto mt-5 w-full max-w-[430px] flex-1">
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="h-auto w-full"
            role="img"
            aria-label="Mapa de Latinoamérica en puntos, con Chile destacado y marcadores en los principales mercados"
          >
            {mapRows.flatMap((row, y) =>
              Array.from(row).map((cell, x) => {
                if (cell === ".") return null;
                const isChile = cell === "C";
                return (
                  <circle
                    key={`${x}-${y}`}
                    cx={x * CELL + CELL / 2}
                    cy={y * CELL + CELL / 2}
                    r={isChile ? CHILE_R : DOT_R}
                    fill={isChile ? "#4F46E5" : "#C9CEDE"}
                  />
                );
              }),
            )}

            {mapMarkers.map((marker) => {
              const cx = marker.x * CELL + CELL / 2;
              const cy = marker.y * CELL + CELL / 2;
              return (
                <g key={marker.id}>
                  {marker.focus && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="9"
                      fill="#4F46E5"
                      opacity="0.35"
                      className="map-ping"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="7"
                    fill="#fff"
                    stroke={marker.focus ? "#4F46E5" : "#C7CBF4"}
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="3"
                    fill={marker.focus ? "#4F46E5" : "#818CF8"}
                  />
                </g>
              );
            })}
          </svg>

          {/* Etiquetas de los marcadores */}
          {mapMarkers.map((marker) => (
            <div
              key={`label-${marker.id}`}
              className={cn(
                "pointer-events-none absolute -translate-y-1/2 whitespace-nowrap",
                marker.side === "left" && "-translate-x-full",
                marker.focus ? "z-10" : "hidden md:block",
              )}
              style={{
                left: `${((marker.x * CELL + CELL / 2 + (marker.side === "left" ? -12 : 12)) / MAP_W) * 100}%`,
                top: `${((marker.y * CELL + CELL / 2) / MAP_H) * 100}%`,
              }}
            >
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 font-mono text-[10px] shadow-sm",
                  marker.focus
                    ? "border-indigo-200 bg-white font-medium text-indigo-700"
                    : "border-neutral-200/80 bg-white/90 text-neutral-500",
                )}
              >
                {marker.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </TextureCardStyled>
  );
}
