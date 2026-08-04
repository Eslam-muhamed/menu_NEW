import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/stores/cartStore';
import CartSheet from '@/components/features/CartSheet';

const GOLD  = '#f0c862';
const GOLD2 = '#c9993d';

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed z-40 flex items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
        style={{
          bottom: '5.4rem',
          right: '1rem',
          width: '52px',
          height: '52px',
          background: 'linear-gradient(135deg,rgba(14,14,32,0.97),rgba(24,24,52,0.97))',
          border: '1.5px solid rgba(201,153,61,0.38)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.55), 0 0 16px rgba(201,153,61,0.1)',
          cursor: 'pointer',
        }}
        aria-label="سلة الطلبات"
      >
        <ShoppingBag className="w-[22px] h-[22px]" style={{ color: GOLD }} />

        {/* Animated count badge */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              key={totalItems}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full font-black"
              style={{
                minWidth: '20px', height: '20px', padding: '0 5px',
                fontSize: '10px',
                background: `linear-gradient(135deg,${GOLD2},${GOLD})`,
                color: '#07070f',
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              {totalItems > 99 ? '99+' : totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Cart sheet */}
      <AnimatePresence>
        {open && <CartSheet key="cart-sheet" onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}