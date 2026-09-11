# QA Shift-Left Suite

Suíte de qualidade para times ágeis que trabalham com GitLab e Kanban: casos
de teste, planos, execuções, defeitos e métricas em um só lugar — pensada
para aplicar **shift-left** de verdade, com qualidade entrando desde o
refinamento e não só na validação final.

A ferramenta é **agnóstica quanto à stack testada pelo time**: a integração
acontece via API do GitLab e via relatórios de teste em formato padrão
(JUnit XML, Playwright JSON), então funciona para projetos em Java, .NET,
Python, JavaScript ou qualquer outra stack.

> Projeto pessoal, open source, construído como portfólio de engenharia de
> qualidade.

## Autor

**Admir Junior** — Engenheiro de Testes de Software Pleno, com 9 anos de
experiência em qualidade de software.

[LinkedIn](https://www.linkedin.com/in/admirjunior/)

## Funcionalidades (MVP 1)

- **Casos de teste**: repositório por componente, prioridade, tipo
  (manual/automatizado), tags e vínculo com issue do GitLab.
- **Planos de teste**: agrupe casos por ciclo/sprint.
- **Execuções**: rode um plano passo a passo, marque resultado, anexe
  evidências (upload direto no Supabase Storage).
- **Defeitos**: crie a partir de um resultado falho e gere a issue
  correspondente no GitLab com um clique.
- **Import agnóstico de stack**: endpoint de API com token por projeto para
  qualquer pipeline de CI enviar relatórios JUnit XML ou Playwright JSON.
- **Métricas de qualidade**: cobertura por componente, tendência de pass
  rate, MTTR de defeitos, ranking de testes flaky.
- **Multi-tenant**: organizações, projetos e papéis, com Row Level Security
  no Postgres.

Veja o [roadmap completo](docs/ROADMAP.md) (refinamento/shift-left no board,
runner de automação E2E hospedado, notificações, etc.) e a
[arquitetura](docs/ARCHITECTURE.md) em detalhe.

## Stack

Next.js 16 (App Router, TypeScript, Tailwind v4, shadcn/ui) · Supabase
(Postgres + Auth + Storage, com RLS) · Render (deploy) · Vitest · Playwright
· GitHub Actions.

## Rodando localmente

Pré-requisitos: Node 20+ e uma conta gratuita no
[Supabase](https://supabase.com).

```bash
git clone https://github.com/admirjuniorgit/qa-shift-left-suite.git
cd qa-shift-left-suite
npm install
cp .env.example .env.local
```

1. Crie um projeto no Supabase e copie `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API) para o
   `.env.local`. Copie também a `service_role` key para
   `SUPABASE_SERVICE_ROLE_KEY`.
2. No SQL Editor do Supabase, rode em ordem os arquivos de
   `supabase/migrations/` (`0001_init.sql`, `0002_rls.sql`, `0003_views.sql`).
3. Gere uma chave qualquer para `GITLAB_TOKEN_ENCRYPTION_KEY`
   (`openssl rand -base64 32`).
4. Suba o app:

```bash
npm run dev
```

Acesse `http://localhost:3000`, crie uma conta e siga o onboarding (cria sua
organização e primeiro projeto).

### Testes

```bash
npm run lint        # ESLint
npm run typecheck    # TypeScript
npm run test          # Vitest (unit/integration)
npm run test:e2e       # Playwright (E2E do próprio painel)
```

### Enviando relatórios de qualquer stack de CI

Gere um token em **Configurações do projeto → Tokens de API** e chame o
endpoint de import a partir do seu pipeline:

```bash
curl -X POST "https://sua-instancia.exemplo/api/projects/$PROJECT_ID/test-runs/import" \
  -H "Authorization: Bearer $QA_SUITE_TOKEN" \
  -F "file=@test-results.xml" \
  -F "runName=Pipeline $CI_PIPELINE_ID"
```

## Deploy

- **Supabase**: crie o projeto, rode as migrations (passo 2 acima), copie as
  chaves.
- **Render**: crie um Web Service apontando para este repositório
  (`npm install && npm run build` como build command, `npm run start` como
  start command), configure as variáveis de ambiente de `.env.example`.

## Licença

[MIT](LICENSE)
