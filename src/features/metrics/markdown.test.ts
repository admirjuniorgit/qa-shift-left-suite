import { describe, expect, it } from "vitest";
import { metricsToMarkdown } from "./markdown";
import type { QualityMetric } from "./types";

const metrics: QualityMetric[] = [
  {
    id: "m1",
    name: "Pass rate",
    category: "processo",
    whatItMeasures: "% de testes que passaram",
    howToMeasure: "passaram ÷ executados",
    tip: "Acompanhe a tendência",
    pitfall: "Não diz nada sobre cobertura",
  },
  {
    id: "m2",
    name: "Lead time for changes",
    category: "fluxoDeEntrega",
    whatItMeasures: "Tempo entre commit e produção",
    howToMeasure: "deploy - commit",
    tip: "Métrica DORA",
    pitfall: "Acompanhe junto do change failure rate",
  },
];

describe("metricsToMarkdown", () => {
  it("agrupa métricas por categoria, na ordem das categorias, com seção O que mede/Como medir/Dica/Cuidado", () => {
    const md = metricsToMarkdown(metrics);

    expect(md).toContain("# Guia de métricas de qualidade");
    expect(md).toContain("## Processo de teste");
    expect(md).toContain("### Pass rate");
    expect(md).toContain("- **O que mede:** % de testes que passaram");
    expect(md).toContain("- **Como medir:** passaram ÷ executados");
    expect(md).toContain("- **Dica:** Acompanhe a tendência");
    expect(md).toContain("- **Cuidado:** Não diz nada sobre cobertura");
    expect(md).toContain("## Fluxo de entrega");
    expect(md).toContain("### Lead time for changes");
    expect(md.indexOf("## Processo de teste")).toBeLessThan(md.indexOf("## Fluxo de entrega"));
  });

  it("omite categorias sem nenhuma métrica", () => {
    const md = metricsToMarkdown(metrics);
    expect(md).not.toContain("## Qualidade do produto");
    expect(md).not.toContain("## Saúde do time");
  });

  it("lida com lista vazia", () => {
    const md = metricsToMarkdown([]);
    expect(md).toBe("# Guia de métricas de qualidade\n");
  });
});
