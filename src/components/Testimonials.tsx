'use client';

import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16 relative">
             <h2 className="text-3xl font-serif text-text-main inline-block bg-white px-4 relative z-10">Client Reviews</h2>
             <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 -z-0"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 p-10 rounded-sm relative"
          >
            <Quote className="text-brand-primary-dark/20 absolute top-6 left-6" size={48} />
            <p className="text-text-muted italic relative z-10 mb-6 pt-6">
              "Park Legal provided clear, reliable guidance every step of the way."
            </p>
            <div className="text-right">
              <span className="text-sm font-semibold text-text-main">- A.R.</span>
            </div>
            <Quote className="text-brand-primary-dark/20 absolute bottom-6 right-6 rotate-180" size={48} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 p-10 rounded-sm relative"
          >
             <Quote className="text-brand-primary-dark/20 absolute top-6 left-6" size={48} />
             <p className="text-text-muted italic relative z-10 mb-6 pt-6">
              "Professional and trustworthy. Highly recommend Park Legal."
            </p>
            <div className="text-right">
              <span className="text-sm font-semibold text-text-main">- M.S.</span>
            </div>
             <Quote className="text-brand-primary-dark/20 absolute bottom-6 right-6 rotate-180" size={48} />
          </motion.div>

        </div>

      </div>
    </section>
  );
}
