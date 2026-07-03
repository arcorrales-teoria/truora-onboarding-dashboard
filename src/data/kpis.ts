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
    highlight: true,
  },
  {
    id: "aprobacion-doc-facial",
    label: "Aprobación documento + facial",
    value: "93.2%",
    delta: "+1.3 pts",
    direction: "up",
  },
  {
    id: "reintentos",
    label: "Éxito en reintentos",
    value: "71.8%",
    delta: "+6.2 pts",
    direction: "up",
  },
  {
    id: "tiempo-mediano",
    label: "Tiempo mediano de validación",
    value: "47 s",
    delta: "-9 s vs. mayo",
    direction: "down",
  },
];
