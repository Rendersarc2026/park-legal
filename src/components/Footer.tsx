import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 bg-gray-50 border-t border-gray-200 text-center md:text-left text-sm text-text-muted">
      {/* Upper Footer (if needed) - Keeping it minimal as per design */}
      
      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        <div className="mb-4 md:mb-0">
          <span className="font-serif text-lg text-text-main mr-4">Park Legal</span>
          <span>123 Main Street, Suite 400, Cityville, CA 12345</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <span>© 2024 Park Legal</span>
          <span className="hidden md:inline">|</span>
          <Link href="#" className="hover:text-text-main">Privacy Policy</Link>
          <span className="hidden md:inline">|</span>
          <Link href="#" className="hover:text-text-main">info@parklegal.com</Link>
        </div>

      </div>
    </footer>
  );
}
