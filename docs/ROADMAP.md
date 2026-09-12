# Roadmap

## MVP1 — Suíte de test management multi-tenant (substituído)

Versão anterior: Next.js + Supabase, multi-tenant, com casos de teste,
planos, execuções, defeitos com integração GitLab, import de relatórios
JUnit/Playwright e dashboard de métricas. Completo, testado e2e e com CI
verde, mas descontinuado em favor da ferramenta estática atual — ver
[ARCHITECTURE.md](ARCHITECTURE.md#por-que-não-há-mais-nextjssupabase). O
código continua disponível no histórico do git.

## v1 — Ferramenta estática de uso diário (entregue)

- [x] Refinamento: banco de perguntas filtrável por características da
      história, checklist de Definition of Ready, histórico de sessões
- [x] Boas práticas: biblioteca de checklists (DoD, code review, relato de
      bug, estratégia de teste, release), editáveis e exportáveis em
      Markdown
- [x] Construtor de testes sem código: montagem visual de passos, geração
      de código Playwright (`.spec.ts`), cópia/download
- [x] Persistência local (localStorage) com export/import de backup em JSON
- [x] Testes unitários (Vitest) das funções puras de maior risco + e2e
      (Playwright) por feature, CI no GitHub Actions, deploy estático no
      Netlify

## v2 — Ideias futuras

- [ ] Construtor de testes: mais ações (hover, pressionar tecla, esperar
      por seletor/estado, `expect` de contagem de elementos)
- [ ] Banco de perguntas de refinamento maior/customizável pelo usuário
      (adicionar categorias e tags próprias)
- [ ] Mais templates de checklist prontos (ex: acessibilidade, segurança)
- [ ] Exportar uma sessão de refinamento inteira como Markdown (perguntas
      respondidas + notas + status do DoR), não só os checklists de
      qualidade
- [ ] Modo "trazer sua própria chave de IA" (client-side, sem proxy/backend)
      para sugerir critérios de aceite ou casos de teste a partir de uma
      descrição de história — opcional, sem armazenar a chave em lugar
      nenhum além do navegador do próprio usuário

## Fora de escopo

- Qualquer backend, banco de dados ou serviço hospedado — a premissa do
  projeto é funcionar só como página estática.
- Gravação real de cliques em sites de terceiros — inviável a partir de uma
  página estática por restrição de segurança do navegador (cross-origin);
  por isso o construtor de testes é um montador visual de passos, não um
  gravador.
- Multi-tenant, autenticação ou colaboração em tempo real — a ferramenta é
  para uso pessoal de uma única pessoa.
