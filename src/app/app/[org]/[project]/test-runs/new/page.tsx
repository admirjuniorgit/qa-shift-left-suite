import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { getTestPlan, getTestPlanCases } from "@/lib/data/test-plans";
import { listTestCases } from "@/lib/data/test-cases";
import { createTestRun } from "@/lib/actions/test-runs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionForm } from "@/components/app/action-form";

export default async function NewTestRunPage({
  params,
  searchParams,
}: {
  params: Promise<{ org: string; project: string }>;
  searchParams: Promise<{ planId?: string }>;
}) {
  const { org: orgSlug, project: projectKey } = await params;
  const { planId } = await searchParams;
  const supabase = await createClient();
  const org = await getOrganizationBySlug(supabase, orgSlug);
  if (!org) notFound();
  const project = await getProjectByKey(supabase, org.id, projectKey);
  if (!project) notFound();

  const action = createTestRun.bind(null, { projectId: project.id, orgSlug, projectKey });

  const plan = planId ? await getTestPlan(supabase, planId) : null;
  const planCases = planId ? await getTestPlanCases(supabase, planId) : [];
  const allCases = plan ? [] : await listTestCases(supabase, project.id);

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Nova execução</h1>
      <ActionForm action={action} className="max-w-2xl space-y-4">
        {(state, pending) => (
          <>
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
                {planCases.length} caso(s) do plano <strong>{plan.name}</strong> serão incluídos.
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Selecione os casos de teste</Label>
                {allCases.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum caso de teste cadastrado neste projeto ainda.
                  </p>
                ) : (
                  <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border p-4">
                    {allCases.map((tc) => (
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
          </>
        )}
      </ActionForm>
    </div>
  );
}
