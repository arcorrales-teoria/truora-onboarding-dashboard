"use client";

import * as React from "react";
import {
  Braces,
  ChevronLeft,
  ChevronRight,
  Database,
  Fingerprint,
  Globe,
  MessageCircle,
  ScanFace,
  ShieldCheck,
  Smartphone,
  Waypoints,
  Webhook,
  type LucideIcon,
} from "lucide-react";

import { TextureCardStyled, TextureSeparator } from "@/components/ui/texture-card";
import { cn } from "@/lib/utils";

/**
 * Diagrama "Truora en el centro": los canales del cliente entran por la
 * izquierda, Truora orquesta el ruteo en el medio y a la derecha están
 * las fuentes consultadas y el sistema del cliente que recibe la decisión.
 */

const W = 1140;
const H = 560;
const SIDE_W = 250;
const HUB_W = 360;
const HUB_X = (W - HUB_W) / 2;

interface Tile {
  icon: LucideIcon;
  label: string;
}

interface SideCard {
  id: string;
  title: string;
  tiles: Tile[];
  x: number;
  y: number;
  h: number;
  side: "left" | "right";
}

const sideCards: SideCard[] = [
  {
    id: "canales",
    title: "Canales de entrada",
    tiles: [
      { icon: MessageCircle, label: "WhatsApp" },
      { icon: Globe, label: "Web" },
      { icon: Smartphone, label: "App" },
      { icon: Braces, label: "API" },
    ],
    x: 0,
    y: 60,
    h: 190,
    side: "left",
  },
  {
    id: "sistema",
    title: "Tu sistema",
    tiles: [
      { icon: Database, label: "Core" },
      { icon: Braces, label: "CRM" },
    ],
    x: 0,
    y: 330,
    h: 150,
    side: "left",
  },
  {
    id: "fuentes",
    title: "Fuentes oficiales",
    tiles: [
      { icon: Fingerprint, label: "CL" },
      { icon: Fingerprint, label: "CO" },
      { icon: Fingerprint, label: "PE" },
      { icon: Fingerprint, label: "MX" },
    ],
    x: W - SIDE_W,
    y: 20,
    h: 190,
    side: "right",
  },
  {
    id: "listas",
    title: "Listas de riesgo",
    tiles: [
      { icon: ShieldCheck, label: "AML" },
      { icon: ShieldCheck, label: "PEP" },
    ],
    x: W - SIDE_W,
    y: 240,
    h: 150,
    side: "right",
  },
  {
    id: "webhook",
    title: "Decisión a tu sistema",
    tiles: [{ icon: Webhook, label: "Webhook" }],
    x: W - SIDE_W,
    y: 420,
    h: 120,
    side: "right",
  },
];

const hubRows = [
  { icon: Waypoints, label: "Ruteo inteligente" },
  { icon: ScanFace, label: "Validación de identidad" },
  { icon: ShieldCheck, label: "Motor de riesgo" },
];

const HUB = { x: HUB_X, y: 140, h: 280 };

function connector(card: SideCard) {
  const y = card.y + card.h / 2;
  const hubY = HUB.y + HUB.h / 2;
  if (card.side === "left") {
    const x1 = card.x + SIDE_W;
    const x2 = HUB.x;
    const bend = (x2 - x1) / 2;
    return {
      path: `M ${x1} ${y} C ${x1 + bend} ${y}, ${x2 - bend} ${hubY}, ${x2} ${hubY}`,
      badgeX: x1 + 36,
      badgeY: y + (hubY - y) * 0.12,
    };
  }
  const x1 = HUB.x + HUB_W;
  const x2 = card.x;
  const bend = (x2 - x1) / 2;
  return {
    path: `M ${x1} ${hubY} C ${x1 + bend} ${hubY}, ${x2 - bend} ${y}, ${x2} ${y}`,
    badgeX: x2 - 36,
    badgeY: y + (hubY - y) * 0.12,
  };
}

const MIN_SCALE = 0.6;

