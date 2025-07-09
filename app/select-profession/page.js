'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const INDUSTRY_CATEGORIES = [
  { 
    id: 'Information Technology', 
    name: 'Information Technology', 
    icon: '💻', 
    description: 'Software development, cybersecurity, cloud computing, and more',
    color: '#3498db'
  },
  { 
    id: 'Healthcare', 
    name: 'Healthcare', 
    icon: '🏥', 
    description: 'Medical, nursing, healthcare administration, and therapy roles',
    color: '#e74c3c'
  },
  { 
    id: 'Business', 
    name: 'Business', 
    icon: '💼', 
    description: 'Management, finance, marketing, and entrepreneurship',
    color: '#2ecc71'
  },
  { 
    id: 'Education', 
    name: 'Education', 
    icon: '🎓', 
    description: 'Teaching, administration, and educational support roles',
    color: '#9b59b6'
  },
  { 
    id: 'Engineering', 
    name: 'Engineering', 
    icon: '⚙️', 
    description: 'Civil, mechanical, electrical, and other engineering fields',
    color: '#e67e22'
  },
  { 
    id: 'Creative Arts', 
    name: 'Creative Arts', 
    icon: '🎨', 
    description: 'Design, writing, multimedia, and performing arts',
    color: '#e74c3c'
  }
];

export default function SelectProfession() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const router = useRouter();

  const handleStartInterview = () => {
    const profession = showCustomInput ? customProfession : selectedCategory;
    if (profession.trim()) {
      router.push(`/interview?profession=${encodeURIComponent(profession)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Back to Home
          </Link>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Select Your Profession</h1>
          <p className="text-xl text-gray-600">Choose an industry category or enter your specific profession</p>
        </div>

        {!showCustomInput ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {INDUSTRY_CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4">Don't see your profession listed?</p>
              <button
                onClick={() => setShowCustomInput(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enter Custom Profession
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setShowCustomInput(false)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
              >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to categories
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Profession</h2>
              <p className="text-gray-600 mb-6">Tell us what you do, and we'll tailor the interview questions for you.</p>
              <div className="flex">
                <input
                  type="text"
                  value={customProfession}
                  onChange={(e) => setCustomProfession(e.target.value)}
                  placeholder="e.g., Product Manager, Data Scientist, Nurse Practitioner"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  autoFocus
                />
                <button
                  onClick={handleStartInterview}
                  disabled={!customProfession.trim()}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {!showCustomInput && (
          <div className="flex justify-center">
            <button
              onClick={handleStartInterview}
              disabled={!selectedCategory}
              className={`px-8 py-3 rounded-lg text-white font-medium ${
                selectedCategory
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              Start Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
