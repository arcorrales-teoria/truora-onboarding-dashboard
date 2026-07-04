/**
 * Configuración del backend por país: qué fuente, documento y señales
 * usa el flujo en cada mercado. Es lo que "se ve por detrás" cuando el
 * ruteo elige una ruta según el país.
 *
 * TODO(data): servir desde GET /v1/config/countries para reflejar la
 * configuración real de la cuenta.
 */

export interface CountryStack {
  code: string;
  name: string;
  status: "activo" | "disponible";
  /** Fuente oficial contra la que se coteja la identidad. */
  identitySource: string;
  document: string;
  /** Fuentes locales de antecedentes y riesgo. */
  backgroundSources: string[];
  /** Cómo se verifica el teléfono en ese mercado. */
  phoneCheck: string;
}

export const countryStacks: CountryStack[] = [
  {
    code: "CL",
    name: "Chile",
    status: "activo",
    identitySource: "Registro Civil e Identificación",
    document: "Cédula de identidad",
    backgroundSources: ["Poder Judicial", "Listas AML y PEP"],
    phoneCheck: "OTP por WhatsApp",
  },
  {
    code: "CO",
    name: "Colombia",
    status: "activo",
    identitySource: "Registraduría Nacional",
    document: "Cédula de ciudadanía",
    backgroundSources: ["Policía Nacional", "Procuraduría", "Listas AML y PEP"],
    phoneCheck: "OTP por WhatsApp",
  },
  {
    code: "PE",
    name: "Perú",
    status: "activo",
    identitySource: "RENIEC",
    document: "DNI",
    backgroundSources: ["Poder Judicial", "Listas AML y PEP"],
    phoneCheck: "OTP por WhatsApp",
  },
  {
    code: "MX",
    name: "México",
    status: "activo",
    identitySource: "INE",
    document: "Credencial para votar",
    backgroundSources: ["OFAC y listas locales", "Buró de identidad"],
    phoneCheck: "OTP por WhatsApp",
  },
  {
    code: "BR",
    name: "Brasil",
    status: "disponible",
    identitySource: "SERPRO",
    document: "CPF + CNH",
    backgroundSources: ["Listas AML y PEP"],
    phoneCheck: "OTP por SMS",
  },
  {
    code: "AR",
    name: "Argentina",
    status: "disponible",
    identitySource: "RENAPER",
    document: "DNI",
    backgroundSources: ["Listas AML y PEP"],
    phoneCheck: "OTP por SMS",
  },
];
