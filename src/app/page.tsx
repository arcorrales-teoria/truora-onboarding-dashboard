import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { TextureOverlay } from "@/components/ui/texture-overlay";

export default function Home() {
  return (
    <main className="relative flex-1 px-4 py-8 md:px-10 md:py-12">
      {/* Fondo con grano sutil, estilo Yuno */}
      <TextureOverlay texture="noise" opacity={0.16} className="fixed inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <DashboardShell />
      </div>
    </main>
  );
}
