import { ClipboardList, FlaskConical, Gauge, ShieldCheck } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: typeof ClipboardList;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "refinement", label: "Refinamento", icon: ClipboardList },
  { id: "quality", label: "Boas práticas", icon: ShieldCheck },
  { id: "metrics", label: "Métricas", icon: Gauge },
  { id: "test-builder", label: "Construtor de testes", icon: FlaskConical },
];
