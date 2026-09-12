import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/field-styles";
import { useToast } from "@/components/ui/toast-context";
import { buildBackup, importBackup } from "@/lib/export-import";
import { getSyncGistId, getSyncToken, pullBackupFromGist, pushBackupToGist, setSyncGistId, setSyncToken } from "@/lib/gist-sync";

export function SyncControls() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(getSyncToken());
  const [gistId, setGistId] = useState(getSyncGistId());
  const [busy, setBusy] = useState(false);
  const notify = useToast();

  function handleTokenChange(value: string) {
    setToken(value);
    setSyncToken(value);
  }

  function handleForgetGist() {
    setGistId("");
    setSyncGistId("");
  }

  async function handlePush() {
    if (!token) {
      notify("Cole um token do GitHub primeiro.", "error");
      return;
    }
    setBusy(true);
    try {
      const backup = buildBackup();
      const newGistId = await pushBackupToGist(token, gistId, JSON.stringify(backup, null, 2));
      setGistId(newGistId);
      setSyncGistId(newGistId);
      notify("Backup enviado para o Gist.");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Falha ao enviar backup.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handlePull() {
    if (!token || !gistId) {
      notify("Informe o token e envie um backup ao menos uma vez antes de baixar.", "error");
      return;
    }
    setBusy(true);
    try {
      const content = await pullBackupFromGist(token, gistId);
      const result = importBackup(JSON.parse(content));
      if (result.ok) {
        notify("Backup restaurado do Gist. Recarregando...");
        setTimeout(() => window.location.reload(), 800);
      } else {
        notify(result.error, "error");
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : "Falha ao baixar backup.", "error");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">
        Sincronizar entre dispositivos (via GitHub Gist)
      </button>
    );
  }

  return (
    <div className="w-full max-w-xs space-y-2 rounded-md border border-slate-200 p-3 text-left dark:border-slate-800">
      <p className="text-xs text-slate-500">
        Usa um Gist privado da sua conta do GitHub como "nuvem" pessoal — sem nenhum servidor nosso no meio. Crie um
        token em{" "}
        <a
          href="https://github.com/settings/tokens?type=beta"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          github.com/settings/tokens
        </a>{" "}
        com escopo apenas <strong>gist</strong>. O token fica salvo só neste navegador.
      </p>
      <div>
        <label className={labelClass} htmlFor="sync-token">
          Token do GitHub
        </label>
        <input
          id="sync-token"
          type="password"
          className={inputClass}
          value={token}
          onChange={(e) => handleTokenChange(e.target.value)}
          placeholder="ghp_..."
        />
      </div>
      {gistId && (
        <p className="text-xs text-slate-500">
          Gist atual: <code>{gistId}</code>{" "}
          <button type="button" onClick={handleForgetGist} className="text-red-500 hover:underline">
            esquecer
          </button>
        </p>
      )}
      <div className="flex gap-2">
        <Button size="sm" disabled={busy} onClick={handlePush}>
          Enviar backup
        </Button>
        <Button size="sm" variant="secondary" disabled={busy} onClick={handlePull}>
          Baixar backup
        </Button>
      </div>
    </div>
  );
}
