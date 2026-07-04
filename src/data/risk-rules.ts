/**
 * Reglas de riesgo (página Riesgo).
 *
 * TODO(data): listar desde GET /v1/risk/rules.
 */

export type RuleAction = "bloquear" | "permitir" | "revisar";

export interface RiskRule {
  id: string;
  name: string;
  affected: number;
  createdAt: string;
  action: RuleAction;
  condition: string;
  enabled: boolean;
}

export const riskRules: RiskRule[] = [
  {
    id: "intentos-cedula",
    name: "Reintentos excesivos de documento",
    affected: 22,
    createdAt: "22 sep 2026",
    action: "bloquear",
    condition: "Intentos de validación por usuario > 5 en 24 h",
    enabled: true,
  },
  {
    id: "geo-mismatch",
    name: "País del teléfono distinto al documento",
    affected: 17,
    createdAt: "10 oct 2026",
    action: "revisar",
    condition: "Prefijo telefónico ≠ país del documento",
    enabled: true,
  },
  {
    id: "listas-hit",
    name: "Coincidencia en listas restrictivas",
    affected: 4,
    createdAt: "01 dic 2026",
    action: "bloquear",
    condition: "Hallazgo en OFAC, ONU o Interpol",
    enabled: true,
  },
  {
    id: "cliente-frecuente",
    name: "Usuario ya validado antes",
    affected: 156,
    createdAt: "15 ene 2026",
    action: "permitir",
    condition: "Documento aprobado en los últimos 90 días",
    enabled: true,
  },
  {
    id: "horario-atipico",
    name: "Validaciones en horario atípico",
    affected: 9,
    createdAt: "03 feb 2026",
    action: "revisar",
    condition: "Inicio del flujo entre 01:00 y 05:00 hora local",
    enabled: false,
  },
];
