import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { listDefects } from "@/lib/data/defects";
import { LinkButton } from "@/components/app/link-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PriorityBadge, StatusBadge } from "@/components/app/badges";
import { Plus } from "lucide-react";

export default async function DefectsPage({
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

  const defects = await listDefects(supabase, project.id);
  const base = `/app/${orgSlug}/${projectKey}`;

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Defeitos</h1>
        <LinkButton href={`${base}/defects/new`}>
          <Plus className="mr-1 h-4 w-4" /> Novo defeito
        </LinkButton>
      </div>

      {defects.length === 0 ? (
        <p className="text-muted-foreground">Nenhum defeito registrado ainda.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Severidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>GitLab</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defects.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <Link href={`${base}/defects/${d.id}`} className="font-medium hover:underline">
                    {d.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <PriorityBadge value={d.severity} />
                </TableCell>
                <TableCell>
                  <StatusBadge value={d.status} />
                </TableCell>
                <TableCell>
                  {d.gitlab_issue_url ? (
                    <a
                      href={d.gitlab_issue_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      Issue
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
