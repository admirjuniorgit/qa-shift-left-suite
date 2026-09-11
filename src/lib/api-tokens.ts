import { randomBytes, createHash } from "crypto";

const TOKEN_PREFIX = "qass_";

export function generateApiToken(): { token: string; hash: string; prefix: string } {
  const raw = randomBytes(24).toString("base64url");
  const token = `${TOKEN_PREFIX}${raw}`;
  return { token, hash: hashApiToken(token), prefix: token.slice(0, 12) };
}

export function hashApiToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
