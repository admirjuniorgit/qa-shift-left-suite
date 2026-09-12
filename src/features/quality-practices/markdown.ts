import type { ChecklistTemplate } from "./types";

export function templateToMarkdown(template: ChecklistTemplate): string {
  const lines = [`# ${template.name}`, ""];
  for (const item of template.items) {
    lines.push(`- [ ] ${item.text}`);
  }
  lines.push("");
  return lines.join("\n");
}
