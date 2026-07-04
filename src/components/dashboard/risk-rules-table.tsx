"use client";

import * as React from "react";
import { CircleSlash, Eye, ShieldCheck } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import {
  TextureCardStyled,
  TextureSeparator,
} from "@/components/ui/texture-card";
import { riskRules, type RuleAction } from "@/data/risk-rules";
import { cn } from "@/lib/utils";

const actionStyles: Record<
  RuleAction,
  { label: string; className: string; icon: typeof CircleSlash }
> = {
  bloquear: {
    label: "Bloquear si",
    className: "bg-red-50 text-red-700",
    icon: CircleSlash,
  },
  permitir: {
    label: "Permitir si",
    className: "bg-emerald-50 text-emerald-700",
    icon: ShieldCheck,
  },
  revisar: {
    label: "Revisar si",
    className: "bg-amber-50 text-amber-700",
    icon: Eye,
  },
};

export function RiskRulesTable() {
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(riskRules.map((rule) => [rule.id, rule.enabled])),
  );

  return (
    <TextureCardStyled>
      <div className="rounded-[20px] bg-white">
        <div className="flex items-baseline justify-between gap-4 p-5">
          <div>
            <h3 className="text-[15px] font-semibold text-neutral-900">
              Reglas activas
            </h3>
            <p className="mt-0.5 text-[12.5px] text-neutral-500">
              Se evalúan en orden antes de la decisión final del flujo.
            </p>
          </div>
          <span className="font-mono text-[12px] text-neutral-500">
            {Object.values(enabled).filter(Boolean).length} de{" "}
            {riskRules.length} activas
          </span>
        </div>

        <TextureSeparator />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-neutral-200/80">
                {["Regla", "Afectadas (30 d)", "Creada", "Condición", "Activa"].map(
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
              {riskRules.map((rule, index) => {
                const action = actionStyles[rule.action];
                const ActionIcon = action.icon;
                const isOn = enabled[rule.id];
                return (
                  <tr
                    key={rule.id}
                    className={cn(
                      index > 0 && "border-t border-neutral-100",
                      "hover:bg-neutral-50/60",
                      !isOn && "opacity-55",
                    )}
                  >
                    <td className="px-5 py-3.5 text-[13.5px] font-medium text-neutral-900">
                      {rule.name}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[13px] tabular-nums text-neutral-600">
                      {rule.affected}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-500">
                      {rule.createdAt}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-2 text-[13px] text-neutral-600">
                        <span
                          className={cn(
                            "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                            action.className,
                          )}
                        >
                          <ActionIcon className="size-3" aria-hidden />
                          {action.label}
                        </span>
                        {rule.condition}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Switch
                        checked={isOn}
                        onCheckedChange={(checked) =>
                          setEnabled((prev) => ({
                            ...prev,
                            [rule.id]: checked === true,
                          }))
                        }
                        aria-label={`${isOn ? "Desactivar" : "Activar"} la regla ${rule.name}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </TextureCardStyled>
  );
}
