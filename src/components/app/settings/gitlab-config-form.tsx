"use client";

import { useActionState, useState, useTransition } from "react";
import { updateGitlabConfig, testGitlabConnection } from "@/lib/actions/settings";
import type { ActionResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionResult = {};

export function GitlabConfigForm({
  projectId,
  revalidatePathTarget,
  defaultBaseUrl,
  defaultProjectId,
  hasToken,
}: {
  projectId: string;
  revalidatePathTarget: string;
  defaultBaseUrl: string | null;
  defaultProjectId: string | null;
  hasToken: boolean;
}) {
  const action = updateGitlabConfig.bind(null, projectId, revalidatePathTarget);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [testResult, setTestResult] = useState<{ error?: string; success?: string } | null>(null);
  const [testing, startTest] = useTransition();

  return (
    <div className="max-w-lg space-y-4">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gitlabBaseUrl">URL do GitLab</Label>
          <Input
            id="gitlabBaseUrl"
            name="gitlabBaseUrl"
            placeholder="https://gitlab.com"
            defaultValue={defaultBaseUrl ?? ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gitlabProjectId">ID ou path do projeto no GitLab</Label>
          <Input
            id="gitlabProjectId"
            name="gitlabProjectId"
            placeholder="grupo/projeto ou 12345678"
            defaultValue={defaultProjectId ?? ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gitlabToken">
            Access token {hasToken && <span className="text-muted-foreground">(já configurado — deixe em branco para manter)</span>}
          </Label>
          <Input id="gitlabToken" name="gitlabToken" type="password" placeholder="glpat-..." />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar integração"}
        </Button>
      </form>

      {hasToken && (
        <div className="space-y-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={testing}
            onClick={() =>
              startTest(async () => {
                setTestResult(await testGitlabConnection(projectId));
              })
            }
          >
            {testing ? "Testando..." : "Testar conexão"}
          </Button>
          {testResult?.success && <p className="text-sm text-emerald-600">{testResult.success}</p>}
          {testResult?.error && <p className="text-sm text-destructive">{testResult.error}</p>}
        </div>
      )}
    </div>
  );
}
