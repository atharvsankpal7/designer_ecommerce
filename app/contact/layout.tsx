import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact SSCreation - Get in Touch | Custom Design Services & Support',
  description: 'Contact SSCreation for custom graphic design services, template support, or business inquiries. Get professional design solutions tailored to your needs. Phone, email, and online support available.',
  keywords: 'Contact SSCreation, custom design services, graphic design support, business inquiries, design consultation, SSCreation contact information, design services India',
  openGraph: {
    title: 'Contact SSCreation - Get in Touch',
    description: 'Contact SSCreation for custom graphic design services, template support, or business inquiries. Professional design solutions available.',
    url: 'https://sscreation.com/contact',
  },
  alternates: {
    canonical: 'https://sscreation.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}