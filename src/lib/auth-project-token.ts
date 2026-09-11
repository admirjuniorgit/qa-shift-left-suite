import { createAdminClient } from "@/lib/supabase/admin";
import { hashApiToken } from "@/lib/api-tokens";

export async function authenticateProjectToken(
  request: Request,
): Promise<{ projectId: string } | { error: string; status: number }> {
  const authHeader = request.headers.get("authorization") ?? "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return { error: "Cabeçalho Authorization: Bearer <token> ausente.", status: 401 };
  }

  const token = match[1];
  const admin = createAdminClient();
  const { data: tokenRow } = await admin
    .from("project_api_tokens")
    .select("id, project_id")
    .eq("token_hash", hashApiToken(token))
    .maybeSingle();

  if (!tokenRow) {
    return { error: "Token inválido.", status: 401 };
  }

  await admin
    .from("project_api_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", tokenRow.id);

  return { projectId: tokenRow.project_id };
}
