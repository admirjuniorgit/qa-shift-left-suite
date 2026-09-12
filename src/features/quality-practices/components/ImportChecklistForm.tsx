import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/field-styles";
import { parseChecklistMarkdown } from "../markdown-import";

export function ImportChecklistForm({ onImport }: { onImport: (parsed: { name: string; items: string[] }) => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  function handleImport() {
    if (!text.trim()) return;
    onImport(parseChecklistMarkdown(text));
    setText("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-violet-600 hover:underline dark:text-violet-400">
        + importar checklist de um Markdown
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-dashed border-slate-300 p-3 dark:border-white/10">
      <p className="text-xs text-slate-500">
        Cole um Markdown com um título (<code># Nome</code>) e itens como <code>- [ ] item</code>.
      </p>
      <textarea
        className={inputClass}
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"# Meu checklist\n- [ ] Primeiro item\n- [ ] Segundo item"}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleImport}>
          Importar
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
