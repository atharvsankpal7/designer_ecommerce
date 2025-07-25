'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, Sparkles, Crown } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { NavigationMenu } from './navigation-menu';
import { MobileNavigationSections } from './mobile-navigation-sections';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-purple-100' 
          : 'bg-white/90 backdrop-blur-sm shadow-sm'
      }`}
    
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="group flex items-center space-x-2">
            <div className="relative">
              <div className="w-10 h-10  rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {/* <Crown className="w-6 h-6 text-white" /> */}
                <Image src={"/header-logo.png"} width={100} height={100} alt='LOGO'/>
              </div>
              
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SS Creation
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className="relative text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium group py-2"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              href="/about" 
              className="relative text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium group py-2"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <NavigationMenu />
            
            <Link 
              href="/bundles" 
              className="relative text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium group py-2"
            >
              Bundles
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              href="/contact" 
              className="relative text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium group py-2"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-6">
            <a 
              href="tel:+91-9876543210" 
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-300 group"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 group-hover:bg-purple-200 transition-colors">
                <Phone className="h-4 w-4" />
              </div>
              <span className="font-medium">+91-9876543210</span>
            </a>
            
           
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden w-10 h-10 rounded-full hover:bg-purple-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Enhanced Mobile menu */}
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden py-6 border-t border-purple-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-purple-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-purple-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-purple-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <MobileNavigationSections onLinkClick={() => setIsMenuOpen(false)} />
              <Link 
                href="/bundles" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-purple-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Bundles
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-purple-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-4 border-t border-gray-200">
                <a 
                  href="tel:+91-9876543210" 
                  className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-purple-50"
                >
                  <Phone className="h-4 w-4 mr-3" />
                  +91-9876543210
                </a>
                
                
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}