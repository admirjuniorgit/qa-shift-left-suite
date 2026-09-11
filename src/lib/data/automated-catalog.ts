import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ResultStatus, TestFramework } from "@/types/database";
import type { ParsedTestResult } from "@/lib/parsers/types";

type Client = SupabaseClient<Database>;

function mapStatus(status: ParsedTestResult["status"]): ResultStatus {
  return status;
}

export async function upsertCatalogEntries(
  supabase: Client,
  projectId: string,
  framework: TestFramework,
  results: ParsedTestResult[],
): Promise<void> {
  for (const result of results) {
    const { data: existing } = await supabase
      .from("automated_test_catalog")
      .select("id, last_status, failure_streak, flaky_score")
      .eq("project_id", projectId)
      .eq("suite", result.suite)
      .eq("name", result.name)
      .maybeSingle();

    const status = mapStatus(result.status);
    const isFailure = status === "failed";

    if (!existing) {
      await supabase.from("automated_test_catalog").insert({
        project_id: projectId,
        name: result.name,
        suite: result.suite,
        framework,
        last_status: status,
        failure_streak: isFailure ? 1 : 0,
        flaky_score: 0,
        last_run_at: new Date().toISOString(),
      });
      continue;
    }

    const changedBetweenPassFail =
      (existing.last_status === "passed" && status === "failed") ||
      (existing.last_status === "failed" && status === "passed");

    await supabase
      .from("automated_test_catalog")
      .update({
        last_status: status,
        failure_streak: isFailure ? existing.failure_streak + 1 : 0,
        flaky_score: changedBetweenPassFail ? existing.flaky_score + 1 : existing.flaky_score,
        last_run_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  }
}
