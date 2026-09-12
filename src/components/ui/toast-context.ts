import { createContext, useContext } from "react";

export type ToastTone = "success" | "error";

export const ToastContext = createContext<((message: string, tone?: ToastTone) => void) | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de um ToastProvider");
  return ctx;
}
