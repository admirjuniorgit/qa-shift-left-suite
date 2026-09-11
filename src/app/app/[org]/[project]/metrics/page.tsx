import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import {
  getComponentCoverage,
  getDefectMetrics,
  getFlakyTests,
  getPassRateTrend,
} from "@/lib/data/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PassRateTrendChart } from "@/components/app/charts/pass-rate-trend-chart";
import { CoverageChart } from "@/components/app/charts/coverage-chart";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default async function MetricsPage({
  params,
}: {
  params: Promise<{ org: string; project: string }>;
}) {
  const { org: orgSlug, project: projectKey } = await params;
  const supabase = await createClient();
  const org = await getOrganizationBySlug(supabase, orgSlug);
  if (!org) notFound();
  const project = await getProjectByKey(supabase, org.id, projectKey);
  if (!project) notFound();

  const [coverage, defectMetrics, flakyTests, trend] = await Promise.all([
    getComponentCoverage(supabase, project.id),
    getDefectMetrics(supabase, project.id),
    getFlakyTests(supabase, project.id),
    getPassRateTrend(supabase, project.id),
  ]);

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Métricas de qualidade</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Defeitos abertos" value={defectMetrics?.open_defects ?? 0} />
        <StatCard label="Defeitos críticos" value={defectMetrics?.critical_count ?? 0} />
        <StatCard
          label="MTTR (horas)"
          value={defectMetrics?.mttr_hours !== null && defectMetrics?.mttr_hours !== undefined ? defectMetrics.mttr_hours : "—"}
        />
        <StatCard label="Testes flaky" value={flakyTests.length} />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tendência de pass rate</CardTitle>
          </CardHeader>
          <CardContent>
            <PassRateTrendChart data={trend.map((t) => ({ name: t.name, pass_rate_percent: t.pass_rate_percent }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cobertura por componente</CardTitle>
          </CardHeader>
          <CardContent>
            <CoverageChart data={coverage} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testes mais instáveis (flaky)</CardTitle>
        </CardHeader>
        <CardContent>
          {flakyTests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum teste flaky detectado. Importe relatórios de CI para alimentar essa métrica.
            </p>
          ) : (
            <ul className="divide-y">
              {flakyTests.map((t) => (
                <li key={t.automated_test_id} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    {t.suite ? `${t.suite} > ` : ""}
                    {t.name}
                  </span>
                  <span className="text-muted-foreground">
                    {t.failure_streak} falhas seguidas · score {t.flaky_score}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
