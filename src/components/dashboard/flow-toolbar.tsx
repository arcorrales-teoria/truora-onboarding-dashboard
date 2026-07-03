"use client";

import * as React from "react";
import { ArrowUpRight, PenLine, Play } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { TextureButton } from "@/components/ui/texture-button";

export function FlowToolbar() {
  const [testMode, setTestMode] = React.useState(true);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/70 bg-white/80 px-6 py-4 backdrop-blur-sm md:px-8">
      <div className="min-w-0">
        <p className="text-[12px] text-neutral-400">
          Rutas <span aria-hidden>/</span> Validación de identidad
        </p>
        <h1 className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-neutral-900">
          WhatsApp Onboarding · LATAM
          <button
            type="button"
            className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-indigo-500"
            aria-label="Renombrar ruta"
          >
            <PenLine className="size-3.5" aria-hidden />
          </button>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-[12.5px] text-neutral-500">
          Modo de prueba
          <Switch
            checked={testMode}
            onCheckedChange={(checked) => setTestMode(checked === true)}
            aria-label="Alternar modo de prueba"
          />
        </label>

        <div className="h-6 w-px bg-neutral-200" aria-hidden />

        <div className="flex items-center gap-2.5">
          <div className="w-44">
            <TextureButton variant="minimal">
              <Play className="size-3.5" aria-hidden />
              Simular validación
            </TextureButton>
          </div>
          <div className="w-36">
            <TextureButton variant="accent">
              Publicar ruta
              <ArrowUpRight className="size-3.5" aria-hidden />
            </TextureButton>
          </div>
        </div>
      </div>
    </div>
  );
}
