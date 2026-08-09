import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/* ── Config ─────────────────────────────────────────────── */
const GOOGLE_REVIEW_URL = 'https://g.page/r/YOUR_PLACE_ID/review';

/* ── Types ──────────────────────────────────────────────── */
interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
}

/* ── Sample reviews ─────────────────────────────────────── */
// const REVIEWS: Review[] = [
//   {
//     id: 1,
//     name: 'محمد أحمد',
//     date: 'منذ أسبوع',
//     rating: 5,
//     text: 'تجربة رائعة من أول لآخر! القهوة لذيذة جداً والديكور حلو أوي. الجو فيه حاجة مختلفة عن أي كافيه تاني. هرجع تاني أكيد.',
//     avatar: 'م',
//   },
//   {
//     id: 2,
//     name: 'سارة علي',
//     date: 'منذ أسبوعين',
//     rating: 5,
//     text: 'أحسن كافيه زرته! الموكتيل والوافل كانوا استثنائيين. الخدمة سريعة والطاقم محترم جداً. أنصح كل الناس بالزيارة.',
//     avatar: 'س',
//   },
//   {
//     id: 3,
//     name: 'عمر خالد',
//     date: 'منذ شهر',
//     rating: 5,
//     text: 'جو هادي ومريح للاسترخاء. الشيشة والمشروبات الباردة من أحلى اللي جربتها. مكان مثالي للقعدة مع الأصحاب.',
//     avatar: 'ع',
//   },
//   {
//     id: 4,
//     name: 'نور إبراهيم',
//     date: 'منذ شهر',
//     rating: 5,
//     text: 'من أجمل الكافيهات! كل حاجة مميزة من الأكل للمشروبات. هاكلة الكريب والسموذي كانوا لذيذين جداً.',
//     avatar: 'ن',
//   },
// ];

/* ── Stars ──────────────────────────────────────────────── */
function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= rating ? '#f0c862' : 'none'}
          stroke={star <= rating ? '#f0c862' : 'rgba(240,200,98,0.25)'}
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Google Icon ─────────────────────────────────────────── */
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

/* ── useInView ───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── Review Card ─────────────────────────────────────────── */
function ReviewCard({ review, delay }: { review: Review; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const needsExpand = review.text.length > 100;
  const displayText = expanded || !needsExpand ? review.text : review.text.slice(0, 100) + '...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      style={{
        minWidth: '260px', maxWidth: '280px',
        padding: '18px', borderRadius: '20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-2)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        flexShrink: 0, display: 'flex', flexDirection: 'column',
        gap: '12px', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg,transparent,rgba(201,153,61,0.5),transparent)',
      }} />

      <div className="flex items-center gap-3" dir="rtl">
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,rgba(201,153,61,0.3),rgba(240,200,98,0.15))',
          border: '1.5px solid rgba(201,153,61,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: '16px', color: '#f0c862',
        }}>
          {review.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ color: 'var(--text-1)', fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>
            {review.name}
          </p>
          <p style={{ color: 'var(--text-4)', fontFamily: "'Cairo',sans-serif", fontSize: '11px' }}>
            {review.date}
          </p>
        </div>
        <div style={{ flexShrink: 0, opacity: 0.85 }}>
          <GoogleIcon size={18} />
        </div>
      </div>

      <Stars rating={review.rating} size={14} />

      <div dir="rtl">
        <p style={{ color: 'var(--text-2)', fontFamily: "'Cairo',sans-serif", fontSize: '13px', lineHeight: '1.65' }}>
          {displayText}
        </p>
        {needsExpand && (
          <button
            onClick={() => setExpanded(x => !x)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#c9993d', fontFamily: "'Cairo',sans-serif",
              fontSize: '12px', fontWeight: 600, marginTop: '4px',
              padding: 0, textDecoration: 'underline',
            }}
          >
            {expanded ? 'اقرأ أقل' : 'اقرأ أكثر'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════════════════ */
export default function GoogleReviewSection() {
  const { ref, inView } = useInView();

  return (
    <section
      id="google-reviews-section"
      ref={ref}
      style={{ paddingTop: '56px', paddingBottom: '16px', overflow: 'hidden' }}
      aria-label="تقييمات العملاء"
    >
      {/* ── Gold divider ──────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 mb-10" aria-hidden="true">
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right,transparent,rgba(201,153,61,0.35))' }} />
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(201,153,61,0.5)' }} />
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left,transparent,rgba(201,153,61,0.35))' }} />
      </div>

      {/* ── Header ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center px-6 mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <GoogleIcon size={22} />
          <span style={{
            color: 'var(--text-3)', fontFamily: "'Cairo',sans-serif",
            fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            Google Reviews
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Cairo',sans-serif", fontWeight: 800,
            fontSize: 'clamp(1.4rem,5vw,1.85rem)',
            color: 'var(--text-1)', marginBottom: '10px', lineHeight: 1.3,
          }}
          dir="rtl"
        >
          ما يقوله <span className="gold-text">ضيوفنا</span>
        </h2>

        {/* Aggregate rating */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <span style={{
              fontFamily: "'Playfair Display','Georgia',serif", fontWeight: 700,
              fontSize: '3.2rem', lineHeight: 1, color: '#f0c862',
            }}>
              4.9
            </span>
            <div className="flex flex-col gap-1">
              <Stars rating={5} size={20} />
              <p style={{ color: 'var(--text-3)', fontFamily: "'Cairo',sans-serif", fontSize: '11px', textAlign: 'right' }}>
                تقييم Google
              </p>
            </div>
          </div>
          <p style={{ color: 'var(--text-4)', fontFamily: "'Cairo',sans-serif", fontSize: '12px' }} dir="rtl">
            بناءً على آراء عملائنا
          </p>
        </div>
      </motion.div>

      {/* ── Reviews horizontal scroll ─────────────────── */}
      {inView && (
        <div
          className="flex gap-3 px-5 pb-4 scrollbar-hide"
          style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
          dir="rtl"
        >
          {REVIEWS.map((review, i) => (
            <ReviewCard key={review.id} review={review} delay={i * 0.1} />
          ))}
          <div style={{ minWidth: '4px', flexShrink: 0 }} />
        </div>
      )}

      {/* ── CTA ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.45 }}
        className="px-5 mt-6 flex flex-col items-center gap-3"
      >
        <motion.a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            width: '100%', maxWidth: '360px',
            padding: '15px 24px', borderRadius: '18px',
            background: 'linear-gradient(135deg,#c9993d,#f0c862)',
            color: '#07070f', fontFamily: "'Cairo',sans-serif",
            fontWeight: 700, fontSize: '14px',
            border: 'none',
            boxShadow: '0 4px 24px rgba(201,153,61,0.35)',
            textDecoration: 'none',
          }}
        >
          <GoogleIcon size={18} />
          اكتب تقييمك على Google
        </motion.a>

        <p
          style={{ color: 'var(--text-4)', fontFamily: "'Cairo',sans-serif", fontSize: '12px', textAlign: 'center' }}
          dir="rtl"
        >
          رأيك يهمنا — ساعد الآخرين في اختيار الأفضل
        </p>
      </motion.div>
    </section>
  );
} 