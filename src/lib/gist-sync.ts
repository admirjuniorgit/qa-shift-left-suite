const TOKEN_KEY = "qa-toolkit-sync-token";
const GIST_ID_KEY = "qa-toolkit-sync-gist-id";
const GIST_FILENAME = "qa-toolkit-backup.json";
const GIST_DESCRIPTION = "Backup do QA Toolkit (refinamento, boas práticas, construtor de testes)";

export function getSyncToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setSyncToken(token: string): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getSyncGistId(): string {
  return localStorage.getItem(GIST_ID_KEY) ?? "";
}

export function setSyncGistId(id: string): void {
  if (id) localStorage.setItem(GIST_ID_KEY, id);
  else localStorage.removeItem(GIST_ID_KEY);
}

async function githubRequest(path: string, token: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`GitHub API respondeu ${response.status}: ${body || response.statusText}`);
  }
  return response;
}

export async function pushBackupToGist(token: string, gistId: string, backupJson: string): Promise<string> {
  const body = JSON.stringify({
    description: GIST_DESCRIPTION,
    public: false,
    files: { [GIST_FILENAME]: { content: backupJson } },
  });

  if (gistId) {
    await githubRequest(`/gists/${gistId}`, token, { method: "PATCH", body });
    return gistId;
  }

  const response = await githubRequest("/gists", token, { method: "POST", body });
  const data = (await response.json()) as { id: string };
  return data.id;
}

export async function pullBackupFromGist(token: string, gistId: string): Promise<string> {
  const response = await githubRequest(`/gists/${gistId}`, token);
  const data = (await response.json()) as { files: Record<string, { content: string }> };
  const file = data.files[GIST_FILENAME];
  if (!file) throw new Error(`O gist não tem um arquivo "${GIST_FILENAME}".`);
  return file.content;
}
