'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: "Understanding Estate Planning",
    excerpt: "Key tips for securing your family's future through meticulous planning and documentation.",
    date: "May 12, 2024",
    category: "Legal Advice",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Business Contract Essentials",
    excerpt: "What to know before signing an agreement to protect your business interests and minimize risk.",
    date: "Apr 28, 2024",
    category: "Corporate",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Real Estate Market Update",
    excerpt: "Recent trends and insights in the real estate sector and how they impact property law.",
    date: "Apr 15, 2024",
    category: "Property",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
  }
];



export default function NewsArticles() {
  return (
    <section className="py-32 bg-white relative overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm uppercase tracking-[0.4em] text-brand-primary font-light mb-4">Latest Insights</h2>
            <h3 className="text-4xl md:text-5xl font-light text-[#333333] leading-tight tracking-tight">
              News & Articles
            </h3>
          </div>
          <motion.button 
            whileHover={{ x: 5 }}
            className="text-sm uppercase tracking-widest text-brand-primary font-light flex items-center gap-2 group transition-colors"
          >
            Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {articles.map((article, index) => (
            <motion.article 
              key={article.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] mb-8 shadow-sm group-hover:shadow-xl group-hover:shadow-brand-primary/10 transition-all duration-500">
                <Image 
                  src={article.image} 
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest font-light text-brand-primary border border-white/20 shadow-sm">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#666666] font-light">
                  <Calendar className="w-3 h-3 text-brand-primary/60" />
                  {article.date}
                </div>
                <h4 className="text-2xl font-light text-[#333333] leading-tight group-hover:text-brand-primary transition-colors duration-300">
                  {article.title}
                </h4>
                <p className="text-[#666666] font-light leading-relaxed line-clamp-2 text-sm">
                  {article.excerpt}
                </p>
                <div className="pt-4 flex items-center gap-2 text-xs text-brand-primary font-light opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  Read Full Article <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
