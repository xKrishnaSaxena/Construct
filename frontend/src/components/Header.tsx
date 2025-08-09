import { Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="w-full py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Construct
            </h1>
          </div>
          <ThemeToggle />
        </div>
        <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
          Transform your ideas into perfect AI prompts with structured, optimized output
        </p>
      </div>
    </header>
  );
};

export default Header;