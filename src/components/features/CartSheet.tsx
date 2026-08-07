import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X as CloseIcon, Trash2, Minus, Plus, ShoppingBag, Eye, Users, ChevronDown } from 'lucide-react';
import { useCart } from '@/stores/cartStore';
import { useTable } from '@/stores/tableStore';
import type { CartItem, IceLevel } from '@/types/cart';

const PHONE   = '201128727999';
const GOLD    = '#f0c862';
const GOLD2   = '#c9993d';
const FALLBACK = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=480&h=360&fit=crop&auto=format&q=85';

const VODAFONE_CASH = '010XXXXXXXX'; // TODO: ضع رقم فودافون كاش الحقيقي
const INSTAPAY_ID   = '010XXXXXXXX'; // TODO: ضع معرف انستاباي الحقيقي

type OrderType    = 'dine-in' | 'delivery';
type PaymentMethod = 'cash' | 'vodafone' | 'instapay';
interface DeliveryInfo { name: string; phone: string; address: string; }

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 9.27 20.92 6.78 19.05 4.91 17.18 3.03 14.69 2 12.04 2zm0 1.67c2.2 0 4.26.86 5.82 2.42 1.55 1.56 2.41 3.63 2.41 5.83 0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.13l-.3-.18-3.12.81.83-3.04-.2-.32C4.24 14.98 3.8 13.46 3.8 11.91c.01-4.54 3.7-8.24 8.24-8.24zm-2.51 4.16c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1.01 2.56.13.17 1.75 2.67 4.24 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.28-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.13-.17.25-.65.8-.79.96-.14.17-.28.19-.52.07-.25-.13-1.03-.38-1.96-1.21-.72-.65-1.2-1.45-1.34-1.7-.14-.25-.01-.39.12-.52.11-.11.25-.29.38-.43.12-.14.17-.25.24-.41.08-.17.04-.31-.02-.44-.05-.13-.56-1.36-.77-1.84-.21-.47-.42-.41-.58-.42-.15-.01-.32-.04-.53-.04z"/>
    </svg>
  );
}

function buildWhatsAppMessage(
  items: CartItem[],
  totalPrice: number,
  tableNumber: string,
  orderType: OrderType = 'dine-in',
  delivery?: DeliveryInfo,
  paymentMethod?: PaymentMethod,
): string {
  const lines: string[] = [];

  if (orderType === 'delivery') {
    lines.push('🛵 *--- طلب توصيل خارجي ---*');
    lines.push('*sky 7 cafe & lounge*');
    lines.push('');
    if (delivery?.name.trim())    lines.push(`👤 *الاسم:* ${delivery.name.trim()}`);
    if (delivery?.phone.trim())   lines.push(`📱 *الموبايل:* ${delivery.phone.trim()}`);
    if (delivery?.address.trim()) lines.push(`📍 *العنوان:* ${delivery.address.trim()}`);
    if (paymentMethod) {
      const pmLabels: Record<PaymentMethod, string> = { cash: 'نقدي', vodafone: 'فودافون كاش', instapay: 'انستاباي' };
      lines.push(`💳 *طريقة الدفع:* ${pmLabels[paymentMethod]}`);
    }
    lines.push('');
  } else {
    lines.push('🪑 *--- طلبية داخل الكافيه ---*');
    lines.push('*sky 7 cafe & lounge*');
    if (tableNumber.trim()) lines.push(`🪑 *رقم الطاولة: ${tableNumber.trim()}*`);
    lines.push('');
  }

  items.forEach((item, idx) => {
    const qty       = item.customization.quantity;
    const lineTotal = item.price * qty;
    lines.push(`${idx + 1}. *${item.name}* × ${qty} = ${lineTotal} ج.م`);
    const tags = getCustomizationTags(item);
    if (tags.length > 0) lines.push(`   ${tags.join(' · ')}`);
    if (item.customization.notes) lines.push(`   📝 ${item.customization.notes}`);
  });

  lines.push('');
  lines.push(`💰 *الاجمالي: ${totalPrice} ج.م*`);
  return lines.join('\n');
}

