'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import * as LucideIcons from 'lucide-react';


interface Specialization {
  id: string;
  label: string;
  description: string;
  details: string[];
}

interface DBSpecialization {
  id: string;
  icon: string;
  label: string;
  description: string;
  details: string[];
}

const containerVariants: Variants = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 }
  }
};

export default function Expertise() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);

  useEffect(() => {
    fetch('/api/admin/specializations')
      .then(r => r.json())
      .then(data => {
        if (data.specializations) {
          const mapped = data.specializations.map((item: DBSpecialization) => {
            return {
              id: item.id,
              label: item.label,
              description: item.description,
              details: item.details,
            };
          });
          setSpecializations(mapped);
        }
      })
      .catch(err => console.error('Error fetching specializations:', err));
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedSpecialization) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSpecialization]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSpecialization(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="py-28 bg-[#fafafa] relative overflow-hidden font-sans">
      {/* Decorative gradient backdrops */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary-dark/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 text-center md:text-left md:flex md:items-end md:justify-between gap-8 border-b border-gray-100 pb-12">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.4em] text-brand-primary font-semibold mb-4 inline-block">
              Our Specialization
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-text-main leading-tight tracking-tight mt-2">
              Comprehensive Legal Solutions <br />
              <span className="font-normal text-brand-primary">Tailored to Your Specific Needs</span>
            </h2>
          </div>
          <p className="text-text-muted font-light max-w-md mt-6 md:mt-0 text-base leading-relaxed">
            We offer expert, strategically structured representation across multiple litigation and advisory domains, protecting your interests at every step.
          </p>
        </div>

        {specializations.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {specializations.map((spec, index) => (
              <motion.div
                key={spec.id || index}
                variants={itemVariants}
                onClick={() => setSelectedSpecialization(spec)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedSpecialization(spec);
                  }
                }}
                className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-brand-primary/30 shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-500 flex flex-col justify-between cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <div>
                  <h3 className="text-xl font-normal text-text-main mb-4 group-hover:text-brand-primary transition-colors duration-300">
                    {spec.label}
                  </h3>
                  <p className="text-text-muted font-light leading-relaxed text-sm line-clamp-3">
                    {spec.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-2 text-brand-primary font-medium text-sm transition-all duration-300">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Read Full Details</span>
                  <LucideIcons.ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Specialization Details Modal */}
      <AnimatePresence>
        {selectedSpecialization && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpecialization(null)}
              className="absolute inset-0 bg-[#111111]/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 180 }}
              className="bg-white/95 border border-gray-100/50 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 max-w-3xl w-full max-h-[85vh] overflow-y-auto relative z-10 flex flex-col justify-between scrollbar-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSpecialization(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 text-text-muted hover:bg-brand-primary hover:text-white transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                aria-label="Close modal"
              >
                <LucideIcons.X size={20} />
              </button>

              <div>
                {/* Header Label */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold">Specialization Focus</span>
                    <h2 className="text-2xl md:text-3xl font-light text-text-main leading-tight mt-1">
                      {selectedSpecialization.label}
                    </h2>
                  </div>
                </div>

                {/* Paragraph Details */}
                <div className="space-y-6 text-text-muted font-light leading-relaxed text-base md:text-lg border-t border-gray-100 pt-8">
                  {selectedSpecialization.details.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? "text-text-main font-normal" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>


            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

