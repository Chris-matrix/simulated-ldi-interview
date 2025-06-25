'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mr-4"
          >
            Go Back
          </Button>
          <Button
            onClick={() => router.push('/home')}
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
