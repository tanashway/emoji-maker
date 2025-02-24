import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Emoji } from './types';

interface EmojiStore {
  emojis: Emoji[];
  addEmojis: (newEmojis: string[], prompt: string) => void;
  likeEmoji: (id: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

type State = {
  emojis: Emoji[];
  isLoading: boolean;
};

type Actions = {
  setIsLoading: (loading: boolean) => void;
  addEmojis: (newEmojis: string[], prompt: string) => void;
  likeEmoji: (id: string) => void;
};

const isValidUrl = (url: unknown): url is string => {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return url.trim().length > 0;
  } catch {
    return false;
  }
};

export const useEmojiStore = create<EmojiStore>()(
  persist<State & Actions>(
    (set) => ({
      emojis: [],
      isLoading: false,
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
      addEmojis: (newEmojis: unknown[], prompt: string) =>
        set((state) => ({
          emojis: [
            ...newEmojis
              .filter(isValidUrl)
              .map((url) => ({
                id: crypto.randomUUID(),
                url,
                prompt,
                likes: 0,
                createdAt: new Date().toISOString(),
              })),
            ...state.emojis,
          ],
        })),
      likeEmoji: (id: string) =>
        set((state) => ({
          emojis: state.emojis.map((emoji) =>
            emoji.id === id
              ? { ...emoji, likes: emoji.likes + 1 }
              : emoji
          ),
        })),
    }),
    {
      name: 'emoji-storage',
    }
  )
); 