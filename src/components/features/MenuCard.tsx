import { MenuItem } from '@/types/menu';
import { useInView } from '@/hooks/useInView';

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

export default function MenuCard({ item, index, baseDelay = 0 }: MenuCardProps) {
  const { ref, inView } = useInView(0.05);

  // Stagger: section base delay + per-card offset (capped so it feels snappy)
  const cardDelay = baseDelay + (index % 5) * 55;

  return (
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
          backgroundColor: '#131328',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '14px',
        }}
      >
        {/* ── MOBILE LAYOUT: horizontal row ── */}
        <div className="flex sm:hidden items-stretch min-h-[88px]" dir="rtl">
          {/* Text side */}
          <div className="flex-1 flex flex-col justify-between px-3 py-2.5 overflow-hidden">
            <div>
              {item.badge && (
                <span
                  className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium mb-1"
                  style={{
                    ...badgeStyle[item.badge],
                    fontFamily: "'Cairo', sans-serif",
                  }}
                >
                  {item.badge}
                </span>
              )}
              <h3
                className="font-semibold text-sm leading-tight"
                style={{ color: '#f0ece4', fontFamily: "'Cairo', 'Inter', sans-serif" }}
              >
                {item.name}
              </h3>
              <p
                className="text-xs mt-0.5 line-clamp-2 leading-relaxed"
                style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}
              >
                {item.description}
              </p>
            </div>
            <span
              className="text-xs font-bold self-start mt-1.5 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#c9993d', color: '#07070f', fontFamily: "'Cairo', sans-serif" }}
            >
              {item.price} {item.currency}
            </span>
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
              style={{ background: 'linear-gradient(to right, #131328 0%, transparent 40%)' }}
            />
          </div>
        </div>

        {/* ── DESKTOP LAYOUT: vertical card ── */}
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
              style={{ background: 'linear-gradient(to top, #131328 0%, rgba(19,19,40,0.35) 50%, transparent 100%)' }}
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
          <div className="p-3 pb-4" dir="rtl">
            <h3
              className="font-semibold text-sm leading-snug mb-1"
              style={{ color: '#f0ece4', fontFamily: "'Cairo', 'Inter', sans-serif" }}
            >
              {item.name}
            </h3>
            <p
              className="text-xs leading-relaxed line-clamp-2"
              style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}
            >
              {item.description}
            </p>
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
  );
}
