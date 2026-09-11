import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { ProjectSidebar } from "@/components/app/project-sidebar";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ org: string; project: string }>;
}) {
  const { org: orgSlug, project: projectKey } = await params;
  const supabase = await createClient();
  const org = await getOrganizationBySlug(supabase, orgSlug);
  if (!org) notFound();

  const project = await getProjectByKey(supabase, org.id, projectKey);
  if (!project) notFound();

  return (
    <div className="flex flex-1">
      <ProjectSidebar orgSlug={orgSlug} projectKey={projectKey} />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
