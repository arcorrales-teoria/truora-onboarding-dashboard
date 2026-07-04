import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppShell } from "@/components/dashboard/app-shell";
import { TextureOverlay } from "@/components/ui/texture-overlay";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Truora · Ruteo de validación por WhatsApp",
  description:
    "Dashboard demo del ruteo de una validación de identidad iniciada por WhatsApp: bloques de validación, playground de simulación, cobertura LATAM y fuentes de verificación.",
  icons: { icon: "/truora-icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <main className="relative flex-1 p-2.5 sm:p-4 lg:p-6">
          {/* Fondo con grano sutil, estilo Yuno */}
          <TextureOverlay
            texture="noise"
            opacity={0.16}
            className="fixed inset-0"
          />
          <div className="relative z-10 mx-auto w-full max-w-[1880px]">
            <AppShell>{children}</AppShell>
          </div>
        </main>
      </body>
    </html>
  );
}
