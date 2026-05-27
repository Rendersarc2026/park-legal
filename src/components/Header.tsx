'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 md:py-5 flex justify-between items-center transition-all duration-500 font-sans ${isMenuOpen ? 'bg-white' : isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'}`}
      >
        <Link href="/" className="z-50 relative group">
          <div className="relative">
            <Image
              src="/assets/logo.png"
              alt="Park Legal Logo"
              width={360}
              height={120}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-12 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`relative text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300 hover:text-[#C53030] ${isActive(link.path) ? 'text-[#C53030]' : 'text-[#333333]'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className={`md:hidden z-50 relative p-2 rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-brand-primary text-white' : 'bg-gray-100 text-[#333333]'}`}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden overflow-hidden border-t border-gray-200"
            >
              <nav className="flex flex-col p-8 gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={toggleMenu}
                    className={`text-xl font-medium transition-colors ${isActive(link.path) ? 'text-[#C53030]' : 'text-[#333333]'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
