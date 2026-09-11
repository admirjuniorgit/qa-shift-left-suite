"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { recordResult } from "@/lib/actions/test-runs";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResultBadge } from "@/components/app/badges";
import { cn } from "@/lib/utils";
import type { EvidenceItem, ResultStatus, TestStep } from "@/types/database";

const STATUS_OPTIONS: { value: ResultStatus; label: string }[] = [
  { value: "passed", label: "Passou" },
  { value: "failed", label: "Falhou" },
  { value: "blocked", label: "Bloqueado" },
  { value: "skipped", label: "Pulado" },
  { value: "flaky", label: "Flaky" },
];

interface TestRunResultRowProps {
  resultId: string;
  status: ResultStatus;
  notes: string | null;
  evidence: EvidenceItem[];
  title: string;
  steps: TestStep[] | null;
  expectedResult: string | null;
  revalidatePathTarget: string;
  newDefectHref: string;
}

export function TestRunResultRow({
  resultId,
  status: initialStatus,
  notes: initialNotes,
  evidence: initialEvidence,
  title,
  steps,
  expectedResult,
  revalidatePathTarget,
  newDefectHref,
}: TestRunResultRowProps) {
  const [status, setStatus] = useState<ResultStatus>(initialStatus);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [evidence, setEvidence] = useState<EvidenceItem[]>(initialEvidence);
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  function save(nextStatus: ResultStatus) {
    setStatus(nextStatus);
    startTransition(async () => {
      await recordResult(resultId, revalidatePathTarget, nextStatus, notes, evidence);
    });
  }

  function saveNotesAndEvidence() {
    startTransition(async () => {
      await recordResult(resultId, revalidatePathTarget, status, notes, evidence);
    });
  }

  async function handleFileUpload(file: File) {
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${resultId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("evidences").upload(path, file);
      if (error) throw error;

      const { data } = supabase.storage.from("evidences").getPublicUrl(path);
      const next = [...evidence, { url: data.publicUrl, label: file.name }];
      setEvidence(next);
      startTransition(async () => {
        await recordResult(resultId, revalidatePathTarget, status, notes, next);
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-md border">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
      >
        <span className="font-medium">{title}</span>
        <ResultBadge value={status} />
      </button>

      {expanded && (
        <div className="space-y-4 border-t px-4 py-4">
          {steps && steps.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Passos</p>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {steps.map((step, i) => (
                  <li key={i}>{step.action}</li>
                ))}
              </ol>
            </div>
          )}
          {expectedResult && (
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                Resultado esperado
              </p>
              <p className="text-sm">{expectedResult}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                size="sm"
                variant={status === opt.value ? "default" : "outline"}
                disabled={pending}
                onClick={() => save(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotesAndEvidence}
              placeholder="Notas da execução..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <input
              type="file"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileUpload(file);
              }}
              className="text-sm"
            />
            {evidence.length > 0 && (
              <ul className="space-y-1 text-sm">
                {evidence.map((item, i) => (
                  <li key={i}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      {item.label ?? item.url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {status === "failed" && (
            <Link
              href={newDefectHref}
              className={cn("inline-block text-sm text-destructive underline underline-offset-2")}
            >
              Criar defeito a partir deste resultado
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
