import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/field-styles";
import { createId } from "@/lib/id";
import { STEP_LABELS, type Locator, type Step, type StepKind } from "../types";
import { LocatorPicker } from "./LocatorPicker";

const STEP_KINDS: StepKind[] = [
  "goto",
  "click",
  "fill",
  "selectOption",
  "check",
  "hover",
  "press",
  "uploadFile",
  "waitFor",
  "expectVisible",
  "expectText",
  "expectCount",
  "expectEnabled",
  "expectDisabled",
  "expectUrl",
  "wait",
  "screenshot",
];

const NEEDS_LOCATOR: StepKind[] = [
  "click",
  "fill",
  "selectOption",
  "check",
  "hover",
  "press",
  "uploadFile",
  "waitFor",
  "expectVisible",
  "expectText",
  "expectCount",
  "expectEnabled",
  "expectDisabled",
];

export function StepForm({ onAdd }: { onAdd: (step: Step) => void }) {
  const [kind, setKind] = useState<StepKind>("goto");
  const [url, setUrl] = useState("");
  const [value, setValue] = useState("");
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [key, setKey] = useState("Enter");
  const [filePath, setFilePath] = useState("");
  const [count, setCount] = useState(1);
  const [ms, setMs] = useState(1000);
  const [checked, setChecked] = useState(true);
  const [locator, setLocator] = useState<Locator>({ kind: "text", text: "" });

  function buildStep(): Step {
    const id = createId();
    switch (kind) {
      case "goto":
        return { id, kind, url };
      case "click":
        return { id, kind, locator };
      case "fill":
        return { id, kind, locator, value };
      case "selectOption":
        return { id, kind, locator, value };
      case "check":
        return { id, kind, locator, checked };
      case "hover":
        return { id, kind, locator };
      case "press":
        return { id, kind, locator, key };
      case "uploadFile":
        return { id, kind, locator, filePath };
      case "waitFor":
        return { id, kind, locator };
      case "expectVisible":
        return { id, kind, locator };
      case "expectText":
        return { id, kind, locator, text };
      case "expectCount":
        return { id, kind, locator, count };
      case "expectEnabled":
        return { id, kind, locator };
      case "expectDisabled":
        return { id, kind, locator };
      case "expectUrl":
        return { id, kind, url };
      case "wait":
        return { id, kind, ms };
      case "screenshot":
        return { id, kind, name };
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onAdd(buildStep());
    setUrl("");
    setValue("");
    setText("");
    setName("");
    setFilePath("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-md border border-dashed border-slate-300 p-3 dark:border-slate-700">
      <div>
        <label className={labelClass} htmlFor="step-kind">
          Tipo de passo
        </label>
        <select id="step-kind" className={inputClass} value={kind} onChange={(e) => setKind(e.target.value as StepKind)}>
          {STEP_KINDS.map((k) => (
            <option key={k} value={k}>
              {STEP_LABELS[k]}
            </option>
          ))}
        </select>
      </div>

      {(kind === "goto" || kind === "expectUrl") && (
        <input className={inputClass} placeholder="URL, ex: /login" value={url} onChange={(e) => setUrl(e.target.value)} />
      )}

      {NEEDS_LOCATOR.includes(kind) && <LocatorPicker value={locator} onChange={setLocator} />}

      {(kind === "fill" || kind === "selectOption") && (
        <input
          className={inputClass}
          placeholder="Valor a preencher/selecionar"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      {kind === "expectText" && (
        <input
          className={inputClass}
          placeholder="Texto esperado"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {kind === "press" && (
        <input
          className={inputClass}
          placeholder="Tecla, ex: Enter, Escape, ArrowDown"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      )}

      {kind === "uploadFile" && (
        <input
          className={inputClass}
          placeholder="Caminho do arquivo, ex: ./fixtures/foto.png"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
      )}

      {kind === "expectCount" && (
        <input
          type="number"
          min={0}
          className={inputClass}
          placeholder="Quantidade esperada"
          value={count}
          onChange={(e) => setCount(Number(e.target.value) || 0)}
        />
      )}

      {kind === "check" && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          Marcar (desmarque para "desmarcar")
        </label>
      )}

      {kind === "wait" && (
        <input
          type="number"
          min={1}
          className={inputClass}
          placeholder="Milissegundos"
          value={ms}
          onChange={(e) => setMs(Number(e.target.value) || 0)}
        />
      )}

      {kind === "screenshot" && (
        <input
          className={inputClass}
          placeholder="Nome do arquivo (sem extensão)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <Button type="submit" size="sm">
        Adicionar passo
      </Button>
    </form>
  );
}
