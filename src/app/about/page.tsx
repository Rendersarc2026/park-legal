import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutContent from '@/components/AboutContent';

export const metadata: Metadata = {
  title: "About Us | Park Legal",
  description: "Learn about Park Legal, our mission, values, and our commitment to providing excellence in legal practice in Kochi.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-24"></div>

      <AboutContent />

      <Footer />
    </main>
  );
}
