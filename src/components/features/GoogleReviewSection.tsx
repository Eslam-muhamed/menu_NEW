import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import { X, Copy, Check } from 'lucide-react';

/* ── Config ─────────────────────────────────────────────── */
/* استبدل برابط صفحة تقييم الكافيه على Google Maps       */
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
const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'محمد أحمد',
    date: 'منذ أسبوع',
    rating: 5,
    text: 'تجربة رائعة من أول لآخر! القهوة لذيذة جداً والديكور حلو أوي. الجو فيه حاجة مختلفة عن أي كافيه تاني. هرجع تاني أكيد.',
    avatar: 'م',
  },
  {
    id: 2,
    name: 'سارة علي',
    date: 'منذ أسبوعين',
    rating: 5,
    text: 'أحسن كافيه زرته! الموكتيل والوافل كانوا استثنائيين. الخدمة سريعة والطاقم محترم جداً. أنصح كل الناس بالزيارة.',
    avatar: 'س',
  },
  {
    id: 3,
    name: 'عمر خالد',
    date: 'منذ شهر',
    rating: 5,
    text: 'جو هادي ومريح للاسترخاء. الشيشة والمشروبات الباردة من أحلى اللي جربتها. مكان مثالي للقعدة مع الأصحاب.',
    avatar: 'ع',
  },
  {
    id: 4,
    name: 'نور إبراهيم',
    date: 'منذ شهر',
    rating: 5,
    text: 'من أجمل الكافيهات! كل حاجة مميزة من الأكل للمشروبات. هاكلة الكريب والسموذي كانوا لذيذين جداً.',
    avatar: 'ن',
  },
];

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

/* ── Copy helper (with fallback) ─────────────────────────── */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Legacy fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
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
   WRITE REVIEW MODAL
