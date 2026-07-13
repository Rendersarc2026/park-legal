import { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsArticles from "@/components/NewsArticles";
import Expertise from "@/components/Expertise";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { getArticles, getSpecializations, getTestimonials } from "@/lib/content";

export const metadata: Metadata = {
  description: "Park Legal is a dedicated law firm in Kochi providing expert legal representation in litigation, corporate law, and personal legal matters.",
};

// Statically rendered and refreshed on demand by the admin routes; the hourly
// window is a safety net in case a revalidation is missed.
export const revalidate = 3600;

export default async function Home() {
  const [articles, specializations, testimonials] = await Promise.all([
    getArticles(10),
    getSpecializations(),
    getTestimonials(20),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <Hero />

      <NewsArticles articles={articles} />
      <Expertise specializations={specializations} />
      <Testimonials testimonials={testimonials} />
      <Footer />
    </main>
  );
}
