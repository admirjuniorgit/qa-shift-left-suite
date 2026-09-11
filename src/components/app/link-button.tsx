import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type LinkButtonProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { className?: string };

// Link estilizado como botão, mas mantendo semântica e role="link" reais —
// o componente Button do Base UI força role="button" quando usado com
// `render`, o que quebra a acessibilidade de um CTA que apenas navega.
export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

type ExternalLinkButtonProps = ComponentProps<"a"> & VariantProps<typeof buttonVariants>;

export function ExternalLinkButton({ variant, size, className, ...props }: ExternalLinkButtonProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