/* ── ICE map ──────────────────────────────────────── */
const ICE_MAP: Record<IceLevel, string> = {
  none: 'بدون ثلج', little: 'ثلج قليل', normal: 'ثلج عادي', extra: 'ثلج كتير',
};

function getCustomizationTags(item: CartItem): string[] {
  const c    = item.customization;
  const tags: string[] = [];
  if (c.sugar !== undefined) tags.push(c.sugar === 0 ? 'بدون سكر' : `${c.sugar} معلقة سكر`);
  if (c.ice)                 tags.push(ICE_MAP[c.ice]);
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
  const { tableNumber }                          = useTable();
  const [orderType,       setOrderType]       = useState<OrderType>('dine-in');
  const [deliveryName,    setDeliveryName]    = useState('');
  const [deliveryPhone,   setDeliveryPhone]   = useState('');
  const [deliveryAddress,  setDeliveryAddress]  = useState('');
  const [paymentMethod,    setPaymentMethod]    = useState<PaymentMethod>('cash');

  const handleSend = () => {
    const msg = buildWhatsAppMessage(
      items, totalPrice, tableNumber ?? '', orderType,
      { name: deliveryName, phone: deliveryPhone, address: deliveryAddress },
      orderType === 'delivery' ? paymentMethod : undefined,
    );
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ background: 'rgba(var(--bg-main-rgb),0.95)', backdropFilter: 'blur(22px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="relative w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        style={{
          background:  'var(--bg-card)',
          maxHeight:   '90svh',
          border:      '1px solid rgba(201,153,61,0.28)',
          boxShadow:   'var(--modal-shadow)',
        }}
      >
        <div style={{ height: '3px', background: `linear-gradient(90deg,transparent,${GOLD2} 28%,${GOLD} 50%,${GOLD2} 72%,transparent)` }} />
        <div className="flex justify-center pt-3 sm:hidden">
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--border-3)' }} />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 left-4 z-30 flex items-center justify-center rounded-full hover:opacity-80"
          style={{ width: '32px', height: '32px', background: 'var(--surface-3)', color: 'var(--text-2)', border: 'none', cursor: 'pointer' }}
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: '86svh' }}>
          {/* Header */}
          <div className="pt-5 pb-2 px-5 text-center">
            <h2 style={{ color: GOLD, fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '17px', letterSpacing: '2px' }}>
              ✦ كشف الطلبات ✦
            </h2>
            <p style={{ color: 'var(--text-4)', fontFamily: "'Cairo', sans-serif", fontSize: '11px', marginTop: '2px' }}>
              sky 7 café &amp; lounge
            </p>
          </div>

          {/* Order type toggle */}
          <div className="px-5 pb-3">
            <div style={{
              display: 'flex', background: 'var(--surface-1)',
              border: '1px solid var(--border-2)', borderRadius: '16px',
              padding: '4px', gap: '4px',
            }} dir="rtl">
              <button
                onClick={() => setOrderType('dine-in')}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: '12px',
                  border: 'none', cursor: 'pointer', transition: 'all 0.22s',
                  fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '13px',
                  background: orderType === 'dine-in' ? `linear-gradient(135deg,${GOLD2},${GOLD})` : 'transparent',
                  color: orderType === 'dine-in' ? '#07070f' : 'var(--text-3)',
                  boxShadow: orderType === 'dine-in' ? '0 2px 12px rgba(201,153,61,0.30)' : 'none',
                }}
              >🪑 داخل الكافيه</button>
              <button
                onClick={() => setOrderType('delivery')}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: '12px',
                  border: 'none', cursor: 'pointer', transition: 'all 0.22s',
                  fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '13px',
                  background: orderType === 'delivery' ? 'linear-gradient(135deg,#1da851,#25D366)' : 'transparent',
                  color: orderType === 'delivery' ? '#fff' : 'var(--text-3)',
                  boxShadow: orderType === 'delivery' ? '0 2px 12px rgba(37,211,102,0.30)' : 'none',
                }}
              >🛵 توصيل خارجي</button>
            </div>
          </div>

          {/* Dine-in: table number | Delivery: customer info */}
          <div className="px-5 pb-2">
            <AnimatePresence mode="wait">
              {orderType === 'dine-in' ? (
                <motion.div key="dine-in"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <div dir="rtl" style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(201,153,61,0.07)', border: '1px solid rgba(201,153,61,0.22)',
                    borderRadius: '14px', padding: '12px 16px',
                  }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>🪑</span>
                    <div>
                      {tableNumber ? (
                        <>
                          <p style={{ color: 'rgba(201,153,61,0.6)', fontFamily: "'Cairo', sans-serif", fontSize: '10px', marginBottom: '2px' }}>
                            رقم الطاولة
                          </p>
                          <p style={{ color: '#f0c862', fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>
                            {tableNumber}
                          </p>
                        </>
                      ) : (
                        <p style={{ color: 'var(--text-3)', fontFamily: "'Cairo', sans-serif", fontSize: '13px', fontWeight: 600 }}>
                          امسح QR كود الطاولة لتحديد رقمها
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="delivery"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col gap-2" dir="rtl"
                >
                  {/* Label */}
                  <div style={{
                    padding: '8px 12px', borderRadius: '10px', marginBottom: '2px',
                    background: 'rgba(37,211,102,0.07)', border: '1px dashed rgba(37,211,102,0.22)',
                    textAlign: 'center',
                  }}>
                    <span style={{ color: '#25D366', fontFamily: "'Cairo', sans-serif", fontSize: '11px', fontWeight: 600 }}>
                      🛵 بيانات التوصيل — ستظهر في رسالة الواتساب
                    </span>
                  </div>
                  {/* Name */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.18)',
                    borderRadius: '14px', padding: '10px 14px',
                  }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>👤</span>
                    <input
                      type="text"
                      placeholder="اسم العميل"
                      value={deliveryName}
                      onChange={e => setDeliveryName(e.target.value)}
                      style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: 'var(--text-1)', fontFamily: "'Cairo', sans-serif",
                        fontSize: '14px', fontWeight: 600,
                      }}
                    />
                  </div>
                  {/* Phone */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.18)',
                    borderRadius: '14px', padding: '10px 14px',
                  }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>📱</span>
                    <input
                      type="tel" inputMode="numeric"
                      placeholder="رقم الموبايل"
                      value={deliveryPhone}
                      onChange={e => setDeliveryPhone(e.target.value)}
                      style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: 'var(--text-1)', fontFamily: "'Cairo', sans-serif",
                        fontSize: '14px', fontWeight: 600,
                      }}
                    />
                  </div>
                  {/* Address */}
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.18)',
                    borderRadius: '14px', padding: '10px 14px',
                  }}>
                    <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '2px' }}>📍</span>
                    <textarea
                      placeholder="العنوان بالتفصيل"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      rows={3}
                      style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: 'var(--text-1)', fontFamily: "'Cairo', sans-serif",
                        fontSize: '14px', fontWeight: 600, resize: 'none', lineHeight: '1.5',
                      }}
                    />
                  </div>

                  {/* ── Payment Method ──────────────────────────── */}
                  <div dir="rtl">
                    <p style={{ color: 'rgba(37,211,102,0.75)', fontFamily: "'Cairo', sans-serif", fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>
                      💳 طريقة الدفع
                    </p>
                    <div className="flex gap-2">
                      {([
                        { key: 'cash',     label: '💵 نقدي' },
                        { key: 'vodafone', label: '📱 فودافون كاش' },
                        { key: 'instapay', label: '🏦 انستاباي' },
                      ] as { key: PaymentMethod; label: string }[]).map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setPaymentMethod(opt.key)}
                          style={{
                            flex: 1, padding: '9px 3px', borderRadius: '12px',
                            border: `1.5px solid ${paymentMethod === opt.key ? 'rgba(37,211,102,0.55)' : 'rgba(37,211,102,0.15)'}`,
                            background: paymentMethod === opt.key ? 'rgba(37,211,102,0.13)' : 'transparent',
                            color: paymentMethod === opt.key ? '#25D366' : 'var(--text-4)',
                            fontFamily: "'Cairo', sans-serif", fontSize: '10px', fontWeight: 700,
                            cursor: 'pointer', transition: 'all 0.18s',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Wallet number ───────────────────────────── */}
                  <AnimatePresence>
                    {(paymentMethod === 'vodafone' || paymentMethod === 'instapay') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: '12px 16px', borderRadius: '14px',
                          background: 'rgba(37,211,102,0.06)',
                          border: '1px dashed rgba(37,211,102,0.32)',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }} dir="rtl">
                          <div>
                            <p style={{ color: 'rgba(37,211,102,0.55)', fontFamily: "'Cairo', sans-serif", fontSize: '10px', marginBottom: '4px' }}>
                              {paymentMethod === 'vodafone' ? 'ادفع على رقم فودافون كاش' : 'ادفع على معرف انستاباي'}
                            </p>
                            <p style={{ color: '#25D366', fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '18px', letterSpacing: '0.06em' }}>
                              {paymentMethod === 'vodafone' ? VODAFONE_CASH : INSTAPAY_ID}
                            </p>
                          </div>
                          <span style={{ fontSize: '30px', lineHeight: 1 }}>
                            {paymentMethod === 'vodafone' ? '📱' : '🏦'}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Receipt note ──────────────────────────── */}
                  <AnimatePresence>
                    {paymentMethod !== 'cash' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: '12px 14px', borderRadius: '14px',
                          background: 'rgba(37,211,102,0.05)',
                          border: '1px dashed rgba(37,211,102,0.25)',
                          display: 'flex', alignItems: 'flex-start', gap: '8px',
                        }} dir="rtl">
                          <span style={{ fontSize: '16px', flexShrink: 0 }}>📎</span>
                          <p style={{
                            color: 'rgba(37,211,102,0.75)', fontFamily: "'Cairo', sans-serif",
                            fontSize: '12px', fontWeight: 600, lineHeight: 1.6, margin: 0,
                          }}>
                            بعد إرسال الطلب، ابعت صورة الوصل على نفس محادثة الواتساب
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ margin: '8px 20px', borderTop: '1px dashed rgba(201,153,61,0.3)' }} />

          {/* Items */}
          <div className="px-5 flex flex-col gap-4" dir="rtl">
            {items.map((item, idx) => {
              const tags = getCustomizationTags(item);
              return (
                <div key={item.cartId}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span style={{ color: 'var(--text-1)', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '15px' }}>
                          {item.name}
                        </span>
                        <span style={{ color: 'var(--text-3)', fontFamily: "'Cairo', sans-serif", fontSize: '13px' }}>
                          × {item.customization.quantity}
                        </span>
                      </div>
                      {tags.length > 0 && (
                        <p style={{ color: 'var(--text-3)', fontFamily: "'Cairo', sans-serif", fontSize: '12px', marginTop: '3px' }}>
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
                    <div style={{ marginTop: '14px', borderTop: '1px dashed var(--border-1)' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div style={{ margin: '20px 20px 0', borderTop: '1px dashed rgba(201,153,61,0.35)' }} />
          <div className="px-5 pt-4 pb-2 flex items-center justify-between" dir="rtl">
            <span style={{ color: 'var(--text-2)', fontFamily: "'Cairo', sans-serif", fontSize: '14px' }}>الإجمالي</span>
            <span style={{ color: GOLD, fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '24px' }}>
              {totalPrice} ج.م
            </span>
          </div>

          {/* WhatsApp */}
          <div className="px-5 pb-6">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSend}
              style={{
                width: '100%', padding: '15px', borderRadius: '16px', marginTop: '10px',
                fontWeight: 700, fontSize: '15px', fontFamily: "'Cairo', sans-serif",
                border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#1da851,#25D366)',
                color: '#fff',
                boxShadow: '0 6px 24px rgba(37,211,102,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <WhatsAppIcon />
              إرسال الطلب عبر واتساب
            </motion.button>
          </div>
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
      <img
        src={item.image} alt={item.name}
        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
      />

      <div className="flex-1 min-w-0">
        <p style={{ color: 'var(--text-1)', fontFamily: "'Cairo', sans-serif", fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
          {item.name}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag, i) => (
              <span key={i} style={{
                padding: '2px 8px', borderRadius: '10px', fontSize: '10px',
                fontFamily: "'Cairo', sans-serif",
                background: 'rgba(201,153,61,0.1)', color: GOLD2,
                border: '1px solid rgba(201,153,61,0.2)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {item.customization.notes && (
          <p style={{ color: 'var(--text-3)', fontFamily: "'Cairo', sans-serif", fontSize: '11px', marginBottom: '6px', fontStyle: 'italic' }}>
            {item.customization.notes}
          </p>
        )}

        <div className="flex items-center justify-between">
          {/* Qty */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQty(item.cartId, item.customization.quantity - 1)}
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-2)',
                color: 'var(--text-2)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span style={{ color: 'var(--text-1)', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '15px', minWidth: '20px', textAlign: 'center' }}>
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
                background: 'var(--delete-bg)', border: '1px solid var(--delete-border)',
                color: 'var(--delete-text)', cursor: 'pointer',
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
  const [showWaiter,  setShowWaiter]  = useState(false);
  const [splitOpen,   setSplitOpen]   = useState(false);
  const [splitCount,  setSplitCount]  = useState(2);
  const [assignments, setAssignments] = useState<Record<string, number | null>>({});

  const handleSplitCountChange = (next: number) => {
    setSplitCount(next);
    setAssignments(prev => {
      const cleaned: Record<string, number | null> = {};
      Object.entries(prev).forEach(([id, idx]) => {
        cleaned[id] = idx !== null && idx < next ? idx : null;
      });
      return cleaned;
    });
  };

  const toggleAssign = (cartId: string, personIdx: number) => {
    setAssignments(prev => ({
      ...prev,
      [cartId]: prev[cartId] === personIdx ? null : personIdx,
    }));
  };

  const personTotals = Array.from({ length: splitCount }, (_, i) =>
    items
      .filter(item => assignments[item.cartId] === i)
      .reduce((sum, item) => sum + item.price * item.customization.quantity, 0)
  );
  const unassignedTotal = items
    .filter(item => assignments[item.cartId] == null)
    .reduce((sum, item) => sum + item.price * item.customization.quantity, 0);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ background: 'rgba(var(--bg-main-rgb),0.88)', backdropFilter: 'blur(16px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="relative w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
          initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{
            background:  'var(--bg-card)',
            maxHeight:   '92svh',
            border:      '1px solid rgba(201,153,61,0.18)',
            boxShadow:   'var(--modal-shadow)',
          }}
        >
          <div style={{ height: '3px', background: `linear-gradient(90deg,transparent,${GOLD2} 28%,${GOLD} 50%,${GOLD2} 72%,transparent)` }} />
          <div className="flex justify-center pt-3 sm:hidden">
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--border-3)' }} />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 left-4 z-30 flex items-center justify-center rounded-full hover:opacity-80"
            style={{ width: '32px', height: '32px', background: 'var(--surface-3)', color: 'var(--text-2)', border: 'none', cursor: 'pointer' }}
          >
            <CloseIcon className="w-4 h-4" />
          </button>

          <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: '88svh' }}>
            {/* Header */}
            <div className="pt-5 pb-3 px-5 text-center">
              <div
                className="mx-auto flex items-center justify-center mb-3"
                style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg,rgba(201,153,61,0.22),rgba(240,200,98,0.06))' }}
              >
                <ShoppingBag className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <h2 style={{ color: 'var(--text-1)', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '18px', marginBottom: '3px' }}>
                سلة الطلبات
              </h2>
              <p style={{ color: 'var(--text-2)', fontFamily: "'Cairo', sans-serif", fontSize: '12px' }}>
                {totalItems > 0 ? `${totalItems} منتج في سلتك` : 'السلة فاضية'}
              </p>
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
              <div className="text-center py-14 px-6" dir="rtl">
                <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</p>
                <p style={{ color: 'var(--text-1)', fontFamily: "'Cairo', sans-serif", fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>
                  السلة فاضية دلوقتي!
                </p>
                <p style={{ color: 'var(--text-2)', fontFamily: "'Cairo', sans-serif", fontSize: '13px' }}>
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
                        <div style={{ height: '1px', background: 'var(--border-1)' }} />
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
                    style={{ background: 'linear-gradient(135deg,rgba(201,153,61,0.1),rgba(240,200,98,0.04))', border: '1px solid rgba(201,153,61,0.22)' }}
                  >
                    <span style={{ color: 'var(--text-2)', fontFamily: "'Cairo', sans-serif", fontSize: '14px' }}>
                      إجمالي الطلب
                    </span>
                    <span style={{ color: GOLD, fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '24px' }}>
                      {totalPrice} ج.م
                    </span>
                  </div>

                  {/* ── Bill Splitter ─────────────────────────── */}
                  <div className="mb-3">
                    <button
                      onClick={() => setSplitOpen(x => !x)}
                      style={{
                        width: '100%', padding: '11px 16px', borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: splitOpen ? 'rgba(168,220,232,0.08)' : 'var(--surface-1)',
                        border: `1px solid ${splitOpen ? 'rgba(168,220,232,0.28)' : 'var(--border-2)'}`,
                        cursor: 'pointer', transition: 'all 0.22s',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" style={{ color: splitOpen ? '#a8dce8' : 'var(--text-3)' }} />
                        <span style={{ color: splitOpen ? '#a8dce8' : 'var(--text-2)', fontFamily: "'Cairo', sans-serif", fontWeight: 600, fontSize: '13px' }}>
                          حساب الشلة
                        </span>
                      </div>
                      <ChevronDown
                        className="w-3.5 h-3.5"
                        style={{ color: splitOpen ? '#a8dce8' : 'var(--text-4)', transform: splitOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.22s' }}
                      />
                    </button>

                    <AnimatePresence>
                      {splitOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.26, ease: 'easeOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ paddingTop: '12px' }}>

                            {/* People counter */}
                            <div
                              className="flex items-center justify-between mb-4"
                              dir="rtl"
                              style={{ padding: '10px 14px', borderRadius: '14px', background: 'var(--surface-1)', border: '1px solid var(--border-1)' }}
                            >
                              <span style={{ color: 'var(--text-2)', fontFamily: "'Cairo', sans-serif", fontSize: '13px' }}>عدد الأفراد</span>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleSplitCountChange(Math.max(2, splitCount - 1))}
                                  style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: splitCount <= 2 ? 'var(--surface-1)' : 'rgba(168,220,232,0.1)',
                                    border: '1px solid rgba(168,220,232,0.18)',
                                    color: splitCount <= 2 ? 'var(--text-4)' : '#a8dce8',
                                    cursor: splitCount <= 2 ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span style={{ color: 'var(--text-1)', fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '18px', minWidth: '28px', textAlign: 'center' }}>
                                  {splitCount}
                                </span>
                                <button
                                  onClick={() => handleSplitCountChange(Math.min(10, splitCount + 1))}
                                  style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: 'rgba(168,220,232,0.1)', border: '1px solid rgba(168,220,232,0.18)',
                                    color: '#a8dce8', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Hint */}
                            <p style={{ color: 'var(--text-5)', fontFamily: "'Cairo', sans-serif", fontSize: '11px', textAlign: 'center', marginBottom: '10px', direction: 'rtl' }}>
                              اضغط رقم الشخص جنب كل منتج
                            </p>

                            {/* Item assignment */}
                            <div className="flex flex-col gap-2 mb-4">
                              {items.map(item => {
                                const assigned  = assignments[item.cartId] ?? null;
                                const lineTotal = item.price * item.customization.quantity;
                                return (
                                  <div
                                    key={item.cartId}
                                    style={{
                                      padding: '10px 12px', borderRadius: '14px',
                                      background: assigned !== null ? 'rgba(168,220,232,0.05)' : 'var(--surface-1)',
                                      border: `1px solid ${assigned !== null ? 'rgba(168,220,232,0.15)' : 'var(--border-1)'}`,
                                      transition: 'all 0.2s',
                                    }}
                                    dir="rtl"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span style={{ color: 'var(--text-1)', fontFamily: "'Cairo', sans-serif", fontSize: '13px', fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: '8px' }}>
                                        {item.name}
                                        {item.customization.quantity > 1 && (
                                          <span style={{ color: 'var(--text-3)', fontSize: '11px', marginRight: '4px' }}>×{item.customization.quantity}</span>
                                        )}
                                      </span>
                                      <span style={{ color: assigned !== null ? '#a8dce8' : GOLD2, fontFamily: "'Cairo', sans-serif", fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                                        {lineTotal} ج.م
                                      </span>
                                    </div>
                                    <div className="flex gap-1.5 flex-wrap">
                                      {Array.from({ length: splitCount }, (_, i) => {
                                        const isMe = assigned === i;
                                        return (
                                          <button
                                            key={i}
                                            onClick={() => toggleAssign(item.cartId, i)}
                                            style={{
                                              width: '32px', height: '26px', borderRadius: '8px',
                                              fontSize: '11px', fontWeight: 700,
                                              fontFamily: "'Cairo', sans-serif",
                                              border: 'none', cursor: 'pointer',
                                              transition: 'all 0.15s',
                                              background: isMe ? 'linear-gradient(135deg,#a8dce8,#7abccf)' : 'var(--surface-3)',
                                              color: isMe ? '#07070f' : 'var(--text-3)',
                                              transform: isMe ? 'scale(1.08)' : 'scale(1)',
                                              boxShadow: isMe ? '0 2px 8px rgba(168,220,232,0.35)' : 'none',
                                            }}
                                          >
                                            {i + 1}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Per-person totals */}
                            <div style={{ padding: '14px', borderRadius: '16px', background: 'linear-gradient(135deg,rgba(168,220,232,0.07),rgba(168,220,232,0.02))', border: '1px solid rgba(168,220,232,0.18)', marginBottom: '12px' }}>
                              <p style={{ color: 'var(--text-2)', fontFamily: "'Cairo', sans-serif", fontSize: '11px', textAlign: 'center', marginBottom: '10px', direction: 'rtl' }}>
                                ✦ ملخص حساب الشلة
                              </p>
                              <div className="flex flex-col gap-2">
                                {Array.from({ length: splitCount }, (_, i) => {
                                  const amt = personTotals[i];
                                  return (
                                    <motion.div key={i} layout className="flex items-center justify-between" dir="rtl"
                                      style={{ padding: '8px 10px', borderRadius: '10px', background: amt > 0 ? 'rgba(168,220,232,0.08)' : 'var(--surface-1)' }}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: amt > 0 ? 'linear-gradient(135deg,#a8dce8,#7abccf)' : 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: amt > 0 ? '#07070f' : 'var(--text-4)', flexShrink: 0 }}>
                                          {i + 1}
                                        </span>
                                        <span style={{ color: amt > 0 ? 'var(--text-1)' : 'var(--text-4)', fontFamily: "'Cairo', sans-serif", fontSize: '12px' }}>
                                          الشخص {i + 1}
                                        </span>
                                      </div>
                                      <motion.span
                                        key={amt}
                                        initial={{ scale: 0.9, opacity: 0.5 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.15 }}
                                        style={{ color: amt > 0 ? '#a8dce8' : 'var(--text-4)', fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: amt > 0 ? '16px' : '13px' }}
                                      >
                                        {amt > 0 ? `${amt} ج.م` : '—'}
                                      </motion.span>
                                    </motion.div>
                                  );
                                })}

                                {unassignedTotal > 0 && (
                                  <div className="flex items-center justify-between" dir="rtl"
                                    style={{ padding: '8px 10px', borderRadius: '10px', background: 'rgba(201,153,61,0.07)', border: '1px dashed rgba(201,153,61,0.2)', marginTop: '2px' }}
                                  >
                                    <span style={{ color: '#7a5a2a', fontFamily: "'Cairo', sans-serif", fontSize: '12px' }}>غير منسوب</span>
                                    <span style={{ color: GOLD2, fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '14px' }}>{unassignedTotal} ج.م</span>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Waiter CTA */}
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
                      background: 'var(--delete-bg)', border: '1px solid var(--delete-border)',
                      color: 'var(--delete-text)', cursor: 'pointer',
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