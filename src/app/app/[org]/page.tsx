import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getOrganizationProjects } from "@/lib/data/access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewProjectDialog } from "@/components/app/new-project-dialog";

export default async function OrgPage({ params }: { params: Promise<{ org: string }> }) {
  const { org: orgSlug } = await params;
  const supabase = await createClient();
  const org = await getOrganizationBySlug(supabase, orgSlug);
  if (!org) notFound();

  const projects = await getOrganizationProjects(supabase, org.id);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projetos</h1>
        <NewProjectDialog organizationId={org.id} organizationSlug={org.slug} />
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum projeto ainda. Crie o primeiro para começar a cadastrar casos de teste.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/app/${org.slug}/${project.key}`}>
              <Card className="h-full transition hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.name}
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                      {project.key}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {project.description || "Sem descrição."}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
