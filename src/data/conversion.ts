/**
 * Serie mensual de conversión del flujo (Enero–Junio).
 *
 * TODO(data): conectar a la serie temporal real
 * (p. ej. GET /v1/metrics/identity-routing/timeseries?granularity=month).
 */

export interface ConversionPoint {
  month: string;
  /** Porcentaje 0–100. */
  value: number;
}

export const conversionSeries: ConversionPoint[] = [
  { month: "Ene", value: 74.2 },
  { month: "Feb", value: 76.8 },
  { month: "Mar", value: 75.9 },
  { month: "Abr", value: 80.4 },
  { month: "May", value: 84.5 },
  { month: "Jun", value: 89.4 },
];
