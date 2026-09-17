import { useEffect, useState } from "react";
import { ListTodo } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/toast-context";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createTask, deleteTask, listTasks, updateTaskContent, updateTaskStatus } from "../storage";
import type { Task, TaskStatus } from "../types";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const notify = useToast();
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    listTasks()
      .then(setTasks)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [configured]);

  async function handleCreate(title: string, notes: string) {
    try {
      const task = await createTask({ title, notes });
      setTasks((prev) => [task, ...prev]);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Erro ao criar tarefa.", "error");
    }
  }

  async function handleStatusChange(id: string, status: TaskStatus) {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await updateTaskStatus(id, status);
    } catch (err) {
      setTasks(previous);
      notify(err instanceof Error ? err.message : "Erro ao atualizar tarefa.", "error");
    }
  }

  async function handleEdit(id: string, title: string, notes: string) {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title, notes } : t)));
    try {
      await updateTaskContent(id, { title, notes });
    } catch (err) {
      setTasks(previous);
      notify(err instanceof Error ? err.message : "Erro ao salvar edição.", "error");
    }
  }

  async function handleDelete(id: string) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
      notify("Tarefa excluída.");
    } catch (err) {
      setTasks(previous);
      notify(err instanceof Error ? err.message : "Erro ao excluir tarefa.", "error");
    }
  }

  if (!configured) {
    return (
      <Card className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Tarefas ainda não configuradas</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Defina <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> (arquivo <code>.env.local</code> em
          desenvolvimento, ou nas variáveis de ambiente do Netlify em produção) e rode a migração SQL em{" "}
          <code>supabase/migrations/0001_tasks.sql</code> no seu projeto Supabase.
        </p>
      </Card>
    );
  }

  const pending = tasks.filter((t) => t.status !== "concluida");
  const done = tasks.filter((t) => t.status === "concluida");

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <Card>
        <TaskForm onCreate={handleCreate} />
      </Card>

      <div className="space-y-4">
        {loading && <p className="text-sm text-slate-400">Carregando tarefas...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <Card className="flex flex-col items-center gap-2 py-12 text-center text-sm text-slate-400">
            <ListTodo className="size-6" />
            Nenhuma tarefa ainda. Adicione a primeira ao lado.
          </Card>
        )}

        {pending.length > 0 && (
          <div className="space-y-2">
            {pending.map((task) => (
              <TaskItem key={task.id} task={task} onStatusChange={handleStatusChange} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {done.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Concluídas</h4>
            {done.map((task) => (
              <TaskItem key={task.id} task={task} onStatusChange={handleStatusChange} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
