'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface EmojiGeneratorFormProps {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

export function EmojiGeneratorForm({ onGenerate, isGenerating }: EmojiGeneratorFormProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrompt = prompt.trim();
    
    if (!cleanPrompt) return;
    
    // Add some basic prompt validation
    if (cleanPrompt.length < 3) {
      toast.error("Please enter a longer prompt (at least 3 characters)");
      return;
    }
    
    if (cleanPrompt.length > 100) {
      toast.error("Please enter a shorter prompt (maximum 100 characters)");
      return;
    }

    await onGenerate(cleanPrompt);
    setPrompt("");
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <Input
          type="text"
          placeholder="Try 'happy cat' or 'cool penguin'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1"
          disabled={isGenerating}
          maxLength={100}
        />
        <Button 
          type="submit" 
          disabled={isGenerating || !prompt.trim()}
          className="min-w-24"
        >
          {isGenerating ? (
            <>
              <span className="animate-pulse">Generating...</span>
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </form>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Be specific about emotions (happy, sad, excited)</li>
          <li>Include an animal or character (cat, dog, robot)</li>
          <li>Add a style (cute, cool, funny)</li>
        </ul>
      </div>
    </div>
  );
} 