"use client";

import { useActionState, useState } from "react";
import { generateApiToken, revokeApiToken } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface ApiToken {
  id: string;
  name: string;
  token_prefix: string;
  created_at: string;
  last_used_at: string | null;
}

const initialState: { error?: string; token?: string } = {};

export function ApiTokensPanel({
  projectId,
  revalidatePathTarget,
  tokens,
}: {
  projectId: string;
  revalidatePathTarget: string;
  tokens: ApiToken[];
}) {
  const action = generateApiToken.bind(null, projectId, revalidatePathTarget);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [newTokenName, setNewTokenName] = useState("");

  return (
    <div className="max-w-xl space-y-6">
      <form
        action={(fd) => {
          formAction(fd);
          setNewTokenName("");
        }}
        className="flex items-end gap-2"
      >
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Novo token de API (para o CI importar relatórios)</label>
          <Input
            name="name"
            placeholder="Ex: pipeline GitLab CI"
            value={newTokenName}
            onChange={(e) => setNewTokenName(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Gerando..." : "Gerar token"}
        </Button>
      </form>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.token && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950">
          <p className="mb-1 font-medium">Copie agora — o token não será mostrado novamente:</p>
          <code className="break-all">{state.token}</code>
        </div>
      )}

      <div className="divide-y rounded-md border">
        {tokens.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Nenhum token gerado ainda.</p>
        ) : (
          tokens.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-2 text-sm">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-muted-foreground">
                  {t.token_prefix}••••••• · criado em {new Date(t.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <form action={revokeApiToken.bind(null, t.id, revalidatePathTarget)}>
                <Button type="submit" variant="ghost" size="icon-sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
