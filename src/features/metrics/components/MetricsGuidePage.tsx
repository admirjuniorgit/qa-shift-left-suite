import { useState } from "react";
import { Gauge, Lightbulb, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { MarkdownExportPreview } from "@/components/ui/MarkdownExportPreview";
import { METRIC_CATEGORIES, METRIC_CATEGORY_LABELS, type MetricCategory } from "../types";
import { QUALITY_METRICS } from "../metrics-seed";
import { metricsToMarkdown } from "../markdown";

const ALL = "todas";

export function MetricsGuidePage() {
  const [category, setCategory] = useState<string>(ALL);

  const visible = category === ALL ? QUALITY_METRICS : QUALITY_METRICS.filter((m) => m.category === category);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Métricas de qualidade</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Um guia curado de métricas para levar ao time — o que cada uma mede, como medir, e cuidados para não virar
          uma métrica de vaidade.
        </p>
      </div>

      <Tabs
        items={[{ id: ALL, label: "Todas" }, ...METRIC_CATEGORIES.map((c) => ({ id: c, label: METRIC_CATEGORY_LABELS[c] }))]}
        activeId={category}
        onChange={setCategory}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((metric) => (
          <Card key={metric.id} className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{metric.name}</h3>
              <span className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:border-white/10 dark:text-slate-400">
                <Gauge className="size-3" />
                {METRIC_CATEGORY_LABELS[metric.category as MetricCategory]}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">{metric.whatItMeasures}</p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">Como medir: </span>
              {metric.howToMeasure}
            </p>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <p className="mb-0.5 flex items-center gap-1.5 font-medium">
                <Lightbulb className="size-3.5" />
                Dica
              </p>
              {metric.tip}
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              <p className="mb-0.5 flex items-center gap-1.5 font-medium">
                <TriangleAlert className="size-3.5" />
                Cuidado
              </p>
              {metric.pitfall}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <MarkdownExportPreview markdown={metricsToMarkdown(visible)} />
      </Card>
    </div>
  );
}
