import { z } from "zod";

export const TASK_STATUSES = ["pendente", "em_andamento", "concluida"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  notes: z.string(),
  status: z.enum(TASK_STATUSES),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const newTaskSchema = z.object({
  title: z.string().trim().min(1, "Digite um título para a tarefa."),
  notes: z.string().trim(),
});

export type NewTaskInput = z.infer<typeof newTaskSchema>;
