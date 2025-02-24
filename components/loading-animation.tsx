'use client';

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="relative w-32 h-32">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-yellow-400 border-r-blue-400 border-b-red-400 border-l-green-400 animate-spin" />
        
        {/* Inner pulsing emoji */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <span className="text-6xl">🎨</span>
        </div>
      </div>
      <div className="flex flex-col items-center text-gray-600 dark:text-gray-300">
        <p className="text-lg font-medium">Creating your emoji...</p>
        <p className="text-sm text-gray-500">This might take up to 30 seconds</p>
        <div className="mt-2 flex gap-1">
          <span className="animate-bounce delay-0">.</span>
          <span className="animate-bounce delay-100">.</span>
          <span className="animate-bounce delay-200">.</span>
        </div>
      </div>
    </div>
  );
} 