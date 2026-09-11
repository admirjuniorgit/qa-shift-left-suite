import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { getTestPlan, getTestPlanCases } from "@/lib/data/test-plans";
import { listTestCases } from "@/lib/data/test-cases";
import { createTestRun } from "@/lib/actions/test-runs";
import { TestRunForm } from "@/components/app/test-run-form";

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
      <TestRunForm
        action={action}
        plan={plan ? { id: plan.id, name: plan.name } : null}
        planCaseCount={planCases.length}
        availableCases={allCases.map((tc) => ({ id: tc.id, title: tc.title }))}
      />
    </div>
  );
}
