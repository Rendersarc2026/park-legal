import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Park Legal | Professional Legal Services in Kochi",
    template: "%s | Park Legal"
  },
  description: "Park Legal is a premier law firm in Kochi, providing expert legal counsel and representation with integrity and precision. Specializing in corporate, litigation, and personal legal services.",
  keywords: ["Law Firm Kochi", "Legal Services Ernakulam", "Advocates Kochi", "Legal Counsel Kerala", "Park Legal", "Kochi Lawyers", "High Court Advocates"],
  authors: [{ name: "Park Legal" }],
  creator: "Park Legal",
  publisher: "Park Legal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Park Legal | Professional Legal Services in Kochi",
    description: "Expert legal counsel and representation with integrity and precision. Specializing in corporate, litigation, and personal legal services.",
    url: "https://parklegal.in",
    siteName: "Park Legal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Park Legal | Professional Legal Services in Kochi",
    description: "Expert legal counsel and representation with integrity and precision.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
