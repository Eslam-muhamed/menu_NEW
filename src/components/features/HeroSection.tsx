import heroBg from '@/assets/hero.jpg';

export default function HeroSection() {
  const handleScrollDown = () => {
    document.getElementById('menu-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden select-none" style={{ minHeight: '85vh', maxHeight: '100svh' }}>
      {/* Background Image */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover hero-img"
      />

      {/* Dark overlay layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-sky7-bg/65 to-sky7-bg" />
      <div className="absolute inset-0 bg-sky7-bg/20" />

      {/* Warm gold glow orb */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[500px] md:h-[500px] rounded-full blur-3xl opacity-15 animate-float"
        style={{ background: 'radial-gradient(circle, #c9993d, #f0c862, transparent)' }}
      />

      {/* Dot grid pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Corner decorations */}
      <div className="absolute top-5 left-5 pointer-events-none" aria-hidden="true">
        <div className="w-7 h-px bg-sky7-gold/40" />
        <div className="w-px h-7 bg-sky7-gold/40 mt-0" />
      </div>
      <div className="absolute top-5 right-5 pointer-events-none flex flex-col items-end" aria-hidden="true">
        <div className="w-7 h-px bg-sky7-gold/40" />
        <div className="w-px h-7 bg-sky7-gold/40 ml-auto" />
      </div>
      <div className="absolute bottom-16 left-5 pointer-events-none flex flex-col justify-end" aria-hidden="true">
        <div className="w-px h-7 bg-sky7-gold/40" />
        <div className="w-7 h-px bg-sky7-gold/40" />
      </div>
      <div className="absolute bottom-16 right-5 pointer-events-none flex flex-col items-end justify-end" aria-hidden="true">
        <div className="w-px h-7 bg-sky7-gold/40 ml-auto" />
        <div className="w-7 h-px bg-sky7-gold/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
        {/* Eyebrow label */}
        <p
          className="font-body text-sky7-gold/75 tracking-[0.35em] uppercase text-xs mb-8 animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          Premium Café Experience
        </p>

        {/* Brand Name */}
        <h1
          className="font-display leading-none mb-6 animate-fade-up"
          style={{
            fontSize: 'clamp(4rem, 18vw, 9rem)',
            animationDelay: '300ms',
          }}
        >
          <span className="text-sky7-cream">sky </span>
          <span className="gold-text-shimmer">7</span>
        </h1>

        {/* Decorative line */}
        <div
          className="flex items-center justify-center gap-3 mb-8 animate-fade-in"
          style={{ animationDelay: '450ms' }}
          aria-hidden="true"
        >
          <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to right, transparent, rgba(201,153,61,0.5))' }} />
          <div className="w-1 h-1 rounded-full bg-sky7-gold/60" />
          <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to left, transparent, rgba(201,153,61,0.5))' }} />
        </div>

        {/* Tagline */}
        <p
          className="font-body text-sky7-muted text-xs md:text-sm max-w-sm mx-auto mb-10 leading-relaxed animate-fade-up"
          style={{ animationDelay: '550ms' }}
        >
          Where every sip tells a story. Discover our curated collection of premium beverages and artisan creations.
        </p>

        {/* Scroll indicator */}
        <button
          onClick={handleScrollDown}
          className="group flex flex-col items-center gap-3 mx-auto animate-fade-in"
          style={{ animationDelay: '750ms' }}
          aria-label="Scroll down to explore menu"
        >
          <span className="font-body text-sky7-dim text-[11px] tracking-[0.2em] uppercase group-hover:text-sky7-gold transition-colors duration-300">
            Explore Menu
          </span>
          {/* Mouse icon */}
          <div
            className="relative w-5 h-8 rounded-full border flex items-start justify-center pt-1.5 transition-colors duration-300"
            style={{ borderColor: 'rgba(201,153,61,0.3)' }}
          >
            <div className="w-0.5 h-2 rounded-full bg-sky7-gold/60 animate-bounce-soft" />
          </div>
        </button>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-sky7-bg to-transparent pointer-events-none" />
    </section>
  );
}
