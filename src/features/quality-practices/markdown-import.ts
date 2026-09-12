export interface ParsedChecklist {
  name: string;
  items: string[];
}

const CHECKBOX_LINE = /^\s*-\s*\[[ xX]?\]\s*(.+)$/;
const PLAIN_BULLET_LINE = /^\s*[-*]\s+(.+)$/;
const HEADING_LINE = /^\s*#{1,6}\s*(.+)$/;

export function parseChecklistMarkdown(markdown: string): ParsedChecklist {
  const lines = markdown.split(/\r?\n/);
  let name = "";
  const items: string[] = [];

  for (const line of lines) {
    if (!name) {
      const heading = line.match(HEADING_LINE);
      if (heading) {
        name = heading[1].trim();
        continue;
      }
    }

    const checkbox = line.match(CHECKBOX_LINE);
    if (checkbox) {
      items.push(checkbox[1].trim());
      continue;
    }

    const bullet = line.match(PLAIN_BULLET_LINE);
    if (bullet) {
      items.push(bullet[1].trim());
    }
  }

  return { name: name || "Checklist importado", items };
}
