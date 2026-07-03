/**
 * Bloques de validación de Truora disponibles para el flujo.
 *
 * TODO(data): sincronizar con la configuración real de la cuenta
 * (p. ej. GET /v1/flows/:id/steps) para que los toggles reflejen el
 * estado verdadero del flujo del cliente durante el demo.
 */

export interface ValidationProduct {
  id: string;
  icon:
    | "face"
    | "document"
    | "phone"
    | "email"
    | "shield"
    | "signature"
    | "pin";
  name: string;
  description: string;
  enabled: boolean;
}

export const validationProducts: ValidationProduct[] = [
  {
    id: "doc-facial",
    icon: "face",
    name: "Validación de documento y facial",
    description: "Valida el documento y la imagen de tus usuarios.",
    enabled: true,
  },
  {
    id: "documento",
    icon: "document",
    name: "Validación de documento",
    description: "Valida el documento de identidad de tus usuarios.",
    enabled: true,
  },
  {
    id: "telefono",
    icon: "phone",
    name: "Validación de teléfono",
    description: "Valida el teléfono de tus usuarios.",
    enabled: true,
  },
  {
    id: "correo",
    icon: "email",
    name: "Validación de correo",
    description: "Valida el email de tus usuarios.",
    enabled: true,
  },
  {
    id: "antecedentes",
    icon: "shield",
    name: "Validación de antecedentes",
    description: "Valida los antecedentes de tus usuarios.",
    enabled: true,
  },
  {
    id: "firma",
    icon: "signature",
    name: "Validación de firma electrónica",
    description: "Permite validar la firma digital de tus usuarios.",
    enabled: true,
  },
  {
    id: "geo",
    icon: "pin",
    name: "Geolocalización",
    description: "Obtén la ubicación geográfica real de tus usuarios.",
    enabled: false,
  },
];
