'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scroll,
  Landmark,
  Shield,
  Briefcase,
  Home,
  Building2,
  FileBadge,
  Handshake,
  Coins,
  Fingerprint,
  Scale,
  Gavel,
  ArrowUpRight,
  X
} from 'lucide-react';


interface Specialization {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  description: string;
  details: string[];
}

const specializations: Specialization[] = [
  {
    icon: Scroll,
    label: "Writ Petitions (High Court of Kerala)",
    description: "Challenging arbitrary actions of government authorities through Writ Petitions, seeking immediate judicial intervention and fair treatment.",
    details: [
      "Legal issues involving government authorities often arise without warning—an application is rejected without clear reasons, a licence is cancelled, or an order is passed that directly affects your business or employment. In many cases, the real issue is not just the decision, but the lack of fairness in how it was made.",
      "Such matters typically arise where there is no effective remedy available at the administrative level, or where the consequences of an order require immediate judicial intervention. Situations involving denial of approvals, arbitrary exercise of power, or actions taken without following due process often necessitate approaching the High Court at the earliest stage to prevent further prejudice.",
      "We evaluate the legal and factual aspects at the outset and adopt a focused approach to High Court proceedings, including seeking appropriate interim relief wherever required. Our emphasis is on prompt and effective representation, ensuring that the issue is addressed without delay and that the client’s rights are adequately protected."
    ]
  },
  {
    icon: Landmark,
    label: "Supreme Court Practice",
    description: "Assisting clients at every stage of appellate and discretionary proceedings in the Supreme Court, raising substantial questions of law.",
    details: [
      "Certain legal matters require escalation beyond the High Court, especially where significant legal questions are involved or where a decision has far-reaching consequences. For many clients, approaching the Supreme Court is a critical step that requires careful evaluation and preparation.",
      "Matters reaching the Supreme Court often involve substantial questions of law, conflicting judicial views, or issues that have wider implications beyond the individual case. The process requires careful scrutiny of the record, identification of legal grounds, and a structured approach to presenting the matter within the limited scope of appellate or discretionary jurisdiction.",
      "We assist clients at every stage, from assessing the viability of proceedings to preparing and presenting the matter with clarity and precision. Our approach is structured and strategic, ensuring that each case is pursued with due regard to its legal merit and practical implications."
    ]
  },
  {
    icon: Shield,
    label: "Constitutional and Public Law",
    description: "Representing clients in public law matters, challenging arbitrary state actions, and defending fundamental constitutional rights.",
    details: [
      "When actions of authorities directly affect fundamental rights or raise broader issues of fairness and governance, legal intervention becomes necessary. These matters often go beyond individual disputes and involve questions that impact larger sections of society.",
      "Such issues frequently arise in the context of arbitrary state action, restrictions imposed without authority of law, or decisions that lack transparency and accountability. In appropriate cases, they may also involve questions that require judicial scrutiny in the larger public interest, particularly where systemic issues are involved.",
      "We approach such matters with a clear understanding of constitutional principles and the broader implications of judicial review. Our focus is on presenting the issue effectively before the Court while ensuring that the client’s rights, as well as the larger legal concerns involved, are adequately addressed."
    ]
  },
  {
    icon: Briefcase,
    label: "Service and Employment Issues",
    description: "Protecting employment and service rights against unfair dismissal, suspension, denial of benefits, or disciplinary actions.",
    details: [
      "Employment-related disputes can have a direct impact on financial stability and career progression. Issues such as suspension, termination, denial of benefits, or disciplinary proceedings often arise suddenly and require timely legal intervention.",
      "These disputes generally involve questions relating to procedural fairness, compliance with service rules, and the validity of decisions taken by the employer or authority. In many cases, delays in addressing such issues can have lasting professional and financial consequences.",
      "We assist clients in assessing their legal position, identifying appropriate remedies, and initiating proceedings where required. Our approach is focused on protecting service rights while ensuring that the matter is addressed in a timely and effective manner."
    ]
  },
  {
    icon: Home,
    label: "Property and Real Estate Disputes",
    description: "Protecting property ownership and possession, resolving complex real estate disputes and boundary or title claims in High Court litigation.",
    details: [
      "Property issues often arise at critical stages—when you are about to purchase a property, when a deal does not go as promised, or when your ownership or possession is suddenly questioned. In many cases, what appears to be a simple transaction turns into a complex legal issue involving documentation and competing claims.",
      "Such disputes typically involve questions relating to title, possession, contractual obligations, or actions taken by authorities affecting the use of property. The complexity is often compounded by documentation issues, overlapping claims, or procedural irregularities that require careful legal examination.",
      "We assist clients in evaluating their rights, verifying legal documentation, and adopting appropriate remedies, including approaching the High Court where necessary. Our focus is on protecting ownership and possession while ensuring that disputes are resolved in a manner that secures long-term interests."
    ]
  },
  {
    icon: Building2,
    label: "Commercial and Business Disputes",
    description: "Resolving business contract conflicts, partnership disputes, and financial transactions with commercial precision.",
    details: [
      "Business disputes can disrupt operations, affect finances, and strain long-term relationships. Issues often arise from contracts, partnerships, or financial transactions where expectations are not met or obligations are not honoured.",
      "These disputes frequently involve interpretation of contractual terms, enforcement of obligations, and protection of commercial interests. Timely legal intervention is often essential to prevent escalation and to safeguard ongoing business operations.",
      "We assist clients in assessing risks, formulating legal strategies, and pursuing appropriate remedies. Our approach combines legal precision with commercial understanding, ensuring that disputes are handled efficiently while minimising disruption."
    ]
  },
  {
    icon: FileBadge,
    label: "Regulatory and Government Matters",
    description: "Navigating government approvals, challenging adverse regulatory orders, and ensuring compliance across operations.",
    details: [
      "Businesses today operate within a framework of licences, approvals, and regulatory requirements. Issues arise when authorities pass adverse orders, delay approvals, or initiate enforcement actions that affect operations.",
      "Such matters often involve compliance-related concerns, interpretation of regulatory provisions, and challenges to decisions taken by authorities. Delays or adverse actions can have immediate operational and financial implications.",
      "We assist clients in addressing these issues through appropriate legal measures, including challenging adverse orders and ensuring compliance with applicable requirements. Our focus is on enabling clients to continue operations without unnecessary disruption."
    ]
  },
  {
    icon: Handshake,
    label: "Arbitration and Dispute Resolution",
    description: "Resolving disputes out of court through efficient arbitration, mediation, and executing related enforcement actions.",
    details: [
      "Not all disputes need to be resolved through lengthy court proceedings. In many cases, arbitration and other dispute resolution mechanisms offer a faster and more practical alternative.",
      "These proceedings typically involve contractual disputes where parties have agreed to resolve issues outside traditional court processes. Effective handling requires a structured approach to both arbitration proceedings and related court interventions.",
      "We assist clients in initiating, conducting, and enforcing arbitration proceedings, while also representing them in related court matters. Our focus is on achieving timely and effective resolution with minimal procedural delay."
    ]
  },
  {
    icon: Coins,
    label: "Banking and Financial Issues",
    description: "Challenging irregular recovery actions, accounts freezes, and protecting financial interests during dispute resolutions.",
    details: [
      "Financial disputes can arise suddenly and have immediate consequences, especially when actions are taken by banks or financial institutions. Issues such as account freezes, recovery proceedings, or enforcement actions can significantly impact day-to-day operations.",
      "Such matters often involve statutory procedures, contractual obligations, and regulatory compliance. The consequences of inaction or delay can be significant, particularly where coercive steps are initiated.",
      "We assist clients in responding to such actions promptly, including challenging irregular measures and ensuring that due process is followed. Our approach is focused on protecting financial interests while addressing the issue efficiently."
    ]
  },
  {
    icon: Fingerprint,
    label: "White Collar and Financial Offences",
    description: "Strategic counsel and defence during corporate investigations, financial audits, and regulatory fraud cases.",
    details: [
      "Allegations involving financial or corporate matters can have serious legal and reputational consequences. These situations often require careful handling from the very beginning.",
      "Such matters typically involve regulatory investigations, compliance issues, and proceedings that require a structured legal response. Early intervention is critical to managing both legal exposure and reputational risk.",
      "We assist clients in navigating these situations with a strategic and measured approach, ensuring that their rights are protected while addressing the matter with the necessary discretion and seriousness."
    ]
  },
  {
    icon: Scale,
    label: "Civil Litigation",
    description: "Comprehensive representation in everyday civil disputes, contract enforcement, and property recovery.",
    details: [
      "Civil disputes often arise out of everyday transactions, including property dealings, financial arrangements, and contractual relationships. When such disputes escalate, legal intervention becomes necessary to protect your rights.",
      "These matters involve a wide range of legal issues, including recovery of money, enforcement of contractual rights, and protection of property interests. Effective handling requires both procedural understanding and strategic planning.",
      "We represent clients at all stages of civil proceedings, ensuring that the matter is pursued efficiently and that the outcome is practical and enforceable."
    ]
  },
  {
    icon: Gavel,
    label: "Criminal Litigation",
    description: "Immediate defence representation to safeguard personal liberty, from criminal investigations to trial and appeal.",
    details: [
      "Criminal issues often arise unexpectedly and require immediate attention, particularly when there is a risk of arrest or legal proceedings being initiated. The initial steps taken in such situations can significantly influence the outcome.",
      "These matters involve procedural safeguards, statutory provisions, and strategic decision-making at every stage, from investigation to trial and appeal. Timely and appropriate legal action is essential to protect personal liberty and legal rights.",
      "We provide prompt and effective representation, ensuring that all available remedies are pursued and that the client’s interests are safeguarded throughout the process."
    ]
  }
];

