"use client";

import { useActionState } from "react";
import { createComponent, deleteComponent } from "@/lib/actions/components";
import type { ActionResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface ComponentItem {
  id: string;
  name: string;
  description: string | null;
}

const initialState: ActionResult = {};

export function ComponentsPanel({
  projectId,
  revalidatePathTarget,
  components,
}: {
  projectId: string;
  revalidatePathTarget: string;
  components: ComponentItem[];
}) {
  const action = createComponent.bind(null, projectId, revalidatePathTarget);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="max-w-xl space-y-4">
      <form action={formAction} className="flex items-end gap-2">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Novo componente</label>
          <Input name="name" placeholder="Ex: Checkout" required />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Adicionando..." : "Adicionar"}
        </Button>
      </form>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="divide-y rounded-md border">
        {components.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Nenhum componente cadastrado.</p>
        ) : (
          components.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-2 text-sm">
              {c.name}
              <form action={deleteComponent.bind(null, c.id, revalidatePathTarget)}>
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
