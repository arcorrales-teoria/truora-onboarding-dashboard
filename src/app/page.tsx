import { ConversionChart } from "@/components/dashboard/conversion-chart";
import { CoveragePanel } from "@/components/dashboard/coverage-panel";
import { KpiBand } from "@/components/dashboard/kpi-band";
import { LatamConnectionsMap } from "@/components/dashboard/latam-connections-map";
import { ProductBlocks } from "@/components/dashboard/product-blocks";
import { RoutingCanvas } from "@/components/dashboard/routing-canvas";
import { Section } from "@/components/dashboard/section";
import { SourcesTable } from "@/components/dashboard/sources-table";
import { TruoraHubDiagram } from "@/components/dashboard/truora-hub-diagram";

export default function ResumenPage() {
  return (
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
        description="De WhatsApp a la decisión final: cada tarjeta es un bloque de Truora y las insignias muestran el porcentaje de tráfico por ruta. Ábrelo en el playground para verlo en acción."
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
          <span className="ml-auto font-mono text-[11px] text-neutral-500">
            Datos de demostración
          </span>
        </div>
      </Section>

      <Section
        title="Truora en el centro del ruteo"
        description="Tus canales entran por un lado, Truora orquesta la validación consultando las fuentes de cada país, y tu sistema recibe la decisión por webhook."
      >
        <TruoraHubDiagram />
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
          <LatamConnectionsMap />
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
  );
}
