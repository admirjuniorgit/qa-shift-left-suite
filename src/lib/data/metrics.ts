import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getComponentCoverage(supabase: Client, projectId: string) {
  const { data, error } = await supabase
    .from("v_component_coverage")
    .select("*")
    .eq("project_id", projectId)
    .order("component_name");

  if (error) throw error;
  return data;
}

export async function getDefectMetrics(supabase: Client, projectId: string) {
  const { data, error } = await supabase
    .from("v_defect_metrics")
    .select("*")
    .eq("project_id", projectId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getFlakyTests(supabase: Client, projectId: string) {
  const { data, error } = await supabase
    .from("v_flaky_tests")
    .select("*")
    .eq("project_id", projectId)
    .limit(10);

  if (error) throw error;
  return data;
}

export async function getPassRateTrend(supabase: Client, projectId: string) {
  const { data, error } = await supabase
    .from("v_pass_rate_trend")
    .select("*")
    .eq("project_id", projectId)
    .limit(15);

  if (error) throw error;
  return data.reverse();
}
