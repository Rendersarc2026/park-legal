import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-24 pb-12 bg-white border-t border-gray-100 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/assets/logo.svg"
                alt="Park Legal Logo"
                width={150}
                height={40}
                className="h-8 w-auto grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            </Link>
            <p className="text-[#666666] font-light leading-relaxed max-w-sm mb-8">
              Litigate with Clarity.
              Clear thinking. Strong advocacy. Compassionate representation for corporate and personal legal needs.            </p>
            <div className="flex gap-4">
              {/* Social icons could go here */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-[#333333] font-light mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-[#666666] hover:text-brand-primary transition-colors font-light text-sm flex items-center group"
                  >
                    {item} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-[#333333] font-light mb-8">Get In Touch</h4>
            <ul className="space-y-4 text-sm text-[#666666] font-light">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                <span className="leading-relaxed">
                  1st Floor, Johns Corner Building, Judges Ave, Kochi, Kerala 682017
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-brand-primary shrink-0" />
                <a href="mailto:parklegalkochi@gmail.com" className="hover:text-brand-primary transition-colors">
                  parklegalkochi@gmail.com
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-brand-primary shrink-0" />
                <a href="tel:+919995905111" className="hover:text-brand-primary transition-colors">
                  +91 99959 05111
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#9CA3AF] font-light tracking-widest">
            © 2024 PARK LEGAL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF] font-light">
            <Link href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-brand-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
