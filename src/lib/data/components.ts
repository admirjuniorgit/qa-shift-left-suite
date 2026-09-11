import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listComponents(supabase: Client, projectId: string) {
  const { data, error } = await supabase
    .from("components")
    .select("id, name, description")
    .eq("project_id", projectId)
    .order("name");

  if (error) throw error;
  return data;
}
