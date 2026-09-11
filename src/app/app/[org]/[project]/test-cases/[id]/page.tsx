import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { listComponents } from "@/lib/data/components";
import { getTestCase } from "@/lib/data/test-cases";
import { updateTestCase, deleteTestCase } from "@/lib/actions/test-cases";
import { TestCaseForm } from "@/components/app/test-case-form";
import { Button } from "@/components/ui/button";

export default async function TestCaseDetailPage({
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

  const [components, testCase] = await Promise.all([
    listComponents(supabase, project.id),
    getTestCase(supabase, id),
  ]);
  if (!testCase || testCase.project_id !== project.id) notFound();

  const action = updateTestCase.bind(null, id, { projectId: project.id, orgSlug, projectKey });
  const deleteAction = deleteTestCase.bind(null, id, orgSlug, projectKey);

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar caso de teste</h1>
        <form action={deleteAction}>
          <Button type="submit" variant="destructive" size="sm">
            Excluir
          </Button>
        </form>
      </div>
      <TestCaseForm
        action={action}
        components={components}
        submitLabel="Salvar alterações"
        showStatus
        defaultValues={{
          title: testCase.title,
          componentId: testCase.component_id,
          preconditions: testCase.preconditions,
          steps: testCase.steps,
          expectedResult: testCase.expected_result,
          type: testCase.type,
          priority: testCase.priority,
          status: testCase.status,
          tags: testCase.tags,
          externalRef: testCase.external_ref,
        }}
      />
    </div>
  );
}
