import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, Crown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.02)_50%,transparent_75%)]"></div>
      
      <div className="container mx-auto px-4 lg:px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-yellow-900" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent tracking-tight">
                    DesignCraft
                  </span>
                  <span className="text-xs text-gray-400 font-medium -mt-1 tracking-wide">
                    Premium Templates
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-8 leading-relaxed text-sm max-w-sm">
                Crafting exceptional graphic designs that transform your vision into stunning visual experiences. Professional quality, modern aesthetics, instant downloads.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600/20" },
                { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600/20" },
                { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-sky-600/20" }
              ].map((social) => (
                <Button
                  key={social.label}
                  size="icon"
                  variant="ghost"
                  className={`w-10 h-10 bg-white/5 border border-white/10 ${social.color} text-gray-300 hover:text-white rounded-xl transition-all duration-300 hover:scale-105 hover:border-white/20`}
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/products', label: 'Products' },
                { href: '/contact', label: 'Contact' }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-all duration-300 text-sm group flex items-center"
                  >
                    <span className="w-1 h-1 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white relative">
              Categories
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/products?section=wedding', label: 'Wedding Designs' },
                { href: '/products?section=business', label: 'Business Cards' },
                { href: '/products?section=social', label: 'Social Media' },
                { href: '/products?section=custom', label: 'Custom Designs' }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-all duration-300 text-sm group flex items-center"
                  >
                    <span className="w-1 h-1 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white relative">
              Get in Touch
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h4>
            <div className="space-y-4">
              {[
                { icon: Phone, text: "+91-9876543210", href: "tel:+91-9876543210" },
                { icon: Mail, text: "info@designcraft.com", href: "mailto:info@designcraft.com" },
                { icon: MapPin, text: "Mumbai, Maharashtra", href: "#" }
              ].map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="flex items-center text-gray-300 hover:text-white transition-all duration-300 group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/20 rounded-xl flex items-center justify-center mr-3 group-hover:from-purple-600/30 group-hover:to-purple-700/30 group-hover:border-purple-500/30 transition-all duration-300">
                    <contact.icon className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-sm font-medium">{contact.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm font-medium">
                © 2024 DesignCraft. All rights reserved.
              </p>
              <div className="flex space-x-4 text-xs">
                <Link href="/privacy" className="text-gray-400 hover:text-gray-300 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-gray-300 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
            
            <div className="flex items-center text-gray-400 text-sm">
              <span>Crafted with</span>
              <Heart className="h-4 w-4 mx-2 text-red-400 fill-current animate-pulse" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
