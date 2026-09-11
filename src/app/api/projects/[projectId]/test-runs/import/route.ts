import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authenticateProjectToken } from "@/lib/auth-project-token";
import { parseTestReport } from "@/lib/parsers";
import { upsertCatalogEntries } from "@/lib/data/automated-catalog";
import type { ResultStatus, TestFramework } from "@/types/database";

// Endpoint agnóstico de stack: qualquer pipeline de CI (Java, .NET, Python, JS...)
// pode enviar um relatório JUnit XML ou Playwright JSON aqui para alimentar as
// métricas de qualidade, sem precisar rodar dentro desta suíte.
//
// Uso (exemplo em .gitlab-ci.yml):
//   curl -X POST "$QA_SUITE_URL/api/projects/$PROJECT_ID/test-runs/import" \
//     -H "Authorization: Bearer $QA_SUITE_TOKEN" \
//     -F "file=@test-results.xml" \
//     -F "runName=Pipeline $CI_PIPELINE_ID"

export async function POST(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId: projectIdFromPath } = await params;

  const auth = await authenticateProjectToken(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  if (auth.projectId !== projectIdFromPath) {
    return NextResponse.json({ error: "Token não pertence a este projeto." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Envie o relatório no campo 'file' (multipart/form-data)." }, { status: 400 });
  }

  const content = await file.text();
  let report;
  try {
    report = parseTestReport(content, file.name);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Não foi possível interpretar o relatório." },
      { status: 400 },
    );
  }

  const runName = String(formData.get("runName") ?? `Import ${file.name}`);
  const environment = String(formData.get("environment") ?? "") || null;

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data: run, error: runError } = await admin
    .from("test_runs")
    .insert({
      project_id: auth.projectId,
      name: runName,
      environment,
      triggered_by: "ci_import",
      status: "completed",
      started_at: now,
      finished_at: now,
    })
    .select("id")
    .single();

  if (runError || !run) {
    return NextResponse.json({ error: runError?.message ?? "Falha ao criar execução." }, { status: 500 });
  }

  const statusMap: Record<string, ResultStatus> = { passed: "passed", failed: "failed", skipped: "skipped" };

  const results = report.results.map((r) => ({
    test_run_id: run.id,
    external_test_name: `${r.suite} > ${r.name}`,
    status: statusMap[r.status],
    duration_ms: r.durationMs,
    notes: r.failureMessage ?? null,
    executed_at: now,
  }));

  if (results.length > 0) {
    const { error: resultsError } = await admin.from("test_run_results").insert(results);
    if (resultsError) {
      return NextResponse.json({ error: resultsError.message }, { status: 500 });
    }
  }

  await upsertCatalogEntries(admin, auth.projectId, report.framework as TestFramework, report.results);

  const summary = {
    runId: run.id,
    total: report.results.length,
    passed: report.results.filter((r) => r.status === "passed").length,
    failed: report.results.filter((r) => r.status === "failed").length,
    skipped: report.results.filter((r) => r.status === "skipped").length,
  };

  return NextResponse.json(summary, { status: 201 });
}
