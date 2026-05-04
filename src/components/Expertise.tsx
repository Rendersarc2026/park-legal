'use client';

import { motion } from 'framer-motion';
import { Building2, Home, FileText, Gavel, Users, Briefcase, ArrowUpRight } from 'lucide-react';

const services = [
  { icon: Building2, label: "Corporate Law", description: "Navigating complex business regulations and corporate structures." },
  { icon: Gavel, label: "Litigation & Dispute Resolution", description: "Strong representation in court and strategic conflict management." },
  { icon: Home, label: "Real Estate Law", description: "Expert guidance for property transactions and development." },
  { icon: Users, label: "Family Law", description: "Compassionate legal support for sensitive personal matters." },
  { icon: FileText, label: "Estate Planning", description: "Securing your legacy through meticulous planning and documentation." },
  { icon: Briefcase, label: "Employment Law", description: "Balancing rights and responsibilities in the workplace." },
];

const containerVariants = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Expertise() {
  return (
    <section className="py-24 bg-white relative overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm uppercase tracking-[0.4em] text-brand-primary font-light mb-4">Our Specialization</h2>
            <h3 className="text-3xl md:text-4xl font-light text-[#333333] leading-tight tracking-tight">
              Comprehensive Legal Solutions Tailored to Your Needs
            </h3>
          </div>

        </div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-white p-8 rounded-3xl border border-gray-200 hover:border-brand-primary/30 shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-500 flex flex-col"
            >
              <div className="w-14 h-14 bg-[#f5f5f0] rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                <service.icon size={28} strokeWidth={1.5} />
              </div>
              <h4 className="text-lg font-light text-[#333333] mb-3 group-hover:text-brand-primary transition-colors duration-300">
                {service.label}
              </h4>
              <p className="text-[#666666] font-light leading-relaxed mb-6">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
