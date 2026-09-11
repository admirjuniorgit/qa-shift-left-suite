"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Bug,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  PlayCircle,
  Settings,
} from "lucide-react";

interface ProjectSidebarProps {
  orgSlug: string;
  projectKey: string;
}

export function ProjectSidebar({ orgSlug, projectKey }: ProjectSidebarProps) {
  const pathname = usePathname();
  const base = `/app/${orgSlug}/${projectKey}`;

  const items = [
    { href: base, label: "Visão geral", icon: LayoutDashboard, exact: true },
    { href: `${base}/test-cases`, label: "Casos de teste", icon: ListChecks },
    { href: `${base}/test-plans`, label: "Planos", icon: ClipboardList },
    { href: `${base}/test-runs`, label: "Execuções", icon: PlayCircle },
    { href: `${base}/defects`, label: "Defeitos", icon: Bug },
    { href: `${base}/metrics`, label: "Métricas", icon: LayoutDashboard },
    { href: `${base}/settings`, label: "Configurações", icon: Settings },
  ];

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r bg-background p-4">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
