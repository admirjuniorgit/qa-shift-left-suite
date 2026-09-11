-- QA Shift-Left Suite — schema inicial (multi-tenant)
-- Organização > Projetos > Membros > Casos de teste > Planos/Execuções > Defeitos

create extension if not exists "pgcrypto";

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================================
-- ORGANIZAÇÕES E MEMBROS
-- =========================================================

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_organizations_updated
  before update on public.organizations
  for each row execute function public.handle_updated_at();

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'qa' check (role in ('owner', 'admin', 'qa_lead', 'qa', 'dev', 'viewer')),
  invited_email text,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists idx_org_members_org on public.organization_members(organization_id);
create index if not exists idx_org_members_user on public.organization_members(user_id);

-- =========================================================
-- PROJETOS E MEMBROS DE PROJETO
-- =========================================================

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  key text not null,
  description text,
  repo_url text,
  gitlab_base_url text,
  gitlab_project_id text,
  gitlab_token_encrypted text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, key)
);

create trigger trg_projects_updated
  before update on public.projects
  for each row execute function public.handle_updated_at();

create index if not exists idx_projects_org on public.projects(organization_id);

create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'qa' check (role in ('owner', 'admin', 'qa_lead', 'qa', 'dev', 'viewer')),
  created_at timestamptz not null default now(),
  unique (project_id, user_id)
);

create index if not exists idx_project_members_project on public.project_members(project_id);
create index if not exists idx_project_members_user on public.project_members(user_id);

-- =========================================================
-- COMPONENTES (áreas do sistema, base para cobertura)
-- =========================================================

create table if not exists public.components (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (project_id, name)
);

create index if not exists idx_components_project on public.components(project_id);

-- =========================================================
-- CASOS DE TESTE
-- =========================================================

create table if not exists public.test_cases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  component_id uuid references public.components(id) on delete set null,
  title text not null,
  preconditions text,
  steps jsonb not null default '[]'::jsonb,
  expected_result text,
  type text not null default 'manual' check (type in ('manual', 'automated')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  status text not null default 'active' check (status in ('active', 'draft', 'deprecated')),
  tags text[] not null default '{}',
  external_ref text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_test_cases_updated
  before update on public.test_cases
  for each row execute function public.handle_updated_at();

create index if not exists idx_test_cases_project on public.test_cases(project_id);
create index if not exists idx_test_cases_component on public.test_cases(component_id);
create index if not exists idx_test_cases_status on public.test_cases(status);

-- =========================================================
-- PLANOS DE TESTE
-- =========================================================

create table if not exists public.test_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  description text,
  cycle_name text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_test_plans_updated
  before update on public.test_plans
  for each row execute function public.handle_updated_at();

create index if not exists idx_test_plans_project on public.test_plans(project_id);

create table if not exists public.test_plan_cases (
  id uuid primary key default gen_random_uuid(),
  test_plan_id uuid not null references public.test_plans(id) on delete cascade,
  test_case_id uuid not null references public.test_cases(id) on delete cascade,
  position integer not null default 0,
  unique (test_plan_id, test_case_id)
);

create index if not exists idx_test_plan_cases_plan on public.test_plan_cases(test_plan_id);

-- =========================================================
-- EXECUÇÕES (TEST RUNS)
-- =========================================================

create table if not exists public.test_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  test_plan_id uuid references public.test_plans(id) on delete set null,
  name text not null,
  environment text,
  triggered_by text not null default 'manual' check (triggered_by in ('manual', 'ci_import')),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_test_runs_project on public.test_runs(project_id);
create index if not exists idx_test_runs_plan on public.test_runs(test_plan_id);
create index if not exists idx_test_runs_created on public.test_runs(created_at desc);

create table if not exists public.test_run_results (
  id uuid primary key default gen_random_uuid(),
  test_run_id uuid not null references public.test_runs(id) on delete cascade,
  test_case_id uuid references public.test_cases(id) on delete set null,
  external_test_name text,
  status text not null default 'pending' check (status in ('pending', 'passed', 'failed', 'blocked', 'skipped', 'flaky')),
  duration_ms integer,
  evidence jsonb not null default '[]'::jsonb,
  notes text,
  executed_by uuid references auth.users(id) on delete set null,
  executed_at timestamptz
);

create index if not exists idx_test_run_results_run on public.test_run_results(test_run_id);
create index if not exists idx_test_run_results_case on public.test_run_results(test_case_id);
create index if not exists idx_test_run_results_status on public.test_run_results(status);

-- =========================================================
-- DEFEITOS
-- =========================================================

create table if not exists public.defects (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  test_run_result_id uuid references public.test_run_results(id) on delete set null,
  title text not null,
  description text,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed', 'wontfix')),
  gitlab_issue_iid text,
  gitlab_issue_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create trigger trg_defects_updated
  before update on public.defects
  for each row execute function public.handle_updated_at();

create index if not exists idx_defects_project on public.defects(project_id);
create index if not exists idx_defects_status on public.defects(status);
create index if not exists idx_defects_severity on public.defects(severity);

-- =========================================================
-- CATÁLOGO DE TESTES AUTOMATIZADOS (alimentado por import de relatórios)
-- =========================================================

create table if not exists public.automated_test_catalog (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  suite text,
  framework text check (framework in ('playwright', 'puppeteer', 'junit', 'other')),
  file_path text,
  last_status text check (last_status in ('passed', 'failed', 'blocked', 'skipped', 'flaky')),
  failure_streak integer not null default 0,
  flaky_score integer not null default 0,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, suite, name)
);

create trigger trg_automated_test_catalog_updated
  before update on public.automated_test_catalog
  for each row execute function public.handle_updated_at();

create index if not exists idx_automated_catalog_project on public.automated_test_catalog(project_id);
create index if not exists idx_automated_catalog_flaky on public.automated_test_catalog(flaky_score desc);

-- =========================================================
-- TOKENS DE API POR PROJETO (usados pelo CI de qualquer stack para
-- importar relatórios de teste sem precisar de sessão de usuário)
-- =========================================================

create table if not exists public.project_api_tokens (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  token_hash text not null unique,
  token_prefix text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists idx_project_api_tokens_project on public.project_api_tokens(project_id);

-- =========================================================
-- STORAGE (evidências de execução: prints, vídeos, logs)
-- =========================================================

insert into storage.buckets (id, name, public)
values ('evidences', 'evidences', true)
on conflict (id) do nothing;