export function TruoraHubDiagram() {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const fit = () =>
      setScale(Math.max(MIN_SCALE, Math.min(1, outer.clientWidth / W)));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(outer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      className="overflow-x-auto rounded-[24px] border border-neutral-200/80 bg-white"
    >
      <div style={{ width: W * scale, height: H * scale }}>
        <div
          className="dot-grid relative origin-top-left"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          <svg
            className="pointer-events-none absolute inset-0"
            width={W}
            height={H}
            aria-hidden
          >
            {sideCards.map((card) => {
              const { path } = connector(card);
              return (
                <g key={card.id}>
                  <path
                    d={path}
                    fill="none"
                    stroke="#C7CBF4"
                    strokeWidth="1.5"
                  />
                  <path
                    d={path}
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="1.5"
                    strokeDasharray="4 14"
                    strokeLinecap="round"
                    className="route-flow"
                    opacity="0.8"
                  />
                </g>
              );
            })}
          </svg>

          {/* Flechas de dirección sobre las líneas, estilo integración */}
          {sideCards.map((card) => {
            const { badgeX, badgeY } = connector(card);
            const Chevron =
              card.id === "sistema" || card.id === "webhook"
                ? card.side === "left"
                  ? ChevronLeft
                  : ChevronRight
                : card.side === "left"
                  ? ChevronRight
                  : ChevronLeft;
            return (
              <span
                key={`badge-${card.id}`}
                className="absolute z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-indigo-600 text-white shadow-[0px_1px_1px_rgba(20,21,38,0.15),0px_4px_10px_-2px_rgba(79,70,229,0.5),inset_0px_1px_0px_rgba(255,255,255,0.35)]"
                style={{ left: badgeX, top: badgeY }}
                aria-hidden
              >
                <Chevron className="size-4" strokeWidth={2} />
              </span>
            );
          })}

          {/* Tarjetas laterales */}
          {sideCards.map((card) => (
            <div
              key={card.id}
              className="absolute"
              style={{ left: card.x, top: card.y, width: SIDE_W }}
            >
              <TextureCardStyled>
                <div className="rounded-[20px] bg-white p-4">
                  <h4 className="text-[13px] font-semibold text-neutral-900">
                    {card.title}
                  </h4>
                  <div
                    className={cn(
                      "mt-3 grid gap-2",
                      card.tiles.length > 1 ? "grid-cols-2" : "grid-cols-1",
                    )}
                  >
                    {card.tiles.map((tile) => {
                      const Icon = tile.icon;
                      return (
                        <span
                          key={tile.label}
                          className="flex items-center gap-1.5 rounded-lg border border-neutral-200/80 bg-neutral-50 px-2 py-2 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.9)]"
                        >
                          <Icon
                            className="size-3.5 shrink-0 text-indigo-600"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                          <span className="truncate text-[11.5px] font-medium text-neutral-700">
                            {tile.label}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </TextureCardStyled>
            </div>
          ))}

          {/* Hub central: Truora */}
          <div
            className="absolute"
            style={{ left: HUB.x, top: HUB.y, width: HUB_W }}
          >
            <TextureCardStyled className="shadow-[0px_1px_1px_rgba(20,21,38,0.06),0px_6px_14px_-4px_rgba(79,70,229,0.25),0px_20px_40px_-16px_rgba(79,70,229,0.28),inset_0px_1px_0px_rgba(255,255,255,0.9)]">
              <div className="rounded-[20px] bg-white">
                <div className="flex items-center justify-between p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/truora-logo.svg"
                    alt="Truora"
                    className="h-6 w-auto"
                    draggable={false}
                  />
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-indigo-700">
                    El ruteo
                  </span>
                </div>
                <TextureSeparator />
                <ul>
                  {hubRows.map((row, index) => {
                    const Icon = row.icon;
                    return (
                      <li key={row.label}>
                        {index > 0 && <TextureSeparator />}
                        <span className="flex items-center gap-3 px-5 py-4">
                          <span className="flex size-9 items-center justify-center rounded-[10px] bg-indigo-50 text-indigo-600 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.9)]">
                            <Icon
                              className="size-4.5"
                              strokeWidth={1.75}
                              aria-hidden
                            />
                          </span>
                          <span className="text-[14px] font-medium text-neutral-900">
                            {row.label}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </TextureCardStyled>
          </div>
        </div>
      </div>
    </div>
  );
}
