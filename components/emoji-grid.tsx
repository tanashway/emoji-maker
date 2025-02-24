'use client';

import { Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Emoji } from "@/lib/types";

interface EmojiGridProps {
  emojis: Emoji[];
  onLike?: (id: string) => void;
  onDownload?: (url: string) => void;
}

const isValidUrl = (url: unknown): url is string => {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return url.trim().length > 0;
  } catch {
    return false;
  }
};

export function EmojiGrid({ emojis, onLike, onDownload }: EmojiGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl">
      {emojis.filter(emoji => isValidUrl(emoji.url)).map((emoji) => (
        <div key={emoji.id} className="relative group aspect-square">
          <Image
            src={emoji.url}
            alt={`Generated emoji from prompt: ${emoji.prompt}`}
            fill
            className="object-cover rounded-lg"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-white/20 hover:bg-white/40"
              onClick={() => onLike?.(emoji.id)}
            >
              <Heart 
                className={`h-4 w-4 ${emoji.likes > 0 ? 'text-red-500 fill-red-500' : 'text-white'}`} 
              />
              {emoji.likes > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {emoji.likes}
                </span>
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-white/20 hover:bg-white/40"
              onClick={() => onDownload?.(emoji.url)}
            >
              <Download className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 