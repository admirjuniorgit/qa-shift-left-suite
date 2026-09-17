import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { inputClass } from "@/components/ui/field-styles";
import { TASK_STATUS_LABELS, TASK_STATUSES, type Task, type TaskStatus } from "../types";

const STATUS_DOT: Record<TaskStatus, string> = {
  pendente: "bg-slate-400",
  em_andamento: "bg-amber-500",
  concluida: "bg-emerald-500",
};

export function TaskItem({
  task,
  onStatusChange,
  onEdit,
  onDelete,
}: {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (id: string, title: string, notes: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes);

  function handleSave() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onEdit(task.id, trimmed, notes.trim());
    setEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setNotes(task.notes);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="space-y-2 rounded-lg border border-violet-300 bg-violet-50/50 p-3 dark:border-violet-500/40 dark:bg-violet-500/5">
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        <textarea className={inputClass} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Check className="size-3.5" />
            Salvar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="size-3.5" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", STATUS_DOT[task.status])} />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium text-slate-800 dark:text-slate-200", task.status === "concluida" && "line-through opacity-60")}>
          {task.title}
        </p>
        {task.notes && <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-500 dark:text-slate-400">{task.notes}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          <Pencil className="size-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
