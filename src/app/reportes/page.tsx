import type { Metadata } from "next";

import { CoveragePanel } from "@/components/dashboard/coverage-panel";
import { MetricsExplorer } from "@/components/dashboard/metrics-explorer";
import { Section } from "@/components/dashboard/section";
import {
  TextureCardStyled,
  TextureSeparator,
} from "@/components/ui/texture-card";
import {
  recentValidations,
  type RecentValidation,
} from "@/data/recent-validations";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reportes · Truora",
};

const resultStyles: Record<RecentValidation["result"], { label: string; className: string }> = {
  aprobado: { label: "Aprobado", className: "bg-emerald-50 text-emerald-700" },
  revision: { label: "Revisión", className: "bg-amber-50 text-amber-700" },
  rechazado: { label: "Rechazado", className: "bg-red-50 text-red-700" },
};

export default function ReportesPage() {
  return (
    <div className="space-y-10 px-6 py-8 md:px-8">
      <Section
        title="Rendimiento"
        description="Los mismos indicadores del resumen, pensados para exportar y revisar con el equipo."
      >
        <MetricsExplorer />
      </Section>

      <Section
        title="Últimas validaciones"
        description="Las validaciones más recientes del flujo, con su resultado y duración."
      >
        <TextureCardStyled>
          <div className="rounded-[20px] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-neutral-200/80">
                    {["ID", "País", "Canal", "Resultado", "Duración", "Fecha"].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-5 py-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-neutral-500"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {recentValidations.map((validation, index) => {
                    const result = resultStyles[validation.result];
                    return (
                      <tr
                        key={validation.id}
                        className={cn(
                          index > 0 && "border-t border-neutral-100",
                          "hover:bg-neutral-50/60",
                        )}
                      >
                        <td className="px-5 py-3 font-mono text-[12.5px] text-neutral-700">
                          {validation.id}
                        </td>
                        <td className="px-5 py-3 text-[13px] text-neutral-600">
                          {validation.country}
                        </td>
                        <td className="px-5 py-3 text-[13px] text-neutral-600">
                          {validation.channel}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[11px] font-medium",
                              result.className,
                            )}
                          >
                            {result.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-[12.5px] tabular-nums text-neutral-600">
                          {validation.duration}
                        </td>
                        <td className="px-5 py-3 text-[13px] text-neutral-500">
                          {validation.date}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <TextureSeparator />
            <p className="p-4 text-center text-[12px] text-neutral-500">
              Datos de demostración · La versión conectada listará las
              validaciones reales de la cuenta.
            </p>
          </div>
        </TextureCardStyled>
      </Section>

      <Section
        title="Cobertura"
        description="Volumen por país durante los últimos 30 días."
      >
        <div className="max-w-xl">
          <CoveragePanel />
        </div>
      </Section>
    </div>
  );
}
