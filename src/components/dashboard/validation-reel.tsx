"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  Fingerprint,
  IdCard,
  ScanFace,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { TextureButton } from "@/components/ui/texture-button";
import { TextureCardStyled } from "@/components/ui/texture-card";
import { cn } from "@/lib/utils";

/**
 * Apertura del dashboard: la validación de identidad de Truora en
 * movimiento, con la misma estética de los videos de producto (tarjeta
 * blanca sobre degradado índigo y píldoras negras de estado), pero
 * dibujada en código para poder cambiar el guion sin regrabar nada.
 */

const phases = [
  {
    id: "documento",
    step: "Documento y rostro",
    pill: null,
  },
  {
    id: "rostro",
    step: "Documento y rostro",
    pill: { icon: ScanFace, text: "Verificando rostro…" },
  },
  {
    id: "fuentes",
    step: "Fuentes oficiales",
    pill: { icon: Fingerprint, text: "Consultando Registro Civil…" },
  },
  {
    id: "aprobada",
    step: "Identidad verificada",
    pill: { icon: BadgeCheck, text: "Identidad verificada", success: true },
  },
] as const;

const steps = [
  "Documento y rostro",
  "Fuentes oficiales",
  "Identidad verificada",
];

const PHASE_MS = 2100;

export function ValidationReel() {
  const [phase, setPhase] = React.useState(0);
  const reduced = useReducedMotion();
  const router = useRouter();

  React.useEffect(() => {
    if (reduced) {
      setPhase(phases.length - 1);
      return;
    }
    const timer = window.setInterval(
      () => setPhase((p) => (p + 1) % phases.length),
      PHASE_MS,
    );
    return () => window.clearInterval(timer);
  }, [reduced]);

  const current = phases[phase];
  const activeStep = steps.indexOf(current.step);

  return (
    <TextureCardStyled>
      <div className="grid items-center gap-6 rounded-[20px] bg-white p-6 md:p-8 lg:grid-cols-[1fr_0.85fr]">
        <div className="max-w-lg space-y-4">
          <h2 className="text-[24px] font-semibold leading-tight tracking-tight text-neutral-900 text-balance">
            Esto pasa por dentro mientras tu usuario espera
          </h2>
          <p className="text-[13.5px] leading-relaxed text-neutral-500">
            En los segundos que dura la conversación de WhatsApp, Truora
            valida el documento, compara el rostro y consulta las fuentes
            oficiales del país. Así se ve ese instante:
          </p>

          <ol className="space-y-2">
            {steps.map((label, index) => {
              const isActive = index === activeStep;
              const isDone = index < activeStep;
              return (
                <li
                  key={label}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-all duration-300",
                    isActive
                      ? "bg-indigo-50 font-medium text-indigo-700"
                      : isDone
                        ? "text-neutral-700"
                        : "text-neutral-500",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full transition-colors duration-300",
                      isActive
                        ? "bg-indigo-600 text-white"
                        : isDone
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-neutral-100 text-neutral-500",
                    )}
                  >
                    {isDone ? (
                      <CircleCheck className="size-3.5" aria-hidden />
                    ) : (
                      <span className="font-mono text-[11px]">{index + 1}</span>
                    )}
                  </span>
                  {label}
                </li>
              );
            })}
          </ol>

          <div className="w-56 pt-1">
            <TextureButton
              variant="accent"
              onClick={() => router.push("/playground")}
            >
              Simular una validación
              <ArrowRight className="size-3.5" aria-hidden />
            </TextureButton>
          </div>
        </div>

        {/* Escena: tarjeta de validación sobre degradado índigo */}
        <figure className="relative mx-auto w-full max-w-[440px]">
          <div className="relative aspect-[564/404] overflow-hidden rounded-2xl border border-neutral-200/80 shadow-[0px_1px_1px_rgba(20,21,38,0.06),0px_16px_32px_-12px_rgba(38,36,110,0.3),inset_0px_1px_0px_rgba(255,255,255,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-indigo-400 to-indigo-700" />
            <div
              className="absolute inset-0 opacity-40 mix-blend-soft-light"
              style={{
                background:
                  "radial-gradient(120% 90% at 20% 10%, rgba(255,255,255,0.9), transparent 55%)",
              }}
              aria-hidden
            />

            {/* Tarjeta del producto */}
            <motion.div
              animate={
                current.pill
                  ? { filter: "blur(7px)", scale: 0.985, opacity: 0.85 }
                  : { filter: "blur(0px)", scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-8 top-1/2 -translate-y-1/2 rounded-2xl bg-white/95 p-5 shadow-[0px_20px_40px_-16px_rgba(30,27,110,0.5),inset_0px_1px_0px_rgba(255,255,255,0.9)]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-semibold tracking-tight text-neutral-900">
                  Validación de identidad
                </h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/truora-icon.svg"
                  alt="Truora"
                  className="size-6 rounded-md"
                  draggable={false}
                />
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3.5 py-2.5 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.9),0px_1px_2px_rgba(20,21,38,0.06)]">
                  <span className="flex items-center gap-2 text-[13px] text-neutral-700">
                    <IdCard className="size-4 text-indigo-600" aria-hidden />
                    Cédula de identidad
                  </span>
                  <span className="font-mono text-[12.5px] text-neutral-800">
                    •••• 8412
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3.5 py-2.5 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.9),0px_1px_2px_rgba(20,21,38,0.06)]">
                  <span className="text-[13px] text-neutral-700">País</span>
                  <span className="font-mono text-[12.5px] text-neutral-800">
                    Chile · CL
                  </span>
                </div>
                <div className="rounded-xl bg-neutral-900 py-3 text-center text-[13.5px] font-medium text-white shadow-[inset_0px_1px_0px_rgba(255,255,255,0.15)]">
                  Validar identidad
                </div>
              </div>
            </motion.div>

            {/* Píldora de estado, estilo video de producto */}
            <AnimatePresence mode="wait">
              {current.pill && (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 14, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                >
                  <span className="flex items-center gap-2.5 whitespace-nowrap rounded-full bg-neutral-950/95 py-3 pl-4 pr-5 text-[14px] font-medium text-white shadow-[0px_16px_32px_-8px_rgba(0,0,0,0.5),inset_0px_1px_0px_rgba(255,255,255,0.18)]">
                    {"success" in current.pill && current.pill.success ? (
                      <span
                        className="size-2 rounded-full bg-emerald-400"
                        aria-hidden
                      />
                    ) : (
                      <current.pill.icon
                        className="size-4 text-indigo-300"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    )}
                    {current.pill.text}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <figcaption className="mt-2.5 text-center font-mono text-[11px] text-neutral-500">
            Validación de identidad · así lo ve el motor de Truora
          </figcaption>
        </figure>
      </div>
    </TextureCardStyled>
  );
}
