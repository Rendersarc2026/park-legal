'use client';

import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#F3F4F6]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <h2 className="text-4xl font-serif mb-12 text-[#1f2937]">
          <span className="text-[#EF4444]">Testimonials</span> Of Clients
        </h2>
        
        <div className="flex justify-center mb-8">
             <Quote className="text-[#1f2937]" size={40} fill="currentColor" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-[#4B5563] text-lg leading-relaxed mb-8 font-serif">
            Jyotsna provided my company with outstanding legal assistance. Her work was thoughtful, timely and complete. Her advice is pragmatic and she is able to quickly understand and help resolve issues faced by foreign entities seeking to do business in India. I would highly recommend her – most particularly in connection with merger and acquisition legal services.
          </p>
          
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="text-[#EF4444]" size={20} fill="currentColor" />
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-[#1f2937] mb-1">Debbie Rosen</h3>
            <p className="text-[#9CA3AF] text-sm">Vice President/CLO at Standex International</p>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
