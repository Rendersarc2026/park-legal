'use client';

import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/testimonials').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setTestimonials(data);
    });
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-32 bg-white relative overflow-hidden font-sans">
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

        <div className="space-y-16">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
              className="max-w-3xl mx-auto"
            >
              <p className="text-[#666666] text-xl md:text-2xl leading-relaxed mb-6 font-light">
                "{item.quote}"
              </p>
              
              {item.author && (
                <p className="font-medium text-[#333333] mb-2">{item.author}</p>
              )}

              <div className="flex justify-center gap-2 mb-8">
                {[...Array(item.stars)].map((_, i) => (
                  <Star key={i} className="text-yellow-400" size={16} fill="currentColor" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
