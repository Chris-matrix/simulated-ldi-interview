// Define the profession type
export interface ProfessionType {
  id: string;
  name: string;
  category: string;
  description: string;
  avgSalary?: string;
  education?: string;
}

// Profession data with type information
export const PROFESSIONS: ProfessionType[] = [
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
export const ALL_CATEGORIES = ['All', 'Technology', 'Healthcare', 'Business', 'Creative', 'Trades'];
