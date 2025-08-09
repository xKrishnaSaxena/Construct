import type { PromptStructure } from "@/types";

export type LintIssue = {
  severity: "info" | "warn" | "error";
  message: string;
};

export function lintPrompt(sp: PromptStructure): {
  score: number;
  issues: LintIssue[];
} {
  const issues: LintIssue[] = [];
  const must = ["persona", "task", "context", "format", "constraints"] as const;

  // Basic checks
  for (const k of must) {
    if (!(sp as any)[k] || !(sp as any)[k].trim()) {
      issues.push({ severity: "error", message: `Missing ${k}.` });
    }
  }

  // Length sanity
  if (sp.task.length > 220)
    issues.push({
      severity: "warn",
      message: "Task is quite long; consider tightening.",
    });
  const placeholderCount = (sp.context.match(/\[User to insert/gi) || [])
    .length;
  if (placeholderCount === 0)
    issues.push({
      severity: "info",
      message: "No placeholders found in context.",
    });

  // Constraint presence of style/length
  if (!/tone|style/i.test(sp.constraints))
    issues.push({
      severity: "info",
      message: "Consider specifying tone/style in constraints.",
    });
  if (!/limit|under|\bmax\b|\bwords?\b/i.test(sp.constraints))
    issues.push({
      severity: "info",
      message: "Consider setting word/length limits.",
    });

  // Score out of 100 (super simple)
  let score = 100;
  score -= issues.filter((i) => i.severity === "error").length * 25;
  score -= issues.filter((i) => i.severity === "warn").length * 10;
  score = Math.max(0, Math.min(100, score));
  return { score, issues };
}
