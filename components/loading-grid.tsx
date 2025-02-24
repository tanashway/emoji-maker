'use client';

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse"
        />
      ))}
    </div>
  );
} 