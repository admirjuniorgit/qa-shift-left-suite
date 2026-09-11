"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionResult = {};

interface TestRunFormProps {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  plan: { id: string; name: string } | null;
  planCaseCount: number;
  availableCases: { id: string; title: string }[];
}

export function TestRunForm({ action, plan, planCaseCount, availableCases }: TestRunFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {plan && <input type="hidden" name="testPlanId" value={plan.id} />}

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={plan ? `Execução — ${plan.name}` : ""}
          placeholder="Ex: Regressão release 3.2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="environment">Ambiente</Label>
        <Input id="environment" name="environment" placeholder="Ex: staging, produção" />
      </div>

      {plan ? (
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          {planCaseCount} caso(s) do plano <strong>{plan.name}</strong> serão incluídos.
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Selecione os casos de teste</Label>
          {availableCases.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum caso de teste cadastrado neste projeto ainda.
            </p>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border p-4">
              {availableCases.map((tc) => (
                <label key={tc.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="caseIds" value={tc.id} className="h-4 w-4" />
                  {tc.title}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar execução"}
      </Button>
    </form>
  );
}
