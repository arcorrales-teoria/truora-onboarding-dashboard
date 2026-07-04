"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BarChart3,
  LayoutDashboard,
  Play,
  PlugZap,
  Settings,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { TextureButton } from "@/components/ui/texture-button";
import { BrowserWindow } from "@/components/ui/mock-browser-window";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/rutas", label: "Rutas", icon: Workflow, badge: "6" },
  { href: "/playground", label: "Playground", icon: Play },
  { href: "/conexiones", label: "Conexiones", icon: PlugZap },
  { href: "/riesgo", label: "Riesgo", icon: ShieldCheck },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

const PAGE_TITLES: Record<string, string> = {
  "/": "Resumen del flujo",
  "/rutas": "Rutas",
  "/playground": "Playground de simulación",
  "/conexiones": "Conexiones",
  "/riesgo": "Condiciones de riesgo",
  "/reportes": "Reportes",
  "/configuracion": "Configuración",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Resumen del flujo";

  return (
    <BrowserWindow
      variant="chrome"
      headerStyle="full"
      size="xl"
      theme="light"
      url={`https://app.truora.com${pathname === "/" ? "/resumen" : pathname}`}
      showSidebar={false}
      className="h-auto! max-w-none! w-full mask-none! bg-white shadow-xl shadow-indigo-950/5"
    >
      <div className="flex min-h-[720px]">
        {/* Barra lateral propia (los ítems del BrowserWindow no navegan) */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-neutral-200/70 bg-neutral-50/60 md:flex">
          <div className="brand-in flex items-center gap-2.5 px-5 pb-4 pt-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/truora-logo.svg"
              alt="Truora"
              className="h-6 w-auto"
              draggable={false}
            />
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10.5px] font-medium text-indigo-700">
              Demo
            </span>
          </div>

          <nav className="brand-in-delayed flex-1 space-y-1 px-3 pb-4">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors duration-150",
                    active
                      ? "bg-indigo-50 font-medium text-indigo-700"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      active ? "text-indigo-600" : "text-neutral-400",
                    )}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-indigo-100/80 px-1.5 py-0.5 font-mono text-[10px] text-indigo-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-neutral-200/70 px-5 py-3">
            <p className="text-[11px] text-neutral-400">
              Validación de identidad · LATAM
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Toolbar title={title} isPlayground={pathname === "/playground"} />
          {children}
        </div>
      </div>
    </BrowserWindow>
  );
}

function Toolbar({
  title,
  isPlayground,
}: {
  title: string;
  isPlayground: boolean;
}) {
  const [testMode, setTestMode] = React.useState(true);
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/70 bg-white/80 px-6 py-4 backdrop-blur-sm md:px-8">
      <div className="min-w-0">
        <p className="text-[12px] text-neutral-400">
          Validación de identidad <span aria-hidden>/</span> WhatsApp
          Onboarding · LATAM
        </p>
        <h1 className="text-[17px] font-semibold tracking-tight text-neutral-900">
          {title}
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

        {!isPlayground && (
          <div className="w-44">
            <TextureButton
              variant="minimal"
              onClick={() => router.push("/playground")}
            >
              <Play className="size-3.5" aria-hidden />
              Abrir playground
            </TextureButton>
          </div>
        )}
        <div className="w-36">
          <TextureButton variant="accent">
            Publicar ruta
            <ArrowUpRight className="size-3.5" aria-hidden />
          </TextureButton>
        </div>
      </div>
    </div>
  );
}
