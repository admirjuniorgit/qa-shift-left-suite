import { inputClass, labelClass } from "@/components/ui/field-styles";
import { LOCATOR_LABELS, type Locator, type LocatorKind } from "../types";

const LOCATOR_KINDS: LocatorKind[] = ["text", "role", "label", "testId", "css"];

function defaultLocatorFor(kind: LocatorKind): Locator {
  switch (kind) {
    case "text":
      return { kind: "text", text: "" };
    case "role":
      return { kind: "role", role: "button", name: "" };
    case "label":
      return { kind: "label", label: "" };
    case "testId":
      return { kind: "testId", testId: "" };
    case "css":
      return { kind: "css", selector: "" };
  }
}

export function LocatorPicker({ value, onChange }: { value: Locator; onChange: (locator: Locator) => void }) {
  return (
    <div className="space-y-2 rounded-md border border-slate-200 p-2 dark:border-slate-800">
      <div>
        <label className={labelClass} htmlFor="locator-kind">
          Como localizar o elemento
        </label>
        <select
          id="locator-kind"
          className={inputClass}
          value={value.kind}
          onChange={(e) => onChange(defaultLocatorFor(e.target.value as LocatorKind))}
        >
          {LOCATOR_KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {LOCATOR_LABELS[kind]}
            </option>
          ))}
        </select>
      </div>

      {value.kind === "text" && (
        <input
          className={inputClass}
          placeholder="Texto visível, ex: Entrar"
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
        />
      )}

      {value.kind === "role" && (
        <div className="grid grid-cols-2 gap-2">
          <input
            className={inputClass}
            placeholder="Papel, ex: button, link, textbox"
            value={value.role}
            onChange={(e) => onChange({ ...value, role: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Nome acessível (opcional), ex: Entrar"
            value={value.name ?? ""}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </div>
      )}

      {value.kind === "label" && (
        <input
          className={inputClass}
          placeholder="Rótulo do campo, ex: E-mail"
          value={value.label}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
        />
      )}

      {value.kind === "testId" && (
        <input
          className={inputClass}
          placeholder="data-testid, ex: submit-button"
          value={value.testId}
          onChange={(e) => onChange({ ...value, testId: e.target.value })}
        />
      )}

      {value.kind === "css" && (
        <input
          className={inputClass}
          placeholder="Seletor CSS, ex: #login-form button"
          value={value.selector}
          onChange={(e) => onChange({ ...value, selector: e.target.value })}
        />
      )}
    </div>
  );
}
