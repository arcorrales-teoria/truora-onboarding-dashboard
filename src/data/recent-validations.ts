/**
 * Últimas validaciones (página Reportes).
 *
 * TODO(data): listar desde GET /v1/validations?limit=10.
 */

export interface RecentValidation {
  id: string;
  country: string;
  channel: string;
  result: "aprobado" | "revision" | "rechazado";
  duration: string;
  date: string;
}

export const recentValidations: RecentValidation[] = [
  { id: "VLD-9314-CL", country: "Chile", channel: "WhatsApp", result: "aprobado", duration: "38 s", date: "Hoy, 17:42" },
  { id: "VLD-9313-MX", country: "México", channel: "WhatsApp", result: "aprobado", duration: "51 s", date: "Hoy, 17:39" },
  { id: "VLD-9312-CO", country: "Colombia", channel: "WhatsApp", result: "revision", duration: "1 m 12 s", date: "Hoy, 17:31" },
  { id: "VLD-9311-CL", country: "Chile", channel: "WhatsApp", result: "aprobado", duration: "44 s", date: "Hoy, 17:28" },
  { id: "VLD-9310-PE", country: "Perú", channel: "WhatsApp", result: "aprobado", duration: "47 s", date: "Hoy, 17:20" },
  { id: "VLD-9309-CL", country: "Chile", channel: "Web", result: "rechazado", duration: "2 m 05 s", date: "Hoy, 17:11" },
  { id: "VLD-9308-MX", country: "México", channel: "WhatsApp", result: "aprobado", duration: "35 s", date: "Hoy, 17:02" },
  { id: "VLD-9307-CO", country: "Colombia", channel: "WhatsApp", result: "aprobado", duration: "58 s", date: "Hoy, 16:55" },
];
