export interface PromptStructure {
  persona: string;
  task: string;
  context: string;
  format: string;
  constraints: string;
}

export interface PromptResponse {
  structured_prompt: PromptStructure;
}
