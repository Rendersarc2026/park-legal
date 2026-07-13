import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutContent from '@/components/AboutContent';
import { getAbout } from '@/lib/content';

export const metadata: Metadata = {
  title: "About Us | Park Legal",
  description: "Learn about Park Legal, our mission, values, and our commitment to providing excellence in legal practice in Kochi.",
};

export const revalidate = 3600;

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-24"></div>

      <AboutContent about={about} />

      <Footer />
    </main>
  );
}
