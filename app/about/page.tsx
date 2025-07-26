import { SSRHeader } from '@/components/layout/ssr-header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Users } from 'lucide-react';
import { Metadata } from 'next';
import { HeroSection } from '@/components/home/hero-section';

export const metadata: Metadata = {
  title: 'About SSCreation - Our Story & Mission | Premium Graphic Design Templates',
  description: 'Learn about SSCreation\'s journey in creating premium graphic design templates. Discover our mission to provide high-quality, creative design solutions for businesses and individuals worldwide.',
  keywords: 'About SSCreation, SS Creation story, graphic design company, design team, premium templates, creative professionals, design mission, graphic design services',
  openGraph: {
    title: 'About SSCreation - Our Story & Mission',
    description: 'Learn about SSCreation\'s journey in creating premium graphic design templates and our mission to democratize great design.',
    url: 'https://sscreation.com/about',
  },
  alternates: {
    canonical: 'https://sscreation.com/about',
  },
};

export default function About() {
  return (
    <div className="min-h-screen">
      <main>
      <HeroSection />

        <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">About SS Creation</h1>
              <p className="text-xl text-gray-600 mb-8">
                We are passionate graphic designers dedicated to bringing your creative visions to life through stunning visual designs.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                  <p className="text-gray-600">
                    To provide high-quality, creative graphic design solutions that help businesses and individuals express their unique identity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                  <p className="text-gray-600">
                    To become the leading platform for graphic design templates and custom design services in the digital space.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Our Team</h3>
                  <p className="text-gray-600">
                    A dedicated team of creative professionals with years of experience in graphic design and digital marketing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  SS Creation was founded with a simple belief: great design should be accessible to everyone. 
                  We started as a small team of passionate designers who wanted to democratize the world of 
                  graphic design by creating beautiful, professional templates that anyone can use.
                </p>
                <p className="text-gray-600 mb-6">
                  Today, we serve thousands of customers worldwide with our extensive collection of design 
                  templates for festivals, celebrations, business needs, and personal projects. Our designs 
                  are crafted with attention to detail and cultural sensitivity, ensuring they resonate with 
                  our diverse customer base.
                </p>
                <p className="text-gray-600">
                  We're constantly evolving, adding new designs, and improving our services to better serve 
                  our community. Whether you're a small business owner, event planner, or someone who loves 
                  creating beautiful content, we're here to help you bring your vision to life.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}