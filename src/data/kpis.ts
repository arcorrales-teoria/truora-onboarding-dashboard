/**
 * KPIs del flujo de validación por WhatsApp.
 *
 * TODO(data): reemplazar por el agregado real del API de métricas
 * (p. ej. GET /v1/metrics/identity-routing?channel=whatsapp&range=30d).
 * El componente <KpiBand /> solo consume esta forma; basta con mapear
 * la respuesta del API a `Kpi[]`.
 */

export interface Kpi {
  id: string;
  label: string;
  value: string;
  /** Comparación contra el período anterior, ya formateada. */
  delta: string;
  direction: "up" | "down";
  /** Últimos seis meses, para la mini gráfica de cada celda. */
  trend: number[];
  /** La celda destacada en índigo (una sola por banda). */
  highlight?: boolean;
}

export const kpis: Kpi[] = [
  {
    id: "conversion-total",
    label: "Conversión total del flujo",
    value: "89.4%",
    delta: "+4.9 pts vs. mayo",
    direction: "up",
    trend: [74.2, 76.8, 75.9, 80.4, 84.5, 89.4],
    highlight: true,
  },
  {
    id: "aprobacion-doc-facial",
    label: "Aprobación documento + facial",
    value: "93.2%",
    delta: "+1.3 pts",
    direction: "up",
    trend: [90.1, 91.4, 90.8, 91.9, 92.2, 93.2],
  },
  {
    id: "reintentos",
    label: "Éxito en reintentos",
    value: "71.8%",
    delta: "+6.2 pts",
    direction: "up",
    trend: [60.4, 63.1, 62.5, 65.6, 68.2, 71.8],
  },
  {
    id: "tiempo-mediano",
    label: "Tiempo mediano de validación",
    value: "47 s",
    delta: "-9 s vs. mayo",
    direction: "down",
    trend: [63, 60, 61, 56, 52, 47],
  },
];
