import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBySlug } from "@/lib/data/access";
import { TopBar } from "@/components/app/top-bar";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ org: string }>;
}) {
  const { org: orgSlug } = await params;
  const supabase = await createClient();
  const org = await getOrganizationBySlug(supabase, orgSlug);

  if (!org) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar orgName={org.name} orgSlug={org.slug} />
      <main className="flex-1 bg-muted/10">{children}</main>
    </div>
  );
}
