import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listDefects(supabase: Client, projectId: string) {
  const { data, error } = await supabase
    .from("defects")
    .select("id, title, severity, priority, status, gitlab_issue_url, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getDefect(supabase: Client, defectId: string) {
  const { data, error } = await supabase
    .from("defects")
    .select(
      "id, project_id, title, description, severity, priority, status, gitlab_issue_iid, gitlab_issue_url, created_at",
    )
    .eq("id", defectId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
