import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/field-styles";
import type { DoRChecklistItem } from "../types";

export function DoRChecklist({
  items,
  onToggle,
  onAdd,
  onRemove,
}: {
  items: DoRChecklistItem[];
  onToggle: (id: string) => void;
  onAdd: (label: string) => void;
  onRemove: (id: string) => void;
}) {
  const [newLabel, setNewLabel] = useState("");
  const doneCount = items.filter((i) => i.checked).length;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Definition of Ready</h4>
        <span className="text-xs text-slate-500">
          {doneCount}/{items.length} prontos
        </span>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={item.checked} onChange={() => onToggle(item.id)} />
            <span className={item.checked ? "text-slate-400 line-through" : ""}>{item.label}</span>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="ml-auto text-xs text-slate-400 hover:text-red-500"
              aria-label={`Remover "${item.label}"`}
            >
              remover
            </button>
          </li>
        ))}
      </ul>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!newLabel.trim()) return;
          onAdd(newLabel.trim());
          setNewLabel("");
        }}
      >
        <input
          className={inputClass}
          placeholder="Adicionar item ao checklist"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <Button type="submit" variant="secondary" size="sm">
          <Plus className="size-3.5" />
          Adicionar
        </Button>
      </form>
    </div>
  );
}
