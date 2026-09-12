import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast-context";
import { downloadBackup, importBackup } from "@/lib/export-import";
import { SyncControls } from "@/components/SyncControls";

export function BackupControls() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notify = useToast();

  async function handleImportFile(file: File) {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const result = importBackup(json);
      if (result.ok) {
        notify("Backup importado. Recarregando...");
        setTimeout(() => window.location.reload(), 800);
      } else {
        notify(result.error, "error");
      }
    } catch {
      notify("Não foi possível ler o arquivo — verifique se é um JSON válido.", "error");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            downloadBackup();
            notify("Backup exportado.");
          }}
        >
          Exportar dados
        </Button>
        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
          Importar dados
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImportFile(file);
            e.target.value = "";
          }}
        />
      </div>
      <p className="max-w-xs text-right text-xs text-slate-400">
        Os dados ficam só neste navegador. Exporte um backup de vez em quando — trocar de navegador ou limpar dados do
        site apaga tudo.
      </p>
      <SyncControls />
    </div>
  );
}
