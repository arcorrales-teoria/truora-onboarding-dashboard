import {
  BarChart3,
  LayoutDashboard,
  PlugZap,
  Settings,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { BrowserWindow } from "@/components/ui/mock-browser-window";

import { ConversionChart } from "./conversion-chart";
import { CoveragePanel } from "./coverage-panel";
import { FlowToolbar } from "./flow-toolbar";
import { KpiBand } from "./kpi-band";
import { LatamMap } from "./latam-map";
import { ProductBlocks } from "./product-blocks";
import { RoutingCanvas } from "./routing-canvas";
import { SourcesTable } from "./sources-table";

const sidebarItems = [
  {
    icon: <LayoutDashboard className="size-4" aria-hidden />,
    label: "Resumen",
    active: true,
  },
  {
    icon: <Workflow className="size-4" aria-hidden />,
    label: "Rutas",
    badge: "3",
  },
  {
    icon: <PlugZap className="size-4" aria-hidden />,
    label: "Conexiones",
  },
  {
    icon: <ShieldCheck className="size-4" aria-hidden />,
    label: "Riesgo",
  },
  {
    icon: <BarChart3 className="size-4" aria-hidden />,
    label: "Reportes",
  },
  {
    icon: <Settings className="size-4" aria-hidden />,
    label: "Configuración",
  },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <header className="max-w-2xl">
        <h2 className="text-[16px] font-semibold tracking-tight text-neutral-900">
          {title}
        </h2>
        <p className="mt-0.5 text-[13px] leading-relaxed text-neutral-500">
          {description}
        </p>
      </header>
      {children}
    </section>
  );
}

export function DashboardShell() {
  return (
    <BrowserWindow
      variant="chrome"
      headerStyle="full"
      size="xl"
      theme="light"
      url="https://app.truora.com/rutas/whatsapp-onboarding-latam"
      showSidebar
      sidebarPosition="left"
      sidebarItems={sidebarItems}
      className="h-auto! max-w-none! w-full mask-none! bg-white shadow-xl shadow-indigo-950/5"
    >
      <FlowToolbar />

      <div className="space-y-10 px-6 py-8 md:px-8">
        <Section
          title="Resumen del flujo"
          description="Rendimiento de la validación de identidad iniciada por WhatsApp durante los últimos seis meses."
        >
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <KpiBand />
            <ConversionChart />
          </div>
        </Section>

        <Section
          title="Recorrido de la validación"
          description="De WhatsApp a la decisión final: cada tarjeta es un bloque de Truora y las insignias muestran el porcentaje de tráfico por ruta."
        >
          <RoutingCanvas />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
              Aprobada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-amber-500" aria-hidden />
              Requiere revisión
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-red-500" aria-hidden />
              Rechazada
            </span>
            <span className="ml-auto font-mono text-[11px] text-neutral-400">
              Datos de demostración
            </span>
          </div>
        </Section>

        <Section
          title="Bloques de validación"
          description="Los productos de Truora que componen este flujo. Actívalos o desactívalos sin escribir código."
        >
          <ProductBlocks />
        </Section>

        <Section
          title="Cobertura"
          description="Dónde opera el flujo hoy y contra qué volumen de validaciones por país."
        >
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <LatamMap />
            <CoveragePanel />
          </div>
        </Section>

        <Section
          title="Fuentes de verificación"
          description="Los registros oficiales y listas que respaldan cada resultado."
        >
          <SourcesTable />
        </Section>
      </div>
    </BrowserWindow>
  );
}
