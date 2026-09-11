const DIACRITICS = /\p{Diacritic}/gu;

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function projectKeyFromName(input: string): string {
  const letters = input
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  return (letters || "PRJ").slice(0, 4);
}
