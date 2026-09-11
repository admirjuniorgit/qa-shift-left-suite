import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { listComponents } from "@/lib/data/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitlabConfigForm } from "@/components/app/settings/gitlab-config-form";
import { ApiTokensPanel } from "@/components/app/settings/api-tokens-panel";
import { ComponentsPanel } from "@/components/app/settings/components-panel";

export default async function ProjectSettingsPage({
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

  const [components, { data: tokens }] = await Promise.all([
    listComponents(supabase, project.id),
    supabase
      .from("project_api_tokens")
      .select("id, name, token_prefix, created_at, last_used_at")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false }),
  ]);

  const pathTarget = `/app/${orgSlug}/${projectKey}/settings`;

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Configurações</h1>

      <Tabs defaultValue="components">
        <TabsList>
          <TabsTrigger value="components">Componentes</TabsTrigger>
          <TabsTrigger value="gitlab">Integração GitLab</TabsTrigger>
          <TabsTrigger value="tokens">Tokens de API</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="pt-6">
          <ComponentsPanel projectId={project.id} revalidatePathTarget={pathTarget} components={components} />
        </TabsContent>

        <TabsContent value="gitlab" className="pt-6">
          <GitlabConfigForm
            projectId={project.id}
            revalidatePathTarget={pathTarget}
            defaultBaseUrl={project.gitlab_base_url}
            defaultProjectId={project.gitlab_project_id}
            hasToken={Boolean(project.gitlab_token_encrypted)}
          />
        </TabsContent>

        <TabsContent value="tokens" className="pt-6">
          <ApiTokensPanel
            projectId={project.id}
            revalidatePathTarget={pathTarget}
            tokens={tokens ?? []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
