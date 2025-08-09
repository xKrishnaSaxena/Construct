import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Sparkles, Check, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PromptStructure, PromptResponse } from "@/types";

const API_BASE = "http://localhost:8000";
const PromptGenerator = () => {
  const [userInput, setUserInput] = useState("");
  const [generatedPrompt, setGeneratedPrompt] =
    useState<PromptStructure | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<PromptStructure>>({});
  const { toast } = useToast();

  const generatePrompt = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Please enter a goal",
        description:
          "Describe what you want to create to generate an optimized prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedPrompt(null);

    try {
      const res = await fetch(`${API_BASE}/generate-prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case: userInput }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to generate prompt");
      }

      const data: PromptResponse = await res.json();
      setGeneratedPrompt(data.structured_prompt);
      toast({
        title: "Prompt generated",
        description: "Your optimized prompt is ready.",
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: `${section} section copied successfully.`,
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };

  const copyFullPrompt = async () => {
    if (!generatedPrompt) return;

    const fullPrompt = `**Persona:** ${generatedPrompt.persona}

**Task:** ${generatedPrompt.task}

**Context:** ${generatedPrompt.context}

**Format:** ${generatedPrompt.format}

**Constraints:** ${generatedPrompt.constraints}`;

    await copyToClipboard(fullPrompt, "Full prompt");
  };

  const startEditing = (section: string, currentValue: string) => {
    setEditingSection(section);
    setEditValues({ ...editValues, [section]: currentValue });
  };

  const saveEdit = (section: string) => {
    if (!generatedPrompt || !editValues[section as keyof PromptStructure])
      return;
    setGeneratedPrompt({
      ...generatedPrompt,
      [section]: editValues[section as keyof PromptStructure] as string,
    });
    setEditingSection(null);
    setEditValues({});
    toast({
      title: "Section updated",
      description: `${section} has been successfully updated.`,
    });
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditValues({});
  };

  const handleEditChange = (section: string, value: string) => {
    setEditValues({ ...editValues, [section]: value });
  };
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <Card className="p-8 bg-gradient-card shadow-elegant border-0">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">
              What would you like to create?
            </h2>
            <p className="text-muted-foreground">
              Describe your goal and we'll generate a structured, optimized
              prompt for you
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="e.g., a marketing email for a new product launch"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-[120px] text-lg border-border/50 focus:border-primary transition-colors resize-none"
            />

            <Button
              onClick={generatePrompt}
              disabled={isGenerating}
              size="lg"
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 h-14 text-lg font-medium"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Prompt
                </div>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Output Section */}
      {generatedPrompt && (
        <Card className="p-8 relative overflow-hidden bg-gradient-to-br from-card via-card/90 to-accent/20 shadow-elegant border border-border/50 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5"></div>
          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Your Optimized Prompt
              </h3>
              <Button
                onClick={copyFullPrompt}
                variant="outline"
                size="sm"
                className="gap-2 bg-background/80 backdrop-blur-sm border-border/60 hover:bg-accent/80 hover:shadow-glow transition-all duration-300"
              >
                {copiedSection === "Full prompt" ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copy All
              </Button>
            </div>

            <div className="grid gap-6">
              {Object.entries(generatedPrompt).map(([key, value], index) => (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium capitalize bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                      {key}
                    </h4>
                    <div className="flex items-center gap-2">
                      {editingSection === key ? (
                        <>
                          <Button
                            onClick={() => saveEdit(key)}
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-200"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={cancelEdit}
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-200"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => startEditing(key, value)}
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => copyToClipboard(value, key)}
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200"
                          >
                            {copiedSection === key ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    className="relative p-5 rounded-xl border border-border/40 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(var(--muted) / 0.3) 0%, 
                        hsl(var(--background) / 0.8) 50%, 
                        hsl(var(--accent) / 0.2) 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/2 via-transparent to-primary-glow/2"></div>
                    {editingSection === key ? (
                      <Textarea
                        value={
                          editValues[key as keyof PromptStructure] || value
                        }
                        onChange={(e) => handleEditChange(key, e.target.value)}
                        className="relative min-h-[100px] border-border/50 focus:border-primary transition-colors resize-none bg-background/50"
                        autoFocus
                      />
                    ) : (
                      <p className="relative text-foreground/95 leading-relaxed whitespace-pre-line">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PromptGenerator;
