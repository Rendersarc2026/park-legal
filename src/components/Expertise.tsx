'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { SpecializationData } from '@/lib/content';

type Specialization = SpecializationData;

export default function Expertise({ specializations }: { specializations: Specialization[] }) {
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState({ thumbWidth: 0, thumbOffset: 0 });

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
      
      if (scrollWidth > 0) {
        const thumbWidth = (clientWidth / scrollWidth) * 100;
        const thumbOffset = (scrollLeft / scrollWidth) * 100;
        setScrollProgress({ thumbWidth, thumbOffset });
      }
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      const timer = setTimeout(() => {
        checkScroll();
      }, 100);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        clearTimeout(timer);
      };
    }
  }, [specializations]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
          <div className="relative">
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-none pb-8 snap-x snap-mandatory px-6 -mx-6 scroll-px-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:mx-0 md:pb-0 md:snap-none"
            >
              {specializations.map((spec, index) => (
                <motion.div
                  key={spec.id || index}
                  onClick={() => setSelectedSpecialization(spec)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedSpecialization(spec);
                    }
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.16, 1, 0.3, 1], // easeOutExpo
                    delay: index * 0.08 
                  }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.02,
                    boxShadow: "0 20px 40px -15px rgba(143, 163, 163, 0.12)",
                    borderColor: "rgba(143, 163, 163, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start shrink-0 w-[290px] sm:w-[350px] md:w-full md:shrink md:snap-none min-h-[300px] transition-[border-color] duration-300"
                >
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-normal text-text-main mb-4 group-hover:text-brand-primary transition-colors duration-300">
                        {spec.label}
                      </h3>
                      <p className="text-text-muted font-light leading-relaxed text-sm line-clamp-4">
                        {spec.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-2 text-brand-primary font-medium text-sm transition-all duration-300">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Read Full Details</span>
                      <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scroll Progress Bar & Controls */}
            <div className="flex justify-between items-center mt-6 md:hidden">
              {/* Progress bar */}
              <div className="w-48 bg-gray-100 h-[3px] rounded-full relative">
                <div 
                  className="bg-brand-primary h-full rounded-full absolute top-0 transition-all duration-150 ease-out"
                  style={{
                    width: `${scrollProgress.thumbWidth || 20}%`,
                    left: `${scrollProgress.thumbOffset || 0}%`
                  }}
                />
              </div>
              
              {/* Mobile/Tablet Arrow Navigation */}
              <div className="flex md:hidden items-center gap-3">
                <button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={`p-2.5 rounded-full border transition-all duration-300 ${
                    canScrollLeft
                      ? 'border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white cursor-pointer'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={`p-2.5 rounded-full border transition-all duration-300 ${
                    canScrollRight
                      ? 'border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white cursor-pointer'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
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
                <X size={20} />
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

