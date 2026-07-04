import { Fingerprint, IdCard, ShieldCheck, Smartphone } from "lucide-react";

import {
  TextureCardStyled,
  TextureSeparator,
} from "@/components/ui/texture-card";
import { countryStacks } from "@/data/country-stack";
import { cn } from "@/lib/utils";

export function CountryStackGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {countryStacks.map((stack) => {
        const active = stack.status === "activo";
        return (
          <TextureCardStyled key={stack.code}>
            <div
              className={cn(
                "flex h-full flex-col rounded-[20px] bg-white",
                !active && "opacity-75",
              )}
            >
              <div className="flex items-center gap-3 p-5">
                <span
                  className={cn(
                    "flex w-10 justify-center rounded-md py-1 font-mono text-[12px] font-medium",
                    active
                      ? "bg-indigo-600 text-white"
                      : "bg-neutral-100 text-neutral-600",
                  )}
                >
                  {stack.code}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[14px] font-semibold text-neutral-900">
                    {stack.name}
                  </h3>
                  <p
                    className={cn(
                      "flex items-center gap-1.5 text-[12px]",
                      active ? "text-emerald-700" : "text-neutral-400",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        active ? "bg-emerald-500" : "bg-neutral-300",
                      )}
                      aria-hidden
                    />
                    {active ? "Activo en el flujo" : "Disponible para activar"}
                  </p>
                </div>
              </div>

              <TextureSeparator />

              <dl className="flex-1 space-y-3 p-5">
                <div className="flex items-start gap-2.5">
                  <Fingerprint
                    className="mt-0.5 size-4 shrink-0 text-indigo-500"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div>
                    <dt className="text-[11.5px] text-neutral-400">
                      Registro de identidad
                    </dt>
                    <dd className="text-[13px] font-medium text-neutral-800">
                      {stack.identitySource}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <IdCard
                    className="mt-0.5 size-4 shrink-0 text-indigo-500"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div>
                    <dt className="text-[11.5px] text-neutral-400">Documento</dt>
                    <dd className="text-[13px] font-medium text-neutral-800">
                      {stack.document}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck
                    className="mt-0.5 size-4 shrink-0 text-indigo-500"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div>
                    <dt className="text-[11.5px] text-neutral-400">
                      Antecedentes y riesgo
                    </dt>
                    <dd className="text-[13px] font-medium text-neutral-800">
                      {stack.backgroundSources.join(" · ")}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Smartphone
                    className="mt-0.5 size-4 shrink-0 text-indigo-500"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div>
                    <dt className="text-[11.5px] text-neutral-400">
                      Verificación de teléfono
                    </dt>
                    <dd className="text-[13px] font-medium text-neutral-800">
                      {stack.phoneCheck}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </TextureCardStyled>
        );
      })}
    </div>
  );
}
