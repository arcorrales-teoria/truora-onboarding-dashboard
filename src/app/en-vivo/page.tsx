import type { Metadata } from "next";

import { LivePreview } from "@/components/live/live-preview";
import { Section } from "@/components/dashboard/section";

export const metadata: Metadata = {
  title: "En vivo · Truora",
};

export default function EnVivoPage() {
  return (
    <div className="space-y-10 px-6 py-8 md:px-8">
      <Section
        title="Conecta tu proceso en vivo"
        description="Muy pronto podrás enchufar tu flujo actual y ver aquí, en tiempo real, cómo cada validación recorre las fuentes de cada país. Así se verá:"
      >
        <LivePreview />
      </Section>
    </div>
  );
}
