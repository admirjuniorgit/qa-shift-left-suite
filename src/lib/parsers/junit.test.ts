import { describe, expect, it } from "vitest";
import { parseJUnitXml } from "./junit";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="checkout">
    <testcase classname="checkout" name="aplica cupom valido" time="0.42" />
    <testcase classname="checkout" name="rejeita cupom expirado" time="0.11">
      <failure message="Expected 400 but got 200">stack trace...</failure>
    </testcase>
    <testcase classname="checkout" name="ignorado por flag" time="0">
      <skipped />
    </testcase>
  </testsuite>
</testsuites>`;

describe("parseJUnitXml", () => {
  it("interpreta suites, casos e status a partir do XML", () => {
    const report = parseJUnitXml(SAMPLE_XML);

    expect(report.framework).toBe("junit");
    expect(report.results).toHaveLength(3);

    expect(report.results[0]).toMatchObject({
      suite: "checkout",
      name: "aplica cupom valido",
      status: "passed",
      durationMs: 420,
    });

    expect(report.results[1]).toMatchObject({
      name: "rejeita cupom expirado",
      status: "failed",
      failureMessage: "Expected 400 but got 200",
    });

    expect(report.results[2]).toMatchObject({
      name: "ignorado por flag",
      status: "skipped",
    });
  });

  it("suporta um único <testsuite> sem <testsuites> ao redor", () => {
    const xml = `<testsuite name="root"><testcase name="ok" time="1" /></testsuite>`;
    const report = parseJUnitXml(xml);
    expect(report.results).toHaveLength(1);
    expect(report.results[0].status).toBe("passed");
  });
});
