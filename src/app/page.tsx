import Header from "@/components/Header";
import Hero from "@/components/Hero";

import NewsArticles from "@/components/NewsArticles";
import Expertise from "@/components/Expertise";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

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
