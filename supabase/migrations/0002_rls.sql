-- QA Shift-Left Suite — Row Level Security
-- Estratégia: funções SECURITY DEFINER isolam a checagem de membership para
-- evitar recursão de RLS entre organization_members/projects/demais tabelas.

-- =========================================================
-- FUNÇÕES HELPER
-- =========================================================

create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_org_admin(org_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
      and m.role in ('owner', 'admin')
  );
$$;

create or replace function public.is_project_member(proj_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.projects p
    join public.organization_members m on m.organization_id = p.organization_id
    where p.id = proj_id and m.user_id = auth.uid()
  );
$$;

-- editor = qualquer papel exceto "viewer" (pode criar/editar casos, execuções, defeitos)
create or replace function public.is_project_editor(proj_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.projects p
    join public.organization_members m on m.organization_id = p.organization_id
    where p.id = proj_id and m.user_id = auth.uid() and m.role <> 'viewer'
  );
$$;

-- admin do projeto = pode excluir registros e configurar integração GitLab
create or replace function public.is_project_admin(proj_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.projects p
    join public.organization_members m on m.organization_id = p.organization_id
    where p.id = proj_id and m.user_id = auth.uid() and m.role in ('owner', 'admin', 'qa_lead')
  );
$$;

create or replace function public.is_run_editor(run_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.test_runs r
    join public.projects p on p.id = r.project_id
    join public.organization_members m on m.organization_id = p.organization_id
    where r.id = run_id and m.user_id = auth.uid() and m.role <> 'viewer'
  );
$$;

