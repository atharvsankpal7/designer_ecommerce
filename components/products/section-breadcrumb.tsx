import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { buildSectionPath } from '@/lib/section-utils';
import { SectionHierarchy } from '@/types/section';

interface SectionBreadcrumbProps {
  breadcrumb: SectionHierarchy[];
}

export function SectionBreadcrumb({ breadcrumb }: SectionBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link 
        href="/" 
        className="flex items-center hover:text-purple-600 transition-colors"
      >
        <Home className="h-4 w-4 mr-1" />
        Home
      </Link>
      
      <ChevronRight className="h-4 w-4 text-gray-400" />
      
      <Link 
        href="/products" 
        className="hover:text-purple-600 transition-colors"
      >
        Products
      </Link>
      
      {breadcrumb.map((section, index) => {
        const isLast = index === breadcrumb.length - 1;
        const sectionPath = buildSectionPath(breadcrumb.slice(0, index + 1));
        
        return (
          <div key={section.id} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">{section.name}</span>
            ) : (
              <Link 
                href={`/products/${sectionPath}`}
                className="hover:text-purple-600 transition-colors"
              >
                {section.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}