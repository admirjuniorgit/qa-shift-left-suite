"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { decryptToken } from "@/lib/crypto";
import { createIssueFromDefect } from "@/lib/gitlab/client";
import type { ActionResult } from "./auth";
import type { DefectPriority, DefectStatus, Priority } from "@/types/database";

interface DefectFormContext {
  projectId: string;
  orgSlug: string;
  projectKey: string;
}

export async function createDefect(
  ctx: DefectFormContext,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Informe o título do defeito." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const testRunResultId = String(formData.get("testRunResultId") ?? "").trim() || null;

  const { data: defect, error } = await supabase
    .from("defects")
    .insert({
      project_id: ctx.projectId,
      test_run_result_id: testRunResultId,
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      severity: String(formData.get("severity") ?? "medium") as Priority,
      priority: String(formData.get("priority") ?? "medium") as DefectPriority,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error || !defect) return { error: error?.message ?? "Não foi possível criar o defeito." };

  redirect(`/app/${ctx.orgSlug}/${ctx.projectKey}/defects/${defect.id}`);
}

export async function updateDefectStatus(
  defectId: string,
  revalidatePathTarget: string,
  status: DefectStatus,
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("defects")
    .update({
      status,
      resolved_at: status === "resolved" || status === "closed" ? new Date().toISOString() : null,
    })
    .eq("id", defectId);

  revalidatePath(revalidatePathTarget);
}

export async function createGitlabIssueForDefect(
  defectId: string,
  revalidatePathTarget: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: defect } = await supabase
    .from("defects")
    .select("id, project_id, title, description, severity")
    .eq("id", defectId)
    .maybeSingle();

  if (!defect) return { error: "Defeito não encontrado." };

  const { data: project } = await supabase
    .from("projects")
    .select("gitlab_base_url, gitlab_project_id, gitlab_token_encrypted")
    .eq("id", defect.project_id)
    .maybeSingle();

  if (!project?.gitlab_base_url || !project.gitlab_project_id || !project.gitlab_token_encrypted) {
    return { error: "Configure a integração com o GitLab nas configurações do projeto." };
  }

  try {
    const token = decryptToken(project.gitlab_token_encrypted);
    const issue = await createIssueFromDefect(
      { baseUrl: project.gitlab_base_url, projectId: project.gitlab_project_id, token },
      {
        title: defect.title,
        description: defect.description ?? "",
        labels: ["qa", `severity::${defect.severity}`],
      },
    );

    await supabase
      .from("defects")
      .update({ gitlab_issue_iid: String(issue.iid), gitlab_issue_url: issue.webUrl })
      .eq("id", defectId);

    revalidatePath(revalidatePathTarget);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao criar issue no GitLab." };
  }
}
