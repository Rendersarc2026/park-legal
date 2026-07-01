'use client';

import { motion } from 'framer-motion';
import { Scale, Shield, Users, Lightbulb, CheckCircle2, History, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import AdminLoader from '@/components/AdminLoader';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
} as const;

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

interface AboutData {
  description: string;
  points: string[];
  stats: { label: string; value: string }[];
}

export default function AboutContent() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/about')
      .then(r => r.json())
      .then(data => {
        if (!data.error) setAboutData(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const values = [
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Integrity",
      description: "Transparency and honest counsel in all our dealings, ensuring trust with every client."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Excellence",
      description: "Highest standards of legal advocacy, combining details, precision, and diligence."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Commitment",
      description: "A client-first focus that puts your objectives and concerns at the heart of our strategy."
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Innovation",
      description: "Combining legal traditions with modern, agile solutions for complex challenges."
    }
  ];

  if (loading) {
    return <AdminLoader message="Loading about page..." className="h-[calc(100vh-6rem)]" />;
  }

  return (
    <div className="flex-grow overflow-hidden font-sans bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-light text-[#333333] mb-6 tracking-tight"
          >
            About Our Firm
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl font-light text-[#666666] max-w-3xl mx-auto leading-relaxed"
          >
            Dedicated to delivering professional excellence in legal practice and safeguarding our clients&apos; interests with integrity, experience, and precision.
          </motion.p>
        </div>
      </section>

      {/* Mission & History Section */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            
            {/* Our Mission Card */}
            <motion.div
              {...fadeInUp}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-black transition-all duration-500"
            >
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors"></div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-xs uppercase tracking-[0.3em] text-brand-primary font-semibold mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Our Mission
                </h2>
                <div className="space-y-4 text-[#666666] text-base leading-relaxed font-light">
                  <p>
                    At Park Legal, our mission is to provide comprehensive, high-quality legal services that meet the unique needs of each client. We believe in a client-centric approach, where understanding your goals and challenges is the foundation of our legal strategy.
                  </p>
                  <p>
                    We strive to build lasting relationships based on trust, transparency, and results. Whether navigating complex litigation or providing counsel on corporate matters, our team is committed to achieving the best possible outcome for you.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Our History Card */}
            <motion.div
              {...fadeInUp}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-black transition-all duration-500"
            >
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors"></div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-xs uppercase tracking-[0.3em] text-brand-primary font-semibold mb-2 flex items-center gap-2">
                  <History className="w-4 h-4" /> Our History
                </h2>
                <div className="space-y-4 text-[#666666] text-base leading-relaxed font-light">
                  <p>
                    Founded with a vision to modernize legal practice while honoring traditional values of the profession, Park Legal has grown into a respected firm known for its detailed approach and unwavering dedication to client success.
                  </p>
                  <p>
                    Over the years, we have expanded our expertise to cover a wide range of legal domains, building a reputation for excellence in Kochi and beyond. Our history is marked by the thousands of cases we have handled with precision and care.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 md:px-8 bg-white relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase tracking-[0.3em] text-brand-primary font-semibold mb-3">The Foundation</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-light text-[#333333]">Our Core Values</h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group bg-white p-8 rounded-[2rem] shadow-sm border border-gray-200 hover:border-black transition-all duration-500"
              >
                <div className="w-11 h-11 bg-brand-primary/5 rounded-xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-105 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shrink-0">
                  {value.icon}
                </div>
                <h4 className="text-lg font-serif text-[#333333] mb-3">{value.title}</h4>
                <p className="text-[#666666] text-[14px] leading-relaxed font-light">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 shadow-sm hover:border-black transition-all duration-500 rounded-[2.5rem] p-8 md:p-14 text-[#333333] relative overflow-hidden"
          >
            <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-8">
                <h3 className="text-3xl md:text-4xl font-serif font-light leading-tight">Why Choose Park Legal?</h3>
                <p className="text-[#666666] text-[15px] leading-relaxed font-light">
                  {aboutData?.description || "We combine deep legal expertise with a practical understanding of the real-world challenges our clients face. Our proactive approach ensures that we not only address current legal issues but also help prevent future complications."}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(aboutData?.points || [
                    "Decades of experience",
                    "Specialized expertise",
                    "Proven track record",
                    "Transparent fee structure"
                  ]).map((item: string, i: number) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                      </div>
                      <span className="text-[#666666] text-[14px] font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats column */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                {(aboutData?.stats || [
                  { label: "Years Experience", value: "15+" },
                  { label: "Cases Won", value: "100+" },
                  { label: "Client Dedication", value: "100%" },
                  { label: "Legal Support", value: "24/7" }
                ]).map((stat: { label: string; value: string }, i: number) => (
                  <div key={i} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 hover:border-black transition-all duration-300 group text-center">
                    <p className="text-3xl font-light text-brand-primary mb-1 group-hover:scale-105 transition-transform duration-300">{stat.value}</p>
                    <p className="text-[10px] text-[#666666] uppercase tracking-widest font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
