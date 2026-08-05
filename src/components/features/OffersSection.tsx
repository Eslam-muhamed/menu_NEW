import { useInView } from '@/hooks/useInView';

interface Offer {
  id: string;
  emoji: string;
  badge: string;
  title: string;
  desc: string;
  highlight: string;
  gradient: string;
  glowColor: string;
}

const offers: Offer[] = [
  {
    id: 'morning',
    emoji: '☀️',
    badge: 'عرض الصباح',
    title: 'خصم 20% على القهوة',
    desc: 'يومياً حتى الساعة 12 ظهراً على جميع مشروبات القهوة الساخنة',
    highlight: '20% OFF',
    gradient: 'linear-gradient(135deg, rgba(201,153,61,0.18) 0%, rgba(240,200,98,0.08) 100%)',
    glowColor: 'rgba(201,153,61,0.25)',
  },
  // {
  //   id: 'dessert',
  //   emoji: '🍰',
  //   badge: 'عرض الحلويات',
  //   title: 'مشروب مجاني',
  //   desc: 'عند طلب أي حلوى من قائمتنا احصل على مشروب ساخن مجاناً',
  //   highlight: '1 + 1',
  //   gradient: 'linear-gradient(135deg, rgba(94,234,212,0.14) 0%, rgba(94,234,212,0.04) 100%)',
  //   glowColor: 'rgba(94,234,212,0.2)',
  // },
  // {
  //   id: 'monday',
  //   emoji: '🥤',
  //   badge: 'عرض الاثنين',
  //   title: 'ميلك شيك مجاني',
  //   desc: 'كل يوم اثنين عند الطلب بأكثر من 100 ج.م تحصل على ميلك شيك مجاناً',
  //   highlight: 'فوق 100 ج.م',
  //   gradient: 'linear-gradient(135deg, rgba(167,139,250,0.14) 0%, rgba(167,139,250,0.04) 100%)',
  //   glowColor: 'rgba(167,139,250,0.2)',
  // },
  {
    id: 'group',
    emoji: '👥',
    badge: 'عرض المجموعات',
    title: 'خصم 15% للأصحاب',
    desc: 'عند الطلب لأكثر من 3 أشخاص في نفس الوقت احصل على خصم خاص',
    highlight: '15% OFF',
    gradient: 'linear-gradient(135deg, rgba(248,113,113,0.14) 0%, rgba(248,113,113,0.04) 100%)',
    glowColor: 'rgba(248,113,113,0.2)',
  },
];

function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  const { ref, inView } = useInView(0.08);
  const delay = index * 90;

  return (
    <div
      ref={ref}
      className="flex-shrink-0 w-[265px] sm:w-auto sm:flex-1"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <article
        className="group relative h-full overflow-hidden"
        style={{
          background: offer.gradient,
          border: '1px solid var(--border-1)',
          borderRadius: '16px',
          backdropFilter: 'blur(12px)',
          cursor: 'default',
          minHeight: '170px',
        }}
      >
        <div
          className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-50 pointer-events-none"
          style={{ background: offer.glowColor }}
          aria-hidden="true"
        />

        <div className="relative z-10 p-4 flex flex-col h-full" dir="rtl">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: 'var(--surface-3)',
                border: '1px solid var(--border-3)',
                color: 'var(--text-1)',
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              {offer.badge}
            </span>
            <span className="text-2xl select-none">{offer.emoji}</span>
          </div>

          <h3
            className="font-bold text-base leading-snug mb-1.5"
            style={{ color: 'var(--text-1)', fontFamily: "'Cairo', sans-serif" }}
          >
            {offer.title}
          </h3>

          <p
            className="text-xs leading-relaxed flex-1"
            style={{ color: 'var(--text-2)', fontFamily: "'Cairo', sans-serif" }}
          >
            {offer.desc}
          </p>

          <div className="mt-3 flex justify-end">
            <span
              className="text-sm font-extrabold tracking-wide px-3 py-1 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #c9993d, #f0c862)',
                color: '#07070f',
                fontFamily: "'Cairo', 'Inter', sans-serif",
              }}
            >
              {offer.highlight}
            </span>
          </div>
        </div>

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            borderRadius: '16px',
            border: `1px solid ${offer.glowColor}`,
            boxShadow: `0 0 30px ${offer.glowColor}`,
          }}
          aria-hidden="true"
        />
      </article>
    </div>
  );
}

function SectionHeader() {
  const { ref, inView } = useInView(0.15);
  return (
    <div
      ref={ref}
      className="flex items-center gap-3 mb-5 px-4 md:px-6"
      dir="rtl"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div>
        <p
          className="text-[10px] uppercase tracking-widest mb-1"
          style={{ color: '#c9993d', fontFamily: "'Inter', sans-serif" }}
        >
          Limited Offers
        </p>
        <h2
          className="font-display text-xl font-bold leading-none"
          style={{ color: 'var(--text-1)' }}
        >
          {'العروض الخاصة '}
          <span
            style={{
              background: 'linear-gradient(135deg, #c9993d, #f0c862)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {'✦'}
          </span>
        </h2>
      </div>
      <div
        className="flex-1 h-px"
        style={{ background: 'linear-gradient(to left, transparent, rgba(201,153,61,0.3))' }}
        aria-hidden="true"
      />
    </div>
  );
}

export default function OffersSection() {
  return (
    <section id="offers-section" className="pt-8 pb-2 max-w-5xl mx-auto overflow-hidden">
      <SectionHeader />

      <div className="md:hidden flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
        {offers.map((offer, i) => (
          <div key={offer.id} className="snap-start">
            <OfferCard offer={offer} index={i} />
          </div>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 px-6">
        {offers.map((offer, i) => (
          <OfferCard key={offer.id} offer={offer} index={i} />
        ))}
      </div>
    </section>
  );
}