import type { PromptStructure } from "../types";

const KEY = "pc_history_v1";

export function saveToHistory(item: PromptStructure) {
  const list = getHistory();
  list.unshift({ item, ts: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
}

export function getHistory(): { item: PromptStructure; ts: number }[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
