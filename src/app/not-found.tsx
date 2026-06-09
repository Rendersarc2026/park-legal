'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Phone, ArrowUpRight } from 'lucide-react';


export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center px-6 py-20 font-sans relative overflow-hidden">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-[#C53030]/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-xl w-full text-center relative z-10">
          
          {/* Animated Scale of Justice */}
          <div className="relative flex items-center justify-center w-36 h-36 mx-auto mb-6">
            {/* Pulsing Outer Ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.05, 0.2] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-brand-primary/20"
            />
            {/* Pulsing Inner Ring */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.05, 0.15] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute inset-3 rounded-full border border-brand-primary/30"
            />
            {/* Tilting Scale */}
            <motion.div
              initial={{ rotate: -6 }}
              animate={{ rotate: 6 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 3,
                ease: "easeInOut"
              }}
              className="relative z-10 text-brand-primary"
            >
              <Scale className="w-16 h-16 stroke-[1.2]" />
            </motion.div>
          </div>

          {/* Error Code */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-8xl md:text-9xl font-serif font-extralight text-[#333333] tracking-widest select-none"
          >
            404
          </motion.h1>

          {/* Elegant Horizontal Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-20 h-[1px] bg-brand-primary/45 mx-auto my-6"
          />

          {/* Heading and Copy */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl md:text-3xl font-serif font-light text-[#333333] mb-4"
          >
            Out of Jurisdiction
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-[#666666] font-light leading-relaxed mb-10 text-sm md:text-base max-w-md mx-auto"
          >
            The legal document or web resource you requested could not be located in our records. The address may have changed, or the page was moved out of jurisdiction.
          </motion.p>

          {/* Navigation Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/"
              className="w-full sm:w-auto bg-[#333333] hover:bg-[#C53030] text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-sm hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Return to Chambers</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            
            <Link
              href="/contact"
              className="w-full sm:w-auto border border-gray-300 hover:border-[#333333] text-[#333333] hover:bg-gray-50 px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-brand-primary" />
              <span>Contact Counsel</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
