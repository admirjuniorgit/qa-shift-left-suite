"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "./auth";

interface PlanFormContext {
  projectId: string;
  orgSlug: string;
  projectKey: string;
}

export async function createTestPlan(
  ctx: PlanFormContext,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Informe o nome do plano." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plan, error } = await supabase
    .from("test_plans")
    .insert({
      project_id: ctx.projectId,
      name,
      description: String(formData.get("description") ?? "").trim() || null,
      cycle_name: String(formData.get("cycleName") ?? "").trim() || null,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error || !plan) return { error: error?.message ?? "Não foi possível criar o plano." };

  redirect(`/app/${ctx.orgSlug}/${ctx.projectKey}/test-plans/${plan.id}`);
}

export async function addCasesToPlan(
  testPlanId: string,
  revalidatePathTarget: string,
  testCaseIds: string[],
): Promise<void> {
  if (testCaseIds.length === 0) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("test_plan_cases")
    .select("position")
    .eq("test_plan_id", testPlanId)
    .order("position", { ascending: false })
    .limit(1);

  let nextPosition = (existing?.[0]?.position ?? -1) + 1;
  const rows = testCaseIds.map((testCaseId) => ({
    test_plan_id: testPlanId,
    test_case_id: testCaseId,
    position: nextPosition++,
  }));

  await supabase.from("test_plan_cases").insert(rows);
  revalidatePath(revalidatePathTarget);
}

export async function removeCaseFromPlan(
  testPlanCaseId: string,
  revalidatePathTarget: string,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("test_plan_cases").delete().eq("id", testPlanCaseId);
  revalidatePath(revalidatePathTarget);
}
