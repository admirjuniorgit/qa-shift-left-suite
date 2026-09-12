import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { ToastProvider } from "@/components/ui/Toast";
import { BackupControls } from "@/components/BackupControls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OnboardingModal } from "@/components/OnboardingModal";
import { RefinementPage } from "@/features/refinement/components/RefinementPage";
import { QualityPracticesPage } from "@/features/quality-practices/components/QualityPracticesPage";
import { TestBuilderPage } from "@/features/test-builder/components/TestBuilderPage";

const TABS = [
  { id: "refinement", label: "Refinamento" },
  { id: "quality", label: "Boas práticas" },
  { id: "test-builder", label: "Construtor de testes" },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id);
  const [qualityJumpTarget, setQualityJumpTarget] = useState<string | undefined>(undefined);

  function handleOpenQualityTemplate(templateId: string) {
    setQualityJumpTarget(templateId);
    setActiveTab("quality");
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">QA Toolkit</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ferramenta pessoal e estática: refinamento, boas práticas de qualidade e construtor de testes Playwright.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ThemeToggle />
          <BackupControls />
        </div>
      </header>
      <OnboardingModal />

      <Tabs items={TABS} activeId={activeTab} onChange={setActiveTab} />

      <main className="py-6">
        {activeTab === "refinement" && <RefinementPage onOpenQualityTemplate={handleOpenQualityTemplate} />}
        {activeTab === "quality" && <QualityPracticesPage initialSelectedId={qualityJumpTarget} />}
        {activeTab === "test-builder" && <TestBuilderPage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
