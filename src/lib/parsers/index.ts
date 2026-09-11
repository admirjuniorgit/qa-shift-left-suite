import { parseJUnitXml } from "./junit";
import { parsePlaywrightJson } from "./playwright";
import type { ParsedReport } from "./types";

export * from "./types";

export function parseTestReport(content: string, filename: string): ParsedReport {
  const trimmed = content.trim();

  if (filename.endsWith(".xml") || trimmed.startsWith("<?xml") || trimmed.startsWith("<testsuite")) {
    return parseJUnitXml(content);
  }

  if (filename.endsWith(".json") || trimmed.startsWith("{")) {
    return parsePlaywrightJson(content);
  }

  throw new Error(
    `Formato de relatório não reconhecido para "${filename}". Envie um JUnit XML ou um Playwright JSON report.`,
  );
}
