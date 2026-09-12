import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { RefinementSession } from "../types";

export function SessionHistory({
  sessions,
  onLoad,
  onDelete,
}: {
  sessions: RefinementSession[];
  onLoad: (session: RefinementSession) => void;
  onDelete: (id: string) => void;
}) {
  if (sessions.length === 0) {
    return <p className="text-sm text-slate-400">Nenhuma sessão de refinamento salva ainda.</p>;
  }

  const sorted = [...sessions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <ul className="space-y-2">
      {sorted.map((session) => {
        const done = session.dorChecklist.filter((i) => i.checked).length;
        return (
          <Card key={session.id} className="flex items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{session.storyTitle || "(sem título)"}</p>
              <p className="text-xs text-slate-500">
                {new Date(session.createdAt).toLocaleString("pt-BR")} · DoR {done}/{session.dorChecklist.length}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="sm" onClick={() => onLoad(session)}>
                Abrir
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(session.id)}>
                Excluir
              </Button>
            </div>
          </Card>
        );
      })}
    </ul>
  );
}
