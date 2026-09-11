import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listTestRuns(supabase: Client, projectId: string) {
  const { data, error } = await supabase
    .from("v_test_run_summary")
    .select("*")
    .eq("project_id", projectId)
    .order("started_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTestRun(supabase: Client, testRunId: string) {
  const { data, error } = await supabase
    .from("test_runs")
    .select("id, project_id, test_plan_id, name, environment, status, started_at, finished_at")
    .eq("id", testRunId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getTestRunResults(supabase: Client, testRunId: string) {
  const { data, error } = await supabase
    .from("test_run_results")
    .select(
      "id, status, duration_ms, evidence, notes, executed_at, test_case_id, external_test_name, test_cases(id, title, steps, expected_result, priority)",
    )
    .eq("test_run_id", testRunId)
    .order("id");

  if (error) throw error;
  return data;
}
