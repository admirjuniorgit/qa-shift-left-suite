import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserOrganizations } from "@/lib/data/access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AppIndexPage() {
  const supabase = await createClient();
  const orgs = await getUserOrganizations(supabase);

  if (orgs.length === 1) {
    redirect(`/app/${orgs[0].org.slug}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Suas organizações</h1>
      <div className="grid gap-4">
        {orgs.map(({ org, role }) => (
          <Link key={org.id} href={`/app/${org.slug}`}>
            <Card className="transition hover:border-primary">
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Seu papel: {role}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
