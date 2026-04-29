'use client';

import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Testimonials() {
  return (
    <section className="py-32 bg-white relative overflow-hidden font-sans">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -ml-32 -mt-32"></div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm uppercase tracking-[0.4em] text-brand-primary font-light mb-4">Client Feedback</h2>
          <h3 className="text-4xl md:text-5xl font-light text-[#333333] mb-16 leading-tight">
            Trust From Our Clients
          </h3>
        </motion.div>

        <div className="flex justify-center mb-12">
          <div className="w-16 h-16 bg-brand-primary/5 rounded-full flex items-center justify-center text-brand-primary/40">
            <Quote size={32} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-[#666666] text-xl md:text-2xl leading-relaxed mb-12 font-light">
            &quot;Jyotsna provided my company with outstanding legal assistance. Her work was thoughtful, timely and complete. Her advice is pragmatic and she is able to quickly understand and help resolve issues faced by foreign entities seeking to do business in India.&quot;
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="text-brand-primary/40" size={16} fill="currentColor" />
            ))}
          </div>

          {/* <div className="text-center">
            <h4 className="text-xl font-light text-[#333333] mb-1">Debbie Rosen</h4>
            <p className="text-[#9CA3AF] text-sm uppercase tracking-widest font-light">Vice President/CLO at Standex International</p>
          </div> */}
        </motion.div>

      </div>
    </section>
  );
}
