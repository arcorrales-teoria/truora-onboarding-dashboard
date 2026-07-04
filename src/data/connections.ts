/**
 * Conectores disponibles (página Conexiones).
 *
 * TODO(data): listar desde GET /v1/sources y el estado de la cuenta.
 */

export interface Connection {
  id: string;
  name: string;
  category:
    | "Registro oficial"
    | "Listas de riesgo"
    | "Operador móvil"
    | "Mensajería";
  countries: string[];
  connected: boolean;
}

export const connections: Connection[] = [
  {
    id: "whatsapp-business",
    name: "WhatsApp Business API",
    category: "Mensajería",
    countries: ["LATAM"],
    connected: true,
  },
  {
    id: "registro-civil-cl",
    name: "Registro Civil e Identificación",
    category: "Registro oficial",
    countries: ["CL"],
    connected: true,
  },
  {
    id: "reniec",
    name: "RENIEC",
    category: "Registro oficial",
    countries: ["PE"],
    connected: true,
  },
  {
    id: "registraduria",
    name: "Registraduría Nacional",
    category: "Registro oficial",
    countries: ["CO"],
    connected: true,
  },
  {
    id: "ine",
    name: "INE",
    category: "Registro oficial",
    countries: ["MX"],
    connected: true,
  },
  {
    id: "listas-aml",
    name: "Listas AML, PEP y sanciones",
    category: "Listas de riesgo",
    countries: ["LATAM"],
    connected: true,
  },
  {
    id: "operadores",
    name: "Operadores móviles",
    category: "Operador móvil",
    countries: ["LATAM"],
    connected: false,
  },
  {
    id: "serpro",
    name: "SERPRO",
    category: "Registro oficial",
    countries: ["BR"],
    connected: false,
  },
  {
    id: "renaper",
    name: "RENAPER",
    category: "Registro oficial",
    countries: ["AR"],
    connected: false,
  },
];
