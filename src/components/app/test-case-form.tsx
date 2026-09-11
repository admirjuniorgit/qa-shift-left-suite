"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TestStep } from "@/types/database";

const initialState: ActionResult = {};

interface TestCaseFormProps {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  components: { id: string; name: string }[];
  submitLabel: string;
  defaultValues?: {
    title?: string;
    componentId?: string | null;
    preconditions?: string | null;
    steps?: TestStep[];
    expectedResult?: string | null;
    type?: string;
    priority?: string;
    status?: string;
    tags?: string[];
    externalRef?: string | null;
  };
  showStatus?: boolean;
}

export function TestCaseForm({
  action,
  components,
  submitLabel,
  defaultValues,
  showStatus,
}: TestCaseFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const stepsText = defaultValues?.steps?.map((s) => s.action).join("\n") ?? "";

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" required defaultValue={defaultValues?.title} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="componentId">Componente</Label>
          <Select name="componentId" defaultValue={defaultValues?.componentId ?? undefined}>
            <SelectTrigger id="componentId">
              <SelectValue placeholder="Nenhum" />
            </SelectTrigger>
            <SelectContent>
              {components.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select name="type" defaultValue={defaultValues?.type ?? "manual"}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automated">Automatizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Prioridade</Label>
          <Select name="priority" defaultValue={defaultValues?.priority ?? "medium"}>
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showStatus && (
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={defaultValues?.status ?? "active"}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="deprecated">Descontinuado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="preconditions">Pré-condições</Label>
        <Textarea
          id="preconditions"
          name="preconditions"
          rows={2}
          defaultValue={defaultValues?.preconditions ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="steps">Passos (um por linha)</Label>
        <Textarea id="steps" name="steps" rows={5} defaultValue={stepsText} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expectedResult">Resultado esperado</Label>
        <Textarea
          id="expectedResult"
          name="expectedResult"
          rows={2}
          defaultValue={defaultValues?.expectedResult ?? ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
          <Input id="tags" name="tags" defaultValue={defaultValues?.tags?.join(", ")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="externalRef">Issue do GitLab (ex: #123)</Label>
          <Input id="externalRef" name="externalRef" defaultValue={defaultValues?.externalRef ?? ""} />
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
