import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, MessageCircle, Braces } from "lucide-react";

import { Reveal } from "@/components/dashboard/reveal";
import { Section } from "@/components/dashboard/section";
import {
  TextureCardStyled,
  TextureSeparator,
} from "@/components/ui/texture-card";
import { routesList, type RouteSummary } from "@/data/routes-list";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Rutas · Truora",
};

const statusStyles: Record<RouteSummary["status"], { dot: string; label: string }> = {
  activa: { dot: "bg-emerald-500", label: "Activa" },
  pausada: { dot: "bg-amber-500", label: "Pausada" },
  borrador: { dot: "bg-neutral-300", label: "Borrador" },
};

const channelIcons = {
  WhatsApp: MessageCircle,
  Web: Globe,
  API: Braces,
};

export default function RutasPage() {
  return (
    <div className="space-y-10 px-6 py-8 md:px-8">
      <Section
        title="Rutas de validación"
        description="Cada ruta define cómo se valida la identidad según el canal y el país. Abre una en el playground para verla en acción."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {routesList.map((route, index) => {
            const status = statusStyles[route.status];
            const ChannelIcon = channelIcons[route.channel];
            return (
              <Reveal key={route.id} delay={index * 0.06} className="h-full">
              <TextureCardStyled className="h-full">
                <div className="flex h-full flex-col rounded-[20px] bg-white">
                  <div className="flex items-start gap-3 p-5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-indigo-50 text-indigo-600">
                      <ChannelIcon
                        className="size-4.5"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-semibold leading-snug text-neutral-900">
                        {route.name}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-neutral-500">
                        <span
                          className={cn("size-1.5 rounded-full", status.dot)}
                          aria-hidden
                        />
                        {status.label} · {route.updatedAt}
                      </p>
                      <span className="mt-2 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700">
                        {route.useCase}
                      </span>
                    </div>
                  </div>

                  <TextureSeparator />

                  <dl className="grid flex-1 grid-cols-2 gap-y-3 p-5 text-[13px]">
                    <div>
                      <dt className="text-[11.5px] text-neutral-500">
                        Conversión
                      </dt>
                      <dd className="font-mono tabular-nums text-neutral-800">
                        {route.conversion}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11.5px] text-neutral-500">
                        Validaciones / mes
                      </dt>
                      <dd className="font-mono tabular-nums text-neutral-800">
                        {route.monthlyVolume}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-[11.5px] text-neutral-500">Países</dt>
                      <dd className="mt-1 flex flex-wrap gap-1.5">
                        {route.countries.map((code) => (
                          <span
                            key={code}
                            className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-700"
                          >
                            {code}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>

                  <TextureSeparator />
                  <Link
                    href={route.status === "activa" ? "/playground" : "/"}
                    className="group flex items-center justify-between px-5 py-3.5 text-[13px] font-medium text-indigo-700 transition-colors hover:bg-indigo-50/60"
                  >
                    {route.status === "activa"
                      ? "Abrir en el playground"
                      : "Ver resumen"}
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </div>
              </TextureCardStyled>
              </Reveal>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
