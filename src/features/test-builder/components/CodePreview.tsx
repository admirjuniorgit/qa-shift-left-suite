import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast-context";

export function CodePreview({ code, fileName }: { code: string; fileName: string }) {
  const notify = useToast();

  function handleDownload() {
    const blob = new Blob([code], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Código Playwright gerado</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(code);
              notify("Código copiado.");
            }}
          >
            Copiar
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDownload}>
            Baixar .spec.ts
          </Button>
        </div>
      </div>
      <pre className="max-h-96 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