══════════════════════════════════════════════════════════ */
function WriteReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating]               = useState(0);
  const [hoverRating, setHoverRating]     = useState(0);
  const [reviewText, setReviewText]       = useState('');
  const [step, setStep]                   = useState<'write' | 'success'>('write');
  const [copied, setCopied]               = useState(false);
  const [focused, setFocused]             = useState(false);

  const starLabels = ['', 'سيئ 😞', 'مقبول 😐', 'جيد 🙂', 'رائع 😊', 'ممتاز ⭐'];
  const activeRating = hoverRating || rating;
  const isValid = rating > 0 && reviewText.trim().length >= 5;

  const handleSubmit = async () => {
    if (!isValid) return;
    await copyToClipboard(reviewText);
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
    setStep('success');
  };

  const handleCopyAgain = async () => {
    const ok = await copyToClipboard(reviewText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        style={{
          width: '100%', maxWidth: '480px',
          background: 'var(--bg-card)',
          borderRadius: '28px 28px 0 0',
          padding: '6px 20px 44px',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{
          width: '40px', height: '4px', borderRadius: '2px',
          background: 'var(--border-3)', margin: '12px auto 18px',
        }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', left: '16px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--surface-2)', border: '1px solid var(--border-2)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" style={{ color: 'var(--text-3)' }} />
        </button>

        <AnimatePresence mode="wait">
          {step === 'write' ? (
            /* ─── WRITE STEP ─────────────────────────────── */
            <motion.div
              key="write"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              dir="rtl"
            >
              {/* Title */}
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
                  <GoogleIcon size={22} />
                  <h3 style={{
                    fontFamily: "'Cairo',sans-serif", fontWeight: 800,
                    fontSize: '20px', color: 'var(--text-1)', margin: 0,
                  }}>
                    شاركنا تجربتك
                  </h3>
                </div>
                <p style={{ fontFamily: "'Cairo',sans-serif", fontSize: '12px', color: 'var(--text-3)', margin: 0 }}>
                  تقييمك يساعدنا ويساعد الآخرين في الاختيار
                </p>
              </div>

              {/* ── Star rating ───────────────────────────── */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', marginBottom: '10px' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.82 }}
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', lineHeight: 0 }}
                    >
                      <svg
                        width="46" height="46" viewBox="0 0 24 24"
                        fill={activeRating >= s ? '#f0c862' : 'none'}
                        stroke={activeRating >= s ? '#f0c862' : 'rgba(240,200,98,0.3)'}
                        strokeWidth={1.5}
                        style={{ transition: 'fill 0.12s, stroke 0.12s' }}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </motion.button>
                  ))}
                </div>

                {/* Rating label */}
                <div style={{ minHeight: '22px' }}>
                  <AnimatePresence mode="wait">
                    {activeRating > 0 && (
                      <motion.p
                        key={activeRating}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.14 }}
                        style={{
                          fontFamily: "'Cairo',sans-serif", fontWeight: 700,
                          fontSize: '15px', color: '#f0c862', margin: 0,
                        }}
                      >
                        {starLabels[activeRating]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Text area ─────────────────────────────── */}
              <div style={{ marginBottom: '18px' }}>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value.slice(0, 500))}
                  placeholder="اكتب تجربتك مع sky 7 هنا..."
                  rows={5}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    width: '100%', borderRadius: '16px',
                    padding: '14px 16px',
                    background: 'var(--surface-1)',
                    border: `1.5px solid ${focused ? 'rgba(201,153,61,0.55)' : 'var(--border-2)'}`,
                    color: 'var(--text-1)',
                    fontFamily: "'Cairo',sans-serif", fontSize: '14px',
                    lineHeight: '1.75', resize: 'none', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                />
                <p style={{
                  fontFamily: "'Inter',sans-serif", fontSize: '11px',
                  color: reviewText.length > 450 ? '#f0c862' : 'var(--text-5)',
                  textAlign: 'left', marginTop: '5px',
                }}>
                  {reviewText.length}/500
                </p>
              </div>

              {/* ── Submit ────────────────────────────────── */}
              <motion.button
                whileTap={isValid ? { scale: 0.97 } : {}}
                onClick={handleSubmit}
                style={{
                  width: '100%', padding: '16px',
                  borderRadius: '18px',
                  background: isValid ? 'linear-gradient(135deg,#c9993d,#f0c862)' : 'var(--surface-2)',
                  border: 'none',
                  cursor: isValid ? 'pointer' : 'not-allowed',
                  color: isValid ? '#07070f' : 'var(--text-4)',
                  fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: '15px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.25s',
                  boxShadow: isValid ? '0 6px 24px rgba(201,153,61,0.32)' : 'none',
                  marginBottom: '14px',
                }}
              >
                <GoogleIcon size={18} />
                نشر التقييم على Google
              </motion.button>

              {/* Hint */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px',
                background: 'var(--surface-1)',
                border: '1px solid var(--border-1)',
                borderRadius: '12px', padding: '10px 14px',
              }}>
                <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>💡</span>
                <p style={{
                  fontFamily: "'Cairo',sans-serif", fontSize: '12px',
                  color: 'var(--text-3)', lineHeight: 1.65, margin: 0,
                }}>
                  سيتم <strong style={{ color: 'var(--text-2)' }}>نسخ تقييمك تلقائياً</strong>، ثم ستفتح صفحة Google — فقط الصق النص واضغط نشر
                </p>
              </div>
            </motion.div>
          ) : (
            /* ─── SUCCESS STEP ───────────────────────────── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              style={{ textAlign: 'center', padding: '12px 4px 4px' }}
              dir="rtl"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.08 }}
                style={{
                  width: '84px', height: '84px', borderRadius: '50%',
                  background: 'linear-gradient(135deg,rgba(201,153,61,0.14),rgba(240,200,98,0.07))',
                  border: '2px solid rgba(201,153,61,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: '40px',
                }}
              >
                ⭐
              </motion.div>

              <h3 style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: '24px', color: 'var(--text-1)', marginBottom: '8px' }}>
                شكراً لك! 🎉
              </h3>

              <p style={{ fontFamily: "'Cairo',sans-serif", fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '4px' }}>
                فُتحت صفحة Google للتقييم
              </p>
              <p style={{ fontFamily: "'Cairo',sans-serif", fontSize: '14px', color: 'var(--text-1)', lineHeight: 1.6, marginBottom: '22px' }}>
                فقط <span style={{ color: '#f0c862', fontWeight: 700 }}>الصق</span> النص المنسوخ واضغط نشر
              </p>

              {/* Stars preview */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '24px' }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="22" height="22" viewBox="0 0 24 24"
                    fill={s <= rating ? '#f0c862' : 'none'}
                    stroke={s <= rating ? '#f0c862' : 'rgba(240,200,98,0.2)'}
                    strokeWidth={1.5}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Copy again */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCopyAgain}
                style={{
                  width: '100%', padding: '14px',
                  borderRadius: '16px',
                  background: copied ? 'rgba(94,204,122,0.10)' : 'var(--surface-2)',
                  border: `1px solid ${copied ? 'rgba(94,204,122,0.3)' : 'var(--border-2)'}`,
                  cursor: 'pointer',
                  color: copied ? '#5ecc7a' : 'var(--text-2)',
                  fontFamily: "'Cairo',sans-serif", fontSize: '14px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s', marginBottom: '10px',
                }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'تم النسخ!' : 'نسخ التقييم مرة أخرى'}
              </motion.button>

              <button
                onClick={onClose}
                style={{
                  width: '100%', padding: '14px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg,#c9993d,#f0c862)',
                  border: 'none', cursor: 'pointer',
                  color: '#07070f', fontFamily: "'Cairo',sans-serif",
                  fontWeight: 800, fontSize: '14px',
                }}
              >
                تم ✓
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>,
    document.body
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════════════════ */
export default function GoogleReviewSection() {
  const { ref, inView }               = useInView();
  const [showWriteModal, setShowWriteModal] = useState(false);

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

      {/* ── CTA section ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.45 }}
        className="px-5 mt-6 flex flex-col items-center gap-3"
      >
        {/* PRIMARY: Write review */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowWriteModal(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            width: '100%', maxWidth: '360px',
            padding: '15px 24px', borderRadius: '18px',
            background: 'linear-gradient(135deg,#c9993d,#f0c862)',
            color: '#07070f', fontFamily: "'Cairo',sans-serif",
            fontWeight: 800, fontSize: '15px',
            boxShadow: '0 6px 24px rgba(201,153,61,0.30)',
            border: 'none', cursor: 'pointer',
          }}
        >
          ✏️ اكتب تقييمك الآن
        </motion.button>

        {/* SECONDARY: View on Google */}
        <motion.a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', maxWidth: '360px',
            padding: '13px 20px', borderRadius: '16px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-2)',
            color: 'var(--text-3)', fontFamily: "'Cairo',sans-serif",
            fontWeight: 600, fontSize: '13px', textDecoration: 'none',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          <GoogleIcon size={16} />
          شاهد جميع التقييمات على Google
        </motion.a>

        <p
          style={{ color: 'var(--text-4)', fontFamily: "'Cairo',sans-serif", fontSize: '12px', textAlign: 'center' }}
          dir="rtl"
        >
          رأيك يهمنا — ساعد الآخرين في اختيار الأفضل
        </p>
      </motion.div>

      {/* ── Write Review Modal ────────────────────────── */}
      <AnimatePresence>
        {showWriteModal && (
          <WriteReviewModal onClose={() => setShowWriteModal(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}