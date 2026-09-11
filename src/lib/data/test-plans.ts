import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listTestPlans(supabase: Client, projectId: string) {
  const { data, error } = await supabase
    .from("test_plans")
    .select("id, name, description, cycle_name, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTestPlan(supabase: Client, testPlanId: string) {
  const { data, error } = await supabase
    .from("test_plans")
    .select("id, project_id, name, description, cycle_name")
    .eq("id", testPlanId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getTestPlanCases(supabase: Client, testPlanId: string) {
  const { data, error } = await supabase
    .from("test_plan_cases")
    .select("id, position, test_cases(id, title, type, priority)")
    .eq("test_plan_id", testPlanId)
    .order("position");

  if (error) throw error;
  return data;
}
