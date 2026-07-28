import { MenuCategory, MenuItem } from '@/types/menu';
import MenuCard from '@/components/features/MenuCard';
import { useInView } from '@/hooks/useInView';

interface MenuSectionProps {
  category: MenuCategory;
  items: MenuItem[];
  sectionIndex?: number;
}

export default function MenuSection({ category, items, sectionIndex = 0 }: MenuSectionProps) {
  const { ref: headerRef, inView: headerInView } = useInView(0.1);

  // Stagger each section's entrance by 60ms (capped at 300ms)
  const entranceDelay = Math.min(sectionIndex * 60, 300);

  return (
    <section
      id={`section-${category.id}`}
      className="py-6 px-3 md:px-6 max-w-5xl mx-auto"
    >
      {/* Section Header */}
      <div
        ref={headerRef}
        style={{
          opacity: headerInView ? 1 : 0,
          transform: headerInView ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.45s ease ${entranceDelay}ms, transform 0.45s ease ${entranceDelay}ms`,
        }}
        className="mb-5"
        dir="rtl"
      >
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-xl leading-none" aria-hidden="true">{category.icon}</span>
          <h2
            className="font-bold text-xl md:text-2xl"
            style={{ color: '#f0ece4', fontFamily: "'Cairo', 'Inter', sans-serif" }}
          >
            {category.name}
          </h2>
        </div>
        <p
          className="text-xs pr-9"
          style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}
        >
          {category.description}
        </p>
        <div
          className="mt-3 mr-9 h-px w-10 rounded-full"
          style={{ background: 'linear-gradient(to left, #c9993d, transparent)' }}
          aria-hidden="true"
        />
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {items.map((item, index) => (
          <MenuCard
            key={item.id}
            item={item}
            index={index}
            baseDelay={entranceDelay}
          />
        ))}
      </div>
    </section>
  );
}
