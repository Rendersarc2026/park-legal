import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Park Legal in Kochi. Reach out for expert legal counsel, consultations, and representation.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-24"></div>

      <section className="flex-grow py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-8 text-center">Contact Us</h1>
          
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-medium text-text-main mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-text-muted mb-1">Office</p>
                    <a href="tel:+919995905111" className="text-xl text-text-main hover:text-brand-primary transition-colors">
                      +91 99959 05111
                    </a>
                    <p className="text-sm text-text-muted mt-1">Park Legal</p>
                  </div>

                  <div>
                    <p className="text-sm uppercase tracking-wide text-text-muted mb-1">Email</p>
                    <a href="mailto:parklegalkochi@gmail.com" className="text-xl text-text-main hover:text-brand-primary transition-colors">
                      parklegalkochi@gmail.com
                    </a>
                  </div>

                  <div>
                    <p className="text-sm uppercase tracking-wide text-text-muted mb-1">Location</p>
                    <p className="text-lg text-text-main">
                      1st Floor, Johns Corner Building, Judges Ave, GCDA LIG Colony, <br />
                      Ernakulam North, Kathrikadavu, Kaloor, Kochi, Ernakulam, Kerala 682017
                    </p>
                    <Link 
                        href="https://share.google/RA8iNjjGzmtfZquIz" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:underline mt-2 inline-block font-medium"
                    >
                        View on Google Maps &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Team Contacts */}
              <div>
                <h2 className="text-2xl font-medium text-text-main mb-6">Direct Contacts</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-white rounded-lg border border-gray-100">
                    <p className="text-lg font-medium text-text-main">Aravind</p>
                    <a href="tel:8714812848" className="text-text-muted hover:text-brand-primary transition-colors block mt-1">
                      87148 12848
                    </a>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-100">
                    <p className="text-lg font-medium text-text-main">Manu</p>
                    <a href="tel:9400897108" className="text-text-muted hover:text-brand-primary transition-colors block mt-1">
                      94008 97108
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto text-text-muted">
            <p>
              We are dedicated to providing excellent legal representation. 
              Reach out to us for a consultation.
            </p>
          </div>

          <div className="mt-16 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-[450px] overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5955.1606332247375!2d76.2860321959727!3d9.989502845573622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080ddacda75ca7%3A0x7c9ac992a01a6300!2sPark%20Legal!5e0!3m2!1sen!2sin!4v1777449136806!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
