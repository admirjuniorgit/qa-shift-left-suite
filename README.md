# QA Shift-Left Suite

[![CI](https://github.com/admirjuniorgit/qa-shift-left-suite/actions/workflows/ci.yml/badge.svg)](https://github.com/admirjuniorgit/qa-shift-left-suite/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Ferramenta pessoal e **100% estática** (sem backend, sem banco de dados, sem
login) para o dia a dia de quem trabalha com qualidade de software:

- **Refinamento**: banco de perguntas para levantar durante o refinamento de
  tarefas, filtrável pelas características da história, com checklist de
  Definition of Ready e histórico de sessões.
- **Boas práticas de qualidade**: biblioteca de checklists editáveis
  (Definition of Done, code review, relato de bug, estratégia de teste,
  release), exportáveis como Markdown para colar no board/wiki do time.
- **Construtor de testes sem código**: monte um fluxo em passos simples
  (clicar em X, preencher Y, verificar texto Z) e gere o código Playwright
  correspondente, pronto para colar no repositório de testes do seu time.

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
npm run test:e2e    # Playwright (fluxos das 3 features + backup/restauração)
```

## Deploy

**Netlify**: Add new site → Import an existing project → conecte este
repositório. O `netlify.toml` do repo já define o build (`npm run build`,
publica `dist/`) e o redirect de SPA — não precisa configurar nada manualmente
no painel.

## Licença

[MIT](LICENSE)
