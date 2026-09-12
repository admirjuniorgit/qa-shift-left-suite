import { useState } from "react";
import { Plus, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/field-styles";
import { createId } from "@/lib/id";
import type { ChecklistTemplate } from "../types";

export function TemplateEditor({
  template,
  onChange,
  onResetToBuiltIn,
}: {
  template: ChecklistTemplate;
  onChange: (template: ChecklistTemplate) => void;
  onResetToBuiltIn?: () => void;
}) {
  const [newItemText, setNewItemText] = useState("");

  function updateItemText(id: string, text: string) {
    onChange({ ...template, items: template.items.map((i) => (i.id === id ? { ...i, text } : i)) });
  }

  function removeItem(id: string) {
    onChange({ ...template, items: template.items.filter((i) => i.id !== id) });
  }

  function addItem() {
    if (!newItemText.trim()) return;
    onChange({ ...template, items: [...template.items, { id: createId(), text: newItemText.trim() }] });
    setNewItemText("");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <input
          className={`${inputClass} max-w-sm font-medium`}
          value={template.name}
          onChange={(e) => onChange({ ...template, name: e.target.value })}
        />
        {template.isBuiltIn && onResetToBuiltIn && (
          <Button variant="ghost" size="sm" onClick={onResetToBuiltIn}>
            <RotateCcw className="size-3.5" />
            Restaurar original
          </Button>
        )}
      </div>

      <ul className="space-y-1.5">
        {template.items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <input className={inputClass} value={item.text} onChange={(e) => updateItemText(item.id, e.target.value)} />
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
              aria-label="Remover item"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addItem();
        }}
      >
        <input
          className={inputClass}
          placeholder="Adicionar item ao checklist"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
        />
        <Button type="submit" variant="secondary" size="sm">
          <Plus className="size-3.5" />
          Adicionar
        </Button>
      </form>
    </div>
  );
}
