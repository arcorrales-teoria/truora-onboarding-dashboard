"use client";

import * as React from "react";
import {
  Activity,
  BadgeCheck,
  Bell,
  CircleCheck,
  Database,
  Fingerprint,
  MessageCircle,
  ShieldCheck,
  Signature,
  Smartphone,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

import { TextureButton } from "@/components/ui/texture-button";
import {
  TextureCardStyled,
  TextureSeparator,
} from "@/components/ui/texture-card";
import { cn } from "@/lib/utils";

/* ── Escenografía de la animación ────────────────────────────────────── */

const W = 1116;
const H = 440;
const CARD_W = 230;

interface LiveNode {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  /** Altura aproximada para anclar las conexiones. */
  h: number;
}

const nodes: LiveNode[] = [
  {
    id: "entrada",
    icon: MessageCircle,
    title: "Validación entrante",
    subtitle: "Tu usuario envía su documento",
    x: 8,
    y: 170,
    h: 100,
  },
  {
    id: "motor",
    icon: Waypoints,
    title: "Motor de ruteo",
    subtitle: "Decide qué consultar y en qué orden",
    x: 320,
    y: 165,
    h: 110,
  },
  {
    id: "db-registro",
    icon: Fingerprint,
    title: "Registro de identidad",
    subtitle: "Registro Civil · RENIEC · INE",
    x: 620,
    y: 20,
    h: 92,
  },
  {
    id: "db-listas",
    icon: ShieldCheck,
    title: "Listas de riesgo",
    subtitle: "AML · PEP · Interpol",
    x: 620,
    y: 175,
    h: 92,
  },
  {
    id: "db-operador",
    icon: Smartphone,
    title: "Operador móvil",
    subtitle: "Titularidad de la línea",
    x: 620,
    y: 330,
    h: 92,
  },
  {
    id: "resultado",
    icon: BadgeCheck,
    title: "Decisión",
    subtitle: "En segundos, no en días",
    x: 878,
    y: 100,
    h: 96,
  },
  {
    id: "siguiente",
    icon: Signature,
    title: "El proceso continúa",
    subtitle: "Firma electrónica y bienvenida",
    x: 878,
    y: 268,
    h: 96,
  },
];

interface LiveEdge {
  from: string;
  to: string;
}

const edges: LiveEdge[] = [
  { from: "entrada", to: "motor" },
  { from: "motor", to: "db-registro" },
  { from: "motor", to: "db-listas" },
  { from: "motor", to: "db-operador" },
  { from: "motor", to: "resultado" },
  { from: "resultado", to: "siguiente" },
];

/**
 * Guion del loop: qué nodo está activo, qué conexiones se encienden y
 * qué dice el subtítulo en cada paso.
 */
const script = [
  {
    active: "entrada",
    lit: ["entrada-motor"],
    caption: "Llega una validación desde tu proceso actual…",
  },
  {
    active: "motor",
    lit: ["entrada-motor"],
    caption: "El motor de ruteo elige la mejor ruta para ese usuario.",
  },
  {
    active: "db-registro",
    lit: ["entrada-motor", "motor-db-registro"],
    caption: "Consultando el registro de identidad del país…",
  },
  {
    active: "db-listas",
    lit: ["entrada-motor", "motor-db-registro", "motor-db-listas"],
    caption: "Cruzando listas AML, PEP e Interpol…",
  },
  {
    active: "db-operador",
    lit: [
      "entrada-motor",
      "motor-db-registro",
      "motor-db-listas",
      "motor-db-operador",
    ],
    caption: "Verificando la titularidad del teléfono…",
  },
  {
    active: "resultado",
    lit: [
      "entrada-motor",
      "motor-db-registro",
      "motor-db-listas",
      "motor-db-operador",
      "motor-resultado",
    ],
    caption: "Identidad aprobada.",
    stamp: true,
  },
  {
    active: "siguiente",
    lit: [
      "entrada-motor",
      "motor-db-registro",
      "motor-db-listas",
      "motor-db-operador",
      "motor-resultado",
      "resultado-siguiente",
    ],
    caption: "Y el proceso sigue: firma, bienvenida y siguiente cliente.",
    stamp: true,
  },
] as const;

const STEP_MS = 1500;

function edgePath(edge: LiveEdge) {
  const from = nodes.find((n) => n.id === edge.from)!;
  const to = nodes.find((n) => n.id === edge.to)!;
  const x1 = from.x + CARD_W;
  const y1 = from.y + from.h / 2;
  const x2 = to.x;
  const y2 = to.y + to.h / 2;
  // La conexión resultado→siguiente baja en la misma columna.
  if (edge.from === "resultado") {
    const cx = from.x + CARD_W / 2;
    return `M ${cx} ${from.y + from.h} C ${cx} ${from.y + from.h + 40}, ${cx} ${to.y - 40}, ${cx} ${to.y}`;
  }
  const bend = Math.max(48, (x2 - x1) / 2.1);
  return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
}

/* ── Componente ──────────────────────────────────────────────────────── */

export function LivePreview() {
  const [step, setStep] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);
  const [notified, setNotified] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    if (media.matches) {
      setStep(script.length - 1);
      return;
    }
    const timer = window.setInterval(
      () => setStep((s) => (s + 1) % script.length),
      STEP_MS,
    );
    return () => window.clearInterval(timer);
  }, []);

  const current = script[step];
  const doneDbs: string[] = script
    .slice(0, step + 1)
    .map((s) => s.active as string)
    .filter((id) => id.startsWith("db-"));

  return (
    <div className="space-y-5">
      <TextureCardStyled>
        <div className="relative rounded-[20px] bg-white">
          <span className="absolute right-4 top-4 z-20 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-medium text-white shadow-sm">
            Próximamente
          </span>

          <div className="overflow-x-auto">
            <div
              className="dot-grid relative mx-auto"
              style={{ width: W, height: H }}
              aria-hidden={reduced ? undefined : true}
            >
              <svg
                className="pointer-events-none absolute inset-0"
                width={W}
                height={H}
                aria-hidden
              >
                {edges.map((edge) => {
                  const key = `${edge.from}-${edge.to}`;
                  const lit = (current.lit as readonly string[]).includes(key);
                  const d = edgePath(edge);
                  return (
                    <g key={key}>
                      <path
                        d={d}
                        fill="none"
                        stroke={lit ? "#4F46E5" : "#C7CBF4"}
                        strokeWidth={lit ? 2 : 1.5}
                        strokeDasharray={lit ? undefined : "3 6"}
                        className="transition-all duration-500"
                      />
                      {lit && (
                        <path
                          d={d}
                          fill="none"
                          stroke="#818CF8"
                          strokeWidth="1.5"
                          strokeDasharray="5 16"
                          strokeLinecap="round"
                          className="route-flow"
                          opacity="0.9"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {nodes.map((node) => {
                const Icon = node.icon;
                const isActive = current.active === node.id;
                const isDb = node.id.startsWith("db-");
                const dbDone = isDb && doneDbs.includes(node.id) && !isActive;
                const isResult = node.id === "resultado";
                const showStamp = isResult && "stamp" in current;
                return (
                  <div
                    key={node.id}
                    className={cn(
                      "absolute rounded-2xl border bg-white p-3.5 shadow-sm transition-all duration-500",
                      isActive
                        ? "sim-active z-10 border-indigo-400"
                        : "border-neutral-200/80",
                    )}
                    style={{ left: node.x, top: node.y, width: CARD_W }}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-500",
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-50 text-indigo-600",
                        )}
                      >
                        <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-neutral-900">
                          {node.title}
                          {dbDone && (
                            <CircleCheck
                              className="size-3.5 shrink-0 text-emerald-500"
                              aria-hidden
                            />
                          )}
                        </span>
                        <span className="block text-[11.5px] leading-snug text-neutral-500">
                          {isDb && isActive ? "Consultando…" : node.subtitle}
                        </span>
                      </span>
                    </div>

                    {showStamp && (
                      <span className="stamp-in mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-1.5 text-[12px] font-medium text-emerald-700">
                        <CircleCheck className="size-3.5" aria-hidden />
                        Aprobado
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <TextureSeparator />
          <p
            aria-live="polite"
            className="flex items-center gap-2 p-4 text-[13px] text-neutral-600"
          >
            <span
              className="size-1.5 shrink-0 animate-pulse rounded-full bg-indigo-600"
              aria-hidden
            />
            {current.caption}
          </p>
        </div>
      </TextureCardStyled>

      {/* Qué será esta herramienta */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Database,
            title: "Conecta tu proceso actual",
            text: "Apunta tu flujo de onboarding existente con una API key y mira tus validaciones reales entrar aquí.",
          },
          {
            icon: Activity,
            title: "Ruteo en tiempo real",
            text: "Cada validación se dibuja en el canvas mientras ocurre: qué fuente respondió, en cuánto tiempo y por qué ruta.",
          },
          {
            icon: CircleCheck,
            title: "Decisiones auditables",
            text: "Cada aprobado o rechazo queda con su evidencia: fuente consultada, hora y regla que decidió.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <TextureCardStyled key={item.title}>
              <div className="flex h-full flex-col gap-2.5 rounded-[20px] bg-white p-5">
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-indigo-50 text-indigo-600">
                  <Icon className="size-4.5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="text-[14px] font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="text-[12.5px] leading-relaxed text-neutral-500">
                  {item.text}
                </p>
              </div>
            </TextureCardStyled>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-56">
          <TextureButton
            variant="minimal"
            onClick={() => setNotified(true)}
            disabled={notified}
          >
            <Bell className="size-3.5" aria-hidden />
            {notified ? "Te avisaremos" : "Avísame cuando esté listo"}
          </TextureButton>
        </div>
        {notified && (
          <p
            aria-live="polite"
            className="flex items-center gap-1.5 text-[12.5px] text-emerald-700"
          >
            <CircleCheck className="size-4" aria-hidden />
            Quedaste en la lista para el acceso anticipado.
          </p>
        )}
      </div>
    </div>
  );
}

