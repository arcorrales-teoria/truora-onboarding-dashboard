/**
 * Cobertura por país mostrada junto al mapa LATAM.
 *
 * TODO(data): alimentar desde el reporte de volumen por país
 * (p. ej. GET /v1/metrics/identity-routing/by-country?range=30d).
 */

export interface CountryCoverage {
  code: string;
  name: string;
  validations: string;
  /** Participación 0–100, usada para la barra fina. */
  share: number;
  /** País destacado en el demo (Chile). */
  focus?: boolean;
}

export const coverageStats = [
  { label: "Países", value: "18" },
  { label: "Fuentes oficiales", value: "60+" },
  { label: "Validaciones / mes", value: "2.4M" },
];

export const countryCoverage: CountryCoverage[] = [
  { code: "CL", name: "Chile", validations: "612k", share: 26, focus: true },
  { code: "MX", name: "México", validations: "548k", share: 23 },
  { code: "CO", name: "Colombia", validations: "471k", share: 20 },
  { code: "PE", name: "Perú", validations: "329k", share: 14 },
  { code: "BR", name: "Brasil", validations: "262k", share: 11 },
  { code: "AR", name: "Argentina", validations: "141k", share: 6 },
];
