import type { PromptStructure } from "@/types";

export function downloadFile(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(sp: PromptStructure) {
  downloadFile("prompt.json", JSON.stringify(sp, null, 2), "application/json");
}

export function exportMarkdown(sp: PromptStructure) {
  const md = `# Prompt

**Persona**  
${sp.persona}

**Task**  
${sp.task}

**Context**  
${sp.context}

**Format**  
${sp.format}

**Constraints**  
${sp.constraints}
`;
  downloadFile("prompt.md", md, "text/markdown");
}
