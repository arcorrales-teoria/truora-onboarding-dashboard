import type { Metadata } from "next";

import { Section } from "@/components/dashboard/section";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const metadata: Metadata = {
  title: "Configuración · Truora",
};

export default function ConfiguracionPage() {
  return (
    <div className="space-y-10 px-6 py-8 md:px-8">
      <Section
        title="Configuración del flujo"
        description="Ajustes generales de la ruta de WhatsApp. Los cambios solo aplican a este demo."
      >
        <SettingsForm />
      </Section>
    </div>
  );
}
