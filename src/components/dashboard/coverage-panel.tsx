import { TextureCardStyled, TextureSeparator } from "@/components/ui/texture-card";
import { countryCoverage, coverageStats } from "@/data/coverage";
import { cn } from "@/lib/utils";

const maxShare = Math.max(...countryCoverage.map((c) => c.share));

export function CoveragePanel() {
  return (
    <TextureCardStyled className="h-full">
      <div className="flex h-full flex-col rounded-[20px] bg-white">
        <div className="grid grid-cols-3">
          {coverageStats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "space-y-1 p-5",
                index > 0 && "border-l border-neutral-200/80",
              )}
            >
              <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-neutral-500">
                {stat.label}
              </p>
              <p className="text-[26px] font-semibold leading-none tracking-tight text-neutral-900 tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <TextureSeparator />

        <div className="flex-1 space-y-4 p-5">
          <h4 className="text-[13px] font-semibold text-neutral-900">
            Principales mercados
          </h4>
          <ul className="space-y-3.5">
            {countryCoverage.map((country) => (
              <li key={country.code} className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex w-9 justify-center rounded-md py-0.5 font-mono text-[11px]",
                      country.focus
                        ? "bg-indigo-600 font-medium text-white"
                        : "bg-neutral-100 text-neutral-600",
                    )}
                  >
                    {country.code}
                  </span>
                  <span className="text-[13px] font-medium text-neutral-800">
                    {country.name}
                  </span>
                  {country.focus && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10.5px] font-medium text-indigo-700">
                      Foco del demo
                    </span>
                  )}
                  <span className="ml-auto font-mono text-[12px] tabular-nums text-neutral-500">
                    {country.validations}
                  </span>
                </div>
                <div
                  className={cn(
                    "h-1 rounded-full",
                    country.focus ? "bg-indigo-600" : "bg-indigo-200",
                  )}
                  style={{ width: `${(country.share / maxShare) * 100}%` }}
                  aria-hidden
                />
              </li>
            ))}
          </ul>
        </div>

        <TextureSeparator />
        <p className="p-4 text-center text-[12px] text-neutral-500">
          Validaciones contra fuentes oficiales de cada país.
        </p>
      </div>
    </TextureCardStyled>
  );
}
