"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "./auth";
import type { Priority, TestCaseStatus, TestCaseType, TestStep } from "@/types/database";

function parseSteps(raw: string): TestStep[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((action) => ({ action }));
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

interface TestCaseFormContext {
  projectId: string;
  orgSlug: string;
  projectKey: string;
}

export async function createTestCase(
  ctx: TestCaseFormContext,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Informe o título do caso de teste." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const componentId = String(formData.get("componentId") ?? "");

  const { error } = await supabase.from("test_cases").insert({
    project_id: ctx.projectId,
    component_id: componentId || null,
    title,
    preconditions: String(formData.get("preconditions") ?? "").trim() || null,
    steps: parseSteps(String(formData.get("steps") ?? "")),
    expected_result: String(formData.get("expectedResult") ?? "").trim() || null,
    type: String(formData.get("type") ?? "manual") as TestCaseType,
    priority: String(formData.get("priority") ?? "medium") as Priority,
    tags: parseTags(String(formData.get("tags") ?? "")),
    external_ref: String(formData.get("externalRef") ?? "").trim() || null,
    created_by: user?.id ?? null,
  });

  if (error) return { error: error.message };

  redirect(`/app/${ctx.orgSlug}/${ctx.projectKey}/test-cases`);
}

export async function updateTestCase(
  testCaseId: string,
  ctx: TestCaseFormContext,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Informe o título do caso de teste." };

  const supabase = await createClient();
  const componentId = String(formData.get("componentId") ?? "");

  const { error } = await supabase
    .from("test_cases")
    .update({
      component_id: componentId || null,
      title,
      preconditions: String(formData.get("preconditions") ?? "").trim() || null,
      steps: parseSteps(String(formData.get("steps") ?? "")),
      expected_result: String(formData.get("expectedResult") ?? "").trim() || null,
      type: String(formData.get("type") ?? "manual") as TestCaseType,
      priority: String(formData.get("priority") ?? "medium") as Priority,
      status: String(formData.get("status") ?? "active") as TestCaseStatus,
      tags: parseTags(String(formData.get("tags") ?? "")),
      external_ref: String(formData.get("externalRef") ?? "").trim() || null,
    })
    .eq("id", testCaseId);

  if (error) return { error: error.message };

  revalidatePath(`/app/${ctx.orgSlug}/${ctx.projectKey}/test-cases/${testCaseId}`);
  return {};
}

export async function deleteTestCase(
  testCaseId: string,
  orgSlug: string,
  projectKey: string,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("test_cases").delete().eq("id", testCaseId);
  redirect(`/app/${orgSlug}/${projectKey}/test-cases`);
}
