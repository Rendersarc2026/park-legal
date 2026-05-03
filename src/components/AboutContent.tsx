'use client';

import { motion } from 'framer-motion';
import { Scale, Shield, Users, Lightbulb, CheckCircle2, History, Target } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
} as const;

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AboutContent() {
  const values = [
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Integrity",
      description: "Integrity in all our dealings, ensuring transparency and trust with every client."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Excellence",
      description: "Excellence in legal advocacy, committed to the highest standards of professional practice."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Commitment",
      description: "Commitment to client success, putting your goals at the heart of our legal strategy."
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation",
      description: "Innovative problem solving, combining traditional values with modern legal solutions."
    }
  ];

  return (
    <div className="flex-grow overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-light text-[#333333] mb-8 leading-tight tracking-tight">
              About Park Legal
            </h1>
            <p className="text-xl md:text-2xl font-light text-[#666666] max-w-3xl mx-auto leading-relaxed">
              Dedicated to delivering excellence in legal practice and safeguarding our clients&apos; interests with integrity and precision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & History Section */}
      <section className=" px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-stretch">
            {/* Our Mission Card */}
            <motion.div
              {...fadeInUp}
              className="bg-white p-10 md:p-14 rounded-[3rem] border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-brand-primary/30 "
            >
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors"></div>
              <div className="relative z-10">
                <h2 className="text-sm uppercase tracking-[0.4em] text-brand-primary font-light mb-8 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Our Mission
                </h2>
                <div className="space-y-6 text-[#666666] text-lg leading-relaxed font-light">
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
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="bg-white p-10 md:p-14 rounded-[3rem] border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-brand-primary/30"
            >
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors"></div>
              <div className="relative z-10">
                <h2 className="text-sm uppercase tracking-[0.4em] text-brand-primary font-light mb-8 flex items-center gap-2">
                  <History className="w-4 h-4" /> Our History
                </h2>
                <div className="space-y-6 text-[#666666] text-lg leading-relaxed font-light">
                  <p>
                    Founded with a vision to modernize legal practice while honoring traditional values of the profession, Park Legal has grown into a respected firm known for its detailed approach and unwavering dedication to client success.
                  </p>
                  <p>
                    Over the years, we have expanded our expertise to cover a wide range of legal domains, building a reputation for excellence in Kochi and beyond. Our history is marked by the thousands of cases we have handled with precision and care.
                  </p>
                </div>
              </div>
              {/* Decorative lines */}
              <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-brand-primary/20 m-6 rounded-br-2xl opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 md:px-8 bg-white relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm uppercase tracking-[0.4em] text-brand-primary font-light mb-4">The Foundation</h2>
            <h3 className="text-4xl md:text-5xl font-light text-[#333333]">Our Core Values</h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mb-8 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                  {value.icon}
                </div>
                <h4 className="text-2xl font-light text-[#333333] mb-4">{value.title}</h4>
                <p className="text-[#666666] leading-relaxed font-light">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white border border-gray-100 shadow-sm rounded-[3rem] p-10 md:p-20 text-[#333333] relative overflow-hidden"
          >
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">Why Choose Park Legal?</h2>
                <p className="text-[#666666] text-xl mb-12 leading-relaxed font-light">
                  We combine deep legal expertise with a practical understanding of the real-world challenges our clients face. Our proactive approach ensures that we not only address current legal issues but also help prevent future complications.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    "Decades of experience",
                    "Specialized expertise",
                    "Proven track record",
                    "Transparent fee structure"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-[#666666] font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Years Experience", value: "15+" },
                  { label: "Cases Won", value: "100+" },
                  { label: "Client Dedication", value: "100%" },
                  { label: "Legal Support", value: "24/7" }
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-brand-primary/50 transition-colors duration-300 group">
                    <p className="text-4xl font-light text-brand-primary mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                    <p className="text-xs text-[#666666] uppercase tracking-widest font-light">{stat.label}</p>
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
