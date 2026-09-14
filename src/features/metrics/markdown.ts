import { METRIC_CATEGORIES, METRIC_CATEGORY_LABELS, type QualityMetric } from "./types";

export function metricsToMarkdown(metrics: QualityMetric[]): string {
  const lines = ["# Guia de métricas de qualidade", ""];

  for (const category of METRIC_CATEGORIES) {
    const items = metrics.filter((m) => m.category === category);
    if (items.length === 0) continue;

    lines.push(`## ${METRIC_CATEGORY_LABELS[category]}`, "");
    for (const m of items) {
      lines.push(`### ${m.name}`, "");
      lines.push(`- **O que mede:** ${m.whatItMeasures}`);
      lines.push(`- **Como medir:** ${m.howToMeasure}`);
      lines.push(`- **Dica:** ${m.tip}`);
      lines.push(`- **Cuidado:** ${m.pitfall}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}
