import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { inputClass } from "@/components/ui/field-styles";
import { useToast } from "@/components/ui/toast-context";
import { sessionToMarkdown } from "../markdown";
import type { QuestionBankEntry, RefinementSession } from "../types";

export function SessionHistory({
  sessions,
  allQuestions,
  onLoad,
  onDelete,
  onDuplicate,
}: {
  sessions: RefinementSession[];
  allQuestions: QuestionBankEntry[];
  onLoad: (session: RefinementSession) => void;
  onDelete: (id: string) => void;
  onDuplicate: (session: RefinementSession) => void;
}) {
  const [query, setQuery] = useState("");
  const notify = useToast();

  if (sessions.length === 0) {
    return <p className="text-sm text-slate-400">Nenhuma sessão de refinamento salva ainda.</p>;
  }

  const filtered = sessions.filter(
    (s) =>
      s.storyTitle.toLowerCase().includes(query.toLowerCase()) || s.notes.toLowerCase().includes(query.toLowerCase()),
  );
  const sorted = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-2">
      <input
        className={inputClass}
        placeholder="Buscar por título ou notas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {sorted.length === 0 && <p className="text-sm text-slate-400">Nenhuma sessão bate com a busca.</p>}
      <ul className="space-y-2">
        {sorted.map((session) => {
          const done = session.dorChecklist.filter((i) => i.checked).length;
          return (
            <Card key={session.id} className="space-y-2 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{session.storyTitle || "(sem título)"}</p>
                <p className="text-xs text-slate-500">
                  {new Date(session.createdAt).toLocaleString("pt-BR")} · DoR {done}/{session.dorChecklist.length}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => onLoad(session)}>
                  Abrir
                </Button>
                <Button variant="secondary" size="sm" onClick={() => onDuplicate(session)}>
                  Duplicar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    await navigator.clipboard.writeText(sessionToMarkdown(session, allQuestions));
                    notify("Markdown copiado.");
                  }}
                >
                  Copiar Markdown
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(session.id)}>
                  Excluir
                </Button>
              </div>
            </Card>
          );
        })}
      </ul>
    </div>
  );
}
