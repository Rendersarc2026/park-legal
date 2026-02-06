'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const articles = [
  {
    id: 1,
    title: "Understanding Estate Planning",
    excerpt: "Key tips for securing your family's future.",
    date: "May 12, 2024",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Business Contract Essentials",
    excerpt: "What to know before signing an agreement.",
    date: "Apr 28, 2024",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Real Estate Market Update",
    excerpt: "Recent trends and insights in real estate.",
    date: "Apr 15, 2024",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", // Cityscape
  }
];

export default function NewsArticles() {
  return (
    <section className="py-20 border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex justify-between items-end mb-12 pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-serif text-text-main">News & Articles</h2>
          {/* <Link href="#" className="text-xs uppercase tracking-widest text-text-muted hover:text-brand-primary-dark transition-colors">
            View All Articles {'>'}
          </Link> */}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {articles.map((article, index) => (
            <motion.div 
              key={article.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image 
                  src={article.image} 
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-serif text-text-main mb-2 group-hover:text-brand-primary-dark transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  {article.excerpt}
                </p>
                <span className="text-xs text-brand-primary-dark font-medium">
                  {article.date}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
