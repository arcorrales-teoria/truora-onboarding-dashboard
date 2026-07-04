"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Clock3,
  IdCard,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { RoutingCanvas } from "@/components/dashboard/routing-canvas";
import { TextureButton } from "@/components/ui/texture-button";
import {
  TextureCardStyled,
  TextureSeparator,
} from "@/components/ui/texture-card";
import { countryStacks } from "@/data/country-stack";
import {
  countryConfigs,
  outcomeOptions,
  type CountryCode,
  type SimulationOutcome,
} from "@/data/simulation";
import { cn } from "@/lib/utils";

/* ── Tipos internos de la simulación ─────────────────────────────────── */

interface ChatMessage {
  id: number;
  from: "bot" | "user";
  text: string;
  attachment?: boolean;
}

interface LogEntry {
  id: number;
  time: string;
  title: string;
  detail: string;
  tone: "info" | "success" | "warning" | "danger";
}

interface SimStep {
  /** Nodo que se activa en el canvas. */
  node?: string;
  /** Conexiones que se marcan como recorridas. */
  edges?: string[];
  chat?: Omit<ChatMessage, "id">[];
  log?: Omit<LogEntry, "id" | "time">;
  /** Pausa después de aplicar el paso (ms). */
  delay: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ── Guion de la simulación ──────────────────────────────────────────── */

function buildSteps(
  country: CountryCode,
  route: "doc-facial" | "doc",
  outcome: SimulationOutcome,
): SimStep[] {
  const c = countryConfigs[country];
  const steps: SimStep[] = [
    {
      node: "inicio",
      chat: [
        { from: "user", text: "Hola, quiero abrir mi cuenta" },
        {
          from: "bot",
          text: `¡Hola! Soy el asistente de verificación. Para continuar necesito validar tu identidad con tu ${c.document.toLowerCase()}. Toma menos de un minuto.`,
        },
      ],
      log: {
        title: "Conversación iniciada",
        detail: `WhatsApp · ${c.phone} · ${c.name}`,
        tone: "info",
      },
      delay: 1400,
    },
    {
      node: "condicion",
      edges: ["inicio-condicion"],
      log: {
        title: "Condición evaluada",
        detail: `País ${c.code} · Documento: ${c.document}`,
        tone: "info",
      },
      delay: 1200,
    },
    {
      node: route,
      edges: [`condicion-${route}`],
      chat: [
        { from: "user", text: "foto_documento.jpg", attachment: true },
        {
          from: "bot",
          text:
            route === "doc-facial"
              ? "Recibido. Ahora tómate una selfie corta para confirmar que eres tú."
              : "Recibido. Estamos validando tu documento.",
        },
      ],
      log: {
        title:
          route === "doc-facial"
            ? "Ruta principal: documento + facial (72%)"
            : "Ruta de respaldo: solo documento (28%)",
        detail: "Elegida por el ruteo inteligente para maximizar conversión",
        tone: "info",
      },
      delay: 1700,
    },
    {
      node: route,
      log:
        outcome === "rechazado"
          ? {
              title: "Validación de documento rechazada",
              detail:
                route === "doc-facial"
                  ? "El rostro no coincide con la foto del documento"
                  : `El documento no coincide con ${c.source}`,
              tone: "danger",
            }
          : {
              title: "Documento verificado",
              detail: `Cotejado contra ${c.source}${route === "doc-facial" ? " · Prueba de vida superada" : ""}`,
              tone: "success",
            },
      delay: 1500,
    },
  ];

  if (route === "doc-facial") {
    steps.push({
      node: "senales",
      edges: ["doc-facial-senales"],
      log: {
        title: "Señales en paralelo",
        detail: `Teléfono verificado por OTP · Correo válido · Ubicación en ${c.name}`,
        tone: "success",
      },
      delay: 1400,
    });
  }

  steps.push({
    node: "antecedentes",
    edges: [`${route}-antecedentes`],
    log:
      outcome === "revision"
        ? {
            title: "Antecedentes con hallazgos",
            detail: "Coincidencia parcial en listas PEP · Se enviará a revisión",
            tone: "warning",
          }
        : {
            title: "Antecedentes sin hallazgos",
            detail: "OFAC, ONU, Interpol y listas locales consultadas",
            tone: "success",
          },
    delay: 1500,
  });

  steps.push({
    node: "firma",
    edges: ["antecedentes-firma"],
    chat:
      outcome === "rechazado"
        ? []
        : [
            {
              from: "bot",
              text: "Último paso: revisa y firma el acuerdo de apertura aquí en el chat.",
            },
            { from: "user", text: "Listo, firmado" },
          ],
    log:
      outcome === "rechazado"
        ? {
            title: "Firma electrónica omitida",
            detail: "El flujo se detiene por el rechazo de identidad",
            tone: "warning",
          }
        : {
            title: "Contrato firmado electrónicamente",
            detail: "Firma con validez legal registrada en el chat",
            tone: "success",
          },
    delay: 1400,
  });

  const finalChat: Record<SimulationOutcome, string> = {
    aprobado:
      "¡Todo listo! Tu identidad fue verificada y tu cuenta quedó activa. Bienvenido.",
    revision:
      "Gracias. Tu solicitud quedó en revisión por nuestro equipo; te avisaremos por aquí en menos de 24 horas.",
    rechazado:
      "No pudimos verificar tu identidad con los datos enviados. Puedes intentarlo de nuevo o escribir a soporte.",
  };

  steps.push({
    node: "resultado",
    edges: [
      "firma-resultado",
      ...(route === "doc-facial" ? ["senales-resultado"] : []),
    ],
    chat: [{ from: "bot", text: finalChat[outcome] }],
    log: {
      title: `Decisión final: ${
        outcome === "aprobado"
          ? "Aprobado"
          : outcome === "revision"
            ? "Revisión manual"
            : "Rechazado"
      }`,
      detail: "Resultado notificado por webhook al sistema del cliente",
      tone:
        outcome === "aprobado"
          ? "success"
          : outcome === "revision"
            ? "warning"
            : "danger",
    },
    delay: 400,
  });

  return steps;
}

/* ── Componente ──────────────────────────────────────────────────────── */

const toneDot: Record<LogEntry["tone"], string> = {
  info: "bg-indigo-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export function Playground() {
  const [country, setCountry] = React.useState<CountryCode>("CL");
  const [forcedOutcome, setForcedOutcome] = React.useState<
    SimulationOutcome | "auto"
  >("auto");
  const [running, setRunning] = React.useState(false);
  const [finished, setFinished] = React.useState<SimulationOutcome | null>(
    null,
  );

  const [activeNode, setActiveNode] = React.useState<string | null>(null);
  const [visited, setVisited] = React.useState<string[]>([]);
  const [traversed, setTraversed] = React.useState<string[]>([]);
  const [chat, setChat] = React.useState<ChatMessage[]>([]);
  const [log, setLog] = React.useState<LogEntry[]>([]);

  const runId = React.useRef(0);
  const idSeq = React.useRef(0);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat]);

  // Cancela la simulación al desmontar la página.
  React.useEffect(() => () => void runId.current++, []);

  function reset() {
    runId.current++;
    setRunning(false);
    setFinished(null);
    setActiveNode(null);
    setVisited([]);
    setTraversed([]);
    setChat([]);
    setLog([]);
  }

  async function simulate() {
    reset();
    const id = ++runId.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const route = Math.random() < 0.72 ? "doc-facial" : "doc";
    const outcome: SimulationOutcome =
      forcedOutcome === "auto"
        ? Math.random() < 0.91
          ? "aprobado"
          : Math.random() < 0.7
            ? "revision"
            : "rechazado"
        : forcedOutcome;

    const steps = buildSteps(country, route, outcome);
    const start = performance.now();
    setRunning(true);

    for (const step of steps) {
      if (runId.current !== id) return;

      if (step.node) {
        const node = step.node;
        setActiveNode(node);
        setVisited((prev) => (prev.includes(node) ? prev : [...prev, node]));
      }
      if (step.edges) {
        const edges = step.edges;
        setTraversed((prev) => [
          ...prev,
          ...edges.filter((e) => !prev.includes(e)),
        ]);
      }
      if (step.chat) {
        for (const message of step.chat) {
          if (runId.current !== id) return;
          setChat((prev) => [...prev, { ...message, id: ++idSeq.current }]);
          await sleep(reduced ? 0 : 550);
        }
      }
      if (step.log) {
        const seconds = ((performance.now() - start) / 1000).toFixed(1);
        setLog((prev) => [
          ...prev,
          { ...step.log!, id: ++idSeq.current, time: `${seconds}s` },
        ]);
      }
      await sleep(reduced ? 0 : step.delay);
    }

    if (runId.current !== id) return;
    setActiveNode(null);
    setRunning(false);
    setFinished(outcome);
  }

  const config = countryConfigs[country];
  const stack = countryStacks.find((s) => s.code === country);

  return (
    <div className="space-y-5 px-6 py-8 md:px-8">
      {/* Controles */}
      <TextureCardStyled>
        <div className="rounded-[20px] bg-white">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4 p-5">
          <fieldset>
            <legend className="mb-2 text-[12px] font-medium text-neutral-500">
              País de la validación
            </legend>
            <div className="flex gap-1.5">
              {(Object.keys(countryConfigs) as CountryCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  disabled={running}
                  onClick={() => setCountry(code)}
                  className={cn(
                    "rounded-lg border px-3.5 py-2 font-mono text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500",
                    country === code
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900",
                    running && "opacity-50",
                  )}
                >
                  {code}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <p className="mb-2 text-[12px] font-medium text-neutral-500">
              Documento
            </p>
            <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[13px] text-neutral-700">
              {config.document}
            </p>
          </div>

          <fieldset>
            <legend className="mb-2 text-[12px] font-medium text-neutral-500">
              Resultado
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {outcomeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={running}
                  onClick={() => setForcedOutcome(option.id)}
                  className={cn(
                    "rounded-lg border px-3.5 py-2 text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500",
                    forcedOutcome === option.id
                      ? "border-indigo-600 bg-indigo-50 font-medium text-indigo-700"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900",
                    running && "opacity-50",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="ml-auto flex items-center gap-2.5">
            {(running || finished) && (
              <div className="w-32">
                <TextureButton variant="minimal" onClick={reset}>
                  <RotateCcw className="size-3.5" aria-hidden />
                  Reiniciar
                </TextureButton>
              </div>
            )}
            <div className="w-44">
              <TextureButton
                variant="accent"
                onClick={simulate}
                disabled={running}
                className={cn(running && "pointer-events-none opacity-70")}
              >
                <Play className="size-3.5" aria-hidden />
                {running ? "Simulando…" : "Iniciar simulación"}
              </TextureButton>
            </div>
          </div>
        </div>

        {/* El backend que usa el flujo en el país elegido */}
        {stack && (
          <>
            <TextureSeparator />
            <dl className="grid gap-x-8 gap-y-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Registro de identidad", value: stack.identitySource },
                { label: "Documento", value: stack.document },
                {
                  label: "Antecedentes y riesgo",
                  value: stack.backgroundSources.join(" · "),
                },
                { label: "Verificación de teléfono", value: stack.phoneCheck },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-neutral-500">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-[13px] font-medium text-neutral-800">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
        </div>
      </TextureCardStyled>

      {/* Canvas + chat */}
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <RoutingCanvas
          activeNodeId={activeNode}
          visitedNodeIds={visited}
          traversedEdges={traversed}
          simulating={running || finished !== null}
        />

        <WhatsAppPanel
          chat={chat}
          phone={config.phone}
          running={running}
          endRef={chatEndRef}
        />
      </div>

      {/* Resultado + log de eventos */}
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <TextureCardStyled>
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-[20px] bg-white p-6 text-center">
            {finished === null ? (
              <>
                <Clock3 className="size-6 text-neutral-300" aria-hidden />
                <p className="text-[13px] text-neutral-500">
                  {running
                    ? "Validación en curso…"
                    : "Configura el país y presiona Iniciar simulación."}
                </p>
              </>
            ) : (
              <>
                {finished === "aprobado" ? (
                  <CheckCircle2
                    className="size-7 text-emerald-500"
                    aria-hidden
                  />
                ) : finished === "revision" ? (
                  <Clock3 className="size-7 text-amber-500" aria-hidden />
                ) : (
                  <XCircle className="size-7 text-red-500" aria-hidden />
                )}
                <p className="text-[16px] font-semibold text-neutral-900">
                  {finished === "aprobado"
                    ? "Identidad aprobada"
                    : finished === "revision"
                      ? "Enviada a revisión manual"
                      : "Identidad rechazada"}
                </p>
                <p className="text-[12.5px] text-neutral-500">
                  {config.name} · {config.document} ·{" "}
                  {log.length > 0 ? log[log.length - 1].time : ""} en total
                </p>
              </>
            )}
          </div>
        </TextureCardStyled>

        <TextureCardStyled>
          <div className="rounded-[20px] bg-white">
            <h3 className="p-4 text-[13px] font-semibold text-neutral-900">
              Log de eventos
            </h3>
            <TextureSeparator />
            <div className="max-h-64 overflow-y-auto p-2">
              {log.length === 0 ? (
                <p className="px-2 py-6 text-center text-[12.5px] text-neutral-500">
                  Los eventos de la validación aparecerán aquí en tiempo real.
                </p>
              ) : (
                <ul>
                  {log.map((entry) => (
                    <motion.li
                      key={entry.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-baseline gap-3 rounded-lg px-2 py-1.5 hover:bg-neutral-50"
                    >
                      <span className="w-12 shrink-0 font-mono text-[11px] tabular-nums text-neutral-500">
                        {entry.time}
                      </span>
                      <span
                        className={cn(
                          "mt-1 size-1.5 shrink-0 self-center rounded-full",
                          toneDot[entry.tone],
                        )}
                        aria-hidden
                      />
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium text-neutral-800">
                          {entry.title}
                        </span>
                        <span className="block text-[12px] text-neutral-500">
                          {entry.detail}
                        </span>
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </TextureCardStyled>
      </div>
    </div>
  );
}

/* ── Panel de chat estilo WhatsApp ───────────────────────────────────── */

function WhatsAppPanel({
  chat,
  phone,
  running,
  endRef,
}: {
  chat: ChatMessage[];
  phone: string;
  running: boolean;
  endRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <TextureCardStyled className="h-full">
      <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[20px] bg-white">
        <div className="flex items-center gap-2.5 bg-emerald-700 px-4 py-3 text-white">
          <span className="flex size-8 items-center justify-center rounded-full bg-white/15 text-[12px] font-semibold">
            T
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-medium leading-tight">
              Verificación · Truora
            </span>
            <span className="block text-[11px] text-emerald-100">
              {running ? "escribiendo…" : phone}
            </span>
          </span>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto bg-[#EFEAE2] p-3">
          {chat.length === 0 && (
            <p className="px-4 py-8 text-center text-[12px] text-neutral-500">
              Aquí verás la conversación de WhatsApp tal como la vive el
              usuario final.
            </p>
          )}
          {chat.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex",
                message.from === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-snug shadow-sm",
                  message.from === "user"
                    ? "rounded-br-sm bg-[#D9FDD3] text-neutral-900"
                    : "rounded-bl-sm bg-white text-neutral-900",
                )}
              >
                {message.attachment ? (
                  <span className="flex items-center gap-2 text-neutral-700">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-neutral-100">
                      <IdCard className="size-4.5 text-indigo-600" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium">{message.text}</span>
                      <span className="block text-[11px] text-neutral-500">
                        Foto · 1.2 MB
                      </span>
                    </span>
                  </span>
                ) : (
                  message.text
                )}
              </div>
            </motion.div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
    </TextureCardStyled>
  );
}
