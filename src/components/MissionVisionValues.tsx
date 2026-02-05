import { Landmark, BookOpen, Scale } from 'lucide-react';

export default function MissionVisionValues() {
  return (
    <section className="py-20 bg-background text-center">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
        
        {/* Mission */}
        <div className="flex flex-col items-center pt-8 md:pt-0 px-4">
          <div className="text-text-muted mb-6">
            <Landmark size={48} strokeWidth={1} />
          </div>
          <h3 className="text-2xl font-serif text-text-main mb-4">Our Mission</h3>
          <p className="text-text-muted leading-relaxed text-sm">
            Dedicated to delivering exceptional legal solutions with integrity and care.
          </p>
        </div>

        {/* Vision */}
        <div className="flex flex-col items-center pt-8 md:pt-0 px-4">
          <div className="text-text-muted mb-6">
            <BookOpen size={48} strokeWidth={1} />
          </div>
          <h3 className="text-2xl font-serif text-text-main mb-4">Our Vision</h3>
          <p className="text-text-muted leading-relaxed text-sm">
            Guiding our clients towards success and peace of mind.
          </p>
        </div>

        {/* Values */}
        <div className="flex flex-col items-center pt-8 md:pt-0 px-4">
          <div className="text-text-muted mb-6">
             <Scale size={48} strokeWidth={1} />
          </div>
          <h3 className="text-2xl font-serif text-text-main mb-4">Our Values</h3>
          <p className="text-text-muted leading-relaxed text-sm">
            Commitment, Trust, and Professionalism.
          </p>
        </div>

      </div>
    </section>
  );
}
