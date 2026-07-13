'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ExternalLink, User, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import type { ContactData } from '@/lib/content';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
} as const;

export default function ContactContent({ contact }: { contact: ContactData | null }) {
  const contactData = contact;

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
      <section className="relative pt-24 pb-16 px-4 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-light text-[#333333] mb-6 tracking-tight"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#666666] max-w-2xl mx-auto font-light leading-relaxed"
          >
            We are dedicated to providing excellent legal representation. Reach out to our team for consultations or general inquiries.
          </motion.p>
        </div>
      </section>

      {/* Primary Contact Cards: Call, Email, Visit */}
      <section className="py-8 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Phone Card */}
            <motion.div
              {...fadeInUp}
              className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-200 shadow-sm hover:border-black transition-all duration-500 group flex flex-col items-center text-center justify-between min-h-[250px]"
            >
              <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-xs uppercase tracking-widest text-[#666666] font-light mb-3">Call Us</h3>
                <a href={`tel:${contactData.phone}`} className="text-2xl font-light text-[#333333] hover:text-brand-primary transition-colors block">
                  {contactData.phone}
                </a>
              </div>
              <p className="text-[#666666] text-sm mt-4 font-light shrink-0">Office Reception & General Queries</p>
            </motion.div>

            {/* Email Card */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-200 shadow-sm hover:border-black transition-all duration-500 group flex flex-col items-center text-center justify-between min-h-[250px]"
            >
              <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col justify-center w-full">
                <h3 className="text-xs uppercase tracking-widest text-[#666666] font-light mb-3">Email Us</h3>
                <a href={`mailto:${contactData.email}`} className="text-lg font-light text-[#333333] hover:text-brand-primary transition-colors break-all block">
                  {contactData.email}
                </a>
              </div>
              <p className="text-[#666666] text-sm mt-4 font-light shrink-0">Official Communications & Case Intake</p>
            </motion.div>

            {/* Location Card */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-200 shadow-sm hover:border-black transition-all duration-500 group flex flex-col items-center text-center justify-between min-h-[250px]"
            >
              <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-xs uppercase tracking-widest text-[#666666] font-light mb-3">Visit Our Office</h3>
                <p className="text-base font-light text-[#333333] leading-relaxed max-w-xs mx-auto">
                  {contactData.address}
                </p>
              </div>
              <div className="mt-4 shrink-0">
                <Link
                  href={contactData.directionsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-brand-primary hover:underline font-light"
                >
                  Get Directions <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Direct Lines */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Direct Contacts List */}
          <motion.div
            {...fadeInUp}
            className="w-full bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-sm hover:border-black transition-all duration-500"
          >
            <h3 className="text-2xl font-serif text-[#333333] mb-8">Direct Contacts</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {contactData.directContacts.map((contact, i) => (
                <div key={i} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-200 hover:border-black transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-sm shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <p className="text-[15px] font-light text-[#333333] truncate">{contact.name}</p>
                  </div>
                  <a href={`tel:${contact.phone}`} className="text-[15px] text-[#666666] hover:text-brand-primary transition-colors block ml-11 font-light">
                    {contact.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
              <p className="text-sm text-[#666666] leading-relaxed font-light flex gap-2">
                <HelpCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                Our team is available for urgent consultations. Please reach out to our direct lines for immediate assistance.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-200 hover:border-black transition-all duration-500 h-[450px]"
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
