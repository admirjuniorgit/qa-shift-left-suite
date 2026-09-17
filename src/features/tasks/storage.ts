import { supabaseDelete, supabaseInsert, supabaseSelect, supabaseUpdate } from "@/lib/supabase";
import type { NewTaskInput, Task, TaskStatus } from "./types";

const TABLE = "tasks";

export async function listTasks(): Promise<Task[]> {
  return supabaseSelect<Task>(TABLE, { order: "created_at.desc" });
}

export async function createTask(input: NewTaskInput): Promise<Task> {
  return supabaseInsert<Task>(TABLE, { title: input.title, notes: input.notes, status: "pendente" });
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  return supabaseUpdate<Task>(TABLE, id, { status, updated_at: new Date().toISOString() });
}

export async function updateTaskContent(id: string, patch: { title: string; notes: string }): Promise<Task> {
  return supabaseUpdate<Task>(TABLE, id, { ...patch, updated_at: new Date().toISOString() });
}

export async function deleteTask(id: string): Promise<void> {
  return supabaseDelete(TABLE, id);
}
