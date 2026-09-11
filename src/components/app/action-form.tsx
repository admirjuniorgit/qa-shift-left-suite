"use client";

import { useActionState, type ReactNode } from "react";
import type { ActionResult } from "@/lib/actions/auth";

export function ActionForm({
  action,
  className,
  children,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  className?: string;
  children: (state: ActionResult, pending: boolean) => ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className={className}>
      {children(state, pending)}
    </form>
  );
}
