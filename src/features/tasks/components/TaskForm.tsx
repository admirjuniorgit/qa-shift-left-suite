import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/field-styles";
import { newTaskSchema } from "../types";

export function TaskForm({ onCreate, disabled }: { onCreate: (title: string, notes: string) => void; disabled?: boolean }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = newTaskSchema.safeParse({ title, notes });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
      return;
    }
    setError("");
    onCreate(parsed.data.title, parsed.data.notes);
    setTitle("");
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className={labelClass} htmlFor="task-title">
          Nova tarefa
        </label>
        <input
          id="task-title"
          className={inputClass}
          placeholder="O que você precisa fazer?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div>
        <textarea
          className={inputClass}
          placeholder="Anotações (opcional)"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={disabled}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" size="sm" disabled={disabled}>
        <Plus className="size-3.5" />
        Adicionar tarefa
      </Button>
    </form>
  );
}
