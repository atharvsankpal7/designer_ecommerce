import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { getNavigationSections } from '@/lib/section-utils';
import { SectionHierarchy } from '@/types/section';

interface SSRNavigationMenuProps {
  className?: string;
}

export async function SSRNavigationMenu({ className = '' }: SSRNavigationMenuProps) {
  const sections = await getNavigationSections();

  const buildSectionUrl = (section: SectionHierarchy, parentSlugs: string[] = []): string => {
    const allSlugs = [...parentSlugs, section.slug];
    return `/products/${allSlugs.join('/')}`;
  };

  const renderSubMenu = (children: SectionHierarchy[], parentSlugs: string[] = [], level = 1) => {
    if (!children || children.length === 0) return null;

    const submenuClasses = level === 1 
      ? 'top-full left-0 translate-y-2 group-hover:translate-y-0' 
      : 'top-0 left-full translate-x-2 group-hover:translate-x-0';

    return (
      <div className={`absolute ${submenuClasses} min-w-[220px] bg-white/98 backdrop-blur-md 
                      shadow-2xl border border-purple-100/60 rounded-xl py-3 z-50 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      transition-all duration-300 ease-out`}>
        <div className="px-2">
          {children.map((child, index) => (
            <div key={child.id} className="relative group/sub">
              <Link
                href={buildSectionUrl(child, parentSlugs)}
                className="flex items-center justify-between px-3 py-2.5 text-gray-700 
                           hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 
                           hover:to-pink-50 transition-all duration-200 rounded-lg group/item"
              >
                <span className="font-medium text-sm">{child.name}</span>
                {child.children && child.children.length > 0 && (
                  <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-gray-400 
                                       group-hover/item:text-purple-600 transition-colors" />
                )}
              </Link>
              
              {child.children && child.children.length > 0 && (
                renderSubMenu(child.children, [...parentSlugs, child.slug], level + 1)
              )}
              
              {index < children.length - 1 && (
                <div className="mx-3 my-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (sections.length === 0) {
    return (
      <div className={`flex items-center space-x-8 ${className}`}>
        <Link 
          href="/products" 
          className="relative text-gray-700 hover:text-purple-600 transition-colors 
                     duration-300 font-medium group py-2"
        >
          Products
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r 
                           from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-8 ${className}`}>
      <Link 
        href="/products" 
        className="relative text-gray-700 hover:text-purple-600 transition-colors 
                   duration-300 font-medium group py-2"
      >
        Products
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r 
                         from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
      </Link>
      
      {sections.map((section) => (
        <div key={section.id} className="relative group">
          <Link
            href={buildSectionUrl(section)}
            className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 
                       transition-colors duration-300 font-medium group py-2"
          >
            <span>{section.name}</span>
            {section.children && section.children.length > 0 && (
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-purple-600 
                                   transition-all duration-300 group-hover:rotate-180" />
            )}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r 
                             from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          {section.children && section.children.length > 0 && (
            renderSubMenu(section.children, [section.slug])
          )}
        </div>
      ))}
    </div>
  );
}