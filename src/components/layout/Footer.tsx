import { MapPin, Phone, Clock } from 'lucide-react';

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 9.27 20.92 6.78 19.05 4.91 17.18 3.03 14.69 2 12.04 2zm0 1.67c2.2 0 4.26.86 5.82 2.42 1.55 1.56 2.41 3.63 2.41 5.83 0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.13l-.3-.18-3.12.81.83-3.04-.2-.32C4.24 14.98 3.8 13.46 3.8 11.91c.01-4.54 3.7-8.24 8.24-8.24zm-2.51 4.16c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1.01 2.56.13.17 1.75 2.67 4.24 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.28-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.13-.17.25-.65.8-.79.96-.14.17-.28.19-.52.07-.25-.13-1.03-.38-1.96-1.21-.72-.65-1.2-1.45-1.34-1.7-.14-.25-.01-.39.12-.52.11-.11.25-.29.38-.43.12-.14.17-.25.24-.41.08-.17.04-.31-.02-.44-.05-.13-.56-1.36-.77-1.84-.21-.47-.42-.41-.58-.42-.15-.01-.32-.04-.53-.04z"/>
    </svg>
  );
}

const PHONE        = '201128727999'; // ← استبدل بالرقم الحقيقي
const DISPLAY_PHONE = '201128727999';
const MSG          = encodeURIComponent('مرحباً، أريد الطلب من sky 7 ☕');
const MAPS_URL     = 'https://maps.google.com/?q=sky+7+cafe+egypt'; // ← استبدل بالرابط الحقيقي

const infoCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '14px',
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* ── Brand Section ─────────────────────────────────────── */}
      <div className="pt-12 pb-8 px-6 text-center">
        <p
          className="tracking-[0.3em] uppercase text-xs mb-4"
          style={{ color: 'rgba(201,153,61,0.5)', fontFamily: "'Cairo','Inter',sans-serif" }}
        >
          Taste the Sky
        </p>
        <h3
          className="font-display font-bold mb-4"
          style={{ fontSize: '2.4rem', lineHeight: 1 }}
        >
          <span style={{ color: '#f0ece4' }}>sky </span>
          <span className="gold-text">7</span>
        </h3>
        <div className="flex items-center justify-center gap-3 mb-4" aria-hidden="true">
          <div className="h-px w-10 rounded" style={{ background: 'linear-gradient(to right,transparent,rgba(201,153,61,0.4))' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(201,153,61,0.5)' }} />
          <div className="h-px w-10 rounded" style={{ background: 'linear-gradient(to left,transparent,rgba(201,153,61,0.4))' }} />
        </div>
        <p className="text-sm" style={{ color: '#7a7268', fontFamily: "'Cairo','Inter',sans-serif" }}>
          Crafted with passion. Served with elegance.
        </p>
      </div>

      {/* ── Location & Contact ────────────────────────────────── */}
      <div className="px-5 pb-8 max-w-md mx-auto" dir="rtl">
        {/* Section label */}
        <p
          className="text-center text-[11px] tracking-[0.25em] uppercase mb-4"
          style={{ color: 'rgba(201,153,61,0.55)', fontFamily: "'Cairo','Inter',sans-serif" }}
        >
          تواصل معنا
        </p>

        {/* Info cards */}
        <div className="flex flex-col gap-2.5 mb-4">

          {/* Address */}
          <div className="flex items-center gap-3 px-4 py-3.5" style={infoCardStyle}>
            <div
              className="w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(201,153,61,0.1)' }}
            >
              <MapPin className="w-4 h-4" style={{ color: '#c9993d' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] mb-0.5" style={{ color: '#7a7268', fontFamily: "'Cairo',sans-serif" }}>العنوان</p>
              <p className="text-sm font-semibold" style={{ color: '#f0ece4', fontFamily: "'Cairo',sans-serif" }}>
                  الشرقية - كفر صقر - شارع البحر - بجوار البنك الأهلي تمكين ( لتمويل المشاريع ){/* ← استبدل بالعنوان الحقيقي */}
              </p>
            </div>
          </div>

          {/* Phone */}
          <a
            href={`tel:${DISPLAY_PHONE}`}
            className="flex items-center gap-3 px-4 py-3.5 no-underline transition-all duration-300 hover:border-sky7-gold/20"
            style={{ ...infoCardStyle, cursor: 'pointer' }}
          >
            <div
              className="w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(201,153,61,0.1)' }}
            >
              <Phone className="w-4 h-4" style={{ color: '#c9993d' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] mb-0.5" style={{ color: '#7a7268', fontFamily: "'Cairo',sans-serif" }}>التليفون</p>
              <p
                className="text-sm font-semibold"
                style={{ color: '#f0c862', fontFamily: "'Cairo',sans-serif", direction: 'ltr', textAlign: 'right' }}
              >
                {DISPLAY_PHONE} {/* ← استبدل بالرقم الحقيقي */}
              </p>
            </div>
          </a>

          {/* Working Hours */}
          <div className="flex items-center gap-3 px-4 py-3.5" style={infoCardStyle}>
            <div
              className="w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(201,153,61,0.1)' }}
            >
              <Clock className="w-4 h-4" style={{ color: '#c9993d' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] mb-0.5" style={{ color: '#7a7268', fontFamily: "'Cairo',sans-serif" }}>مواعيد العمل</p>
              <p className="text-sm font-semibold" style={{ color: '#f0ece4', fontFamily: "'Cairo',sans-serif" }}>
               العمل على مدار اليوم 24/7{/* ← استبدل بالمواعيد الحقيقية */}
              </p>
            </div>
          </div>

        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5">
          {/* Maps */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold no-underline transition-all duration-300"
            style={{
              background: 'rgba(201,153,61,0.1)',
              border: '1px solid rgba(201,153,61,0.22)',
              color: '#c9993d',
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            <MapPin className="w-4 h-4" />
            اعثر علينا
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${PHONE}?text=${MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold no-underline transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg,rgba(29,168,81,0.18),rgba(37,211,102,0.12))',
              border: '1px solid rgba(37,211,102,0.3)',
              color: '#4ade80',
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            <WhatsAppIcon />
            واتساب
          </a>
        </div>
      </div>

      {/* ── Copyright ─────────────────────────────────────────── */}
      <div
        className="py-4 px-6 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <p className="text-xs" style={{ color: '#4a4850', fontFamily: "'Cairo','Inter',sans-serif" }}>
          © {year} sky 7 Café · All rights reserved
        </p>
      </div>

    </footer>
  );
}
