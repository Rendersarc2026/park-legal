'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 py-3 md:py-4 px-6 md:px-8 flex justify-between items-center transition-all duration-300 group shadow-md bg-white`}>
        <Link href="/" className="z-50 relative">
          <Image 
            src="/assets/logo.png" 
            alt="Park Legal Logo" 
            width={180} 
            height={60} 
            className="w-auto h-10 md:h-14 object-contain"
            priority
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-text-muted">
          <Link href="/" className="hover:text-brand-primary-dark transition-colors">Home</Link>
          <Link href="/about" className="hover:text-brand-primary-dark transition-colors">About</Link>
          <Link href="/contact" className="hover:text-brand-primary-dark transition-colors">Contact</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-text-muted hover:text-text-main z-50 relative p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation Dropdown */}
        <div className={`absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col p-6 gap-4 text-sm uppercase tracking-widest text-text-muted">
            <Link href="/" onClick={toggleMenu} className="hover:text-brand-primary-dark transition-colors border-b border-gray-100 pb-2">Home</Link>
            <Link href="/about" onClick={toggleMenu} className="hover:text-brand-primary-dark transition-colors border-b border-gray-100 pb-2">About</Link>
            <Link href="/contact" onClick={toggleMenu} className="hover:text-brand-primary-dark transition-colors pb-2">Contact</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
