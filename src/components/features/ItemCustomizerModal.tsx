import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X as CloseIcon, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import type { MenuItem } from '@/types/menu';
import type { CartCustomization, IceLevel } from '@/types/cart';
import { CATEGORY_OPTIONS } from '@/constants/itemCustomizations';
import { useCart } from '@/stores/cartStore';
import { playCartAdd } from '@/lib/sound';

/* ── Theme ───────────────────────────────────────────── */
const DARK  = '#0c0c1e';
const GOLD  = '#f0c862';
const GOLD2 = '#c9993d';
const FALLBACK = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=480&h=360&fit=crop&auto=format&q=85';

/* ── Labels ──────────────────────────────────────────── */
const ICE_LABELS:  Record<IceLevel, string> = {
  none:   '🚫 بدون',
  little: '❄️ قليل',
  normal: '🧊 عادي',
  extra:  '💎 كتير',
};

/* ── Props ───────────────────────────────────────────── */
interface Props {
  item: MenuItem;
  onClose: () => void;
}

/* ── Section title helper ────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      color: GOLD, fontFamily: "'Cairo', sans-serif",
      fontWeight: 600, fontSize: '13px', marginBottom: '8px',
    }}>
      {children}
    </p>
  );
}

/* ── Main Component ──────────────────────────────────── */
export default function ItemCustomizerModal({ item, onClose }: Props) {
  const { addItem } = useCart();
  const opts = CATEGORY_OPTIONS[item.category] ?? {};

  /* State */
  const [qty,       setQty]       = useState(1);
  const [sugar,     setSugar]     = useState<number | undefined>(undefined);
  const [ice,       setIce]       = useState<IceLevel>('normal');
  const [extraShot, setExtraShot] = useState(false);
  const [cream,     setCream]     = useState(false);
  const [honey,     setHoney]     = useState(false);
  const [notes,     setNotes]     = useState('');

  const total = item.price * qty;

  /* Pill styles */
  const pillBase: React.CSSProperties = {
    padding: '7px 14px', borderRadius: '20px', fontSize: '12px',
    fontFamily: "'Cairo', sans-serif", fontWeight: 600,
    border: 'none', cursor: 'pointer', transition: 'all 0.18s',
  };
  const pillActive:   React.CSSProperties = { ...pillBase, background: `linear-gradient(135deg,${GOLD2},${GOLD})`, color: '#07070f' };
  const pillInactive: React.CSSProperties = { ...pillBase, background: 'rgba(255,255,255,0.05)', color: '#7a7268' };

  /* Add to cart */
  const handleAdd = () => {
    const customization: CartCustomization = {
      quantity: qty,
      ...(opts.sugar && sugar !== undefined ? { sugar } : {}),
      ...(opts.ice       ? { ice }       : {}),
      ...(opts.extraShot ? { extraShot } : {}),
      ...(opts.cream     ? { cream }     : {}),
      ...(opts.honey     ? { honey }     : {}),
      ...(notes.trim()   ? { notes: notes.trim() } : {}),
    };

    const cartId = Date.now().toString(36) + Math.random().toString(36).slice(2);

    addItem({
      cartId,
      menuItemId: item.id,
      name:       item.name,
      price:      item.price,
      currency:   item.currency,
      category:   item.category,
      image:      item.image ?? FALLBACK,
      customization,
    });

    playCartAdd();

    toast.success('تمت الإضافة للسلة ✅', {
      description: item.name,
      duration: 2000,
      style: {
        background: '#131328',
        border: '1px solid rgba(201,153,61,0.3)',
        color: '#f0ece4',
        fontFamily: "'Cairo', sans-serif",
        direction: 'rtl',
      },
    });

    onClose();
  };

  const modalContent = (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ background: 'rgba(7,7,15,0.9)', backdropFilter: 'blur(18px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="relative w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        style={{
          background: DARK, maxHeight: '92svh',
          border: '1px solid rgba(201,153,61,0.18)',
          boxShadow: '0 0 80px rgba(201,153,61,0.1), 0 -20px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Gold line */}
        <div style={{ height: '3px', background: `linear-gradient(90deg,transparent,${GOLD2} 28%,${GOLD} 50%,${GOLD2} 72%,transparent)` }} />

        {/* Drag handle */}
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

          {/* Item preview */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-4" dir="rtl">
            <img
              src={item.image ?? FALLBACK}
              alt={item.name}
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
            />
            <div className="flex-1 min-w-0">
              <h3 style={{ color: '#f0ece4', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '16px', marginBottom: '3px' }}>
                {item.name}
              </h3>
              <p className="line-clamp-2" style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '12px', marginBottom: '6px' }}>
                {item.description}
              </p>
              <span style={{ color: GOLD2, fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '14px' }}>
                {item.price} {item.currency}
              </span>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 20px' }} />

          {/* Options */}
          <div className="px-5 py-4 flex flex-col gap-5" dir="rtl">

            {/* ─ Quantity ─ */}
            <div>
              <SectionTitle>🔢 الكمية</SectionTitle>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: qty <= 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: qty <= 1 ? '#3a3848' : '#f0ece4',
                    cursor: qty <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span style={{ color: '#f0ece4', fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '22px', minWidth: '28px', textAlign: 'center' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => Math.min(10, q + 1))}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: `linear-gradient(135deg,${GOLD2},${GOLD})`,
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Plus className="w-4 h-4" style={{ color: '#07070f' }} />
                </button>
              </div>
            </div>

            {/* ─ Sugar ─ */}
            {opts.sugar && (
              <div>
                <SectionTitle>🍬 السكر</SectionTitle>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setSugar(undefined)} style={sugar === undefined ? pillActive : pillInactive}>
                    لا تحدد
                  </button>
                  {[0, 1, 2, 3, 4].map(n => (
                    <button key={n} onClick={() => setSugar(n)} style={sugar === n ? pillActive : pillInactive}>
                      {n === 0 ? 'بدون سكر' : `${n} معلقة`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─ Ice ─ */}
            {opts.ice && (
              <div>
                <SectionTitle>🧊 الثلج</SectionTitle>
                <div className="flex gap-2 flex-wrap">
                  {(['none', 'little', 'normal', 'extra'] as IceLevel[]).map(lvl => (
                    <button key={lvl} onClick={() => setIce(lvl)} style={ice === lvl ? pillActive : pillInactive}>
                      {ICE_LABELS[lvl]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─ Extras toggles ─ */}
            {(opts.extraShot || opts.cream || opts.honey) && (
              <div>
                <SectionTitle>✨ إضافات</SectionTitle>
                <div className="flex gap-2 flex-wrap">
                  {opts.extraShot && (
                    <button onClick={() => setExtraShot(x => !x)} style={extraShot ? pillActive : pillInactive}>
                      ☕ شوت إضافي
                    </button>
                  )}
                  {opts.cream && (
                    <button onClick={() => setCream(c => !c)} style={cream ? pillActive : pillInactive}>
                      🍦 كريمة
                    </button>
                  )}
                  {opts.honey && (
                    <button onClick={() => setHoney(h => !h)} style={honey ? pillActive : pillInactive}>
                      🍯 عسل
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ─ Notes ─ */}
            <div>
              <SectionTitle>📝 ملاحظات (اختياري)</SectionTitle>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="أي تعليمات أو تخصيصات إضافية..."
                maxLength={120}
                rows={2}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '12px',
                  color: '#f0ece4',
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: '13px',
                  padding: '10px 14px',
                  resize: 'none',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Footer: total + CTA */}
          <div className="px-5 pb-6 pt-1">
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '16px' }} />
            <div className="flex items-center justify-between mb-4" dir="rtl">
              <span style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '13px' }}>الإجمالي</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={total}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  style={{ color: GOLD, fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '22px' }}
                >
                  {total} {item.currency}
                </motion.span>
              </AnimatePresence>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              style={{
                width: '100%', padding: '15px', borderRadius: '16px',
                fontWeight: 700, fontSize: '15px', fontFamily: "'Cairo', sans-serif",
                border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg,${GOLD2},${GOLD})`,
                color: '#07070f',
                boxShadow: '0 6px 24px rgba(201,153,61,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <ShoppingBag className="w-5 h-5" />
              إضافة للسلة
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}