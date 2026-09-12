import { CATEGORY_LABELS, STORY_TAG_LABELS, type QuestionBankEntry, type RefinementSession } from "./types";

export function sessionToMarkdown(session: RefinementSession, allQuestions: QuestionBankEntry[]): string {
  const questionById = new Map(allQuestions.map((q) => [q.id, q]));
  const lines = [`# ${session.storyTitle || "(sem título)"}`, ""];

  if (session.storyTags.length > 0) {
    lines.push(`**Características:** ${session.storyTags.map((t) => STORY_TAG_LABELS[t]).join(", ")}`, "");
  }

  if (session.selectedQuestionIds.length > 0) {
    lines.push("## Perguntas levantadas", "");
    for (const id of session.selectedQuestionIds) {
      const q = questionById.get(id);
      if (q) lines.push(`- **[${CATEGORY_LABELS[q.category]}]** ${q.text}`);
    }
    lines.push("");
  }

  if (session.notes.trim()) {
    lines.push("## Notas", "", session.notes.trim(), "");
  }

  const done = session.dorChecklist.filter((i) => i.checked).length;
  lines.push(`## Definition of Ready (${done}/${session.dorChecklist.length})`, "");
  for (const item of session.dorChecklist) {
    lines.push(`- [${item.checked ? "x" : " "}] ${item.label}`);
  }
  lines.push("");

  return lines.join("\n");
}
