import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast-context";

export function MarkdownExportPreview({ markdown }: { markdown: string }) {
  const notify = useToast();

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Exportar como Markdown</p>
        <Button
          size="sm"
          variant="secondary"
          onClick={async () => {
            await navigator.clipboard.writeText(markdown);
            notify("Markdown copiado.");
          }}
        >
          Copiar
        </Button>
      </div>
      <pre className="max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
        <code>{markdown}</code>
      </pre>
    </div>
  );
}
