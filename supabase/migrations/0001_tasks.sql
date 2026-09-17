-- Tabela de tarefas pessoais do QA Toolkit (aba "Tarefas").
-- Rode isto no SQL Editor do projeto Supabase (aoyvbtaduzzjguouudxs).

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text not null default '',
  status text not null default 'pendente' check (status in ('pendente', 'em_andamento', 'concluida')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

-- Ferramenta pessoal de um único usuário: a chave anon (pública) tem acesso total.
create policy "tasks anon select" on public.tasks for select to anon using (true);
create policy "tasks anon insert" on public.tasks for insert to anon with check (true);
create policy "tasks anon update" on public.tasks for update to anon using (true) with check (true);
create policy "tasks anon delete" on public.tasks for delete to anon using (true);
