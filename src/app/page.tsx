import { LinkButton, ExternalLinkButton } from "@/components/app/link-button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ClipboardCheck,
  GitBranch,
  LineChart,
  ShieldCheck,
  Workflow,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Casos de teste organizados",
    description:
      "Repositório de casos por componente, prioridade e tipo (manual ou automatizado), com histórico completo.",
  },
  {
    icon: Workflow,
    title: "Planos e execuções",
    description:
      "Monte planos por ciclo/sprint, execute passo a passo e registre evidências direto no resultado.",
  },
  {
    icon: GitBranch,
    title: "Integração com GitLab",
    description:
      "Vincule casos a issues, crie defeitos como issues automaticamente e suporte a instâncias self-hosted.",
  },
  {
    icon: Zap,
    title: "Agnóstica de stack",
    description:
      "Importe relatórios JUnit XML ou Playwright JSON de qualquer pipeline — Java, .NET, Python, JS, o que for.",
  },
  {
    icon: LineChart,
    title: "Métricas de qualidade",
    description:
      "Cobertura por componente, pass rate, MTTR de defeitos e ranking de testes flaky, em tempo real.",
  },
  {
    icon: ShieldCheck,
    title: "Shift-left de verdade",
    description:
      "Qualidade entra no refinamento e no planning, não só na validação final antes do deploy.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            QA Shift-Left Suite
          </span>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <LinkButton variant="ghost" href="/login">
              Entrar
            </LinkButton>
            <LinkButton href="/signup">Criar conta grátis</LinkButton>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Qualidade desde o refinamento,
            <br /> não só na validação final.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A QA Shift-Left Suite reúne casos de teste, execução, defeitos e
            métricas em um só lugar — integrada ao GitLab e agnóstica quanto à
            stack que o seu time testa.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <LinkButton size="lg" href="/signup">
              Começar agora
            </LinkButton>
            <ExternalLinkButton
              size="lg"
              variant="outline"
              href="https://github.com/admirjuniorgit/qa-shift-left-suite"
              target="_blank"
              rel="noreferrer"
            >
              Ver no GitHub
            </ExternalLinkButton>
          </div>
        </section>

        <section className="border-t bg-muted/20">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col gap-3">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>
          Projeto open source — construído como portfólio de engenharia de
          qualidade.
        </p>
        <p className="mt-1">
          por Admir Junior, Engenheiro de Testes de Software Pleno ·{" "}
          <a
            href="https://www.linkedin.com/in/admirjunior/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
}
