export type ParsedResultStatus = "passed" | "failed" | "skipped";

export interface ParsedTestResult {
  suite: string;
  name: string;
  status: ParsedResultStatus;
  durationMs: number;
  failureMessage?: string;
}

export interface ParsedReport {
  framework: "junit" | "playwright" | "puppeteer" | "other";
  results: ParsedTestResult[];
}
