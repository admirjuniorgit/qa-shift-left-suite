import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { getTestPlan, getTestPlanCases } from "@/lib/data/test-plans";
import { listTestCases } from "@/lib/data/test-cases";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/app/link-button";
import { PriorityBadge } from "@/components/app/badges";
import { AddCasesToPlanForm } from "@/components/app/add-cases-to-plan-form";
import { removeCaseFromPlan } from "@/lib/actions/test-plans";
import { X } from "lucide-react";

export default async function TestPlanDetailPage({
  params,
}: {
  params: Promise<{ org: string; project: string; id: string }>;
}) {
  const { org: orgSlug, project: projectKey, id } = await params;
  const supabase = await createClient();
  const org = await getOrganizationBySlug(supabase, orgSlug);
  if (!org) notFound();
  const project = await getProjectByKey(supabase, org.id, projectKey);
  if (!project) notFound();

  const plan = await getTestPlan(supabase, id);
  if (!plan || plan.project_id !== project.id) notFound();

  const [planCases, allCases] = await Promise.all([
    getTestPlanCases(supabase, id),
    listTestCases(supabase, project.id),
  ]);

  const linkedIds = new Set(planCases.map((pc) => pc.test_cases?.id).filter(Boolean));
  const availableCases = allCases
    .filter((tc) => !linkedIds.has(tc.id))
    .map((tc) => ({ id: tc.id, title: tc.title }));

  const base = `/app/${orgSlug}/${projectKey}`;
  const pathTarget = `${base}/test-plans/${id}`;

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{plan.name}</h1>
          {plan.cycle_name && <p className="text-sm text-muted-foreground">Ciclo: {plan.cycle_name}</p>}
        </div>
        <LinkButton href={`${base}/test-runs/new?planId=${id}`}>Iniciar execução</LinkButton>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-lg font-medium">Casos neste plano ({planCases.length})</h2>
        {planCases.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum caso vinculado ainda.</p>
        ) : (
          <div className="divide-y rounded-md border">
            {planCases.map((pc) =>
              pc.test_cases ? (
                <div key={pc.id} className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{pc.test_cases.title}</span>
                    <PriorityBadge value={pc.test_cases.priority} />
                  </div>
                  <form action={removeCaseFromPlan.bind(null, pc.id, pathTarget)}>
                    <Button type="submit" variant="ghost" size="icon-sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Adicionar casos</h2>
        <AddCasesToPlanForm testPlanId={id} revalidatePathTarget={pathTarget} availableCases={availableCases} />
      </div>
    </div>
  );
}
