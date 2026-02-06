'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-8 flex justify-between items-center transition-all duration-300 group
          ${isScrolled || isMenuOpen ? 'bg-white/50 backdrop-blur-md shadow-md py-3 md:py-4' : 'bg-transparent py-4 md:py-6'}
        `}
      >
        <Link href="/" className="z-50 relative">
          <Image 
            src="/assets/logo.svg" 
            alt="Park Legal Logo" 
            width={180} 
            height={60} 
            className={`w-auto object-contain transition-all duration-300 ${isScrolled || isMenuOpen ? 'h-10 md:h-12' : 'h-12 md:h-16'}`}
            priority
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className={`hidden md:flex gap-8 text-sm uppercase tracking-widest transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-black'}`}>
          <Link 
            href="/" 
            className={`transition-colors hover:text-red-700 ${isActive('/') ? 'text-red-600 font-bold' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`transition-colors hover:text-red-700 ${isActive('/about') ? 'text-red-600 font-bold' : ''}`}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={`transition-colors hover:text-red-700 ${isActive('/contact') ? 'text-red-600 font-bold' : ''}`}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className={`md:hidden z-50 relative p-2 transition-colors ${isScrolled || isMenuOpen ? 'text-text-muted' : 'text-black'}`}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation Dropdown */}
        <div className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col p-6 gap-4 text-sm uppercase tracking-widest text-text-muted">
            <Link 
              href="/" 
              onClick={toggleMenu} 
              className={`hover:text-red-700 transition-colors border-b border-gray-100 pb-2 ${isActive('/') ? 'text-red-600 font-bold' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              onClick={toggleMenu} 
              className={`hover:text-red-700 transition-colors border-b border-gray-100 pb-2 ${isActive('/about') ? 'text-red-600 font-bold' : ''}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              onClick={toggleMenu} 
              className={`hover:text-red-700 transition-colors pb-2 ${isActive('/contact') ? 'text-red-600 font-bold' : ''}`}
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
