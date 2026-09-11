import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { listTestPlans } from "@/lib/data/test-plans";
import { LinkButton } from "@/components/app/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default async function TestPlansPage({
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

  const plans = await listTestPlans(supabase, project.id);
  const base = `/app/${orgSlug}/${projectKey}`;

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Planos de teste</h1>
        <LinkButton href={`${base}/test-plans/new`}>
          <Plus className="mr-1 h-4 w-4" /> Novo plano
        </LinkButton>
      </div>

      {plans.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum plano ainda. Agrupe casos de teste por ciclo/sprint para organizar a execução.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Link key={plan.id} href={`${base}/test-plans/${plan.id}`}>
              <Card className="h-full transition hover:border-primary">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {plan.cycle_name ? `Ciclo: ${plan.cycle_name}` : "Sem ciclo definido"}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
