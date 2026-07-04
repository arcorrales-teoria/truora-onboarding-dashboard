import type { Metadata } from "next";

import { ConnectionsGrid } from "@/components/dashboard/connections-grid";
import { Section } from "@/components/dashboard/section";

export const metadata: Metadata = {
  title: "Conexiones · Truora",
};

export default function ConexionesPage() {
  return (
    <div className="space-y-10 px-6 py-8 md:px-8">
      <Section
        title="Conexiones"
        description="Fuentes oficiales, listas y canales que alimentan las rutas. Conecta nuevas fuentes cuando expandas a otro país."
      >
        <ConnectionsGrid />
      </Section>
    </div>
  );
}
