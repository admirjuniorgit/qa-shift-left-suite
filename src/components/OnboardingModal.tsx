import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const KEY = "qa-toolkit-onboarding-seen";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Bem-vindo ao QA Toolkit</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Uma ferramenta pessoal e estática — sem servidor, sem login. Três coisas pra ajudar no seu dia a dia:
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>Refinamento</strong> — sugere perguntas pra levantar numa história e acompanha o Definition of
            Ready.
          </li>
          <li>
            <strong>Boas práticas</strong> — checklists de qualidade (DoD, code review, release...) editáveis e
            exportáveis.
          </li>
          <li>
            <strong>Construtor de testes</strong> — monta passos visualmente e gera código Playwright pronto.
          </li>
        </ul>
        <p className="text-xs text-slate-500">
          Os dados ficam só neste navegador. Use o botão "Exportar dados" no topo de vez em quando pra não perder
          nada.
        </p>
        <Button onClick={dismiss}>Entendi</Button>
      </Card>
    </div>
  );
}
