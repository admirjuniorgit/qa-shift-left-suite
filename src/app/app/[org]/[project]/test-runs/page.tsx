import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { listTestRuns } from "@/lib/data/test-runs";
import { LinkButton } from "@/components/app/link-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/app/badges";
import { Plus } from "lucide-react";

export default async function TestRunsPage({
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

  const runs = await listTestRuns(supabase, project.id);
  const base = `/app/${orgSlug}/${projectKey}`;

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Execuções</h1>
        <LinkButton href={`${base}/test-runs/new`}>
          <Plus className="mr-1 h-4 w-4" /> Nova execução
        </LinkButton>
      </div>

      {runs.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma execução ainda.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Resultados</TableHead>
              <TableHead>Pass rate</TableHead>
              <TableHead>Iniciada em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow key={run.test_run_id}>
                <TableCell>
                  <Link href={`${base}/test-runs/${run.test_run_id}`} className="font-medium hover:underline">
                    {run.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge value={run.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {run.passed}/{run.total_results} passou
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {run.pass_rate_percent !== null ? `${run.pass_rate_percent}%` : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(run.started_at).toLocaleString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
