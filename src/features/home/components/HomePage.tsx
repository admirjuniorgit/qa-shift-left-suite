import { useEffect, useState } from "react";
import { ArrowRight, ClipboardList, FlaskConical, Gauge, Lightbulb, ListTodo, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { loadSessions } from "@/features/refinement/storage";
import type { RefinementSession } from "@/features/refinement/types";
import { QUALITY_METRICS } from "@/features/metrics/metrics-seed";

function dorProgress(session: RefinementSession): { done: number; total: number } {
  return { done: session.dorChecklist.filter((i) => i.checked).length, total: session.dorChecklist.length };
}

function tipOfTheDay() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
  );
  return QUALITY_METRICS[dayOfYear % QUALITY_METRICS.length];
}

const QUICK_ACTIONS = [
  {
    icon: ListTodo,
    title: "Minhas tarefas",
    text: "Anote e acompanhe o que você precisa executar.",
    action: "tasks" as const,
  },
  {
    icon: ClipboardList,
    title: "Nova sessão de refinamento",
    text: "Levante perguntas de escopo, critérios de aceite e riscos antes de codar.",
    action: "refinement" as const,
  },
  {
    icon: Sparkles,
    title: "Nova sessão de planning",
    text: "Capacidade, sequenciamento e riscos antes de comprometer a sprint.",
    action: "planning" as const,
  },
  {
    icon: ShieldCheck,
    title: "Boas práticas de qualidade",
    text: "DoD, code review, bug report, estratégia de teste e release.",
    action: "quality" as const,
  },
  {
    icon: Gauge,
    title: "Métricas de qualidade",
    text: "O que medir e como levar isso pro time sem virar vaidade.",
    action: "metrics" as const,
  },
  {
    icon: FlaskConical,
    title: "Construtor de testes",
    text: "Monte um fluxo e gere o código Playwright pronto.",
    action: "test-builder" as const,
  },
];

export type HomeAction = (typeof QUICK_ACTIONS)[number]["action"];

export function HomePage({
  onQuickAction,
  onContinueSession,
}: {
  onQuickAction: (action: HomeAction) => void;
  onContinueSession: (sessionId: string) => void;
}) {
  const [pendingSessions, setPendingSessions] = useState<RefinementSession[]>([]);

  useEffect(() => {
    const sessions = loadSessions();
    const pending = sessions
      .filter((s) => {
        const { done, total } = dorProgress(s);
        return total > 0 && done < total;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setPendingSessions(pending);
  }, []);

  const tip = tipOfTheDay();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold">O que você precisa fazer agora?</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Atalhos diretos pro que você mais faz no dia a dia de qualidade.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {QUICK_ACTIONS.map((qa) => (
          <Card key={qa.title} className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-600/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
              <qa.icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{qa.title}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{qa.text}</p>
              <Button size="sm" variant="ghost" className="mt-2 -ml-2.5" onClick={() => onQuickAction(qa.action)}>
                Ir <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {pendingSessions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Sessões com Definition of Ready pendente
          </h3>
          <div className="space-y-2">
            {pendingSessions.map((s) => {
              const { done, total } = dorProgress(s);
              return (
                <Card key={s.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {s.storyTitle || "(sem título)"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {done}/{total} itens prontos
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => onContinueSession(s.id)}>
                    Continuar
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Card className="space-y-1.5">
        <p className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Lightbulb className="size-4 text-amber-500" />
          Métrica do dia: {tip.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{tip.tip}</p>
        <Button size="sm" variant="ghost" className="-ml-2.5 mt-1" onClick={() => onQuickAction("metrics")}>
          Ver todas as métricas <ArrowRight className="size-3.5" />
        </Button>
      </Card>
    </div>
  );
}
