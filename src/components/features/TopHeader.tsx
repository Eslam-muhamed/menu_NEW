import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Moon, Sun } from 'lucide-react';
import { useCart } from '@/stores/cartStore';
import { useTheme } from '@/stores/themeStore';
import CartSheet from '@/components/features/CartSheet';

const GOLD  = '#f0c862';
const GOLD2 = '#c9993d';

export const HEADER_H = 56; // px — exported so HeroSection can offset

export default function TopHeader() {
  const [open,       setOpen]       = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);
  const { totalItems }              = useCart();
  const { isDark, toggleTheme }     = useTheme();

  useEffect(() => {
    const onScroll = () => {
      // Start fading in at scrollY=80, fully opaque at scrollY=380
      const ratio = Math.min(Math.max((window.scrollY - 80) / 300, 0), 1);
      setScrollRatio(ratio);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Dynamic background colour — adapts to theme
  const [r, g, b] = isDark ? [7, 7, 15] : [250, 247, 242];
  const bgAlpha     = (scrollRatio * 0.97).toFixed(3);
  const borderAlpha = (scrollRatio * 0.22).toFixed(3);
  const shadowAlpha = scrollRatio > 0.5
    ? (scrollRatio * (isDark ? 0.45 : 0.10)).toFixed(3)
    : '0';

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between"
        style={{
          height:           `${HEADER_H}px`,
          padding:          '0 16px',
          background:       `rgba(${r},${g},${b},${bgAlpha})`,
          backdropFilter:   scrollRatio > 0.05 ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrollRatio > 0.05 ? 'blur(20px)' : 'none',
          borderBottom:     `1px solid rgba(201,153,61,${borderAlpha})`,
          boxShadow:        scrollRatio > 0.5 ? `0 4px 32px rgba(0,0,0,${shadowAlpha})` : 'none',
          transition:       'box-shadow 0.3s ease',
        }}
      >
        {/* ── LEFT: Cart button ───────────────────────────── */}
        <button
          onClick={() => setOpen(true)}
          className="relative flex items-center gap-2.5 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-95"
          style={{
            height:     '40px',
            padding:    totalItems > 0 ? '0 14px 0 10px' : '0 10px',
            background: totalItems > 0
              ? 'linear-gradient(135deg,rgba(201,153,61,0.16),rgba(240,200,98,0.05))'
              : 'var(--surface-2)',
            border:  `1.5px solid ${totalItems > 0 ? 'rgba(201,153,61,0.32)' : 'var(--border-2)'}`,
            cursor:  'pointer',
          }}
          aria-label="سلة الطلبات"
        >
          {/* Badge */}
          <div className="relative flex-shrink-0">
            <ShoppingBag
              className="w-[19px] h-[19px]"
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
                    top: '-7px', right: '-7px',
                    minWidth: '17px', height: '17px', padding: '0 4px',
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

          {/* Label — only when items exist */}
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  color: GOLD2,
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: '13px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                سلتي
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* ── RIGHT: Theme toggle + Brand ─────────────────── */}
        <div className="flex items-center gap-2" dir="rtl">
          {/* Brand */}
          <div>
            <p
              className="font-display leading-none tracking-wider"
              style={{ fontSize: '17px', color: 'var(--text-1)', letterSpacing: '0.07em' }}
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
            <p
              style={{
                color: 'var(--text-4)',
                fontSize: '8px',
                letterSpacing: '0.32em',
                fontFamily: "'Cairo', sans-serif",
                textAlign: 'right',
                lineHeight: 1.2,
                marginTop: '1px',
              }}
            >
              CAFÉ &amp; LOUNGE
            </p>
          </div>

          {/* Separator */}
          <div
            style={{
              width: '1.5px', height: '22px', borderRadius: '1px',
              background: 'linear-gradient(180deg,transparent,rgba(201,153,61,0.5),transparent)',
            }}
          />

          {/* ── Theme Toggle ──────────────────────────────── */}
          <motion.button
            whileTap={{ scale: 0.85, rotate: 20 }}
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-full"
            style={{
              width:  '36px',
              height: '36px',
              flexShrink: 0,
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
        </div>
      </header>

      {/* Cart sheet */}
      <AnimatePresence>
        {open && <CartSheet key="cart-sheet" onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}