'use client';

import { useState, useMemo } from 'react';

// Define profession data directly
const PROFESSIONS = [
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

// Categories
const ALL_CATEGORIES = ['All', 'Technology', 'Healthcare', 'Business', 'Creative', 'Trades'];

// Default profession object - not used, so removing to clean up

export default function ProfessionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('toggle'); // Default to toggle view

  // Get all unique profession names and categories for the toggle view
  const allProfessions = useMemo(() => {
    // Group by category
    const byCategory = {};
    PROFESSIONS.forEach(prof => {
      if (!byCategory[prof.category]) {
        byCategory[prof.category] = [];
      }
      byCategory[prof.category].push(prof);
    });
    
    // Sort categories
    const sortedCategories = Object.keys(byCategory).sort();
    
    // Sort professions within each category
    sortedCategories.forEach(category => {
      byCategory[category].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return { byCategory, categories: sortedCategories };
  }, []);

  // Filter professions based on search term and category
  const filteredProfessions = useMemo(() => {
    return PROFESSIONS.filter(profession => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = profession.name.toLowerCase().includes(searchLower) ||
                         profession.description.toLowerCase().includes(searchLower);
      const matchesCategory = selectedCategory === 'All' || profession.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Handle profession selection
  const handleProfessionSelect = (profession) => {
    setSelectedProfession(profession);
    setIsModalOpen(true);
  };
  
  // Toggle between search and toggle views
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'search' ? 'toggle' : 'search');
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Explore Professions</h1>
        <button
          onClick={toggleViewMode}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          {viewMode === 'search' ? 'View as List' : 'View with Search'}
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8">
        {viewMode === 'search' ? (
        <>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search professions..."
              className="w-full p-2 pl-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {ALL_CATEGORIES.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessions.map((prof) => (
              <div
                key={prof.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleProfessionSelect(prof)}
              >
                <h3 className="text-xl font-semibold mb-2">{prof.name}</h3>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-3">
                  {prof.category}
                </span>
                <p className="text-gray-600 mb-4">{prof.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Avg. Salary: {prof.avgSalary}</span>
                  <span>Education: {prof.education}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {allProfessions.categories.map((category) => (
            <div key={category} className="mb-6">
              <h2 className="text-lg font-medium mb-3">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {allProfessions.byCategory[category].map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => handleProfessionSelect(prof)}
                    className={`p-3 text-left rounded-lg border transition-colors ${
                      selectedProfession?.id === prof.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{prof.name}</div>
                    <div className="text-sm text-gray-500">
                      {prof.avgSalary} • {prof.education}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}  
      </div>
      
      {/* Profession Grid */}
      {viewMode === 'search' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessions.map((profession) => (
            <div
              key={profession.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProfessionSelect(profession)}
            >
              <h3 className="text-xl font-semibold mb-2">{profession.name}</h3>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-3">
                {profession.category}
              </span>
              <p className="text-gray-600 mb-4">{profession.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Avg. Salary: {profession.avgSalary}</span>
                <span>Education: {profession.education}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {viewMode === 'search' && filteredProfessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No professions found matching your criteria.</p>
        </div>
      )}
      
      {/* Profession Detail Modal */}
      {isModalOpen && selectedProfession && selectedProfession.name && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProfession.name}</h2>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-2">
                    {selectedProfession.category}
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-gray-700">{selectedProfession.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-500">Average Salary</h4>
                    <p>{selectedProfession.avgSalary || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Education Required</h4>
                    <p>{selectedProfession.education || 'Varies'}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <button
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      // Handle start interview action
                    }}
                  >
                    Start Practice Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
