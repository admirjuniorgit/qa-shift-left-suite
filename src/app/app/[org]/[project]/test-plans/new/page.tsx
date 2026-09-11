import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug, getProjectByKey } from "@/lib/data/access";
import { createTestPlan } from "@/lib/actions/test-plans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ActionForm } from "@/components/app/action-form";

export default async function NewTestPlanPage({
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

  const action = createTestPlan.bind(null, { projectId: project.id, orgSlug, projectKey });

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Novo plano de teste</h1>
      <ActionForm action={action} className="max-w-xl space-y-4">
        {(state, pending) => (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" required placeholder="Ex: Regressão Sprint 12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycleName">Ciclo/Sprint</Label>
              <Input id="cycleName" name="cycleName" placeholder="Ex: Sprint 12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" rows={3} />
            </div>
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            <Button type="submit" disabled={pending}>
              {pending ? "Criando..." : "Criar plano"}
            </Button>
          </>
        )}
      </ActionForm>
    </div>
  );
}
