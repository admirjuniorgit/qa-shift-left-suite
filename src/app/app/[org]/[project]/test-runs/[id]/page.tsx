import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { getTestRun, getTestRunResults } from "@/lib/data/test-runs";
import { finishTestRun } from "@/lib/actions/test-runs";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app/badges";
import { TestRunResultRow } from "@/components/app/test-run-result-row";

export default async function TestRunDetailPage({
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

  const run = await getTestRun(supabase, id);
  if (!run || run.project_id !== project.id) notFound();

  const results = await getTestRunResults(supabase, id);
  const base = `/app/${orgSlug}/${projectKey}`;
  const pathTarget = `${base}/test-runs/${id}`;

  const pending = results.filter((r) => r.status === "pending").length;

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{run.name}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <StatusBadge value={run.status} />
            {run.environment && <span>· {run.environment}</span>}
            <span>
              · {results.length - pending}/{results.length} executados
            </span>
          </div>
        </div>
        {run.status === "in_progress" && (
          <form action={finishTestRun.bind(null, id, pathTarget)}>
            <Button type="submit" variant="outline">
              Finalizar execução
            </Button>
          </form>
        )}
      </div>

      <div className="space-y-3">
        {results.map((result) => (
          <TestRunResultRow
            key={result.id}
            resultId={result.id}
            status={result.status}
            notes={result.notes}
            evidence={result.evidence}
            title={result.test_cases?.title ?? result.external_test_name ?? "Teste sem nome"}
            steps={result.test_cases?.steps ?? null}
            expectedResult={result.test_cases?.expected_result ?? null}
            revalidatePathTarget={pathTarget}
            newDefectHref={`${base}/defects/new?resultId=${result.id}&title=${encodeURIComponent(
              result.test_cases?.title ?? result.external_test_name ?? "",
            )}`}
          />
        ))}
      </div>
    </div>
  );
}
