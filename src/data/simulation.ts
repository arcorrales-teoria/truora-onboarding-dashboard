/**
 * Configuración del playground de simulación.
 *
 * TODO(data): cuando exista el API de simulación (sandbox), estos datos
 * pueden venir de GET /v1/flows/:id/simulate para reflejar tiempos y
 * fuentes reales por país.
 */

export type CountryCode = "CL" | "MX" | "CO" | "PE";

export interface CountryConfig {
  code: CountryCode;
  name: string;
  document: string;
  source: string;
  phone: string;
}

export const countryConfigs: Record<CountryCode, CountryConfig> = {
  CL: {
    code: "CL",
    name: "Chile",
    document: "Cédula de identidad",
    source: "Registro Civil e Identificación",
    phone: "+56 9 6123 4567",
  },
  MX: {
    code: "MX",
    name: "México",
    document: "Credencial INE",
    source: "INE",
    phone: "+52 1 55 1234 5678",
  },
  CO: {
    code: "CO",
    name: "Colombia",
    document: "Cédula de ciudadanía",
    source: "Registraduría Nacional",
    phone: "+57 301 234 5678",
  },
  PE: {
    code: "PE",
    name: "Perú",
    document: "DNI",
    source: "RENIEC",
    phone: "+51 912 345 678",
  },
};

export type SimulationOutcome = "aprobado" | "revision" | "rechazado";

export const outcomeOptions: {
  id: SimulationOutcome | "auto";
  label: string;
}[] = [
  { id: "auto", label: "Aleatorio" },
  { id: "aprobado", label: "Aprobado" },
  { id: "revision", label: "Revisión manual" },
  { id: "rechazado", label: "Rechazado" },
];
