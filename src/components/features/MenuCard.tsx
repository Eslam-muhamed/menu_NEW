import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { MenuItem } from '@/types/menu';
import { useInView } from '@/hooks/useInView';
import ItemCustomizerModal from '@/components/features/ItemCustomizerModal';

interface MenuCardProps {
  item: MenuItem;
  index: number;
  baseDelay?: number;
}

const FALLBACK =
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=480&h=360&fit=crop&auto=format&q=85';

const badgeStyle: Record<string, React.CSSProperties> = {
  "Chef's Choice": {
    background: 'rgba(201, 153, 61, 0.15)',
    border: '1px solid rgba(201, 153, 61, 0.4)',
    color: '#f0c862',
  },
  Popular: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    color: '#f0ece4',
  },
  New: {
    background: 'rgba(94, 234, 212, 0.12)',
    border: '1px solid rgba(94, 234, 212, 0.3)',
    color: '#5eead4',
  },
};

/* ── Add button (shared style) ─────────────────────── */
function AddBtn({ onPress }: { onPress: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onPress}
      className="flex items-center justify-center rounded-full flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
      style={{
        width: '28px', height: '28px',
        background: 'linear-gradient(135deg, #c9993d, #f0c862)',
        border: 'none', cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(201,153,61,0.4)',
      }}
      aria-label="أضف للسلة"
    >
      <Plus className="w-3.5 h-3.5" style={{ color: '#07070f', strokeWidth: 3 }} />
    </button>
  );
}

export default function MenuCard({ item, index, baseDelay = 0 }: MenuCardProps) {
  const { ref, inView } = useInView(0.05);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const cardDelay = baseDelay + (index % 5) * 55;

  const openCustomizer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCustomizer(true);
  };

  return (
    <>
      <div
        ref={ref}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(18px)',
          transition: `opacity 0.45s ease ${cardDelay}ms, transform 0.45s ease ${cardDelay}ms`,
        }}
      >
        {/* Mobile: horizontal card | sm+: vertical card */}
        <article
          className="group relative overflow-hidden card-glow-hover"
          style={{
            backgroundColor: 'var(--bg-card-alt)',
            border: '1px solid var(--border-1)',
            borderRadius: '14px',
          }}
        >
          {/* ── MOBILE LAYOUT ── */}
          <div className="flex sm:hidden items-stretch min-h-[88px]" dir="rtl">
            {/* Text side */}
            <div className="flex-1 flex flex-col justify-between px-3 py-2.5 overflow-hidden">
              <div>
                {item.badge && (
                  <span
                    className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium mb-1"
                    style={{ ...badgeStyle[item.badge], fontFamily: "'Cairo', sans-serif" }}
                  >
                    {item.badge}
                  </span>
                )}
                <h3
                  className="font-semibold text-sm leading-tight"
                  style={{ color: 'var(--text-1)', fontFamily: "'Cairo', 'Inter', sans-serif" }}
                >
                  {item.name}
                </h3>
                <p
                  className="text-xs mt-0.5 line-clamp-2 leading-relaxed"
                  style={{ color: 'var(--text-2)', fontFamily: "'Cairo', sans-serif" }}
                >
                  {item.description}
                </p>
              </div>
              {/* Price + add button row */}
              <div className="flex items-center justify-between mt-1.5 gap-2">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#c9993d', color: '#07070f', fontFamily: "'Cairo', sans-serif" }}
                >
                  {item.price} {item.currency}
                </span>
                <AddBtn onPress={openCustomizer} />
              </div>
            </div>
            {/* Image side */}
            <div className="relative flex-shrink-0 overflow-hidden" style={{ width: '90px' }}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, transparent 55%)' }}
              />
            </div>
          </div>

          {/* ── DESKTOP LAYOUT ── */}
          <div className="hidden sm:block">
            {/* Image */}
            <div className="relative overflow-hidden" style={{ height: '170px' }}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)' }}
              />
              {item.badge && (
                <div className="absolute top-2 left-2">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ ...badgeStyle[item.badge], backdropFilter: 'blur(8px)' }}
                  >
                    {item.badge}
                  </span>
                </div>
              )}
              <div className="absolute bottom-2.5 right-2.5">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#c9993d', color: '#07070f', fontFamily: "'Cairo', sans-serif" }}
                >
                  {item.price} {item.currency}
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="p-3 pb-3" dir="rtl">
              <h3
                className="font-semibold text-sm leading-snug mb-1"
                style={{ color: 'var(--text-1)', fontFamily: "'Cairo', 'Inter', sans-serif" }}
              >
                {item.name}
              </h3>
              <p
                className="text-xs leading-relaxed line-clamp-2 mb-3"
                style={{ color: 'var(--text-2)', fontFamily: "'Cairo', sans-serif" }}
              >
                {item.description}
              </p>
              {/* Add to cart button */}
              <button
                onClick={openCustomizer}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl transition-opacity hover:opacity-90 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,153,61,0.15), rgba(240,200,98,0.08))',
                  border: '1px solid rgba(201,153,61,0.28)',
                  color: '#f0c862',
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                أضف للسلة
              </button>
            </div>
          </div>

          {/* Hover border glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ borderRadius: '14px', border: '1px solid rgba(201, 153, 61, 0.22)' }}
            aria-hidden="true"
          />
        </article>
      </div>

      {/* Item customizer modal — rendered outside article to avoid overflow clip */}
      <AnimatePresence>
        {showCustomizer && (
          <ItemCustomizerModal
            key={`customizer-${item.id}`}
            item={item}
            onClose={() => setShowCustomizer(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}