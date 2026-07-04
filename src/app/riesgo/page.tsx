import type { Metadata } from "next";

import { RiskRulesTable } from "@/components/dashboard/risk-rules-table";
import { Section } from "@/components/dashboard/section";

export const metadata: Metadata = {
  title: "Riesgo · Truora",
};

export default function RiesgoPage() {
  return (
    <div className="space-y-10 px-6 py-8 md:px-8">
      <Section
        title="Condiciones de riesgo"
        description="Reglas que bloquean, permiten o envían a revisión una validación antes de la decisión final."
      >
        <RiskRulesTable />
      </Section>
    </div>
  );
}
