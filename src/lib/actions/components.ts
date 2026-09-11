"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "./auth";

export async function createComponent(
  projectId: string,
  revalidatePathTarget: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Informe o nome do componente." };

  const supabase = await createClient();
  const { error } = await supabase.from("components").insert({
    project_id: projectId,
    name,
    description: String(formData.get("description") ?? "").trim() || null,
  });

  if (error) return { error: error.message };

  revalidatePath(revalidatePathTarget);
  return {};
}

export async function deleteComponent(
  componentId: string,
  revalidatePathTarget: string,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("components").delete().eq("id", componentId);
  revalidatePath(revalidatePathTarget);
}
