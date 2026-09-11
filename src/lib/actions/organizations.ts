"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify, projectKeyFromName } from "@/lib/slug";
import type { ActionResult } from "./auth";

export async function completeOnboarding(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const orgName = String(formData.get("orgName") ?? "").trim();
  const projectName = String(formData.get("projectName") ?? "").trim();

  if (!orgName || !projectName) {
    return { error: "Informe o nome da organização e do primeiro projeto." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const baseSlug = slugify(orgName) || "organizacao";
  let slug = baseSlug;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({ name: orgName, slug, created_by: user.id })
    .select("id, slug")
    .single();

  if (orgError || !org) {
    return { error: orgError?.message ?? "Não foi possível criar a organização." };
  }

  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({ organization_id: org.id, user_id: user.id, role: "owner" });

  if (memberError) {
    return { error: memberError.message };
  }

  const projectKey = projectKeyFromName(projectName);
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      organization_id: org.id,
      name: projectName,
      key: projectKey,
      created_by: user.id,
    })
    .select("key")
    .single();

  if (projectError || !project) {
    return { error: projectError?.message ?? "Não foi possível criar o projeto." };
  }

  redirect(`/app/${org.slug}/${project.key}`);
}

export async function createProject(
  organizationId: string,
  organizationSlug: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Informe o nome do projeto." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const key = projectKeyFromName(name);
  const { data: project, error } = await supabase
    .from("projects")
    .insert({ organization_id: organizationId, name, key, created_by: user!.id })
    .select("key")
    .single();

  if (error || !project) {
    return { error: error?.message ?? "Não foi possível criar o projeto." };
  }

  redirect(`/app/${organizationSlug}/${project.key}`);
}
