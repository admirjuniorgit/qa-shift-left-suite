# Arquitetura

## Visão geral

SPA estática (Vite + React + TypeScript), sem backend. Tudo roda no
navegador do usuário:

```
Navegador
  ├── React (UI: 3 abas — Refinamento, Boas práticas, Construtor de testes)
  ├── localStorage (persistência, namespaced sob "qa-toolkit:v1:*")
  └── módulo de codegen (Step[] -> arquivo .spec.ts do Playwright, string pura)
```

Não há chamadas de rede, API, autenticação ou serviço externo em tempo de
execução. O build (`vite build`) gera arquivos estáticos publicados
diretamente no Netlify (`netlify.toml` define `command`/`publish`).

## Módulos (`src/features/*`)

Cada feature é isolada em `types.ts` (modelos + schemas `zod`),
`storage.ts` (persistência namespaced) e `components/`:

- **`refinement/`**: banco de perguntas estático (`question-bank.ts`,
  filtrado pelas tags da história em `filterQuestions`), sessões de
  refinamento com checklist de Definition of Ready, salvas em
  `localStorage` e listadas em histórico.
- **`quality-practices/`**: templates de checklist (seed em
  `templates-seed.ts`: DoD, code review, relato de bug, estratégia de teste,
  release), editáveis e persistidos, exportáveis para Markdown
  (`markdown.ts`).
- **`test-builder/`**: modelo `Step`/`Locator` (união discriminada,
  `types.ts`) e `codegen.ts` — função pura que converte uma lista de passos
  em um arquivo `.spec.ts` do Playwright (`page.getByRole/getByText/
  getByLabel/getByTestId/locator(...)`), com escaping seguro de strings via
  `JSON.stringify`.

## Persistência e backup

`src/lib/storage.ts` expõe `getItem`/`setItem` genéricos sobre
`localStorage`, com fallback seguro em caso de dado corrompido ou cota
excedida. `src/lib/export-import.ts` agrega os dados de todas as features em
um único JSON versionado (`{ version, exportedAt, data }`), validado com
`zod` na importação antes de sobrescrever qualquer coisa — um backup
inválido não corrompe o estado atual (a validação roda inteira antes de
qualquer `setItem`).

**Limitação conhecida**: os dados são por navegador/dispositivo, sem
sincronização entre eles. A mitigação é o próprio export/import manual
(botões no cabeçalho do app).

## Stack de implementação

- **Vite + React 19 + TypeScript** — build estático puro, sem SSR/rotas de
  servidor. Três features cabem como abas dentro de uma única página
  (`App.tsx`), sem necessidade de roteador.
- **Tailwind v4** para estilo, com uns poucos primitivos locais em
  `src/components/ui/` (Button, Card, Tabs, Toast) — sem biblioteca de
  componentes externa.
- **Vitest + Testing Library** para testes unitários — foco nas funções
  puras de maior risco (`codegen.ts`, `question-bank.ts`, `markdown.ts`,
  `storage.ts`, `export-import.ts`).
- **Playwright** para testes end-to-end (um smoke por feature + o fluxo de
  backup/restauração).
- **Netlify**: build estático (`npm run build` → `dist/`), sem runtime de
  servidor.

## Por que não há mais Next.js/Supabase

A versão anterior deste projeto (MVP1) era uma suíte de test management
multi-tenant com Next.js + Supabase (Postgres/Auth/Storage com RLS,
integração com a API do GitLab, import de relatórios JUnit/Playwright).
Ela foi descontinuada e substituída por esta ferramenta estática porque o
uso real do autor é pessoal e diário, e não justifica manter um
backend/banco de dados no ar. Nada do código do MVP1 foi reaproveitado —
o histórico do git preserva essa implementação anterior para referência.
