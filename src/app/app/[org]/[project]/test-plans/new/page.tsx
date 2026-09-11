import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { createTestPlan } from "@/lib/actions/test-plans";
import { TestPlanForm } from "@/components/app/test-plan-form";

export default async function NewTestPlanPage({
  params,
}: {
  params: Promise<{ org: string; project: string }>;
}) {
  const { org: orgSlug, project: projectKey } = await params;
  const supabase = await createClient();
  const org = await getOrganizationBySlug(supabase, orgSlug);
  if (!org) notFound();
  const project = await getProjectByKey(supabase, org.id, projectKey);
  if (!project) notFound();

  const action = createTestPlan.bind(null, { projectId: project.id, orgSlug, projectKey });

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Novo plano de teste</h1>
      <TestPlanForm action={action} />
    </div>
  );
}
