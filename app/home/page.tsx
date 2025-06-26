'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/components/loading';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === 'loading' || status === 'unauthenticated') {
    return <Loading />;
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to the Workshop</h1>
          <button 
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Welcome back!</h2>
            <p className="mt-2 text-sm text-gray-500">
              You are now logged in to the workshop application.
            </p>
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-base font-medium text-gray-900">Your Profile</h3>
                <dl className="mt-2 space-y-2">
                  <div className="flex">
                    <dt className="w-20 text-sm font-medium text-gray-500">Role:</dt>
                    <dd className="text-sm text-gray-900">{session?.user?.role || 'User'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-20 text-sm font-medium text-gray-500">Email:</dt>
                    <dd className="text-sm text-gray-900">{session?.user?.email || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-2">Start Interview</h3>
                  <p className="text-gray-600 mb-4">Begin a new interview session</p>
                  <a 
                    href="/select-profession" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Start Now
                  </a>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-2">View History</h3>
                  <p className="text-gray-600 mb-4">Review your previous interviews</p>
                  <a 
                    href="/history" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View History
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
