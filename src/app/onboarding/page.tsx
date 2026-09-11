"use client";

import { useActionState } from "react";
import { completeOnboarding } from "@/lib/actions/organizations";
import type { ActionResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ActionResult = {};

export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState(completeOnboarding, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Vamos configurar seu espaço</CardTitle>
          <CardDescription>
            Crie sua organização e o primeiro projeto para começar a cadastrar
            casos de teste.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organização</Label>
              <Input id="orgName" name="orgName" placeholder="Ex: Minha Squad" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectName">Primeiro projeto</Label>
              <Input id="projectName" name="projectName" placeholder="Ex: App Checkout" required />
            </div>
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Criando..." : "Criar e continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
