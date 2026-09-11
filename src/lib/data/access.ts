import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getUserOrganizations(supabase: Client) {
  const { data, error } = await supabase
    .from("organization_members")
    .select("role, organizations(id, name, slug)")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data
    .map((row) => ({ role: row.role, org: row.organizations }))
    .filter(
      (row): row is { role: (typeof row)["role"]; org: NonNullable<typeof row.org> } =>
        row.org !== null,
    );
}

export async function getOrganizationBySlug(supabase: Client, slug: string) {
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getOrganizationProjects(supabase: Client, organizationId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, key, description, created_at")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getProjectByKey(supabase: Client, organizationId: string, key: string) {
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, name, key, description, repo_url, gitlab_base_url, gitlab_project_id, gitlab_token_encrypted, organization_id",
    )
    .eq("organization_id", organizationId)
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return data;
}
