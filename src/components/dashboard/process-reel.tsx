"use client";

import * as React from "react";
import { ArrowRight, CircleCheck, RefreshCw, Send } from "lucide-react";
import { useRouter } from "next/navigation";

import { TextureButton } from "@/components/ui/texture-button";
import { TextureCardStyled } from "@/components/ui/texture-card";
import { cn } from "@/lib/utils";

/**
 * Secuencia de frames extraída del video "Motor de Cobro" (40 cuadros a
 * 4 fps): un cobro se confirma, el motor reintenta y el pago sale
 * exitoso. Se reproduce en loop como apertura de la página.
 */

const FRAME_COUNT = 40;
const FRAME_MS = 250; // 4 fps, igual que la extracción
const frameSrc = (index: number) =>
  `/proceso/frame-${String(index + 1).padStart(2, "0")}.webp`;

/** Etapas de la historia, mapeadas a rangos de frames. */
const steps = [
  { icon: Send, label: "Cobro programado", from: 0 },
  { icon: RefreshCw, label: "Reintento inteligente", from: 13 },
  { icon: CircleCheck, label: "Pago exitoso", from: 26 },
];

export function ProcessReel() {
  const [frame, setFrame] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setReduced(true);
      setFrame(FRAME_COUNT - 1);
      return;
    }
    // Precarga para que el loop no parpadee.
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = frameSrc(i);
    }
    const timer = window.setInterval(
      () => setFrame((f) => (f + 1) % FRAME_COUNT),
      FRAME_MS,
    );
    return () => window.clearInterval(timer);
  }, []);

  const activeStep = steps.reduce(
    (acc, step, index) => (frame >= step.from ? index : acc),
    0,
  );

  return (
    <TextureCardStyled>
      <div className="grid items-center gap-6 rounded-[20px] bg-white p-6 md:p-8 lg:grid-cols-[1fr_0.85fr]">
        <div className="max-w-lg space-y-4">
          <h2 className="text-[24px] font-semibold leading-tight tracking-tight text-neutral-900 text-balance">
            Esto pasa por dentro mientras tu usuario espera
          </h2>
          <p className="text-[13.5px] leading-relaxed text-neutral-500">
            El mismo motor que rutea la validación de identidad orquesta cada
            paso del proceso: intenta, reintenta con inteligencia y confirma.
            Aquí, aplicado a un cobro recurrente.
          </p>

          <ol className="space-y-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              const isDone = index < activeStep;
              return (
                <li
                  key={step.label}
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
                      <Icon
                        className={cn(
                          "size-3.5",
                          isActive && !reduced && step.icon === RefreshCw
                            ? "animate-spin [animation-duration:2s]"
                            : undefined,
                        )}
                        aria-hidden
                      />
                    )}
                  </span>
                  {step.label}
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

        <figure className="relative mx-auto w-full max-w-[440px]">
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 shadow-[0px_1px_1px_rgba(20,21,38,0.06),0px_16px_32px_-12px_rgba(38,36,110,0.25),inset_0px_1px_0px_rgba(255,255,255,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frameSrc(frame)}
              alt="Secuencia del motor de cobro: el pago se confirma, el motor reintenta y termina exitoso"
              width={564}
              height={404}
              className="h-auto w-full"
              draggable={false}
            />
          </div>
          <figcaption className="mt-2.5 text-center font-mono text-[11px] text-neutral-500">
            Motor de cobro · secuencia real del producto
          </figcaption>
        </figure>
      </div>
    </TextureCardStyled>
  );
}
