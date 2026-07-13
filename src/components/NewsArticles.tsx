'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ArticleData } from '@/lib/content';

type Article = ArticleData;

export default function NewsArticles({ articles }: { articles: Article[] }) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArticle]);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  const nextSlide = () => {
    if (articles.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    if (articles.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  if (articles.length === 0) return null;

  return (
    <section className="py-32 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm uppercase tracking-[0.4em] text-brand-primary font-light mb-4">Latest Insights</h2>
            <h3 className="text-3xl md:text-5xl font-light text-[#333333] leading-tight tracking-tight">
              News & Articles
            </h3>
          </div>
          
          {/* Carousel Controls */}
          {articles.length > 3 && (
            <div className="flex items-center gap-4">
              <button
                onClick={prevSlide}
                className="p-4 rounded-full border border-gray-100 text-gray-400 hover:text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 transition-all duration-300"
                aria-label="Previous article"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-4 rounded-full border border-gray-100 text-gray-400 hover:text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 transition-all duration-300"
                aria-label="Next article"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="overflow-hidden -mx-4 px-4">
            <motion.div 
              className="flex gap-8"
              animate={{ x: `calc(-${currentIndex * (100 / 3.1)}%)` }}
              transition={{ type: "spring", stiffness: 150, damping: 22 }}
            >
              {articles.map((article, index) => (
                <motion.article 
                  key={article.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.985 }}
                  className="min-w-[calc(100%-2rem)] sm:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1.5rem)] group cursor-pointer will-change-transform"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2.5rem] mb-8 shadow-sm group-hover:shadow-2xl group-hover:shadow-brand-primary/10 transition-all duration-500 bg-gray-50 border border-gray-100">
                    <Image 
                      src={(article.imageUrl?.startsWith('/') || article.imageUrl?.startsWith('http')) 
                        ? article.imageUrl 
                        : "https://images.unsplash.com/photo-1589829085413-51de8ae18c73?auto=format&fit=crop&q=80&w=800"} 
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest font-medium text-brand-primary border border-white/20 shadow-sm">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#999999] font-light">
                      <Calendar className="w-3 h-3 text-brand-primary/60" />
                      {article.date}
                    </div>
                    <h4 className="text-xl md:text-2xl font-light text-[#333333] leading-tight group-hover:text-brand-primary transition-colors duration-300">
                      {article.title}
                    </h4>
                    <p className="text-[#666666] font-light leading-relaxed line-clamp-2 text-sm">
                      {article.excerpt}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs text-brand-primary font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      Read Full Article <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-16 flex justify-center gap-2">
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 transition-all duration-500 rounded-full ${
                currentIndex === i 
                  ? "w-8 bg-brand-primary" 
                  : "w-2 bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`Go to article ${i + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 180 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 z-20 p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:text-black transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative w-full aspect-[21/9] md:aspect-[21/7] overflow-hidden bg-gray-50 border-b border-gray-100">
                <Image 
                  src={(selectedArticle.imageUrl?.startsWith('/') || selectedArticle.imageUrl?.startsWith('http')) 
                    ? selectedArticle.imageUrl 
                    : "https://images.unsplash.com/photo-1589829085413-51de8ae18c73?auto=format&fit=crop&q=80&w=800"} 
                  alt={selectedArticle.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] uppercase tracking-widest font-medium">
                      {selectedArticle.category}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#666666] font-light">
                      <Calendar className="w-3 h-3" />
                      {selectedArticle.date}
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-light text-[#333333] leading-tight mb-8">
                    {selectedArticle.title}
                  </h2>

                  <div className="prose prose-sm md:prose-base max-w-none text-[#555555] font-light leading-relaxed space-y-6">
                    {selectedArticle.content ? (
                      selectedArticle.content.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))
                    ) : (
                      <p>{selectedArticle.excerpt}</p>
                    )}
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-[#999999] italic">
                      Park Legal Insights
                    </div>
                    <button 
                      onClick={closeModal}
                      className="text-xs font-medium text-brand-primary hover:underline"
                    >
                      Close Article
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
