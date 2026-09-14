# QA Shift-Left Suite

[![CI](https://github.com/admirjuniorgit/qa-shift-left-suite/actions/workflows/ci.yml/badge.svg)](https://github.com/admirjuniorgit/qa-shift-left-suite/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Ferramenta pessoal e **100% estática** (sem backend, sem banco de dados, sem
login) para o dia a dia de quem trabalha com qualidade de software:

- **Início**: dashboard que já direciona a próxima ação — atalhos diretos
  pras features abaixo, sessões de refinamento com Definition of Ready
  pendente prontas pra continuar de onde parou, e uma métrica de qualidade
  em destaque por dia.
- **Refinamento**: banco de perguntas prontas para levantar durante o
  refinamento e o planning de tarefas (capacidade, riscos, sequenciamento,
  alinhamento do time...), filtrável por fase e pelas características da
  história, com checklist de Definition of Ready, histórico de sessões (com
  busca e duplicação), export da sessão inteira em Markdown e checklists de
  qualidade sugeridos automaticamente conforme as tags da história.
- **Boas práticas de qualidade**: biblioteca de checklists editáveis
  (Definition of Done, code review, relato de bug, estratégia de teste,
  release), exportáveis como Markdown ou importáveis colando um Markdown
  pronto.
- **Métricas de qualidade**: guia curado de métricas pra levar ao time
  (pass rate, defect escape rate, MTTR, lead time, change failure rate...),
  filtrável por categoria, com o que cada uma mede, como medir, uma dica
  prática e um cuidado pra não virar métrica de vaidade — exportável como
  Markdown.
- **Construtor de testes sem código**: monte um fluxo em passos simples
  (clicar, preencher, passar o mouse, pressionar tecla, esperar elemento
  aparecer, verificar visibilidade/texto/quantidade...) e gere o código
  Playwright correspondente — com `test.step()` por passo, duplicar/
  reordenar por arrastar e baixar todos os fluxos de uma vez.

Também tem tema claro/escuro/sistema, funciona como PWA instalável, e um
sincronizador opcional entre dispositivos via Gist privado da sua própria
conta do GitHub (sem nenhum servidor nosso no meio).

> Projeto pessoal, open source, construído como portfólio de engenharia de
> qualidade.

## Autor

**Admir Junior** — Engenheiro de Testes de Software Pleno, com 9 anos de
experiência em qualidade de software.

[LinkedIn](https://www.linkedin.com/in/admirjunior/)

## Por que estático?

Sem servidor, sem serviço para manter no ar e sem custo — abre a página e
usa. O preço disso é que os dados ficam salvos só no navegador atual
(`localStorage`): trocar de navegador/dispositivo ou limpar dados do site
apaga tudo. Por isso a ferramenta tem um botão de **Exportar/Importar dados**
(um arquivo `.json` de backup) — exporte de vez em quando.

Veja o [roadmap](docs/ROADMAP.md) e a [arquitetura](docs/ARCHITECTURE.md) em
detalhe.

## Stack

Vite + React 19 + TypeScript + Tailwind v4 · Vitest + Testing Library ·
Playwright · GitHub Actions · Netlify (deploy estático).

## Rodando localmente

```bash
git clone https://github.com/admirjuniorgit/qa-shift-left-suite.git
cd qa-shift-left-suite
npm install
npm run dev
```

Acesse `http://localhost:5173`. Não precisa de conta, banco de dados ou
variável de ambiente — tudo roda no navegador.

### Testes

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run test        # Vitest (unitários)
npm run test:e2e    # Playwright (fluxos das 5 features + backup/restauração)
```

## Deploy

**Netlify**: Add new site → Import an existing project → conecte este
repositório. O `netlify.toml` do repo já define o build (`npm run build`,
publica `dist/`) e o redirect de SPA — não precisa configurar nada manualmente
no painel.

## Licença

[MIT](LICENSE)
