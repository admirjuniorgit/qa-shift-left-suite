import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { getDefectMetrics } from "@/lib/data/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/app/link-button";

export default async function ProjectOverviewPage({
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

  const [{ count: testCaseCount }, { count: openRunsCount }, defectMetrics] = await Promise.all([
    supabase.from("test_cases").select("id", { count: "exact", head: true }).eq("project_id", project.id),
    supabase
      .from("test_runs")
      .select("id", { count: "exact", head: true })
      .eq("project_id", project.id)
      .eq("status", "in_progress"),
    getDefectMetrics(supabase, project.id),
  ]);

  const base = `/app/${orgSlug}/${projectKey}`;

  return (
    <div className="px-6 py-8">
      <h1 className="mb-1 text-2xl font-semibold">{project.name}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {project.description || "Visão geral do projeto."}
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Casos de teste
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{testCaseCount ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Execuções em andamento
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{openRunsCount ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Defeitos abertos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {defectMetrics?.open_defects ?? 0}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <LinkButton href={`${base}/test-cases/new`}>Novo caso de teste</LinkButton>
        <LinkButton variant="outline" href={`${base}/test-runs/new`}>
          Nova execução
        </LinkButton>
        <LinkButton variant="outline" href={`${base}/metrics`}>
          Ver métricas completas
        </LinkButton>
      </div>
    </div>
  );
}
