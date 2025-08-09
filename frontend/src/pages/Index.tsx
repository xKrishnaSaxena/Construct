import Header from "@/components/Header";
import PromptGenerator from "@/components/PromptGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main className="flex justify-center mt-8">
          <PromptGenerator />
        </main>
      </div>
    </div>
  );
};

export default Index;
