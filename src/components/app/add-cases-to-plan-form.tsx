"use client";

import { useState, useTransition } from "react";
import { addCasesToPlan } from "@/lib/actions/test-plans";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface AvailableCase {
  id: string;
  title: string;
}

export function AddCasesToPlanForm({
  testPlanId,
  revalidatePathTarget,
  availableCases,
}: {
  testPlanId: string;
  revalidatePathTarget: string;
  availableCases: AvailableCase[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  if (availableCases.length === 0) {
    return <p className="text-sm text-muted-foreground">Todos os casos do projeto já estão neste plano.</p>;
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit() {
    startTransition(async () => {
      await addCasesToPlan(testPlanId, revalidatePathTarget, Array.from(selected));
      setSelected(new Set());
    });
  }

  return (
    <div className="space-y-3 rounded-md border p-4">
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {availableCases.map((tc) => (
          <label key={tc.id} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={selected.has(tc.id)}
              onCheckedChange={() => toggle(tc.id)}
            />
            {tc.title}
          </label>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={selected.size === 0 || pending} size="sm">
        {pending ? "Adicionando..." : `Adicionar selecionados (${selected.size})`}
      </Button>
    </div>
  );
}
