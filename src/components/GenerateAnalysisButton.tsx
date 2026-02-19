'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface GenerateAnalysisButtonProps {
  sessionId: string;
}

export default function GenerateAnalysisButton({
  sessionId,
}: GenerateAnalysisButtonProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate analysis');
      }

      // refresh to show the new analysis
      router.refresh();
    } catch (error) {
      console.error('Error generating analysis:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
    >
      {isGenerating ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Generating Analysis...
        </span>
      ) : (
        'Generate AI Analysis'
      )}
    </button>
  );
}
