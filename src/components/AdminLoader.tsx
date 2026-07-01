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
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border border-brand-primary/20" />
        <div className="text-brand-primary">
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
