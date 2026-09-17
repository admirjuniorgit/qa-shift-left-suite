const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, "") ?? "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

type QueryParams = Record<string, string>;

async function supabaseRequest(table: string, init: RequestInit & { query?: QueryParams } = {}): Promise<Response> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (arquivo .env.local em dev, variáveis de ambiente no Netlify em produção).",
    );
  }

  const { query, ...rest } = init;
  const search = new URLSearchParams(query).toString();
  const url = `${SUPABASE_URL}/rest/v1/${table}${search ? `?${search}` : ""}`;

  const response = await fetch(url, {
    ...rest,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      ...rest.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Supabase respondeu ${response.status}: ${body || response.statusText}`);
  }

  return response;
}

export async function supabaseSelect<T>(table: string, query: QueryParams = {}): Promise<T[]> {
  const response = await supabaseRequest(table, { method: "GET", query: { select: "*", ...query } });
  return (await response.json()) as T[];
}

export async function supabaseInsert<T>(table: string, row: Record<string, unknown>): Promise<T> {
  const response = await supabaseRequest(table, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  const rows = (await response.json()) as T[];
  return rows[0];
}

export async function supabaseUpdate<T>(table: string, id: string, patch: Record<string, unknown>): Promise<T> {
  const response = await supabaseRequest(table, {
    method: "PATCH",
    query: { id: `eq.${id}` },
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  const rows = (await response.json()) as T[];
  return rows[0];
}

export async function supabaseDelete(table: string, id: string): Promise<void> {
  await supabaseRequest(table, { method: "DELETE", query: { id: `eq.${id}` } });
}
