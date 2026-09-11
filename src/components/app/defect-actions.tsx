"use client";

import { useState, useTransition } from "react";
import { createGitlabIssueForDefect, updateDefectStatus } from "@/lib/actions/defects";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DefectStatus } from "@/types/database";

const STATUS_LABELS: Record<DefectStatus, string> = {
  open: "Aberto",
  in_progress: "Em progresso",
  resolved: "Resolvido",
  closed: "Fechado",
  wontfix: "Não corrigirá",
};

export function DefectStatusSelect({
  defectId,
  status,
  revalidatePathTarget,
}: {
  defectId: string;
  status: DefectStatus;
  revalidatePathTarget: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      items={STATUS_LABELS}
      disabled={pending}
      onValueChange={(value) =>
        startTransition(() => updateDefectStatus(defectId, revalidatePathTarget, value as DefectStatus))
      }
    >
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CreateGitlabIssueButton({
  defectId,
  revalidatePathTarget,
  alreadyLinked,
}: {
  defectId: string;
  revalidatePathTarget: string;
  alreadyLinked: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (alreadyLinked) return null;

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createGitlabIssueForDefect(defectId, revalidatePathTarget);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="space-y-1">
      <Button type="button" variant="outline" onClick={handleClick} disabled={pending}>
        {pending ? "Criando issue..." : "Criar issue no GitLab"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
