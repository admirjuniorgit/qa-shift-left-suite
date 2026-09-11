import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { listComponents } from "@/lib/data/components";
import { createTestCase } from "@/lib/actions/test-cases";
import { TestCaseForm } from "@/components/app/test-case-form";

export default async function NewTestCasePage({
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

  const components = await listComponents(supabase, project.id);
  const action = createTestCase.bind(null, { projectId: project.id, orgSlug, projectKey });

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Novo caso de teste</h1>
      <TestCaseForm action={action} components={components} submitLabel="Criar caso de teste" />
    </div>
  );
}
