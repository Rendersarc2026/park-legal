import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
         {/* Using a placeholder image that matches the clean, office aesthetic */}
        <div className="relative w-full h-full bg-gray-200">
             <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop"
                alt="Modern Office"
                fill
                className="object-cover opacity-80"
                priority
             />
             <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-[-5%]">
        <h1 className="text-6xl md:text-8xl text-text-main mb-6 drop-shadow-sm tracking-tight">
          Park Legal
        </h1>
        <p className="text-xl md:text-2xl text-text-muted font-light max-w-2xl mx-auto leading-relaxed">
          Excellence in legal practice, dedicated to your peace of mind and success.
        </p>
      </div>
      
      {/* Decorative gradient at bottom to blend with next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
}
