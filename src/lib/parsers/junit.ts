import { XMLParser } from "fast-xml-parser";
import type { ParsedReport, ParsedTestResult } from "./types";

interface JUnitTestCase {
  "@_classname"?: string;
  "@_name": string;
  "@_time"?: string;
  failure?: { "@_message"?: string } | { "@_message"?: string }[];
  error?: { "@_message"?: string } | { "@_message"?: string }[];
  skipped?: unknown;
}

interface JUnitTestSuite {
  "@_name"?: string;
  testcase?: JUnitTestCase | JUnitTestCase[];
}

interface JUnitRoot {
  testsuites?: { testsuite?: JUnitTestSuite | JUnitTestSuite[] };
  testsuite?: JUnitTestSuite | JUnitTestSuite[];
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function firstMessage(node: JUnitTestCase["failure"]): string | undefined {
  const arr = toArray(node);
  return arr[0]?.["@_message"];
}

export function parseJUnitXml(xml: string): ParsedReport {
  const parser = new XMLParser({ ignoreAttributes: false, allowBooleanAttributes: true });
  const parsed = parser.parse(xml) as JUnitRoot;

  const suites = toArray(parsed.testsuites?.testsuite ?? parsed.testsuite);
  const results: ParsedTestResult[] = [];

  for (const suite of suites) {
    const suiteName = suite["@_name"] ?? "default";
    for (const testcase of toArray(suite.testcase)) {
      const durationSeconds = Number.parseFloat(testcase["@_time"] ?? "0");
      const failureMessage = firstMessage(testcase.failure) ?? firstMessage(testcase.error);

      let status: ParsedTestResult["status"] = "passed";
      if (testcase.skipped !== undefined) status = "skipped";
      else if (failureMessage !== undefined || testcase.failure || testcase.error) status = "failed";

      results.push({
        suite: suiteName,
        name: testcase["@_name"],
        status,
        durationMs: Math.round((Number.isNaN(durationSeconds) ? 0 : durationSeconds) * 1000),
        failureMessage,
      });
    }
  }

  return { framework: "junit", results };
}
