import { Search } from "lucide-react";

import { TextureCardStyled, TextureSeparator } from "@/components/ui/texture-card";
import { verificationSources } from "@/data/sources";

export function SourcesTable() {
  return (
    <TextureCardStyled>
      <div className="rounded-[20px] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h3 className="text-[15px] font-semibold text-neutral-900">
              Fuentes de verificación
            </h3>
            <p className="mt-0.5 text-[12.5px] text-neutral-500">
              Conectores consultados por el flujo en cada país.
            </p>
          </div>
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Buscar fuente"
              className="h-9 w-56 rounded-full border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-[13px] text-neutral-800 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </label>
        </div>

        <TextureSeparator />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-neutral-200/80">
                {["Fuente", "Tipo", "País", "Cobertura", "Capacidades"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-neutral-400"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {verificationSources.map((source, index) => (
                <tr
                  key={source.id}
                  className={
                    index > 0
                      ? "border-t border-neutral-100 hover:bg-neutral-50/60"
                      : "hover:bg-neutral-50/60"
                  }
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-mono text-[10px] font-medium text-indigo-700">
                        {source.countryCode === "INTL"
                          ? "LA"
                          : source.countryCode}
                      </span>
                      <span className="text-[13.5px] font-medium text-neutral-900">
                        {source.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                      {source.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-neutral-600">
                    {source.country}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-neutral-600">
                    {source.coverage}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {source.features.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-600"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TextureCardStyled>
  );
}
