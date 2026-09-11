import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  deprecated: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  open: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  closed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  wontfix: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const RESULT_STYLES: Record<string, string> = {
  pending: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  passed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  blocked: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  skipped: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  flaky: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
};

export function PriorityBadge({ value }: { value: string }) {
  return (
    <Badge variant="outline" className={cn("border-0 capitalize", PRIORITY_STYLES[value])}>
      {value}
    </Badge>
  );
}

export function StatusBadge({ value }: { value: string }) {
  return (
    <Badge variant="outline" className={cn("border-0 capitalize", STATUS_STYLES[value])}>
      {value.replace("_", " ")}
    </Badge>
  );
}

export function ResultBadge({ value }: { value: string }) {
  return (
    <Badge variant="outline" className={cn("border-0 capitalize", RESULT_STYLES[value])}>
      {value}
    </Badge>
  );
}
