/**
 * Rutas configuradas en la cuenta (página Rutas).
 *
 * TODO(data): listar desde GET /v1/routing/flows.
 */

export interface RouteSummary {
  id: string;
  name: string;
  useCase: string;
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
    useCase: "Apertura de cuenta",
    channel: "WhatsApp",
    countries: ["CL", "MX", "CO", "PE"],
    status: "activa",
    conversion: "89.4%",
    monthlyVolume: "1.9M",
    updatedAt: "Hace 2 días",
  },
  {
    id: "colocacion-credito-cl",
    name: "Colocación de crédito · Chile",
    useCase: "Colocación de producto",
    channel: "WhatsApp",
    countries: ["CL"],
    status: "activa",
    conversion: "76.2%",
    monthlyVolume: "184k",
    updatedAt: "Hace 5 días",
  },
  {
    id: "firma-contratos-co",
    name: "Firma de contratos · Colombia",
    useCase: "Contratación remota",
    channel: "API",
    countries: ["CO"],
    status: "activa",
    conversion: "94.7%",
    monthlyVolume: "96k",
    updatedAt: "Hace 1 semana",
  },
  {
    id: "web-onboarding-mx",
    name: "Web Onboarding · México",
    useCase: "Apertura de cuenta",
    channel: "Web",
    countries: ["MX"],
    status: "pausada",
    conversion: "84.1%",
    monthlyVolume: "310k",
    updatedAt: "Hace 3 semanas",
  },
  {
    id: "reactivacion-pe",
    name: "Reactivación de cuentas · Perú",
    useCase: "Recuperación de acceso",
    channel: "WhatsApp",
    countries: ["PE"],
    status: "borrador",
    conversion: "Sin datos",
    monthlyVolume: "Sin datos",
    updatedAt: "Ayer",
  },
  {
    id: "kyc-reforzado-co",
    name: "KYC reforzado · Colombia",
    useCase: "Cumplimiento AML",
    channel: "API",
    countries: ["CO"],
    status: "borrador",
    conversion: "Sin datos",
    monthlyVolume: "Sin datos",
    updatedAt: "Ayer",
  },
];
