import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { getDefect } from "@/lib/data/defects";
import { PriorityBadge } from "@/components/app/badges";
import { DefectStatusSelect, CreateGitlabIssueButton } from "@/components/app/defect-actions";

export default async function DefectDetailPage({
  params,
}: {
  params: Promise<{ org: string; project: string; id: string }>;
}) {
  const { org: orgSlug, project: projectKey, id } = await params;
  const supabase = await createClient();
  const org = await getOrganizationBySlug(supabase, orgSlug);
  if (!org) notFound();
  const project = await getProjectByKey(supabase, org.id, projectKey);
  if (!project) notFound();

  const defect = await getDefect(supabase, id);
  if (!defect || defect.project_id !== project.id) notFound();

  const pathTarget = `/app/${orgSlug}/${projectKey}/defects/${id}`;

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{defect.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <PriorityBadge value={defect.severity} />
            <span className="text-sm text-muted-foreground">
              Criado em {new Date(defect.created_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
        <DefectStatusSelect defectId={id} status={defect.status} revalidatePathTarget={pathTarget} />
      </div>

      {defect.description && (
        <p className="mb-6 max-w-2xl whitespace-pre-wrap text-sm">{defect.description}</p>
      )}

      <div className="max-w-xl space-y-2">
        {defect.gitlab_issue_url ? (
          <a
            href={defect.gitlab_issue_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary underline underline-offset-2"
          >
            Ver issue no GitLab (#{defect.gitlab_issue_iid})
          </a>
        ) : (
          <CreateGitlabIssueButton
            defectId={id}
            revalidatePathTarget={pathTarget}
            alreadyLinked={Boolean(defect.gitlab_issue_url)}
          />
        )}
      </div>
    </div>
  );
}
