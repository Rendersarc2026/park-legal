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
          <div className="absolute inset-0 bg-white/20"></div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <Image
            src="/assets/logo.png"
            alt="Park Legal Logo"
            width={700}
            height={120}
            className="w-[110px] md:w-[150px] h-auto drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-full bg-gradient-to-r from-transparent via-white/50 to-transparent backdrop-blur-[2px] py-4 md:py-6 flex justify-center items-center [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
        >
          <h1 className="text-base md:text-xl lg:text-2xl font-serif tracking-[0.25em] text-[#1A1A1A] uppercase text-center px-6 leading-tight">
            Litigate with Clarity
          </h1>
        </motion.div>
      </div>

      {/* Decorative gradient at bottom to blend with next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
}
