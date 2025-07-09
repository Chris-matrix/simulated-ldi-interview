'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

interface Profession {
  id: string;
  name: string;
  category: string;
  description: string;
  avgSalary?: string;
  education?: string;
}

const PROFESSIONS: Profession[] = [
  // Technology
  { id: 'software-engineer', name: 'Software Engineer', category: 'Technology', description: 'Design and develop software applications and systems.', avgSalary: '$110,000', education: "Bachelor's" },
  { id: 'data-scientist', name: 'Data Scientist', category: 'Technology', description: 'Analyze and interpret complex data to help organizations make decisions.', avgSalary: '$120,000', education: "Master's" },
  { id: 'devops-engineer', name: 'DevOps Engineer', category: 'Technology', description: 'Streamline software development and deployment processes.', avgSalary: '$115,000', education: "Bachelor's" },
  
  // Healthcare
  { id: 'physician', name: 'Physician', category: 'Healthcare', description: 'Diagnose and treat illnesses and injuries in patients.', avgSalary: '$210,000', education: 'Doctoral' },
  { id: 'nurse-practitioner', name: 'Nurse Practitioner', category: 'Healthcare', description: 'Provide primary and specialty healthcare services.', avgSalary: '$120,000', education: "Master's" },
  
  // Business
  { id: 'financial-analyst', name: 'Financial Analyst', category: 'Business', description: 'Assess financial data to help businesses make investment decisions.', avgSalary: '$85,000', education: "Bachelor's" },
  { id: 'hr-manager', name: 'HR Manager', category: 'Business', description: 'Oversee human resources functions and employee relations.', avgSalary: '$126,000', education: "Bachelor's" },
  
  // Creative
  { id: 'graphic-designer', name: 'Graphic Designer', category: 'Creative', description: 'Create visual concepts using software or by hand.', avgSalary: '$53,000', education: "Bachelor's" },
  { id: 'video-producer', name: 'Video Producer', category: 'Creative', description: 'Oversee video production from concept to completion.', avgSalary: '$74,000', education: "Bachelor's" },
  
  // Trades
  { id: 'electrician', name: 'Electrician', category: 'Trades', description: 'Install, maintain, and repair electrical power systems.', avgSalary: '$60,000', education: 'Apprenticeship' },
  { id: 'plumber', name: 'Plumber', category: 'Trades', description: 'Install and repair pipes and fixtures for water and drainage.', avgSalary: '$56,000', education: 'Apprenticeship' },
];

const CATEGORIES = ['All', ...new Set(PROFESSIONS.map(p => p.category))];

export default function ProfessionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);

  const filteredProfessions = useMemo(() => {
    return PROFESSIONS.filter(profession => {
      const matchesSearch = profession.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profession.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || profession.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Career Path</h1>
          <p className="text-lg text-gray-600">Explore different professions and find the perfect match for your skills</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search professions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Professions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfessions.map((profession) => (
            <div
              key={profession.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedProfession(profession)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{profession.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                      {profession.category}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 line-clamp-3">{profession.description}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>💰 {profession.avgSalary}</span>
                  <span className="mx-2">•</span>
                  <span>🎓 {profession.education}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProfessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No professions found matching your search.</p>
          </div>
        )}

        {/* Profession Detail Modal */}
        {selectedProfession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProfession.name}</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                      {selectedProfession.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProfession(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Overview</h3>
                    <p className="mt-2 text-gray-600">{selectedProfession.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Average Salary</h4>
                      <p className="mt-1 text-lg font-medium text-gray-900">{selectedProfession.avgSalary}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Education Required</h4>
                      <p className="mt-1 text-lg font-medium text-gray-900">{selectedProfession.education}</p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <button
                      type="button"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        // Handle start interview or save selection
                        alert(`Starting interview preparation for ${selectedProfession.name}`);
                        setSelectedProfession(null);
                      }}
                    >
                      Start Interview Preparation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
