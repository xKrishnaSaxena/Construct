export type Placeholder = { key: string; label: string };

const PLACEHOLDER_RX =
  /\[(?:User\s+to\s+insert\s+([^\]]+)|([^\]]+?)\s+to\s+insert|([^\]]+?))\]/gi;

function toKey(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
}

export function extractPlaceholders(text: string): Placeholder[] {
  const found = new Set<string>();
  const items: Placeholder[] = [];
  let m: RegExpExecArray | null;

  while ((m = PLACEHOLDER_RX.exec(text)) !== null) {
    const label = (m[1] || m[2] || m[3] || "").trim();
    if (!label) continue;

    const key = toKey(label);
    if (!found.has(key)) {
      found.add(key);
      items.push({ key, label });
    }
  }
  return items;
}

export function fillPlaceholders(text: string, values: Record<string, string>) {
  return text.replace(PLACEHOLDER_RX, (_full, g1, g2, g3) => {
    const label = (g1 || g2 || g3 || "").trim();
    const key = toKey(label);
    return values[key] ?? `[MISSING: ${label}]`;
  });
}
