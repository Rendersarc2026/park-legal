import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactContent from '@/components/ContactContent';

export const metadata: Metadata = {
  title: "Contact Us | Park Legal",
  description: "Get in touch with Park Legal in Kochi. Reach out for expert legal counsel, consultations, and representation.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-24"></div>

      <ContactContent />

      <Footer />
    </main>
  );
}
