'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Simple error component with basic type safety
export default function ErrorComponent({ error, reset }) {
  const router = useRouter();
  const errorMessage = error?.message || 'An unexpected error occurred. Please try again later.';
  
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      console.error('Error boundary caught:', error);
    }, [error]);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          {reset && (
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          )}
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
}