create or replace function public.is_run_member(run_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.test_runs r
    join public.projects p on p.id = r.project_id
    join public.organization_members m on m.organization_id = p.organization_id
    where r.id = run_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_plan_editor(plan_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.test_plans t
    join public.projects p on p.id = t.project_id
    join public.organization_members m on m.organization_id = p.organization_id
    where t.id = plan_id and m.user_id = auth.uid() and m.role <> 'viewer'
  );
$$;

create or replace function public.is_plan_member(plan_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.test_plans t
    join public.projects p on p.id = t.project_id
    join public.organization_members m on m.organization_id = p.organization_id
    where t.id = plan_id and m.user_id = auth.uid()
  );
$$;

-- =========================================================
-- ORGANIZATIONS
-- =========================================================

alter table public.organizations enable row level security;

drop policy if exists org_select on public.organizations;
create policy org_select on public.organizations for select
  using (public.is_org_member(id));

drop policy if exists org_insert on public.organizations;
create policy org_insert on public.organizations for insert
  with check (auth.uid() is not null);

drop policy if exists org_update on public.organizations;
create policy org_update on public.organizations for update
  using (public.is_org_admin(id));

drop policy if exists org_delete on public.organizations;
create policy org_delete on public.organizations for delete
  using (public.is_org_admin(id));

-- =========================================================
-- ORGANIZATION MEMBERS
-- =========================================================

alter table public.organization_members enable row level security;

drop policy if exists org_members_select on public.organization_members;
create policy org_members_select on public.organization_members for select
  using (public.is_org_member(organization_id));

-- Primeiro membro (dono) se auto-insere ao criar a organização;
-- convites subsequentes exigem que quem convida já seja owner/admin.
drop policy if exists org_members_insert on public.organization_members;
create policy org_members_insert on public.organization_members for insert
  with check (
    (
      auth.uid() = user_id
      and role = 'owner'
      and not exists (
        select 1 from public.organization_members existing
        where existing.organization_id = organization_members.organization_id
      )
    )
    or public.is_org_admin(organization_id)
  );

drop policy if exists org_members_update on public.organization_members;
create policy org_members_update on public.organization_members for update
  using (public.is_org_admin(organization_id));

drop policy if exists org_members_delete on public.organization_members;
create policy org_members_delete on public.organization_members for delete
  using (public.is_org_admin(organization_id) or auth.uid() = user_id);

-- =========================================================
-- PROJECTS
-- =========================================================

alter table public.projects enable row level security;

drop policy if exists projects_select on public.projects;
create policy projects_select on public.projects for select
  using (public.is_org_member(organization_id));

drop policy if exists projects_insert on public.projects;
create policy projects_insert on public.projects for insert
  with check (public.is_org_member(organization_id));

drop policy if exists projects_update on public.projects;
create policy projects_update on public.projects for update
  using (public.is_org_admin(organization_id));

drop policy if exists projects_delete on public.projects;
create policy projects_delete on public.projects for delete
  using (public.is_org_admin(organization_id));

-- =========================================================
-- PROJECT MEMBERS
-- =========================================================

alter table public.project_members enable row level security;

drop policy if exists project_members_select on public.project_members;
create policy project_members_select on public.project_members for select
  using (public.is_project_member(project_id));

drop policy if exists project_members_insert on public.project_members;
create policy project_members_insert on public.project_members for insert
  with check (public.is_project_admin(project_id));

drop policy if exists project_members_delete on public.project_members;
create policy project_members_delete on public.project_members for delete
  using (public.is_project_admin(project_id));

-- =========================================================
-- COMPONENTS
-- =========================================================

alter table public.components enable row level security;

drop policy if exists components_select on public.components;
create policy components_select on public.components for select
  using (public.is_project_member(project_id));

drop policy if exists components_write on public.components;
create policy components_write on public.components for insert
  with check (public.is_project_editor(project_id));

drop policy if exists components_update on public.components;
create policy components_update on public.components for update
  using (public.is_project_editor(project_id));

drop policy if exists components_delete on public.components;
create policy components_delete on public.components for delete
  using (public.is_project_admin(project_id));

-- =========================================================
-- TEST CASES
-- =========================================================

alter table public.test_cases enable row level security;

drop policy if exists test_cases_select on public.test_cases;
create policy test_cases_select on public.test_cases for select
  using (public.is_project_member(project_id));

drop policy if exists test_cases_insert on public.test_cases;
create policy test_cases_insert on public.test_cases for insert
  with check (public.is_project_editor(project_id));

drop policy if exists test_cases_update on public.test_cases;
create policy test_cases_update on public.test_cases for update
  using (public.is_project_editor(project_id));

drop policy if exists test_cases_delete on public.test_cases;
create policy test_cases_delete on public.test_cases for delete
  using (public.is_project_admin(project_id));

-- =========================================================
-- TEST PLANS
-- =========================================================

alter table public.test_plans enable row level security;

drop policy if exists test_plans_select on public.test_plans;
create policy test_plans_select on public.test_plans for select
  using (public.is_project_member(project_id));

drop policy if exists test_plans_insert on public.test_plans;
create policy test_plans_insert on public.test_plans for insert
  with check (public.is_project_editor(project_id));

drop policy if exists test_plans_update on public.test_plans;
create policy test_plans_update on public.test_plans for update
  using (public.is_project_editor(project_id));

drop policy if exists test_plans_delete on public.test_plans;
create policy test_plans_delete on public.test_plans for delete
  using (public.is_project_admin(project_id));

-- =========================================================
-- TEST PLAN CASES
-- =========================================================

alter table public.test_plan_cases enable row level security;

drop policy if exists test_plan_cases_select on public.test_plan_cases;
create policy test_plan_cases_select on public.test_plan_cases for select
  using (public.is_plan_member(test_plan_id));

drop policy if exists test_plan_cases_insert on public.test_plan_cases;
create policy test_plan_cases_insert on public.test_plan_cases for insert
  with check (public.is_plan_editor(test_plan_id));

drop policy if exists test_plan_cases_delete on public.test_plan_cases;
create policy test_plan_cases_delete on public.test_plan_cases for delete
  using (public.is_plan_editor(test_plan_id));

-- =========================================================
-- TEST RUNS
-- =========================================================

alter table public.test_runs enable row level security;

drop policy if exists test_runs_select on public.test_runs;
create policy test_runs_select on public.test_runs for select
  using (public.is_project_member(project_id));

drop policy if exists test_runs_insert on public.test_runs;
create policy test_runs_insert on public.test_runs for insert
  with check (public.is_project_editor(project_id));

drop policy if exists test_runs_update on public.test_runs;
create policy test_runs_update on public.test_runs for update
  using (public.is_project_editor(project_id));

drop policy if exists test_runs_delete on public.test_runs;
create policy test_runs_delete on public.test_runs for delete
  using (public.is_project_admin(project_id));

-- =========================================================
-- TEST RUN RESULTS
-- =========================================================

alter table public.test_run_results enable row level security;

drop policy if exists test_run_results_select on public.test_run_results;
create policy test_run_results_select on public.test_run_results for select
  using (public.is_run_member(test_run_id));

drop policy if exists test_run_results_insert on public.test_run_results;
create policy test_run_results_insert on public.test_run_results for insert
  with check (public.is_run_editor(test_run_id));

drop policy if exists test_run_results_update on public.test_run_results;
create policy test_run_results_update on public.test_run_results for update
  using (public.is_run_editor(test_run_id));

drop policy if exists test_run_results_delete on public.test_run_results;
create policy test_run_results_delete on public.test_run_results for delete
  using (public.is_run_editor(test_run_id));

-- =========================================================
-- DEFECTS
-- =========================================================

alter table public.defects enable row level security;

drop policy if exists defects_select on public.defects;
create policy defects_select on public.defects for select
  using (public.is_project_member(project_id));

drop policy if exists defects_insert on public.defects;
create policy defects_insert on public.defects for insert
  with check (public.is_project_editor(project_id));

drop policy if exists defects_update on public.defects;
create policy defects_update on public.defects for update
  using (public.is_project_editor(project_id));

drop policy if exists defects_delete on public.defects;
create policy defects_delete on public.defects for delete
  using (public.is_project_admin(project_id));

-- =========================================================
-- AUTOMATED TEST CATALOG
-- =========================================================

alter table public.automated_test_catalog enable row level security;

drop policy if exists automated_catalog_select on public.automated_test_catalog;
create policy automated_catalog_select on public.automated_test_catalog for select
  using (public.is_project_member(project_id));

drop policy if exists automated_catalog_insert on public.automated_test_catalog;
create policy automated_catalog_insert on public.automated_test_catalog for insert
  with check (public.is_project_editor(project_id));

drop policy if exists automated_catalog_update on public.automated_test_catalog;
create policy automated_catalog_update on public.automated_test_catalog for update
  using (public.is_project_editor(project_id));

drop policy if exists automated_catalog_delete on public.automated_test_catalog;
create policy automated_catalog_delete on public.automated_test_catalog for delete
  using (public.is_project_admin(project_id));

-- =========================================================
-- PROJECT API TOKENS
-- (a validação do token em si acontece server-side com a service role key,
-- fora do RLS — estas policies só cobrem a gestão dos tokens pela UI)
-- =========================================================

alter table public.project_api_tokens enable row level security;

drop policy if exists project_api_tokens_select on public.project_api_tokens;
create policy project_api_tokens_select on public.project_api_tokens for select
  using (public.is_project_admin(project_id));

drop policy if exists project_api_tokens_insert on public.project_api_tokens;
create policy project_api_tokens_insert on public.project_api_tokens for insert
  with check (public.is_project_admin(project_id));

drop policy if exists project_api_tokens_delete on public.project_api_tokens;
create policy project_api_tokens_delete on public.project_api_tokens for delete
  using (public.is_project_admin(project_id));

-- =========================================================
-- STORAGE: evidências (leitura pública do bucket, escrita restrita a membros autenticados)
-- =========================================================

drop policy if exists "evidences_public_read" on storage.objects;
create policy "evidences_public_read" on storage.objects for select
  using (bucket_id = 'evidences');

drop policy if exists "evidences_authenticated_write" on storage.objects;
create policy "evidences_authenticated_write" on storage.objects for insert
  with check (bucket_id = 'evidences' and auth.uid() is not null);

drop policy if exists "evidences_authenticated_delete" on storage.objects;
create policy "evidences_authenticated_delete" on storage.objects for delete
  using (bucket_id = 'evidences' and auth.uid() is not null);
