/**
 * Rutas configuradas en la cuenta (página Rutas).
 *
 * TODO(data): listar desde GET /v1/routing/flows.
 */

export interface RouteSummary {
  id: string;
  name: string;
  channel: "WhatsApp" | "Web" | "API";
  countries: string[];
  status: "activa" | "pausada" | "borrador";
  conversion: string;
  monthlyVolume: string;
  updatedAt: string;
}

export const routesList: RouteSummary[] = [
  {
    id: "whatsapp-onboarding-latam",
    name: "WhatsApp Onboarding · LATAM",
    channel: "WhatsApp",
    countries: ["CL", "MX", "CO", "PE"],
    status: "activa",
    conversion: "89.4%",
    monthlyVolume: "1.9M",
    updatedAt: "Hace 2 días",
  },
  {
    id: "web-onboarding-mx",
    name: "Web Onboarding · México",
    channel: "Web",
    countries: ["MX"],
    status: "pausada",
    conversion: "84.1%",
    monthlyVolume: "310k",
    updatedAt: "Hace 3 semanas",
  },
  {
    id: "kyc-reforzado-co",
    name: "KYC reforzado · Colombia",
    channel: "API",
    countries: ["CO"],
    status: "borrador",
    conversion: "Sin datos",
    monthlyVolume: "Sin datos",
    updatedAt: "Ayer",
  },
];
