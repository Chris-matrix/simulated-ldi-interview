'use client';

import React from 'react';
import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This is a test page to check routing.</p>
      <Link 
        href="/select-profession" 
        className="text-blue-600 hover:underline"
      >
        Go to Select Profession
      </Link>
    </div>
  );
}
