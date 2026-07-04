"use client";

import * as React from "react";
import { CircleCheck } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { TextureButton } from "@/components/ui/texture-button";
import {
  TextureCardStyled,
  TextureSeparator,
} from "@/components/ui/texture-card";
import { countryConfigs, type CountryCode } from "@/data/simulation";
import { cn } from "@/lib/utils";

export function SettingsForm() {
  const [name, setName] = React.useState("WhatsApp Onboarding · LATAM");
  const [defaultCountry, setDefaultCountry] = React.useState<CountryCode>("CL");
  const [webhook, setWebhook] = React.useState(
    "https://api.cliente.com/webhooks/truora",
  );
  const [notify, setNotify] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <TextureCardStyled className="max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="rounded-[20px] bg-white"
        noValidate
      >
        <div className="space-y-5 p-6">
          <div className="space-y-1.5">
            <label
              htmlFor="flow-name"
              className="text-[13px] font-medium text-neutral-800"
            >
              Nombre de la ruta
            </label>
            <input
              id="flow-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13.5px] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <p className="text-[12px] text-neutral-500">
              Es el nombre que ven los equipos de producto y riesgo.
            </p>
          </div>

          <fieldset className="space-y-1.5">
            <legend className="text-[13px] font-medium text-neutral-800">
              País por defecto
            </legend>
            <div className="flex gap-1.5">
              {(Object.keys(countryConfigs) as CountryCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setDefaultCountry(code)}
                  className={cn(
                    "rounded-lg border px-3.5 py-2 font-mono text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500",
                    defaultCountry === code
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
                  )}
                >
                  {code}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-neutral-500">
              Se usa cuando el prefijo del teléfono no permite inferir el país.
            </p>
          </fieldset>

          <div className="space-y-1.5">
            <label
              htmlFor="webhook"
              className="text-[13px] font-medium text-neutral-800"
            >
              Webhook de resultados
            </label>
            <input
              id="webhook"
              type="url"
              value={webhook}
              onChange={(event) => setWebhook(event.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 font-mono text-[12.5px] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <p className="text-[12px] text-neutral-500">
              Cada decisión final (aprobado, revisión, rechazado) se notifica a
              esta URL.
            </p>
          </div>

          <label className="flex items-center justify-between gap-4 text-[13px] font-medium text-neutral-800">
            Notificar revisiones manuales por correo
            <Switch
              checked={notify}
              onCheckedChange={(checked) => setNotify(checked === true)}
              aria-label="Alternar notificaciones de revisiones manuales"
            />
          </label>
        </div>

        <TextureSeparator />

        <div className="flex items-center justify-between gap-4 p-5">
          <p
            aria-live="polite"
            className={cn(
              "flex items-center gap-1.5 text-[12.5px] text-emerald-700 transition-opacity duration-300",
              saved ? "opacity-100" : "opacity-0",
            )}
          >
            <CircleCheck className="size-4" aria-hidden />
            Cambios guardados
          </p>
          <div className="w-40">
            <TextureButton variant="accent" type="submit">
              Guardar cambios
            </TextureButton>
          </div>
        </div>
      </form>
    </TextureCardStyled>
  );
}
