import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X as CloseIcon, Trash2, Minus, Plus, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/stores/cartStore';
import type { CartItem, DrinkSize, IceLevel, MilkType } from '@/types/cart';

/* ── Theme ───────────────────────────────────────────── */
const DARK  = '#0c0c1e';
const GOLD  = '#f0c862';
const GOLD2 = '#c9993d';
const FALLBACK = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=480&h=360&fit=crop&auto=format&q=85';

/* ── Label maps ──────────────────────────────────────── */
const SIZE_MAP: Record<DrinkSize, string> = { S: 'صغير', M: 'وسط', L: 'كبير' };
const ICE_MAP:  Record<IceLevel,  string> = {
  none: 'بدون ثلج', little: 'ثلج قليل', normal: 'ثلج عادي', extra: 'ثلج كتير',
};
const MILK_MAP: Record<MilkType, string> = {
  whole: 'لبن عادي', skim: 'خالي دسم', oat: 'شوفان',
};

function getCustomizationTags(item: CartItem): string[] {
  const c = item.customization;
  const tags: string[] = [];
  if (c.size)                tags.push(SIZE_MAP[c.size]);
  if (c.sugar !== undefined) tags.push(c.sugar === 0 ? 'بدون سكر' : `${c.sugar} معلقة سكر`);
  if (c.ice)                 tags.push(ICE_MAP[c.ice]);
  if (c.milk)                tags.push(MILK_MAP[c.milk]);
  if (c.extraShot)           tags.push('شوت إضافي');
  if (c.cream)               tags.push('مع كريمة');
  if (c.honey)               tags.push('مع عسل');
  return tags;
}