const containerVariants = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 30 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 }
  }
};

export default function Expertise() {
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedSpecialization) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSpecialization]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSpecialization(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="py-28 bg-[#fafafa] relative overflow-hidden font-sans">
      {/* Decorative gradient backdrops */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary-dark/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 text-center md:text-left md:flex md:items-end md:justify-between gap-8 border-b border-gray-100 pb-12">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.4em] text-brand-primary font-semibold mb-4 inline-block">
              Our Specialization
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-text-main leading-tight tracking-tight mt-2">
              Comprehensive Legal Solutions <br />
              <span className="font-normal text-brand-primary">Tailored to Your Specific Needs</span>
            </h2>
          </div>
          <p className="text-text-muted font-light max-w-md mt-6 md:mt-0 text-base leading-relaxed">
            We offer expert, strategically structured representation across multiple litigation and advisory domains, protecting your interests at every step.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {specializations.map((spec, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onClick={() => setSelectedSpecialization(spec)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedSpecialization(spec);
                }
              }}
              className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-brand-primary/30 shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-500 flex flex-col justify-between cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <div>
                <div className="w-14 h-14 bg-[#f5f5f0] rounded-2xl flex items-center justify-center text-brand-primary mb-8 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                  <spec.icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-normal text-text-main mb-4 group-hover:text-brand-primary transition-colors duration-300">
                  {spec.label}
                </h3>
                <p className="text-text-muted font-light leading-relaxed text-sm line-clamp-3">
                  {spec.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-2 text-brand-primary font-medium text-sm transition-all duration-300">
                <span className="group-hover:translate-x-1 transition-transform duration-300">Read Full Details</span>
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Specialization Details Modal */}
      <AnimatePresence>
        {selectedSpecialization && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpecialization(null)}
              className="absolute inset-0 bg-[#111111]/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="bg-white/95 border border-gray-100/50 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 max-w-3xl w-full max-h-[85vh] overflow-y-auto relative z-10 flex flex-col justify-between scrollbar-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSpecialization(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 text-text-muted hover:bg-brand-primary hover:text-white transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div>
                {/* Header Icon + Label */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary shrink-0">
                    {React.createElement(selectedSpecialization.icon, { size: 32, strokeWidth: 1.5 })}
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold">Specialization Focus</span>
                    <h2 className="text-2xl md:text-3xl font-light text-text-main leading-tight mt-1">
                      {selectedSpecialization.label}
                    </h2>
                  </div>
                </div>

                {/* Paragraph Details */}
                <div className="space-y-6 text-text-muted font-light leading-relaxed text-base md:text-lg border-t border-gray-100 pt-8">
                  {selectedSpecialization.details.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? "text-text-main font-normal" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>


            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

