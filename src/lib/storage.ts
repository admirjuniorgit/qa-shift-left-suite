const NAMESPACE = "qa-toolkit:v1";

export function storageKey(name: string): string {
  return `${NAMESPACE}:${name}`;
}

export function getItem<T>(name: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(name));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(name: string, value: T): boolean {
  try {
    localStorage.setItem(storageKey(name), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeItem(name: string): void {
  try {
    localStorage.removeItem(storageKey(name));
  } catch {
    // ignore
  }
}

export function allNamespacedKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`${NAMESPACE}:`)) keys.push(key);
  }
  return keys;
}
