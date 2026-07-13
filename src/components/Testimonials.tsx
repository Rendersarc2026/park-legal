'use client';

import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import type { TestimonialData } from '@/lib/content';

export default function Testimonials({ testimonials }: { testimonials: TestimonialData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      return nextIndex;
    });
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 10000);
    return () => clearInterval(timer);
  }, [testimonials.length, paginate]);

  if (testimonials.length === 0) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <section className="py-32 bg-white relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -ml-32 -mt-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -mr-48 -mb-48"></div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-sm uppercase tracking-[0.4em] text-brand-primary font-light mb-4">Client Feedback</h2>
          <h3 className="text-3xl md:text-4xl font-light text-[#333333] leading-tight">
            Trust From Our Clients
          </h3>
        </motion.div>

        <div className="relative min-h-[400px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 150, damping: 22 },
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 }
              }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="flex justify-center mb-10">
                <div className="w-16 h-16 bg-brand-primary/5 rounded-full flex items-center justify-center text-brand-primary/20">
                  <Quote size={40} fill="currentColor" />
                </div>
              </div>

              <blockquote className="text-[#555555] text-lg md:text-2xl leading-relaxed mb-10 font-light italic px-8 md:px-16">
                &quot;{testimonials[currentIndex].quote}&quot;
              </blockquote>
              
              <div className="space-y-4">
                {testimonials[currentIndex].author && (
                  <p className="text-base font-medium text-[#333333] tracking-tight">
                    {testimonials[currentIndex].author}
                  </p>
                )}

                <div className="flex justify-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={i < testimonials[currentIndex].stars ? "text-yellow-400" : "text-gray-200"} 
                      size={18} 
                      fill="currentColor" 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={() => paginate(-1)}
                className="absolute left-4 md:-left-16 top-1/2 -translate-y-1/2 p-4 text-[#333333]/30 hover:text-brand-primary transition-colors duration-300 focus:outline-none hidden md:block"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={48} strokeWidth={1} />
              </button>
              <button
                onClick={() => paginate(1)}
                className="absolute right-4 md:-right-16 top-1/2 -translate-y-1/2 p-4 text-[#333333]/30 hover:text-brand-primary transition-colors duration-300 focus:outline-none hidden md:block"
                aria-label="Next testimonial"
              >
                <ChevronRight size={48} strokeWidth={1} />
              </button>

              {/* Pagination Dots */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      index === currentIndex 
                        ? "bg-brand-primary w-8" 
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
