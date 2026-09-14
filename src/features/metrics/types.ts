export const METRIC_CATEGORIES = ["processo", "produto", "fluxoDeEntrega", "time"] as const;

export type MetricCategory = (typeof METRIC_CATEGORIES)[number];

export const METRIC_CATEGORY_LABELS: Record<MetricCategory, string> = {
  processo: "Processo de teste",
  produto: "Qualidade do produto",
  fluxoDeEntrega: "Fluxo de entrega",
  time: "Saúde do time",
};

export interface QualityMetric {
  id: string;
  name: string;
  category: MetricCategory;
  whatItMeasures: string;
  howToMeasure: string;
  tip: string;
  pitfall: string;
}
