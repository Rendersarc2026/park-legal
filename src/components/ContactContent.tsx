'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ExternalLink, User } from 'lucide-react';
import Link from 'next/link';
import AdminLoader from '@/components/AdminLoader';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
} as const;

interface DirectContact {
  name: string;
  phone: string;
}

interface ContactData {
  phone: string;
  email: string;
  address: string;
  directionsLink: string;
  directContacts: DirectContact[];
}

export default function ContactContent() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/contact')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setContactData(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <AdminLoader message="Loading contact information..." className="h-[calc(100vh-6rem)]" />;
  }

  if (!contactData) {
    return (
      <div className="flex-grow flex items-center justify-center py-24 px-6 text-gray-500 font-light text-center">
        Contact details currently unavailable.
      </div>
    );
  }


  return (
    <div className="flex-grow font-sans">
      {/* Hero Section */}
      <section className="relative pt-24 pb-24 px-4 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-light text-[#333333] mb-8 tracking-tight"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#666666] max-w-2xl mx-auto font-light"
          >
            We are dedicated to providing excellent legal representation. Reach out to us for a consultation.
          </motion.p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Primary Contact Info */}
            <motion.div
              {...fadeInUp}
              className="lg:col-span-2 space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Phone Card */}
                <div className="bg-white p-10 rounded-[2rem] border border-gray-200 hover:border-brand-primary/30 transition-all duration-500 group shadow-sm">
                  <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm uppercase tracking-widest text-[#666666] font-light mb-2">Call Us</h3>
                  <a href={`tel:${contactData.phone}`} className="text-2xl font-light text-[#333333] hover:text-brand-primary transition-colors">
                    {contactData.phone}
                  </a>
                  <p className="text-[#666666] mt-2 font-light">Office Reception</p>
                </div>

                {/* Email Card */}
                <div className="bg-white p-10 rounded-[2rem] border border-gray-200 hover:border-brand-primary/30 transition-all duration-500 group shadow-sm">
                  <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm uppercase tracking-widest text-[#666666] font-light mb-2">Email Us</h3>
                  <a href={`mailto:${contactData.email}`} className="text-xl font-light text-[#333333] hover:text-brand-primary transition-colors break-words">
                    {contactData.email}
                  </a>
                  <p className="text-[#666666] mt-2 font-light">Direct Inquiry</p>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white p-10 md:p-14 rounded-[2.5rem] text-[#333333] border border-gray-200 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mb-8">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm uppercase tracking-widest text-[#666666] font-light mb-4">Visit Our Office</h3>
                  <p className="text-2xl font-light mb-6 leading-relaxed">
                    {contactData.address}
                  </p>
                  <Link
                    href={contactData.directionsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand-primary hover:text-[#333333] transition-colors font-light text-lg"
                  >
                    Get Directions <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Side Column - Direct Contacts */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm h-full">
                <h3 className="text-2xl font-light text-[#333333] mb-8">Direct Contacts</h3>
                <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {contactData.directContacts.map((contact, i) => (
                    <div key={i} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-200 hover:border-brand-primary/20 transition-all group">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-sm">
                          <User className="w-5 h-5" />
                        </div>
                        <p className="text-lg font-light text-[#333333]">{contact.name}</p>
                      </div>
                      <a href={`tel:${contact.phone}`} className="text-xl text-[#666666] hover:text-brand-primary transition-colors block ml-14 font-light">
                        {contact.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                  <p className="text-sm text-[#666666] leading-relaxed font-light">
                    Our team is available for urgent consultations. Please reach out to our direct lines for immediate assistance.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-primary/5 border-8 border-gray-50 h-[500px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5955.1606332247375!2d76.2860321959727!3d9.989502845573622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080ddacda75ca7%3A0x7c9ac992a01a6300!2sPark%20Legal!5e0!3m2!1sen!2sin!4v1777449136806!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full transition-all duration-1000"
            ></iframe>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
