'use client';

import { useEmojiStore } from "@/lib/store";
import { EmojiGeneratorForm } from "@/components/emoji-generator-form";
import { EmojiGrid } from "@/components/emoji-grid";
import { LoadingAnimation } from "@/components/loading-animation";
import { toast } from "sonner";

export default function Home() {
  const { emojis, isLoading, setIsLoading, addEmojis, likeEmoji } = useEmojiStore();

  const handleGenerate = async (prompt: string) => {
    try {
      setIsLoading(true);
      toast.promise(
        (async () => {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to generate emoji");
          }

          if (!Array.isArray(data.images) || data.images.length === 0) {
            throw new Error("No emoji was generated. Please try a different prompt.");
          }

          addEmojis(data.images, prompt);
          return data;
        })(),
        {
          loading: 'Creating your emoji...',
          success: 'Emoji generated successfully!',
          error: (err) => err.message || "Failed to generate emoji. Please try again."
        }
      );
    } catch (error) {
      console.error('Error generating emoji:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to download image");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "emoji.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Emoji downloaded successfully!");
    } catch (error) {
      console.error('Error downloading emoji:', error);
      toast.error("Failed to download emoji. Please try again.");
    }
  };

  const handleLike = (id: string) => {
    likeEmoji(id);
    toast.success("Emoji liked!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto flex flex-col items-center py-16 px-4 gap-8">
        <h1 className="text-4xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          🤓 Emoj maker
        </h1>
        
        <div className="w-full max-w-xl">
          <EmojiGeneratorForm
            onGenerate={handleGenerate}
            isGenerating={isLoading}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try prompts like "happy cat", "cool penguin", or "excited robot"
          </p>
        </div>

        {isLoading ? (
          <LoadingAnimation />
        ) : emojis.length > 0 ? (
          <EmojiGrid
            emojis={emojis}
            onLike={handleLike}
            onDownload={handleDownload}
          />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No emojis generated yet.</p>
            <p className="text-sm">Enter a prompt above to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
