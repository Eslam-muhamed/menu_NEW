import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/stores/cartStore';
import CartSheet from '@/components/features/CartSheet';

const GOLD  = '#f0c862';
const GOLD2 = '#c9993d';

export const HEADER_H = 56; // px — exported so HeroSection can offset

export default function TopHeader() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between transition-all duration-300"
        style={{
          height:       `${HEADER_H}px`,
          padding:      '0 16px',
          background:   scrolled ? 'rgba(7,7,15,0.97)' : 'rgba(7,7,15,0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${scrolled ? 'rgba(201,153,61,0.22)' : 'rgba(201,153,61,0.09)'}`,
          boxShadow:    scrolled ? '0 4px 32px rgba(0,0,0,0.45)' : 'none',
        }}
      >
        {/* ── LEFT: Cart button ───────────────────────────── */}
        <button
          onClick={() => setOpen(true)}
          className="relative flex items-center gap-2.5 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-95"
          style={{
            height: '40px',
            padding: totalItems > 0 ? '0 14px 0 10px' : '0 10px',
            background: totalItems > 0
              ? 'linear-gradient(135deg,rgba(201,153,61,0.16),rgba(240,200,98,0.05))'
              : 'rgba(255,255,255,0.05)',
            border: `1.5px solid ${totalItems > 0 ? 'rgba(201,153,61,0.32)' : 'rgba(255,255,255,0.09)'}`,
            cursor: 'pointer',
          }}
          aria-label="سلة الطلبات"
        >
          {/* Badge */}
          <div className="relative flex-shrink-0">
            <ShoppingBag
              className="w-[19px] h-[19px]"
              style={{ color: totalItems > 0 ? GOLD : '#5a5868' }}
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

        {/* ── RIGHT: Brand ────────────────────────────────── */}
        <div className="flex items-center gap-2.5" dir="rtl">
          {/* Gold separator */}
          <div
            style={{
              width: '1.5px', height: '22px', borderRadius: '1px',
              background: 'linear-gradient(180deg,transparent,rgba(201,153,61,0.5),transparent)',
            }}
          />
          <div>
            <p
              className="font-display leading-none tracking-wider"
              style={{ fontSize: '17px', color: '#f0ece4', letterSpacing: '0.07em' }}
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
                color: '#3a3848',
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
        </div>
      </header>

      {/* Cart sheet */}
      <AnimatePresence>
        {open && <CartSheet key="cart-sheet" onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}