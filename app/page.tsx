'use client';

import { useEmojiStore } from "@/lib/store";
import { EmojiGeneratorForm } from "@/components/emoji-generator-form";
import { EmojiGrid } from "@/components/emoji-grid";
import { LoadingAnimation } from "@/components/loading-animation";
import { toast } from "sonner";
import Image from "next/image";
import { Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { emojis, isLoading, setIsLoading, addEmojis, toggleLike, isLiked } = useEmojiStore();

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
    toggleLike(id);
    const liked = isLiked(id);
    toast.success(liked ? "Added to favorites!" : "Removed from favorites");
  };

  const latestEmoji = emojis[0];

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
        ) : latestEmoji ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-64 h-64 group">
              <Image
                src={latestEmoji.url}
                alt={`Latest emoji: ${latestEmoji.prompt}`}
                fill
                className="object-contain rounded-lg"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-12 w-12 bg-white/20 hover:bg-white/40"
                  onClick={() => handleLike(latestEmoji.id)}
                >
                  <Heart 
                    className={`h-6 w-6 transition-colors ${isLiked(latestEmoji.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                  />
                  {latestEmoji.likes > 0 && (
                    <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {latestEmoji.likes}
                    </span>
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-12 w-12 bg-white/20 hover:bg-white/40"
                  onClick={() => handleDownload(latestEmoji.url)}
                >
                  <Download className="h-6 w-6 text-white" />
                </Button>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400">"{latestEmoji.prompt}"</p>
          </div>
        ) : null}

        {emojis.length > 1 && (
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Previously Generated</h2>
            <EmojiGrid
              emojis={emojis.slice(1)}
              onLike={handleLike}
              onDownload={handleDownload}
              isLiked={isLiked}
            />
          </div>
        )}

        {!isLoading && emojis.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No emojis generated yet.</p>
            <p className="text-sm">Enter a prompt above to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
