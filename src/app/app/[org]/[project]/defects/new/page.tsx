import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { createDefect } from "@/lib/actions/defects";
import { DefectForm } from "@/components/app/defect-form";

export default async function NewDefectPage({
  params,
  searchParams,
}: {
  params: Promise<{ org: string; project: string }>;
  searchParams: Promise<{ resultId?: string; title?: string }>;
}) {
  const { org: orgSlug, project: projectKey } = await params;
  const { resultId, title } = await searchParams;
  const supabase = await createClient();
  const org = await getOrganizationBySlug(supabase, orgSlug);
  if (!org) notFound();
  const project = await getProjectByKey(supabase, org.id, projectKey);
  if (!project) notFound();

  const action = createDefect.bind(null, { projectId: project.id, orgSlug, projectKey });

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Novo defeito</h1>
      <DefectForm action={action} resultId={resultId} defaultTitle={title} />
    </div>
  );
}
