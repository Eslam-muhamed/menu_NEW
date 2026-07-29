import { useState, useRef } from 'react';
import { X, Sparkles, Flame, Snowflake } from 'lucide-react';
import { menuItems, categories } from '@/constants/menuData';
import { MenuItem } from '@/types/menu';

const HOT_CATS = ['hot-drinks', 'coffee'];
const COLD_CATS = [
  'ice-coffee', 'milk-shake', 'fresh-juice', 'mix-fresh',
  'smoothies', 'yogurt', 'ice-cream', 'soft-drink', 'soda-flavors',
];
const FALLBACK =
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=480&h=360&fit=crop&auto=format&q=85';

type Pref = 'hot' | 'cold' | null;

export default function SurpriseModal({ onClose }: { onClose: () => void }) {
  const [pref, setPref] = useState<Pref>(null);
  const [result, setResult] = useState<MenuItem | null>(null);
  const [spinItem, setSpinItem] = useState<MenuItem | null>(null);
  const [spinning, setSpinning] = useState(false);
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getPool = () => {
    if (pref === 'hot') return menuItems.filter(i => HOT_CATS.includes(i.category));
    if (pref === 'cold') return menuItems.filter(i => COLD_CATS.includes(i.category));
    return menuItems;
  };

  const handleSurprise = () => {
    if (spinRef.current) clearInterval(spinRef.current);
    const pool = getPool();
    const final = pool[Math.floor(Math.random() * pool.length)];

    setSpinning(true);
    setResult(null);
    setSpinItem(pool[Math.floor(Math.random() * pool.length)]);

    let n = 0;
    spinRef.current = setInterval(() => {
      setSpinItem(pool[Math.floor(Math.random() * pool.length)]);
      n++;
      if (n >= 9) {
        clearInterval(spinRef.current!);
        setSpinItem(final);
        setTimeout(() => {
          setResult(final);
          setSpinning(false);
        }, 180);
      }
    }, 100);
  };

  const catName = (id: string) => categories.find(c => c.id === id)?.name ?? '';
  const catIcon = (id: string) => categories.find(c => c.id === id)?.icon ?? '✨';
  const shown = spinning ? spinItem : result;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(7,7,15,0.88)', backdropFilter: 'blur(14px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="slide-up-modal relative w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
        style={{
          background: '#0c0c1e',
          border: '1px solid rgba(201,153,61,0.2)',
          boxShadow: '0 0 80px rgba(201,153,61,0.12), 0 40px 80px rgba(0,0,0,0.75)',
        }}
      >
        {/* Gold top line */}
        <div
          className="h-[3px] w-full"
          style={{ background: 'linear-gradient(90deg,transparent,#c9993d 28%,#f0c862 50%,#c9993d 72%,transparent)' }}
        />

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#7a7268' }}
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="pt-6 pb-4 px-6 text-center">
          <div
            className="mx-auto mb-3 w-12 h-12 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(201,153,61,0.22),rgba(240,200,98,0.1))' }}
          >
            <Sparkles className="w-6 h-6" style={{ color: '#f0c862' }} />
          </div>
          <h2
            className="font-bold text-lg mb-0.5"
            style={{ color: '#f0ece4', fontFamily: "'Cairo',sans-serif" }}
          >
            ابهرني! ✨
          </h2>
          <p className="text-xs" style={{ color: '#7a7268', fontFamily: "'Cairo',sans-serif" }}>
            خليني أختارلك حاجة على زوقك من المنيو
          </p>
        </div>

        {/* ── Preference selector ───────────────────────────────────── */}
        <div className="px-6 mb-4" dir="rtl">
          <p
            className="text-[11px] text-center mb-2.5 transition-all duration-300"
            style={{ color: pref ? '#c9993d' : '#7a7268', fontFamily: "'Cairo',sans-serif" }}
          >
            {pref === null
              ? 'عايز حاجة... (اختياري)'
              : pref === 'hot'
              ? '🔥 اخترت سخن — هدور في الساخن بس'
              : '❄️ اخترت بارد — هدور في البارد بس'}
          </p>
          <div className="flex gap-3">
            {/* Hot */}
            <button
              onClick={() => setPref(p => (p === 'hot' ? null : 'hot'))}
              className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-300"
              style={{
                fontFamily: "'Cairo',sans-serif",
                background: pref === 'hot' ? 'rgba(239,68,68,0.16)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${pref === 'hot' ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.07)'}`,
                color: pref === 'hot' ? '#fb7185' : '#6b6870',
                transform: pref === 'hot' ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              <Flame className="w-4 h-4" />
              سخن
            </button>
            {/* Cold */}
            <button
              onClick={() => setPref(p => (p === 'cold' ? null : 'cold'))}
              className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-300"
              style={{
                fontFamily: "'Cairo',sans-serif",
                background: pref === 'cold' ? 'rgba(56,189,248,0.16)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${pref === 'cold' ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.07)'}`,
                color: pref === 'cold' ? '#7dd3fc' : '#6b6870',
                transform: pref === 'cold' ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              <Snowflake className="w-4 h-4" />
              بارد
            </button>
          </div>
          {pref && (
            <p
              className="text-[10px] text-center mt-2 transition-opacity duration-300"
              style={{ color: '#4a4850', fontFamily: "'Cairo',sans-serif" }}
            >
              اضغط على الاختيار تاني عشان تلغيه
            </p>
          )}
        </div>

        {/* ── Spinning / Result card ────────────────────────────────── */}
        {shown && (
          <div
            className={`mx-6 mb-4 rounded-2xl overflow-hidden ${!spinning && result ? 'surprise-reveal' : ''}`}
            style={{ background: '#131328', border: '1px solid rgba(201,153,61,0.12)' }}
          >
            {/* Image */}
            <div className="relative h-36 overflow-hidden">
              <img
                src={shown.image}
                alt={shown.name}
                className="w-full h-full object-cover"
                style={{
                  filter: spinning ? 'blur(2px) brightness(0.6)' : 'none',
                  transition: spinning ? 'none' : 'filter 0.3s ease',
                }}
                onError={e => {
                  (e.target as HTMLImageElement).src = FALLBACK;
                }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top,#131328 5%,rgba(19,19,40,0.3) 55%,transparent 100%)' }}
              />

              {/* Spinning sparkle overlay */}
              {spinning && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                  style={{ background: 'rgba(12,12,30,0.55)' }}
                >
                  <Sparkles
                    className="w-9 h-9 animate-spin"
                    style={{ color: '#f0c862' }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: '#7a7268', fontFamily: "'Cairo',sans-serif" }}
                  >
                    بدور على أحسن حاجة...
                  </span>
                </div>
              )}

              {/* Category tag */}
              <div className="absolute top-2.5 right-2.5">
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(7,7,15,0.75)',
                    color: '#f0c862',
                    backdropFilter: 'blur(6px)',
                    fontFamily: "'Cairo',sans-serif",
                  }}
                >
                  {catIcon(shown.category)} {catName(shown.category)}
                </span>
              </div>

              {/* Price */}
              <div className="absolute bottom-2.5 left-2.5">
                <span
                  className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ background: '#c9993d', color: '#07070f', fontFamily: "'Cairo',sans-serif" }}
                >
                  {shown.price} {shown.currency}
                </span>
              </div>
            </div>

            {/* Text */}
            <div className="px-4 py-3" dir="rtl">
              <h3
                className="font-bold text-sm mb-0.5"
                style={{ color: '#f0ece4', fontFamily: "'Cairo',sans-serif" }}
              >
                {shown.name}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: '#7a7268', fontFamily: "'Cairo',sans-serif" }}
              >
                {shown.description}
              </p>
            </div>
          </div>
        )}

        {/* ── CTA button ───────────────────────────────────────────── */}
        <div className="px-6 pb-7">
          <button
            onClick={handleSurprise}
            disabled={spinning}
            className="w-full py-[15px] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              fontFamily: "'Cairo',sans-serif",
              background: spinning
                ? 'rgba(201,153,61,0.18)'
                : 'linear-gradient(135deg,#c9993d 0%,#f0c862 50%,#c9993d 100%)',
              color: spinning ? '#7a7268' : '#07070f',
              boxShadow: spinning ? 'none' : '0 8px 28px rgba(201,153,61,0.38)',
              cursor: spinning ? 'not-allowed' : 'pointer',
            }}
          >
            {spinning ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                بدور...
              </>
            ) : result ? (
              <>
                <span className="text-base leading-none">🎲</span>
                جرب تاني
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                ابهرني!
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
