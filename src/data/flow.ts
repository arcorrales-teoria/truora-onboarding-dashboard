/**
 * Definición del recorrido de la validación (nodos + conexiones del canvas).
 *
 * Las posiciones son coordenadas absolutas dentro del lienzo de ruteo
 * (ancho fijo con scroll horizontal en pantallas angostas).
 *
 * TODO(data): si el ruteo se vuelve dinámico por cliente, servir esta
 * configuración desde el backend (p. ej. GET /v1/routing/flows/:id) y
 * mantener exactamente esta forma.
 */

export type FlowStatusTone = "success" | "warning" | "danger";

export interface FlowStatusRow {
  label: string;
  tone: FlowStatusTone;
  value?: string;
}

export interface FlowNode {
  id: string;
  /** Icono resuelto en el componente (mapa de lucide-react). */
  icon:
    | "whatsapp"
    | "filter"
    | "sparkles"
    | "face"
    | "document"
    | "signals"
    | "shield"
    | "signature"
    | "flag";
  kicker?: string;
  title: string;
  description?: string;
  x: number;
  y: number;
  /** Filas de estado tipo "Aprobada / Rechazada / Error". */
  statuses?: FlowStatusRow[];
  /** Pares clave–valor tipo tarjeta de condición. */
  fields?: { label: string; value: string }[];
  /** Chips (p. ej. países de la condición). */
  chips?: string[];
  /** Lista simple con viñeta de estado (tarjeta de ruteo inteligente). */
  list?: { label: string; sublabel: string }[];
  footnote?: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  /** Porcentaje de tráfico mostrado como insignia sobre la línea. */
  share?: string;
  /** Línea punteada para señales que corren en paralelo. */
  parallel?: boolean;
}

export const CANVAS_WIDTH = 1628;
export const CANVAS_HEIGHT = 850;

export const flowNodes: FlowNode[] = [
  {
    id: "inicio",
    icon: "whatsapp",
    kicker: "Inicio",
    title: "WhatsApp",
    description: "La persona escribe al número del cliente y abre el flujo.",
    x: 16,
    y: 268,
    fields: [
      { label: "ID", value: "VLD-8412-CL" },
      { label: "Canal", value: "WhatsApp" },
      { label: "Flujo", value: "Onboarding Chile" },
    ],
  },
  {
    id: "condicion",
    icon: "filter",
    kicker: "Condición",
    title: "País y documento",
    description: "Decide la ruta según el país del teléfono y el documento.",
    x: 336,
    y: 252,
    chips: ["CL", "MX", "CO", "PE"],
    fields: [{ label: "Documento", value: "Cédula · DNI · INE" }],
  },
  {
    id: "ruteo",
    icon: "sparkles",
    kicker: "Ruteo inteligente",
    title: "Mejor ruta por conversión",
    x: 672,
    y: 8,
    list: [
      { label: "Documento + facial", sublabel: "Ruta principal" },
      { label: "Solo documento", sublabel: "Ruta de respaldo" },
    ],
    footnote: "Optimizando conversión y latencia",
  },
  {
    id: "doc-facial",
    icon: "face",
    kicker: "Validación",
    title: "Documento y facial",
    x: 672,
    y: 286,
    statuses: [
      { label: "Aprobada", tone: "success", value: "93.2%" },
      { label: "Rechazada", tone: "danger", value: "4.1%" },
      { label: "Error", tone: "warning", value: "2.7%" },
    ],
  },
  {
    id: "doc",
    icon: "document",
    kicker: "Validación",
    title: "Solo documento",
    x: 672,
    y: 586,
    statuses: [
      { label: "Aprobada", tone: "success", value: "88.6%" },
      { label: "Rechazada", tone: "danger", value: "8.9%" },
    ],
  },
  {
    id: "senales",
    icon: "signals",
    kicker: "En paralelo",
    title: "Señales del dispositivo",
    x: 1008,
    y: 44,
    list: [
      { label: "Validación de teléfono", sublabel: "OTP por WhatsApp" },
      { label: "Validación de correo", sublabel: "Verificación de buzón" },
      { label: "Geolocalización", sublabel: "Ubicación real del usuario" },
    ],
  },
  {
    id: "antecedentes",
    icon: "shield",
    kicker: "Validación",
    title: "Antecedentes",
    description: "Listas AML, PEP y registros locales.",
    x: 1008,
    y: 356,
    statuses: [
      { label: "Sin hallazgos", tone: "success", value: "96.8%" },
      { label: "Con hallazgos", tone: "warning", value: "3.2%" },
    ],
  },
  {
    id: "firma",
    icon: "signature",
    kicker: "Cierre",
    title: "Firma electrónica",
    description: "Acepta términos y firma el contrato en el mismo chat.",
    x: 1008,
    y: 648,
    statuses: [{ label: "Firmada", tone: "success", value: "97.4%" }],
  },
  {
    id: "resultado",
    icon: "flag",
    kicker: "Resultado",
    title: "Decisión final",
    x: 1330,
    y: 330,
    statuses: [
      { label: "Aprobado", tone: "success", value: "91.3%" },
      { label: "Revisión manual", tone: "warning", value: "6.2%" },
      { label: "Rechazado", tone: "danger", value: "2.5%" },
    ],
  },
];

export const flowEdges: FlowEdge[] = [
  { from: "inicio", to: "condicion" },
  { from: "condicion", to: "doc-facial", share: "72%" },
  { from: "condicion", to: "doc", share: "28%" },
  { from: "doc-facial", to: "senales", parallel: true },
  { from: "doc-facial", to: "antecedentes" },
  { from: "doc", to: "antecedentes" },
  { from: "antecedentes", to: "firma" },
  { from: "firma", to: "resultado" },
  { from: "senales", to: "resultado", parallel: true },
];
