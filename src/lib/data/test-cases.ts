import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listTestCases(supabase: Client, projectId: string) {
  const { data, error } = await supabase
    .from("test_cases")
    .select("id, title, type, priority, status, tags, updated_at, components(name)")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTestCase(supabase: Client, testCaseId: string) {
  const { data, error } = await supabase
    .from("test_cases")
    .select(
      "id, project_id, component_id, title, preconditions, steps, expected_result, type, priority, status, tags, external_ref",
    )
    .eq("id", testCaseId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
