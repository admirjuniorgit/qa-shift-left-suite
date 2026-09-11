"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { encryptToken, decryptToken } from "@/lib/crypto";
import { testConnection } from "@/lib/gitlab/client";
import { generateApiToken as generateTokenValue } from "@/lib/api-tokens";
import type { ActionResult } from "./auth";

export async function updateGitlabConfig(
  projectId: string,
  revalidatePathTarget: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const baseUrl = String(formData.get("gitlabBaseUrl") ?? "").trim();
  const gitlabProjectId = String(formData.get("gitlabProjectId") ?? "").trim();
  const token = String(formData.get("gitlabToken") ?? "").trim();

  if (!baseUrl || !gitlabProjectId) {
    return { error: "Informe a URL do GitLab e o ID do projeto." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({
      gitlab_base_url: baseUrl,
      gitlab_project_id: gitlabProjectId,
      ...(token ? { gitlab_token_encrypted: encryptToken(token) } : {}),
    })
    .eq("id", projectId);
  if (error) return { error: error.message };

  revalidatePath(revalidatePathTarget);
  return {};
}

export async function testGitlabConnection(projectId: string): Promise<{ error?: string; success?: string }> {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("gitlab_base_url, gitlab_project_id, gitlab_token_encrypted")
    .eq("id", projectId)
    .maybeSingle();

  if (!project?.gitlab_base_url || !project.gitlab_project_id || !project.gitlab_token_encrypted) {
    return { error: "Configure e salve a integração antes de testar." };
  }

  try {
    const result = await testConnection({
      baseUrl: project.gitlab_base_url,
      projectId: project.gitlab_project_id,
      token: decryptToken(project.gitlab_token_encrypted),
    });
    return { success: `Conectado a "${result.name}".` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Falha ao conectar." };
  }
}

export async function generateApiToken(
  projectId: string,
  revalidatePathTarget: string,
  _prev: ActionResult & { token?: string },
  formData: FormData,
): Promise<ActionResult & { token?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Informe um nome para identificar o token." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { token, hash, prefix } = generateTokenValue();

  const { error } = await supabase.from("project_api_tokens").insert({
    project_id: projectId,
    name,
    token_hash: hash,
    token_prefix: prefix,
    created_by: user?.id ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath(revalidatePathTarget);
  return { token };
}

export async function revokeApiToken(tokenId: string, revalidatePathTarget: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("project_api_tokens").delete().eq("id", tokenId);
  revalidatePath(revalidatePathTarget);
}
