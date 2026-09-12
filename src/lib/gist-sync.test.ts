import { afterEach, describe, expect, it, vi } from "vitest";
import { pullBackupFromGist, pushBackupToGist } from "./gist-sync";

function mockFetchOnce(response: { ok: boolean; status?: number; json?: () => unknown; text?: () => Promise<string> }) {
  const fn = vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 500),
    statusText: "erro",
    json: async () => response.json?.(),
    text: response.text ?? (async () => ""),
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("pushBackupToGist", () => {
  it("cria um gist novo (POST) quando não há gistId e retorna o id criado", async () => {
    const fetchMock = mockFetchOnce({ ok: true, json: () => ({ id: "novo-id-123" }) });
    const id = await pushBackupToGist("token-abc", "", "{}");

    expect(id).toBe("novo-id-123");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.github.com/gists");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer token-abc");
  });

  it("atualiza um gist existente (PATCH) quando já há gistId", async () => {
    const fetchMock = mockFetchOnce({ ok: true, json: () => ({}) });
    const id = await pushBackupToGist("token-abc", "gist-existente", "{}");

    expect(id).toBe("gist-existente");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.github.com/gists/gist-existente");
    expect(init.method).toBe("PATCH");
  });

  it("lança erro com o status quando a API responde com falha", async () => {
    mockFetchOnce({ ok: false, status: 401, text: async () => "Bad credentials" });
    await expect(pushBackupToGist("token-invalido", "", "{}")).rejects.toThrow(/401/);
  });
});

describe("pullBackupFromGist", () => {
  it("retorna o conteúdo do arquivo de backup dentro do gist", async () => {
    mockFetchOnce({
      ok: true,
      json: () => ({ files: { "qa-toolkit-backup.json": { content: '{"version":1}' } } }),
    });
    const content = await pullBackupFromGist("token-abc", "gist-1");
    expect(content).toBe('{"version":1}');
  });

  it("lança erro quando o gist não tem o arquivo esperado", async () => {
    mockFetchOnce({ ok: true, json: () => ({ files: {} }) });
    await expect(pullBackupFromGist("token-abc", "gist-1")).rejects.toThrow(/qa-toolkit-backup\.json/);
  });
});
