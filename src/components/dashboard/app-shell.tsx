"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ChartColumn,
  Headset,
  CircleCheck,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  PlugZap,
  Radio,
  Route,
  Settings,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";

import { motion } from "motion/react";

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
  { href: "/rutas", label: "Rutas", icon: Route, badge: "6" },
  { href: "/playground", label: "Playground", icon: Play },
  { href: "/en-vivo", label: "En vivo", icon: Radio, badge: "Pronto" },
  { href: "/conexiones", label: "Conexiones", icon: PlugZap },
  { href: "/riesgo", label: "Riesgo", icon: ShieldCheck },
  { href: "/reportes", label: "Reportes", icon: ChartColumn },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

const PAGE_TITLES: Record<string, string> = {
  "/": "Resumen del flujo",
  "/rutas": "Rutas",
  "/playground": "Playground de simulación",
  "/en-vivo": "Conecta tu proceso en vivo",
  "/conexiones": "Conexiones",
  "/riesgo": "Condiciones de riesgo",
  "/reportes": "Reportes",
  "/configuracion": "Configuración",
};

const EXPERT_URL = "https://www.truora.com/es/contacto-ventas";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Resumen del flujo";
  const [collapsed, setCollapsed] = React.useState(false);
  const footerCtaRef = React.useRef<HTMLDivElement>(null);
  const [footerCtaVisible, setFooterCtaVisible] = React.useState(false);

  // El botón flotante se retira cuando el CTA del pie ya está en pantalla.
  React.useEffect(() => {
    const el = footerCtaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterCtaVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Recuerda el estado del menú entre visitas.
  React.useEffect(() => {
    setCollapsed(localStorage.getItem("truora-demo:sidebar") === "collapsed");
  }, []);
  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((value) => {
      localStorage.setItem(
        "truora-demo:sidebar",
        value ? "expanded" : "collapsed",
      );
      return !value;
    });
  }, []);

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
      <div className="flex min-h-[calc(100dvh-8rem)]">
        {/* Barra lateral propia (los ítems del BrowserWindow no navegan) */}
        <aside
          className={cn(
            "hidden shrink-0 flex-col border-r border-neutral-200/70 bg-neutral-50/60 transition-[width] duration-300 md:flex",
            collapsed ? "w-[68px]" : "w-60",
          )}
        >
          <div
            className={cn(
              "brand-in flex items-center pb-4 pt-5",
              collapsed ? "justify-center px-2" : "gap-2.5 px-5",
            )}
          >
            {collapsed ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/truora-icon.svg"
                alt="Truora"
                className="size-7 rounded-lg"
                draggable={false}
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/truora-logo.svg"
                alt="Truora"
                className="h-6 w-auto"
                draggable={false}
              />
            )}
          </div>

          <nav
            className={cn(
              "brand-in-delayed flex-1 space-y-1 pb-4",
              collapsed ? "px-2.5" : "px-3",
            )}
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
              />
            ))}
          </nav>

          <div
            className={cn(
              "border-t border-neutral-200/70 py-2.5",
              collapsed ? "px-2.5" : "px-3",
            )}
          >
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={
                collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"
              }
              className={cn(
                "flex min-h-[40px] w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800",
                collapsed && "justify-center px-0",
              )}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" strokeWidth={1.75} aria-hidden />
              ) : (
                <>
                  <PanelLeftClose
                    className="size-4"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Colapsar
                </>
              )}
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <MobileNav pathname={pathname} title={title} />
          <Toolbar title={title} isPlayground={pathname === "/playground"} />
          <div className="flex-1">{children}</div>
          <div ref={footerCtaRef}>
            <ExpertCta />
          </div>
        </div>
      </div>

      <FloatingExpertCta hidden={footerCtaVisible} />
    </BrowserWindow>
  );
}

/** Botón flotante: la asesoría siempre a un clic, sin importar el scroll. */
function FloatingExpertCta({ hidden }: { hidden: boolean }) {
  return (
    <a
      href={EXPERT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        hidden && "pointer-events-none translate-y-2 opacity-0",
        "fixed bottom-5 right-5 z-50 block rounded-full border border-black/10 bg-gradient-to-b from-indigo-300/90 to-indigo-500 p-[1px] shadow-[0px_2px_2px_rgba(20,21,38,0.12),0px_10px_24px_-6px_rgba(79,70,229,0.55)] transition-[transform,box-shadow] duration-200 hover:shadow-[0px_2px_2px_rgba(20,21,38,0.12),0px_14px_30px_-6px_rgba(79,70,229,0.65)] active:translate-y-[1px]",
        "transition-[opacity,transform,box-shadow] duration-300",
      )}
    >
      <span className="flex items-center gap-2 rounded-full bg-gradient-to-b from-indigo-400 to-indigo-600 py-2.5 pl-4 pr-5 text-[13px] font-medium text-white/95 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.4),inset_0px_-1.5px_1px_rgba(30,27,110,0.35)]">
      <Headset className="size-4" strokeWidth={1.75} aria-hidden />
      Agendar una asesoría
      </span>
    </a>
  );
}

