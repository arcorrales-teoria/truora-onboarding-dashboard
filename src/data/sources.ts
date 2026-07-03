/**
 * Fuentes de verificación consultadas por el flujo.
 *
 * TODO(data): listar desde el catálogo real de conectores
 * (p. ej. GET /v1/sources?region=latam) para que la tabla refleje
 * las fuentes activas de la cuenta del cliente.
 */

export interface VerificationSource {
  id: string;
  name: string;
  category: "Registro oficial" | "Listas de riesgo" | "Operador móvil";
  country: string;
  countryCode: string;
  coverage: string;
  features: string[];
}

export const verificationSources: VerificationSource[] = [
  {
    id: "registro-civil-cl",
    name: "Registro Civil e Identificación",
    category: "Registro oficial",
    country: "Chile",
    countryCode: "CL",
    coverage: "Cédula de identidad vigente",
    features: ["Biometría", "OCR", "Vigencia"],
  },
  {
    id: "reniec-pe",
    name: "RENIEC",
    category: "Registro oficial",
    country: "Perú",
    countryCode: "PE",
    coverage: "DNI y DNI electrónico",
    features: ["Biometría", "OCR"],
  },
  {
    id: "registraduria-co",
    name: "Registraduría Nacional",
    category: "Registro oficial",
    country: "Colombia",
    countryCode: "CO",
    coverage: "Cédula de ciudadanía",
    features: ["Biometría", "Vigencia"],
  },
  {
    id: "ine-mx",
    name: "INE",
    category: "Registro oficial",
    country: "México",
    countryCode: "MX",
    coverage: "Credencial para votar",
    features: ["OCR", "Vigencia"],
  },
  {
    id: "listas-aml",
    name: "Listas AML, PEP y sanciones",
    category: "Listas de riesgo",
    country: "LATAM",
    countryCode: "INTL",
    coverage: "OFAC, ONU, Interpol y listas locales",
    features: ["Monitoreo continuo"],
  },
  {
    id: "operadores",
    name: "Operadores móviles",
    category: "Operador móvil",
    country: "LATAM",
    countryCode: "INTL",
    coverage: "Titularidad y antigüedad de la línea",
    features: ["Señal de riesgo", "OTP"],
  },
];