/* ══════════════════════════════════════════════════════
   WAITER VIEW
══════════════════════════════════════════════════════ */
function WaiterView({ onClose }: { onClose: () => void }) {
  const { items, totalPrice } = useCart();

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ background: 'rgba(7,7,15,0.95)', backdropFilter: 'blur(22px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="relative w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        style={{
          background: '#090919', maxHeight: '90svh',
          border: '1px solid rgba(201,153,61,0.28)',
          boxShadow: '0 0 80px rgba(201,153,61,0.18)',
        }}
      >
        <div style={{ height: '3px', background: `linear-gradient(90deg,transparent,${GOLD2} 28%,${GOLD} 50%,${GOLD2} 72%,transparent)` }} />
        <div className="flex justify-center pt-3 sm:hidden">
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.12)' }} />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 left-4 z-30 flex items-center justify-center rounded-full hover:bg-white/10"
          style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.07)', color: '#7a7268', border: 'none', cursor: 'pointer' }}
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: '86svh' }}>
          {/* Header */}
          <div className="pt-5 pb-2 px-5 text-center">
            <h2 style={{ color: GOLD, fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '17px', letterSpacing: '2px' }}>
              ✦ كشف الطلبات ✦
            </h2>
            <p style={{ color: '#3a3848', fontFamily: "'Cairo', sans-serif", fontSize: '11px', marginTop: '2px' }}>
              sky 7 café &amp; lounge
            </p>
          </div>

          <div style={{ margin: '12px 20px', borderTop: '1px dashed rgba(201,153,61,0.3)' }} />

          {/* Items */}
          <div className="px-5 flex flex-col gap-4" dir="rtl">
            {items.map((item, idx) => {
              const tags = getCustomizationTags(item);
              return (
                <div key={item.cartId}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span style={{ color: '#f0ece4', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '15px' }}>
                          {item.name}
                        </span>
                        <span style={{ color: '#5a5868', fontFamily: "'Cairo', sans-serif", fontSize: '13px' }}>
                          × {item.customization.quantity}
                        </span>
                      </div>
                      {tags.length > 0 && (
                        <p style={{ color: '#5a5868', fontFamily: "'Cairo', sans-serif", fontSize: '12px', marginTop: '3px' }}>
                          {tags.join(' · ')}
                        </p>
                      )}
                      {item.customization.notes && (
                        <p style={{ color: '#c9993d', fontFamily: "'Cairo', sans-serif", fontSize: '11px', marginTop: '3px', fontStyle: 'italic' }}>
                          ملاحظة: {item.customization.notes}
                        </p>
                      )}
                    </div>
                    <span style={{ color: GOLD2, fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                      {item.price * item.customization.quantity} ج.م
                    </span>
                  </div>
                  {idx < items.length - 1 && (
                    <div style={{ marginTop: '14px', borderTop: '1px dashed rgba(255,255,255,0.06)' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div style={{ margin: '20px 20px 0', borderTop: '1px dashed rgba(201,153,61,0.35)' }} />
          <div className="px-5 py-4 flex items-center justify-between" dir="rtl">
            <span style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '14px' }}>الإجمالي</span>
            <span style={{ color: GOLD, fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '24px' }}>
              {totalPrice} ج.م
            </span>
          </div>
          <div style={{ height: '20px' }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   CART ITEM ROW
══════════════════════════════════════════════════════ */
function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, updateQty } = useCart();
  const tags = getCustomizationTags(item);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.22 }}
      className="flex items-start gap-3 py-3"
      dir="rtl"
    >
      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p style={{ color: '#f0ece4', fontFamily: "'Cairo', sans-serif", fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
          {item.name}
        </p>

        {/* Customization tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: '2px 8px', borderRadius: '10px', fontSize: '10px',
                  fontFamily: "'Cairo', sans-serif",
                  background: 'rgba(201,153,61,0.1)', color: GOLD2,
                  border: '1px solid rgba(201,153,61,0.2)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {item.customization.notes && (
          <p style={{ color: '#5a5868', fontFamily: "'Cairo', sans-serif", fontSize: '11px', marginBottom: '6px', fontStyle: 'italic' }}>
            {item.customization.notes}
          </p>
        )}

        {/* Qty controls + price + remove */}
        <div className="flex items-center justify-between">
          {/* Qty */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQty(item.cartId, item.customization.quantity - 1)}
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#7a7268', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span style={{ color: '#f0ece4', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '15px', minWidth: '20px', textAlign: 'center' }}>
              {item.customization.quantity}
            </span>
            <button
              onClick={() => updateQty(item.cartId, item.customization.quantity + 1)}
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: `linear-gradient(135deg,${GOLD2},${GOLD})`,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Plus className="w-3 h-3" style={{ color: '#07070f' }} />
            </button>
          </div>

          {/* Price + delete */}
          <div className="flex items-center gap-2">
            <span style={{ color: GOLD2, fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '14px' }}>
              {item.price * item.customization.quantity} ج.م
            </span>
            <button
              onClick={() => removeItem(item.cartId)}
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)',
                color: '#f87171', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN CART SHEET
══════════════════════════════════════════════════════ */
interface Props { onClose: () => void; }

export default function CartSheet({ onClose }: Props) {
  const { items, clearCart, totalItems, totalPrice } = useCart();
  const [showWaiter, setShowWaiter] = useState(false);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ background: 'rgba(7,7,15,0.88)', backdropFilter: 'blur(16px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="relative w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
          initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{
            background: DARK, maxHeight: '92svh',
            border: '1px solid rgba(201,153,61,0.18)',
            boxShadow: '0 0 80px rgba(201,153,61,0.1), 0 -20px 60px rgba(0,0,0,0.8)',
          }}
        >
          <div style={{ height: '3px', background: `linear-gradient(90deg,transparent,${GOLD2} 28%,${GOLD} 50%,${GOLD2} 72%,transparent)` }} />
          <div className="flex justify-center pt-3 sm:hidden">
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.12)' }} />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 left-4 z-30 flex items-center justify-center rounded-full hover:bg-white/10"
            style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.07)', color: '#7a7268', border: 'none', cursor: 'pointer' }}
          >
            <CloseIcon className="w-4 h-4" />
          </button>

          <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: '88svh' }}>
            {/* Header */}
            <div className="pt-5 pb-3 px-5 text-center">
              <div
                className="mx-auto flex items-center justify-center mb-3"
                style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: 'linear-gradient(135deg,rgba(201,153,61,0.22),rgba(240,200,98,0.06))',
                }}
              >
                <ShoppingBag className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <h2 style={{ color: '#f0ece4', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '18px', marginBottom: '3px' }}>
                سلة الطلبات
              </h2>
              <p style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '12px' }}>
                {totalItems > 0 ? `${totalItems} منتج في سلتك` : 'السلة فاضية'}
              </p>
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
              <div className="text-center py-14 px-6" dir="rtl">
                <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</p>
                <p style={{ color: '#f0ece4', fontFamily: "'Cairo', sans-serif", fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>
                  السلة فاضية دلوقتي!
                </p>
                <p style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '13px' }}>
                  اضغط على زرار + جنب أي منتج عشان تضيفه للسلة
                </p>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="px-5">
                  <AnimatePresence>
                    {items.map((item) => (
                      <div key={item.cartId}>
                        <CartItemRow item={item} />
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                      </div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Total + actions */}
                <div className="px-5 py-4">
                  {/* Total card */}
                  <div
                    className="flex items-center justify-between py-4 px-4 rounded-2xl mb-4"
                    dir="rtl"
                    style={{
                      background: 'linear-gradient(135deg,rgba(201,153,61,0.1),rgba(240,200,98,0.04))',
                      border: '1px solid rgba(201,153,61,0.22)',
                    }}
                  >
                    <span style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '14px' }}>
                      إجمالي الطلب
                    </span>
                    <span style={{ color: GOLD, fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '24px' }}>
                      {totalPrice} ج.م
                    </span>
                  </div>

                  {/* Waiter view CTA */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowWaiter(true)}
                    style={{
                      width: '100%', padding: '15px', borderRadius: '16px', marginBottom: '10px',
                      fontWeight: 700, fontSize: '15px', fontFamily: "'Cairo', sans-serif",
                      border: 'none', cursor: 'pointer',
                      background: `linear-gradient(135deg,${GOLD2},${GOLD})`, color: '#07070f',
                      boxShadow: '0 6px 24px rgba(201,153,61,0.28)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                  >
                    <Eye className="w-5 h-5" />
                    عرض كشف الطلب على الويتر
                  </motion.button>

                  {/* Clear cart */}
                  <button
                    onClick={clearCart}
                    dir="rtl"
                    style={{
                      width: '100%', padding: '12px', borderRadius: '14px',
                      fontWeight: 600, fontSize: '13px', fontFamily: "'Cairo', sans-serif",
                      background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)',
                      color: '#f87171', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    مسح كل الطلبات
                  </button>
                </div>
              </>
            )}

            <div style={{ height: '12px' }} />
          </div>
        </motion.div>
      </motion.div>

      {/* Waiter View */}
      <AnimatePresence>
        {showWaiter && <WaiterView key="waiter" onClose={() => setShowWaiter(false)} />}
      </AnimatePresence>
    </>
  );
}