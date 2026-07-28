export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-14 px-6 text-center"
      style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
    >
      <div className="max-w-sm mx-auto">
        {/* Eyebrow */}
        <p
          className="font-body tracking-[0.3em] uppercase text-xs mb-4"
          style={{ color: 'rgba(201, 153, 61, 0.5)' }}
        >
          Taste the Sky
        </p>

        {/* Brand */}
        <h3 className="font-display font-bold mb-5" style={{ fontSize: '2.5rem', lineHeight: 1 }}>
          <span style={{ color: '#f0ece4' }}>sky </span>
          <span className="gold-text">7</span>
        </h3>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
          <div
            className="h-px w-10 rounded"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,153,61,0.45))' }}
          />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(201,153,61,0.5)' }} />
          <div
            className="h-px w-10 rounded"
            style={{ background: 'linear-gradient(to left, transparent, rgba(201,153,61,0.45))' }}
          />
        </div>

        {/* Tagline */}
        <p className="font-body text-sm mb-6" style={{ color: '#7a7268' }}>
          Crafted with passion. Served with elegance.
        </p>

        {/* Copyright */}
        <p className="font-body text-xs" style={{ color: '#4a4850' }}>
          © {year} sky 7 Café · All rights reserved
        </p>
      </div>
    </footer>
  );
}
