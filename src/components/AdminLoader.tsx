'use client';

import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

interface AdminLoaderProps {
  message?: string;
  className?: string;
}

export default function AdminLoader({ 
  message = 'Loading administration data...',
  className = 'min-h-[400px]'
}: AdminLoaderProps) {
  return (
    <div className={`w-full flex flex-col items-center justify-center py-16 px-4 font-sans ${className}`}>
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        {/* Pulsing rings */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.05, 0.25] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-brand-primary/20"
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.05, 0.2] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.6 }}
          className="absolute inset-2 rounded-full border border-brand-primary/30"
        />
        {/* Spinning indicator ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-transparent border-t-brand-primary border-r-brand-primary/30"
        />
        {/* Scale icon */}
        <div className="relative z-10 text-brand-primary">
          <Scale className="w-8 h-8 stroke-[1.2]" />
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-xs font-light text-gray-500 uppercase tracking-[0.25em] text-center"
      >
        {message}
      </motion.p>
    </div>
  );
}
