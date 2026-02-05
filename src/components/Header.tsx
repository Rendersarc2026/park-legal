import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent py-6 px-8 flex justify-between items-center backdrop-blur-sm bg-white/10 hover:bg-white/90 transition-all duration-300 group">
      <div className="text-2xl font-serif text-brand-primary-dark group-hover:text-text-main transition-colors">
        Park Legal
      </div>
      
      <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-text-muted">
        <Link href="#" className="hover:text-brand-primary-dark transition-colors">Home</Link>
        <Link href="#" className="hover:text-brand-primary-dark transition-colors">About</Link>
        <Link href="#" className="hover:text-brand-primary-dark transition-colors">Expertise</Link>
        <Link href="#" className="hover:text-brand-primary-dark transition-colors">News</Link>
        <Link href="#" className="hover:text-brand-primary-dark transition-colors">Contact</Link>
      </nav>

      {/* Mobile Menu Icon */}
      <button className="md:hidden text-text-muted hover:text-text-main">
        <Menu size={24} />
      </button>
    </header>
  );
}
