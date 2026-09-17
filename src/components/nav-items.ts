import { ClipboardList, FlaskConical, Gauge, Home, ListTodo, ShieldCheck } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: typeof ClipboardList;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "tasks", label: "Tarefas", icon: ListTodo },
  { id: "refinement", label: "Refinamento", icon: ClipboardList },
  { id: "quality", label: "Boas práticas", icon: ShieldCheck },
  { id: "metrics", label: "Métricas", icon: Gauge },
  { id: "test-builder", label: "Construtor de testes", icon: FlaskConical },
];
