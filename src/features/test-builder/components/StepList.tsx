import { useState } from "react";
import { STEP_LABELS, type Step } from "../types";
import { describeStep } from "../describe-step";

export function StepList({
  steps,
  onMove,
  onRemove,
  onDuplicate,
  onReorder,
}: {
  steps: Step[];
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
  onDuplicate: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  if (steps.length === 0) {
    return <p className="text-sm text-slate-400">Nenhum passo ainda — adicione o primeiro abaixo.</p>;
  }

  return (
    <ol className="space-y-1.5">
      {steps.map((step, index) => (
        <li
          key={step.id}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(index);
          }}
          onDragEnd={() => {
            if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
              onReorder(dragIndex, overIndex);
            }
            setDragIndex(null);
            setOverIndex(null);
          }}
          className={`flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-white/5 ${
            overIndex === index && dragIndex !== null && dragIndex !== index ? "outline outline-2 outline-violet-500" : ""
          }`}
        >
          <span className="cursor-grab select-none text-slate-400" title="Arraste para reordenar">
            ⠿
          </span>
          <span className="w-5 shrink-0 text-slate-400">{index + 1}.</span>
          <span className="min-w-0 flex-1 truncate" title={describeStep(step)}>
            <span className="font-medium">{STEP_LABELS[step.kind]}:</span> {describeStep(step)}
          </span>
          <div className="flex shrink-0 gap-1.5 text-xs">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onMove(index, -1)}
              className="disabled:opacity-30"
              aria-label="Mover para cima"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={index === steps.length - 1}
              onClick={() => onMove(index, 1)}
              className="disabled:opacity-30"
              aria-label="Mover para baixo"
            >
              ↓
            </button>
            <button type="button" onClick={() => onDuplicate(index)} className="text-slate-400 hover:text-violet-500" aria-label="Duplicar passo">
              duplicar
            </button>
            <button type="button" onClick={() => onRemove(index)} className="text-slate-400 hover:text-red-500" aria-label="Remover passo">
              remover
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}
