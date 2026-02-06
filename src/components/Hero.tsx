'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <div className="relative w-full h-full bg-gray-200">
             <Image 
                src="/assets/park-label-hero.png"
                alt="Park Legal Office"
                fill
                className="object-cover opacity-80"
                priority
             />
             <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-[-5%]">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-6xl md:text-8xl text-text-main mb-6 drop-shadow-sm tracking-tight"
        >
          Park Legal
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl md:text-2xl text-text-muted font-light max-w-2xl mx-auto leading-relaxed"
        >
          Excellence in legal practice, dedicated to your peace of mind and success.
        </motion.p>
      </div>
      
      {/* Decorative gradient at bottom to blend with next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
}
