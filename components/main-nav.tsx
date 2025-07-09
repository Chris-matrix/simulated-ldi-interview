'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
// @ts-ignore
import { ChevronDown as _ChevronDown } from 'lucide-react';

const professions = [
  { id: 'software-engineer', name: 'Software Engineer' },
  { id: 'product-manager', name: 'Product Manager' },
  { id: 'data-scientist', name: 'Data Scientist' },
  { id: 'ux-designer', name: 'UX Designer' },
  { id: 'devops-engineer', name: 'DevOps Engineer' },
];

const MainNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState('Select Profession');

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Resume', href: '/resume' },
    { name: 'How It Works', href: '/how-it-works' },
  ];

  return (
    <div className="flex items-center space-x-6">
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              'transition-colors hover:text-primary',
              pathname === item.href ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {item.name}
          </a>
        ))}
      </nav>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-4 py-2 text-sm border rounded-md hover:bg-accent hover:text-accent-foreground"
        >
          {selectedProfession}
          <span className={`ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}>
            {/* @ts-ignore */}
            <_ChevronDown className="h-4 w-4" />
          </span>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {professions.map((profession) => (
                <button
                  key={profession.id}
                  onClick={() => {
                    setSelectedProfession(profession.name);
                    setIsOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {profession.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNav;
