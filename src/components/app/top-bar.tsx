import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function TopBar({ orgName, orgSlug }: { orgName: string; orgSlug: string }) {
  return (
    <header className="flex items-center justify-between border-b bg-background px-6 py-3">
      <Link href={`/app/${orgSlug}`} className="flex items-center gap-2 font-semibold">
        <span className="rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
          QA
        </span>
        {orgName}
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">
            Sair
          </Button>
        </form>
      </div>
    </header>
  );
}
