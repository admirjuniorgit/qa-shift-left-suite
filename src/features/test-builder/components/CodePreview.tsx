import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast-context";
import { downloadTextFile } from "@/lib/download";

export function CodePreview({ code, fileName }: { code: string; fileName: string }) {
  const notify = useToast();

  function handleDownload() {
    downloadTextFile(fileName, code, "text/typescript");
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
            <Copy className="size-3.5" />
            Copiar
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDownload}>
            <Download className="size-3.5" />
            Baixar .spec.ts
          </Button>
        </div>
      </div>
      <pre className="max-h-96 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
