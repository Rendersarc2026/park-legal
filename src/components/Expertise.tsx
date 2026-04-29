import { Building2, Home, FileText, Gavel, Users, Briefcase } from 'lucide-react';

const services = [
  { icon: Building2, label: "Corporate Law" },
  { icon: Gavel, label: "Litigation & Dispute Resolution" },
  { icon: Home, label: "Real Estate Law" },
  { icon: Users, label: "Family Law" },
  { icon: FileText, label: "Estate Planning" },
  { icon: Briefcase, label: "Employment Law" },
];

export default function Expertise() {
  return (
    <section className="py-20 bg-brand-beige">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-12 pb-4 border-b border-gray-300">
          <h2 className="text-3xl font-serif text-text-main">Our Expertise</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {services.map((service, index) => (
            <div key={index} className="flex items-center p-4 border-b border-gray-200/50 hover:bg-white/50 transition-colors">
              <div className="text-text-muted mr-4">
                <service.icon size={24} strokeWidth={1} />
              </div>
              <span className="text-lg text-text-main font-light">{service.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
