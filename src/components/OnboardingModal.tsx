import { useEffect, useState } from "react";
import { ClipboardList, FlaskConical, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const KEY = "qa-toolkit-onboarding-seen";

const FEATURES = [
  { icon: ClipboardList, title: "Refinamento", text: "sugere perguntas pra levantar numa história e acompanha o Definition of Ready." },
  { icon: ShieldCheck, title: "Boas práticas", text: "checklists de qualidade (DoD, code review, release...) editáveis e exportáveis." },
  { icon: FlaskConical, title: "Construtor de testes", text: "monta passos visualmente e gera código Playwright pronto." },
];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setOpen(true);
  }, []);

  function dismiss() {
    localStorage.setItem(KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <Card className="max-w-md space-y-5">
        <h2 className="text-lg font-semibold tracking-tight">Bem-vindo ao QA Toolkit</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Uma ferramenta pessoal e estática — sem servidor, sem login. Três coisas pra ajudar no seu dia a dia:
        </p>
        <ul className="space-y-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex gap-3 text-sm">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-600/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                <f.icon className="size-4" />
              </span>
              <span>
                <strong className="font-medium">{f.title}</strong> — {f.text}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500">
          Os dados ficam só neste navegador. Use o menu de configurações (ícone de engrenagem) pra exportar um backup
          de vez em quando.
        </p>
        <Button onClick={dismiss}>Entendi</Button>
      </Card>
    </div>
  );
}
