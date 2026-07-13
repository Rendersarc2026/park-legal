import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactContent from '@/components/ContactContent';
import { getContact } from '@/lib/content';

export const metadata: Metadata = {
  title: "Contact Us | Park Legal",
  description: "Get in touch with Park Legal in Kochi. Reach out for expert legal counsel, consultations, and representation.",
};

export const revalidate = 3600;

export default async function ContactPage() {
  const contact = await getContact();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-24"></div>

      <ContactContent contact={contact} />

      <Footer />
    </main>
  );
}
