'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    // Check for interview feedback in session storage
    const storedFeedback = sessionStorage.getItem('interviewFeedback');
    if (storedFeedback) {
      setFeedback(JSON.parse(storedFeedback));
      // Clear the feedback from session storage
      sessionStorage.removeItem('interviewFeedback');
    } else {
      // If no feedback, set flag to redirect
      setShouldRedirect(true);
    }
    setIsLoading(false);
  }, []);
  
  // Handle redirection in a separate effect
  useEffect(() => {
    if (shouldRedirect && !isLoading) {
      router.push('/select-profession');
    }
  }, [shouldRedirect, isLoading, router]);

  const startNewInterview = () => {
    router.push('/select-profession');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (feedback) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Interview Results
            </h1>
            
            <div className="mb-8 text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {feedback.score}%
              </div>
              <div className="text-lg text-gray-600">Overall Score</div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Strengths</h2>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Areas for Improvement</h2>
              <ul className="space-y-2">
                {feedback.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <h3 className="font-medium text-blue-800 mb-2">Recommendation</h3>
              <p className="text-blue-700">{feedback.recommendation}</p>
            </div>
            
            <button
              onClick={startNewInterview}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // If we get here, we're either loading or redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading interview setup...</p>
      </div>
    </div>
  );
}

