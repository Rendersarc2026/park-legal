'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Scale, Users, Shield, Lightbulb, ArrowRight } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutContent() {
  const values = [
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Integrity",
      description: "We uphold the highest ethical standards in every case and client interaction."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Excellence",
      description: "Our commitment to legal excellence ensures the best possible outcomes for our clients."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Client-Centric",
      description: "Your goals are our priority. We build strategies around your unique needs."
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation",
      description: "We combine traditional values with modern legal solutions for complex challenges."
    }
  ];

  return (
    <div className="flex-grow">

      {/* Our Story Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeIn}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-sm uppercase tracking-[0.3em] text-brand-primary font-bold mb-4">Our Story</h2>
            <h3 className="text-3xl md:text-5xl font-serif text-text-main mb-8">Modern Legal Practice with Traditional Values</h3>
            <div className="space-y-6 text-text-muted text-xl leading-relaxed max-w-3xl mx-auto">
              <p>
                Founded in Kochi, Park Legal was established with a singular vision: to redefine the legal experience for individuals and businesses alike. We understood that the modern world requires more than just legal advice—it requires a partnership built on transparency and results.
              </p>
              <p>
                Over the years, we have grown from a small dedicated team into a respected firm known for our meticulous approach and unwavering commitment to our clients. Our journey is defined by the successes of those we represent.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-4 md:px-8 bg-brand-beige/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-[0.3em] text-brand-primary font-bold mb-4">Our Foundation</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-text-main">The Values That Drive Us</h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6">
                  {value.icon}
                </div>
                <h4 className="text-xl font-serif text-text-main mb-3">{value.title}</h4>
                <p className="text-text-muted leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 md:px-8 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="bg-text-main rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full -mr-32 -mt-32"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif mb-6">Why Choose Park Legal?</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  We combine deep legal expertise with a practical understanding of the real-world challenges our clients face. Our proactive approach ensures that we not only address current legal issues but also help prevent future complications.
                </p>
                <ul className="space-y-4">
                  {[
                    "Decades of combined legal experience",
                    "Specialized expertise in Corporate & Criminal Law",
                    "Proven track record of high-stakes litigation",
                    "Transparent and fair fee structures"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                        <ArrowRight className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                  <p className="text-4xl font-serif text-brand-primary mb-1">15+</p>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Years Experience</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                  <p className="text-4xl font-serif text-brand-primary mb-1">500+</p>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Cases Won</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                  <p className="text-4xl font-serif text-brand-primary mb-1">100%</p>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Client Dedication</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                  <p className="text-4xl font-serif text-brand-primary mb-1">24/7</p>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Legal Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
