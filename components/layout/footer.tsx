import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, Crown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 text-gray-800 relative overflow-hidden border-t border-orange-200/50">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-200/60 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(251,146,60,0.08)_50%,transparent_75%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="mb-6">
              <div className="w-72 h-auto mb-6">
                <Image 
                  src="/footer-logo.jpg" 
                  width={400} 
                  height={150} 
                  alt="SS Creation Logo"
                  className="object-contain"
                />
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Crafting exceptional graphic designs that transform your vision into stunning visual experiences. Professional quality, modern aesthetics, instant downloads.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-2 mt-auto">
              {[
                { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-500/20" },
                { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-500/20" },
                { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-sky-500/20" }
              ].map((social) => (
                <Button
                  key={social.label}
                  size="icon"
                  variant="ghost"
                  className={`w-9 h-9 bg-white/60 backdrop-blur-sm border border-orange-200/60 ${social.color} text-gray-600 hover:text-gray-800 rounded-lg transition-all duration-300 hover:scale-105 hover:border-orange-300/60`}
                  asChild
                >
                  <Link href={social.href} aria-label={social.label}>
                    <social.icon className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
              <Sparkles className="h-4 w-4 text-orange-500 mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/products', label: 'Products' },
                { href: '/bundles', label: 'Bundles' },
                { href: '/contact', label: 'Contact' }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-gray-800 transition-all duration-200 text-sm group flex items-center hover:pl-1"
                  >
                    <span className="w-2 h-0.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
              <Crown className="h-4 w-4 text-amber-500 mr-2" />
              Categories
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/products?section=Wedding', label: 'Wedding Designs' },
                { href: '/bundles', label: 'Design Bundles' },
                { href: '/products?section=Business', label: 'Business Cards' },
                { href: '/products?section=Social', label: 'Social Media' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-gray-800 transition-all duration-200 text-sm group flex items-center hover:pl-1"
                  >
                    <span className="w-2 h-0.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
              <MapPin className="h-4 w-4 text-rose-500 mr-2" />
              Contact Us
            </h4>
            <div className="space-y-4">
              {[
                { icon: Phone, text: "+91-9876543210", href: "tel:+91-9876543210", color: "text-emerald-600" },
                { icon: Mail, text: "info@sscreation.com", href: "mailto:info@sscreation.com", color: "text-blue-600" },
                { icon: MapPin, text: "Mumbai, Maharashtra", href: "#", color: "text-rose-600" }
              ].map((contact, index) => (
                <Link
                  key={index}
                  href={contact.href}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200/60 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gradient-to-br group-hover:from-orange-200 group-hover:to-amber-200 group-hover:border-orange-300/60 transition-all duration-300">
                    <contact.icon className={`h-3.5 w-3.5 ${contact.color}`} />
                  </div>
                  <span className="text-sm font-medium">{contact.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-orange-200/60 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
              <p className="text-gray-500">
                © {new Date().getFullYear()} SS Creation. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link href="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 mx-1.5 text-rose-500 fill-current animate-pulse" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}