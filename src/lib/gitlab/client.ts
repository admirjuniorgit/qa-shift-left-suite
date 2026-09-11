// Cliente mínimo para a API REST v4 do GitLab (suporta instâncias self-hosted
// via baseUrl configurável). Mantém a suíte agnóstica quanto à stack do time
// cliente: só fala com a API do GitLab, nunca com o código do projeto deles.

export interface GitLabIssueSummary {
  iid: number;
  title: string;
  webUrl: string;
  state: string;
  labels: string[];
}

export interface GitLabConfig {
  baseUrl: string;
  projectId: string;
  token: string;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

async function gitlabFetch<T>(config: GitLabConfig, path: string, init?: RequestInit): Promise<T> {
  const url = `${normalizeBaseUrl(config.baseUrl)}/api/v4/projects/${encodeURIComponent(
    config.projectId,
  )}${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "PRIVATE-TOKEN": config.token,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`GitLab API ${response.status}: ${body || response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function testConnection(config: GitLabConfig): Promise<{ name: string; webUrl: string }> {
  const project = await gitlabFetch<{ name: string; web_url: string }>(config, "");
  return { name: project.name, webUrl: project.web_url };
}

export async function listOpenIssues(config: GitLabConfig): Promise<GitLabIssueSummary[]> {
  const issues = await gitlabFetch<
    Array<{ iid: number; title: string; web_url: string; state: string; labels: string[] }>
  >(config, "/issues?state=opened&per_page=50&order_by=updated_at");

  return issues.map((issue) => ({
    iid: issue.iid,
    title: issue.title,
    webUrl: issue.web_url,
    state: issue.state,
    labels: issue.labels,
  }));
}

export async function createIssueFromDefect(
  config: GitLabConfig,
  defect: { title: string; description: string; labels?: string[] },
): Promise<{ iid: number; webUrl: string }> {
  const issue = await gitlabFetch<{ iid: number; web_url: string }>(config, "/issues", {
    method: "POST",
    body: JSON.stringify({
      title: defect.title,
      description: defect.description,
      labels: (defect.labels ?? ["qa", "bug"]).join(","),
    }),
  });

  return { iid: issue.iid, webUrl: issue.web_url };
}
