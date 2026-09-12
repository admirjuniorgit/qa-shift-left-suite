import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { ToastProvider } from "@/components/ui/Toast";
import { Sidebar } from "@/components/Sidebar";
import { NAV_ITEMS } from "@/components/nav-items";
import { SettingsMenu } from "@/components/SettingsMenu";
import { OnboardingModal } from "@/components/OnboardingModal";
import { RefinementPage } from "@/features/refinement/components/RefinementPage";
import { QualityPracticesPage } from "@/features/quality-practices/components/QualityPracticesPage";
import { TestBuilderPage } from "@/features/test-builder/components/TestBuilderPage";

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>(NAV_ITEMS[0].id);
  const [qualityJumpTarget, setQualityJumpTarget] = useState<string | undefined>(undefined);

  function handleOpenQualityTemplate(templateId: string) {
    setQualityJumpTarget(templateId);
    setActiveTab("quality");
  }

  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab) ?? NAV_ITEMS[0];

  return (
    <div className="flex min-h-screen">
      <Sidebar activeId={activeTab} onChange={setActiveTab} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 md:px-8 dark:border-white/10">
          <div className="flex items-center gap-2 md:hidden">
            <span className="flex size-7 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Sparkles className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">QA Toolkit</span>
          </div>
          <h1 className="hidden text-base font-semibold tracking-tight md:block">{activeItem.label}</h1>
          <SettingsMenu />
        </header>

        <div className="border-b border-slate-200 px-4 py-2.5 md:hidden dark:border-white/10">
          <Tabs items={NAV_ITEMS} activeId={activeTab} onChange={setActiveTab} />
        </div>

        <OnboardingModal />

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8">
          {activeTab === "refinement" && <RefinementPage onOpenQualityTemplate={handleOpenQualityTemplate} />}
          {activeTab === "quality" && <QualityPracticesPage initialSelectedId={qualityJumpTarget} />}
          {activeTab === "test-builder" && <TestBuilderPage />}
        </main>
      </div>
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
