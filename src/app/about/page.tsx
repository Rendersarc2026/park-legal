import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Park Legal, our mission, values, and our commitment to providing excellence in legal practice in Kochi.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-24"></div>

      <section className="flex-grow py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-8 text-center">About Park Legal</h1>
          
          <div className="prose prose-lg mx-auto text-text-muted">
            <p className="lead text-xl md:text-2xl font-light mb-8 text-center text-text-main">
              Dedicated to delivering excellence in legal practice and safeguarding our clients' interests with integrity and precision.
            </p>

            <div className="mb-12">
              <h2 className="text-2xl font-serif text-text-main mb-4">Our Mission</h2>
              <p className="mb-4">
                At Park Legal, our mission is to provide comprehensive, high-quality legal services that meet the unique needs of each client. We believe in a client-centric approach, where understanding your goals and challenges is the foundation of our legal strategy.
              </p>
              <p>
                We strive to build lasting relationships based on trust, transparency, and results. Whether navigating complex litigation or providing counsel on corporate matters, our team is committed to achieving the best possible outcome for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                <h3 className="text-xl font-serif text-text-main mb-3">Our Values</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Integrity in all our dealings</li>
                  <li>Excellence in legal advocacy</li>
                  <li>Commitment to client success</li>
                  <li>Innovative problem solving</li>
                </ul>
              </div>
               <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                <h3 className="text-xl font-serif text-text-main mb-3">Our History</h3>
                <p>
                  Founded with a vision to modernize legal practice while honoring traditional values of the profession, Park Legal has grown into a respected firm known for its detailed approach and unwavering dedication.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-text-main mb-4">Why Choose Us?</h2>
              <p>
                We combine deep legal expertise with a practical understanding of the real-world challenges our clients face. Our proactive approach ensures that we not only address current legal issues but also help prevent future complications.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
