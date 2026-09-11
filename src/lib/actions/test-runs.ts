"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "./auth";
import type { EvidenceItem, ResultStatus } from "@/types/database";

interface RunFormContext {
  projectId: string;
  orgSlug: string;
  projectKey: string;
}

export async function createTestRun(
  ctx: RunFormContext,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Informe o nome da execução." };

  const testPlanId = String(formData.get("testPlanId") ?? "").trim() || null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let caseIds: string[];
  if (testPlanId) {
    const { data: planCases } = await supabase
      .from("test_plan_cases")
      .select("test_case_id")
      .eq("test_plan_id", testPlanId)
      .order("position");
    caseIds = (planCases ?? []).map((pc) => pc.test_case_id);
  } else {
    caseIds = formData.getAll("caseIds").map(String);
  }

  if (caseIds.length === 0) {
    return { error: "Selecione ao menos um caso de teste para executar." };
  }

  const { data: run, error } = await supabase
    .from("test_runs")
    .insert({
      project_id: ctx.projectId,
      test_plan_id: testPlanId,
      name,
      environment: String(formData.get("environment") ?? "").trim() || null,
      triggered_by: "manual",
      status: "in_progress",
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error || !run) return { error: error?.message ?? "Não foi possível criar a execução." };

  const results = caseIds.map((testCaseId) => ({
    test_run_id: run.id,
    test_case_id: testCaseId,
    status: "pending" as const,
  }));

  const { error: resultsError } = await supabase.from("test_run_results").insert(results);
  if (resultsError) return { error: resultsError.message };

  redirect(`/app/${ctx.orgSlug}/${ctx.projectKey}/test-runs/${run.id}`);
}

export async function recordResult(
  resultId: string,
  revalidatePathTarget: string,
  status: ResultStatus,
  notes: string,
  evidence: EvidenceItem[],
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("test_run_results")
    .update({
      status,
      notes: notes.trim() || null,
      evidence,
      executed_by: user?.id ?? null,
      executed_at: new Date().toISOString(),
    })
    .eq("id", resultId);

  revalidatePath(revalidatePathTarget);
}

export async function finishTestRun(testRunId: string, revalidatePathTarget: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("test_runs")
    .update({ status: "completed", finished_at: new Date().toISOString() })
    .eq("id", testRunId);

  revalidatePath(revalidatePathTarget);
}
