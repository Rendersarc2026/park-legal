import { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsArticles from "@/components/NewsArticles";
import Expertise from "@/components/Expertise";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  description: "Park Legal is a dedicated law firm in Kochi providing expert legal representation in litigation, corporate law, and personal legal matters.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <Hero />

      <NewsArticles />
      <Expertise />
      <Testimonials />
      <Footer />
    </main>
  );
}
