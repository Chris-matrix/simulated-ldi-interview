'use client';

import { useState } from 'react';

export default function TestErrorPage() {
  const [shouldError, setShouldError] = useState(false);

  // This will throw an error when the button is clicked
  if (shouldError) {
    throw new Error('This is a test error');
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Test Error Boundary</h1>
      <p className="mb-6">
        This page tests the error boundary. Click the button below to trigger an error.
      </p>
      <button
        onClick={() => setShouldError(true)}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Trigger Error
      </button>
      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h2 className="text-xl font-semibold mb-2">Navigation Test</h2>
        <p className="mb-4">Try these links to test navigation:</p>
        <div className="flex flex-wrap gap-4">
          <a href="/" className="text-blue-600 hover:underline">Home</a>
          <a href="/resume" className="text-blue-600 hover:underline">Resume</a>
          <a href="/select-profession" className="text-blue-600 hover:underline">Select Profession</a>
          <a href="/non-existent" className="text-blue-600 hover:underline">Non-existent Page</a>
        </div>
      </div>
    </div>
  );
}
