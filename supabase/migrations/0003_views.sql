-- QA Shift-Left Suite — views de métricas
-- Views são SECURITY INVOKER por padrão: herdam a RLS das tabelas de origem,
-- então cada usuário só enxerga métricas dos projetos/organizações a que pertence.

-- Cobertura de testes por componente (manual x automatizado)
create or replace view public.v_component_coverage as
select
  c.project_id,
  c.id as component_id,
  c.name as component_name,
  count(tc.id)::int as total_cases,
  count(tc.id) filter (where tc.type = 'automated')::int as automated_cases,
  count(tc.id) filter (where tc.type = 'manual')::int as manual_cases,
  case when count(tc.id) = 0 then 0
    else round(100.0 * count(tc.id) filter (where tc.type = 'automated') / count(tc.id))::int
  end as automation_percent
from public.components c
left join public.test_cases tc on tc.component_id = c.id and tc.status = 'active'
group by c.project_id, c.id, c.name;

-- Resumo de cada execução (test run): totais por status e taxa de aprovação
create or replace view public.v_test_run_summary as
select
  r.id as test_run_id,
  r.project_id,
  r.name,
  r.status,
  r.started_at,
  r.finished_at,
  count(res.id)::int as total_results,
  count(res.id) filter (where res.status = 'passed')::int as passed,
  count(res.id) filter (where res.status = 'failed')::int as failed,
  count(res.id) filter (where res.status = 'blocked')::int as blocked,
  count(res.id) filter (where res.status = 'skipped')::int as skipped,
  count(res.id) filter (where res.status = 'flaky')::int as flaky,
  case when count(res.id) filter (where res.status in ('passed','failed','blocked','flaky')) = 0 then null
    else round(100.0 * count(res.id) filter (where res.status = 'passed')
      / count(res.id) filter (where res.status in ('passed','failed','blocked','flaky')))::int
  end as pass_rate_percent
from public.test_runs r
left join public.test_run_results res on res.test_run_id = r.id
group by r.id, r.project_id, r.name, r.status, r.started_at, r.finished_at;

-- Métricas de defeitos por projeto: contagem por severidade/status e MTTR (em horas)
create or replace view public.v_defect_metrics as
select
  project_id,
  count(*)::int as total_defects,
  count(*) filter (where status in ('open', 'in_progress'))::int as open_defects,
  count(*) filter (where severity = 'critical')::int as critical_count,
  count(*) filter (where severity = 'high')::int as high_count,
  count(*) filter (where severity = 'medium')::int as medium_count,
  count(*) filter (where severity = 'low')::int as low_count,
  round(
    avg(extract(epoch from (resolved_at - created_at)) / 3600.0)
      filter (where resolved_at is not null)
  )::int as mttr_hours
from public.defects
group by project_id;

-- Testes automatizados mais instáveis (flaky) ou com falhas consecutivas
create or replace view public.v_flaky_tests as
select
  project_id,
  id as automated_test_id,
  name,
  suite,
  framework,
  last_status,
  failure_streak,
  flaky_score,
  last_run_at
from public.automated_test_catalog
where flaky_score > 0 or failure_streak > 0
order by flaky_score desc, failure_streak desc;

-- Tendência de pass rate: últimas execuções concluídas por projeto (para gráfico de linha)
create or replace view public.v_pass_rate_trend as
select
  r.project_id,
  r.id as test_run_id,
  r.name,
  r.finished_at,
  s.pass_rate_percent,
  s.total_results
from public.test_runs r
join public.v_test_run_summary s on s.test_run_id = r.id
where r.status = 'completed'
order by r.finished_at desc;
