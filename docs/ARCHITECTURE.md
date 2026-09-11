# Arquitetura

## Visão geral

```
                         ┌─────────────────────────────┐
                         │        Next.js app          │
                         │  (App Router, TS, Tailwind)  │
                         │                               │
  Browser  ─────────────▶│  Server Components / Actions │
                         │  Route Handlers (API)        │
                         └───────────────┬───────────────┘
                                         │
                     ┌───────────────────┼────────────────────┐
                     ▼                   ▼                    ▼
             ┌───────────────┐   ┌───────────────┐   ┌──────────────────┐
             │   Supabase     │   │   GitLab API   │   │  CI de qualquer  │
             │ Postgres/Auth/ │   │ (issues, MRs)  │   │  stack (Java,    │
             │ Storage + RLS  │   │  self-hosted   │   │  .NET, Python…)  │
             └───────────────┘   │  ou SaaS       │   └─────────┬────────┘
                                  └───────────────┘             │
                                                        POST /api/projects/:id/
                                                        test-runs/import
                                                        (JUnit XML / Playwright JSON)
```

A suíte é intencionalmente **agnóstica quanto à stack testada**: ela não roda
código do projeto do time, só fala com a API do GitLab e recebe relatórios de
teste em formatos padrão (JUnit XML, Playwright JSON). Qualquer pipeline de CI
— independente da linguagem — pode alimentar as métricas.

## Stack de implementação

- **Next.js 16 (App Router, TypeScript, Tailwind v4, shadcn/ui sobre Base UI)**
  para frontend e backend (Server Components, Server Actions, Route Handlers).
- **Supabase**: Postgres com Row Level Security multi-tenant, Auth
  (e-mail/senha) e Storage (bucket `evidences` para anexos de execução).
- **Render**: hospedagem do serviço Next.js (Web Service). Supabase Cloud
  hospeda banco/auth/storage.
- **Vitest** para testes unitários/integração (parsers, criptografia, slugs).
- **Playwright** para testes end-to-end do próprio painel (dogfooding).

## Modelo de dados

Hierarquia: `organizations` → `projects` → (`test_cases`, `test_plans`,
`test_runs`, `defects`, `automated_test_catalog`). Toda tabela de negócio
carrega `project_id` (direto ou via join) e a Row Level Security garante que
um usuário só acessa dados de organizações das quais é membro
(`organization_members`).

As métricas (cobertura por componente, pass rate, MTTR de defeitos, testes
flaky) são **views SQL** (`v_component_coverage`, `v_test_run_summary`,
`v_defect_metrics`, `v_flaky_tests`, `v_pass_rate_trend`) — elas herdam a RLS
das tabelas de origem automaticamente, então não há duplicação de lógica de
autorização.

Ver `supabase/migrations/` para o schema completo e comentado.

## Autenticação e autorização

- Autenticação de usuário: Supabase Auth (cookies via `@supabase/ssr`),
  sessão renovada no `proxy.ts` (middleware).
- Autorização: RLS baseada em `organization_members.role`
  (`owner`, `admin`, `qa_lead`, `qa`, `dev`, `viewer`). Funções `SECURITY
  DEFINER` (`is_org_member`, `is_project_editor`, `is_project_admin`, …)
  evitam recursão de policies entre tabelas relacionadas.
- Autenticação de sistema (CI externo): tokens de API por projeto
  (`project_api_tokens`), gerados na tela de configurações, usados apenas no
  endpoint de import de relatórios via `Authorization: Bearer`. O endpoint
  usa a **service role key** do Supabase (bypassa RLS) só depois de validar o
  hash do token contra o projeto correspondente.

## Integração com GitLab

- Cliente REST v4 mínimo (`src/lib/gitlab/client.ts`), com `baseUrl`
  configurável por projeto — suporta GitLab.com e instâncias self-hosted.
- O token de acesso é armazenado criptografado (AES-256-GCM) na coluna
  `projects.gitlab_token_encrypted` e só é decifrado em código server-only.
- Usos atuais: testar conexão, listar issues abertas (para vincular casos de
  teste), criar uma issue a partir de um defeito.

## Import de relatórios de teste

`POST /api/projects/:id/test-runs/import` aceita `multipart/form-data` com um
arquivo (`file`) em JUnit XML ou Playwright JSON, autenticado por token de
projeto. Ele:

1. Detecta o formato e faz o parse (`src/lib/parsers/`).
2. Cria um `test_run` (`triggered_by: 'ci_import'`) e os `test_run_results`
   correspondentes.
3. Atualiza o `automated_test_catalog` (status mais recente, sequência de
   falhas, heurística simples de flaky score).

Isso é o que permite a qualquer time — em qualquer stack — começar a ver
métricas reais sem esperar pelo runner de automação hospedado (roadmap).
