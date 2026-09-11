import { describe, expect, it } from "vitest";
import { parsePlaywrightJson } from "./playwright";

const SAMPLE_REPORT = {
  suites: [
    {
      title: "checkout.spec.ts",
      specs: [
        {
          title: "aplica cupom valido",
          tests: [{ results: [{ status: "passed", duration: 512 }] }],
        },
      ],
      suites: [
        {
          title: "cupons expirados",
          specs: [
            {
              title: "rejeita cupom expirado",
              tests: [
                {
                  results: [
                    { status: "failed", duration: 220, error: { message: "Timeout no seletor" } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

describe("parsePlaywrightJson", () => {
  it("percorre suites aninhadas e mapeia status", () => {
    const report = parsePlaywrightJson(JSON.stringify(SAMPLE_REPORT));

    expect(report.framework).toBe("playwright");
    expect(report.results).toHaveLength(2);

    expect(report.results[0]).toMatchObject({
      suite: "checkout.spec.ts",
      name: "aplica cupom valido",
      status: "passed",
      durationMs: 512,
    });

    expect(report.results[1]).toMatchObject({
      suite: "checkout.spec.ts > cupons expirados",
      name: "rejeita cupom expirado",
      status: "failed",
      failureMessage: "Timeout no seletor",
    });
  });

  it("mapeia timedOut e interrupted como failed", () => {
    const report = parsePlaywrightJson(
      JSON.stringify({
        suites: [
          {
            title: "s",
            specs: [{ title: "t1", tests: [{ results: [{ status: "timedOut", duration: 5000 }] }] }],
          },
        ],
      }),
    );
    expect(report.results[0].status).toBe("failed");
  });
});
