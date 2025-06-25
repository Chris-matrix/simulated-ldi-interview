'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-xl shadow-md text-center">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-red-600">500</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Something went wrong!</h2>
          <p className="text-gray-600">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {error.message || 'An unknown error occurred'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onClick={() => reset()}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Try Again
          </Button>
          <Button
            onClick={() => router.push('/home')}
            className="w-full sm:w-auto"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
