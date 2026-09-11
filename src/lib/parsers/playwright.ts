import type { ParsedReport, ParsedTestResult } from "./types";

interface PWResult {
  status: "passed" | "failed" | "timedOut" | "skipped" | "interrupted";
  duration: number;
  error?: { message?: string };
}

interface PWTest {
  results: PWResult[];
}

interface PWSpec {
  title: string;
  tests: PWTest[];
}

interface PWSuite {
  title: string;
  specs?: PWSpec[];
  suites?: PWSuite[];
}

interface PWReport {
  suites: PWSuite[];
}

function mapStatus(status: PWResult["status"]): ParsedTestResult["status"] {
  if (status === "passed") return "passed";
  if (status === "skipped") return "skipped";
  return "failed"; // failed, timedOut, interrupted
}

function collectFromSuite(suite: PWSuite, parentTitle: string, results: ParsedTestResult[]): void {
  const suiteTitle = parentTitle ? `${parentTitle} > ${suite.title}` : suite.title;

  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      const lastResult = test.results[test.results.length - 1];
      if (!lastResult) continue;

      results.push({
        suite: suiteTitle,
        name: spec.title,
        status: mapStatus(lastResult.status),
        durationMs: lastResult.duration,
        failureMessage: lastResult.error?.message,
      });
    }
  }

  for (const nested of suite.suites ?? []) {
    collectFromSuite(nested, suiteTitle, results);
  }
}

export function parsePlaywrightJson(json: string): ParsedReport {
  const parsed = JSON.parse(json) as PWReport;
  const results: ParsedTestResult[] = [];

  for (const suite of parsed.suites ?? []) {
    collectFromSuite(suite, "", results);
  }

  return { framework: "playwright", results };
}