function NavLink({
  item,
  pathname,
  collapsed = false,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const active = pathname === item.href;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "relative flex min-h-[40px] items-center rounded-lg text-[13px] transition-colors duration-150",
        collapsed ? "justify-center px-0" : "gap-2.5 px-2.5 py-2",
        active
          ? "bg-indigo-50 font-medium text-indigo-700"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0",
          active ? "text-indigo-600" : "text-neutral-500",
        )}
        strokeWidth={1.75}
        aria-hidden
      />
      {!collapsed && <span className="flex-1">{item.label}</span>}
      {!collapsed && item.badge && (
        <span className="rounded-full bg-indigo-100/80 px-1.5 py-0.5 font-mono text-[10px] text-indigo-700">
          {item.badge}
        </span>
      )}
      {collapsed && item.badge && (
        <span
          className="absolute right-2 top-2 size-1.5 rounded-full bg-indigo-500"
          aria-hidden
        />
      )}
    </Link>
  );
}

function MobileNav({ pathname, title }: { pathname: string; title: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border-b border-neutral-200/70 bg-white md:hidden">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/truora-logo.svg"
            alt="Truora"
            className="h-5 w-auto"
            draggable={false}
          />
          <span className="text-[13px] text-neutral-500">{title}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex size-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          {open ? (
            <X className="size-5" aria-hidden />
          ) : (
            <Menu className="size-5" aria-hidden />
          )}
        </button>
      </div>
      {open && (
        <nav className="grid grid-cols-2 gap-1 border-t border-neutral-100 p-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </nav>
      )}
    </div>
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
  const [published, setPublished] = React.useState(false);
  const router = useRouter();

  function publish() {
    setPublished(true);
    window.setTimeout(() => setPublished(false), 2500);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-neutral-200/70 bg-white/80 px-4 py-4 backdrop-blur-sm md:px-8">
      <div className="min-w-0">
        <p className="text-[12px] text-neutral-500">
          Validación de identidad <span aria-hidden>/</span> WhatsApp
          Onboarding · LATAM
        </p>
        <motion.h1
          key={title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-[17px] font-semibold tracking-tight text-neutral-900"
        >
          {title}
        </motion.h1>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
        <span
          aria-live="polite"
          className={cn(
            "flex items-center gap-1.5 text-[12.5px] text-emerald-700 transition-opacity duration-300",
            published ? "opacity-100" : "opacity-0",
          )}
        >
          <CircleCheck className="size-4" aria-hidden />
          Publicada en el sandbox
        </span>

        <label className="flex items-center gap-2 text-[12.5px] text-neutral-500">
          <span className="hidden sm:inline">Modo de prueba</span>
          <Switch
            checked={testMode}
            onCheckedChange={(checked) => setTestMode(checked === true)}
            aria-label="Alternar modo de prueba"
          />
        </label>

        <div className="hidden h-6 w-px bg-neutral-200 sm:block" aria-hidden />

        {!isPlayground && (
          <div className="hidden w-44 sm:block">
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
          <TextureButton variant="accent" onClick={publish}>
            Publicar ruta
            <ArrowUpRight className="size-3.5" aria-hidden />
          </TextureButton>
        </div>
      </div>
    </div>
  );
}

/** CTA permanente: llevar el demo a una conversación comercial. */
function ExpertCta() {
  return (
    <div className="border-t border-neutral-200/70 bg-neutral-50/60 px-4 py-6 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-lg">
          <p className="text-[15px] font-semibold tracking-tight text-neutral-900">
            Impleméntalo con tu producto
          </p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-neutral-500">
            Un experto de Truora arma contigo este mismo flujo para tu
            operación y tus países, sin escribir código.
          </p>
        </div>
        <a
          href={EXPERT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-56 rounded-[12px] border border-black/10 bg-gradient-to-b from-indigo-300/90 to-indigo-500 p-[1px] transition-[transform,box-shadow] duration-200 shadow-[0px_1px_1px_rgba(20,21,38,0.1),0px_6px_14px_-4px_rgba(79,70,229,0.45)] hover:shadow-[0px_1px_1px_rgba(20,21,38,0.1),0px_8px_20px_-4px_rgba(79,70,229,0.55)] active:translate-y-[1px] active:shadow-[0px_1px_3px_rgba(79,70,229,0.35)]"
        >
          <span className="flex items-center justify-center gap-2 rounded-[10px] bg-gradient-to-b from-indigo-400 to-indigo-600 px-4 py-2 text-sm text-white/90 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.4),inset_0px_-1.5px_1px_rgba(30,27,110,0.35)] transition duration-300 hover:from-indigo-400/80 hover:to-indigo-600/80">
            Agendar una asesoría
            <ArrowUpRight className="size-3.5" aria-hidden />
          </span>
        </a>
      </div>
    </div>
  );
}
