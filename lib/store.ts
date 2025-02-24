import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Emoji } from './types';

interface EmojiStore {
  emojis: Emoji[];
  likedEmojis: string[];
  addEmojis: (newEmojis: string[], prompt: string) => void;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

type State = {
  emojis: Emoji[];
  likedEmojis: string[];
  isLoading: boolean;
};

type Actions = {
  setIsLoading: (loading: boolean) => void;
  addEmojis: (newEmojis: string[], prompt: string) => void;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
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

// Clear the existing storage to avoid migration issues
try {
  localStorage.removeItem('emoji-storage');
} catch (error) {
  console.error('Failed to clear storage:', error);
}

export const useEmojiStore = create<EmojiStore>()(
  persist<State & Actions>(
    (set, get) => ({
      emojis: [],
      likedEmojis: [],
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
      toggleLike: (id: string) =>
        set((state) => {
          const isCurrentlyLiked = state.likedEmojis.includes(id);
          const newLikedEmojis = isCurrentlyLiked
            ? state.likedEmojis.filter(emojiId => emojiId !== id)
            : [...state.likedEmojis, id];

          return {
            likedEmojis: newLikedEmojis,
            emojis: state.emojis.map((emoji) =>
              emoji.id === id
                ? { ...emoji, likes: emoji.likes + (isCurrentlyLiked ? -1 : 1) }
                : emoji
            ),
          };
        }),
      isLiked: (id: string) => get().likedEmojis.includes(id),
    }),
    {
      name: 'emoji-storage',
      version: 2, // Increment version number
      skipHydration: true, // Skip initial hydration to avoid migration issues
      merge: (persistedState: any, currentState: State & Actions) => {
        // Handle merging of persisted state
        return {
          ...currentState,
          ...persistedState,
          // Ensure likedEmojis is always an array
          likedEmojis: Array.isArray(persistedState?.likedEmojis) 
            ? persistedState.likedEmojis 
            : [],
          // Ensure emojis is always an array
          emojis: Array.isArray(persistedState?.emojis) 
            ? persistedState.emojis 
            : [],
        };
      },
    }
  )
); 