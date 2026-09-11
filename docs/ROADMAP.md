# Roadmap

## MVP 1 — Núcleo de qualidade (entregue)

- [x] Multi-tenant (organizações, projetos, papéis)
- [x] Repositório de casos de teste (manual/automatizado, componente,
      prioridade, tags, vínculo com issue do GitLab)
- [x] Planos de teste (agrupamento de casos por ciclo/sprint)
- [x] Execuções manuais (marcar passou/falhou/bloqueado/pulado/flaky, notas,
      evidências)
- [x] Defeitos, com criação de issue no GitLab a partir de um resultado
- [x] Import de relatórios JUnit XML / Playwright JSON via API com token por
      projeto (agnóstico de stack)
- [x] Dashboard de métricas: cobertura por componente, tendência de pass
      rate, MTTR de defeitos, testes mais flaky
- [x] Testes automatizados do próprio projeto (Vitest + Playwright) e CI

## MVP 2 — Refinamento & shift-left no board

- [ ] Importar issues/itens do board do GitLab (com filtros por label/milestone)
- [ ] Checklist de Definition of Ready por item, com histórico de quem
      preencheu
- [ ] Geração assistida de casos de teste a partir de critérios de aceite
- [ ] Estimativa colaborativa (planning poker simplificado) vinculada ao item
      do GitLab
- [ ] Comentários e menções nos itens, sincronizados com o GitLab

## MVP 3 — Runner de automação E2E hospedado

- [ ] Serviço separado (`apps/runner`, monorepo) rodando Playwright em
      container no Render
- [ ] Disparo via webhook do GitLab CI ou agendado
- [ ] Trace viewer embutido, histórico de execuções por teste
- [ ] Detecção de flaky test com re-execução automática e sinalização
- [ ] Suporte a Puppeteer como motor alternativo por suíte

## MVP 4 — Colaboração e insights avançados

- [ ] Notificações (Slack/Teams) para defeitos críticos e quedas de pass rate
- [ ] Relatórios executivos exportáveis (PDF/link compartilhável)
- [ ] Sugestão de casos de teste por IA a partir de descrição de história
- [ ] Papéis e permissões mais granulares por projeto (hoje herdados da
      organização)
- [ ] Convite de membros por e-mail com fluxo de aceite completo

## Fora de escopo (por enquanto)

- Execução de testes dentro da própria suíte para o código do time cliente —
  a suíte orquestra e recebe resultados, mas não hospeda o código testado.
- Suporte a ferramentas de gestão além do GitLab (Jira, Azure DevOps) — pode
  entrar no roadmap se houver demanda real, mantendo a mesma filosofia de
  integração via API sem acoplamento à stack do time.
