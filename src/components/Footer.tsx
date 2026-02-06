import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 bg-gray-50 border-t border-gray-200 text-center md:text-left text-sm text-text-muted">
      {/* Upper Footer (if needed) - Keeping it minimal as per design */}
      
      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start text-center md:text-left">
          <span className="font-serif text-lg text-text-main mb-2">Park Legal</span>
          <span className="max-w-md mx-auto md:mx-0 leading-relaxed">
            1st Floor, Johns Corner Building, Judges Ave, GCDA LIG Colony, 
            Ernakulam North, Kathrikadavu, Kaloor, Kochi, Ernakulam, Kerala 682017
          </span>
          <Link 
            href="https://share.google/RA8iNjjGzmtfZquIz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-primary hover:underline text-xs mt-2 inline-flex items-center"
          >
            View on Map
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <span>© 2024 Park Legal</span>
          <span className="hidden md:inline">|</span>
          <Link href="#" className="hover:text-text-main">Privacy Policy</Link>
          <span className="hidden md:inline">|</span>
          <Link href="mailto:parklegalkochi@gmail.com" className="hover:text-text-main">parklegalkochi@gmail.com</Link>
        </div>

      </div>
    </footer>
  );
}
