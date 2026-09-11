import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { listTestCases } from "@/lib/data/test-cases";
import { LinkButton } from "@/components/app/link-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PriorityBadge, StatusBadge } from "@/components/app/badges";
import { Plus } from "lucide-react";

export default async function TestCasesPage({
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

  const testCases = await listTestCases(supabase, project.id);
  const base = `/app/${orgSlug}/${projectKey}`;

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Casos de teste</h1>
          <p className="text-sm text-muted-foreground">
            {testCases.length} caso{testCases.length === 1 ? "" : "s"} cadastrado
            {testCases.length === 1 ? "" : "s"}.
          </p>
        </div>
        <LinkButton href={`${base}/test-cases/new`}>
          <Plus className="mr-1 h-4 w-4" /> Novo caso
        </LinkButton>
      </div>

      {testCases.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum caso de teste ainda. Crie o primeiro para começar a montar seus planos de execução.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Componente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testCases.map((tc) => (
              <TableRow key={tc.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`${base}/test-cases/${tc.id}`} className="font-medium hover:underline">
                    {tc.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {tc.components?.name ?? "—"}
                </TableCell>
                <TableCell className="capitalize">{tc.type}</TableCell>
                <TableCell>
                  <PriorityBadge value={tc.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge value={tc.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
