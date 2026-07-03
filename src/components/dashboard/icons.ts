import {
  AtSign,
  Flag,
  IdCard,
  MapPin,
  MessageCircle,
  PenLine,
  ScanFace,
  ShieldCheck,
  Signal,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { FlowNode } from "@/data/flow";
import type { ValidationProduct } from "@/data/products";

export const flowIcons: Record<FlowNode["icon"], LucideIcon> = {
  whatsapp: MessageCircle,
  filter: SlidersHorizontal,
  sparkles: Sparkles,
  face: ScanFace,
  document: IdCard,
  signals: Signal,
  shield: ShieldCheck,
  signature: PenLine,
  flag: Flag,
};

export const productIcons: Record<ValidationProduct["icon"], LucideIcon> = {
  face: ScanFace,
  document: IdCard,
  phone: Smartphone,
  email: AtSign,
  shield: ShieldCheck,
  signature: PenLine,
  pin: MapPin,
};
