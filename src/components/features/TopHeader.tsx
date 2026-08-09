import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Moon, Sun } from 'lucide-react';
import { useCart } from '@/stores/cartStore';
import { useTheme } from '@/stores/themeStore';
import CartSheet from '@/components/features/CartSheet';

const GOLD  = '#f0c862';
const GOLD2 = '#c9993d';

export const HEADER_H = 56;

export default function TopHeader() {
  const [open,        setOpen]        = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);
  const { totalItems }                = useCart();
  const { isDark, toggleTheme }       = useTheme();
  useEffect(() => {
    const onScroll = () => {
      const ratio = Math.min(Math.max((window.scrollY - 80) / 300, 0), 1);
      setScrollRatio(ratio);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [r, g, b]  = isDark ? [7, 7, 15] : [250, 247, 242];
  const bgAlpha    = (scrollRatio * 0.97).toFixed(3);
  const borderAlpha = (scrollRatio * 0.22).toFixed(3);
  const shadowAlpha = scrollRatio > 0.5
    ? (scrollRatio * (isDark ? 0.45 : 0.10)).toFixed(3)
    : '0';

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between overflow-visible"
        style={{
          height:               `${HEADER_H}px`,
          padding:              '0 14px',
          background:           `rgba(${r},${g},${b},${bgAlpha})`,
          backdropFilter:       scrollRatio > 0.05 ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrollRatio > 0.05 ? 'blur(20px)' : 'none',
          borderBottom:         `1px solid rgba(201,153,61,${borderAlpha})`,
          boxShadow:            scrollRatio > 0.5 ? `0 4px 32px rgba(0,0,0,${shadowAlpha})` : 'none',
          transition:           'box-shadow 0.3s ease',
        }}
      >

        {/* ── LEFT: Cart button + Table badge ──────────── */}
        <button
          onClick={() => setOpen(true)}
          className="relative flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-95"
          style={{
            height:     '38px',
            minWidth:   '38px',
            padding:    totalItems > 0 ? '0 13px 0 10px' : '0 10px',
            background: totalItems > 0
              ? 'linear-gradient(135deg,rgba(201,153,61,0.16),rgba(240,200,98,0.05))'
              : 'var(--surface-2)',
            border:  `1.5px solid ${totalItems > 0 ? 'rgba(201,153,61,0.32)' : 'var(--border-2)'}`,
            cursor:  'pointer',
          }}
          aria-label="سلة الطلبات"
        >
          <div className="relative flex-shrink-0">
            <ShoppingBag
              className="w-[18px] h-[18px]"
              style={{ color: totalItems > 0 ? GOLD : 'var(--text-3)' }}
            />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                  className="absolute flex items-center justify-center rounded-full font-black pointer-events-none"
                  style={{
                    top: '-6px', right: '-6px',
                    minWidth: '16px', height: '16px', padding: '0 3px',
                    fontSize: '9px',
                    background: `linear-gradient(135deg,${GOLD2},${GOLD})`,
                    color: '#07070f',
                    fontFamily: "'Cairo', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
              >
                <span style={{
                  color: GOLD2,
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                }}>
                  سلتي
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* ── CENTER: Brand ──────────────────────────────── */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-0.5"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="العودة للأعلى"
        >
          <p
            className="font-display leading-none"
            style={{ fontSize: '18px', color: 'var(--text-1)', letterSpacing: '0.08em' }}
          >
            sky{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#c9993d,#f0c862)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              7
            </span>
          </p>

          {/* Star rating row — subtle tap target to reviews */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('google-reviews-section')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="flex items-center gap-0.5 transition-opacity hover:opacity-75"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
            aria-label="تقييمات Google"
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                width="7" height="7" viewBox="0 0 24 24"
                fill="#f0c862" stroke="none"
                aria-hidden="true"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span style={{
              color: 'rgba(240,200,98,0.55)',
              fontFamily: "'Cairo',sans-serif",
              fontSize: '9px',
              fontWeight: 600,
              marginRight: '1px',
              lineHeight: 1,
            }}>
              4.9
            </span>
          </button>
        </button>

        {/* ── RIGHT: Theme toggle ────────────────────────── */}
        <motion.button
          whileTap={{ scale: 0.85, rotate: 20 }}
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{
            width:  '38px',
            height: '38px',
            background: isDark
              ? 'rgba(168,220,232,0.08)'
              : 'rgba(201,153,61,0.10)',
            border: isDark
              ? '1px solid rgba(168,220,232,0.22)'
              : '1px solid rgba(201,153,61,0.30)',
            cursor: 'pointer',
            transition: 'background 0.3s ease, border 0.3s ease',
          }}
          aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.span
                key="moon"
                initial={{ rotate: -40, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                exit={{   rotate: 40,  opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.22 }}
                style={{ display: 'flex' }}
              >
                <Moon className="w-[15px] h-[15px]" style={{ color: '#a8dce8' }} />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                initial={{ rotate: -40, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                exit={{   rotate: 40,  opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.22 }}
                style={{ display: 'flex' }}
              >
                <Sun className="w-[15px] h-[15px]" style={{ color: '#c9993d' }} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

      </header>

      {/* Cart sheet */}
      <AnimatePresence>
        {open && <CartSheet key="cart-sheet" onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}