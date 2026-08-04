import { useRef, useEffect, useMemo } from 'react';
import { MenuCategory } from '@/types/menu';

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export default function CategoryNav({ categories, activeCategory, onCategoryChange }: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Prepend virtual "All" tab
  const allTabs = useMemo(
    () => [
      { id: 'all', name: 'الكل', icon: '◈', description: '' } as MenuCategory,
      ...categories,
    ],
    [categories]
  );

  // Auto-scroll active tab into view inside the horizontal nav
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const btn = scrollContainerRef.current.querySelector<HTMLElement>(
      `[data-cat="${activeCategory}"]`
    );
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  return (
    <div
      ref={navRef}
      id="category-nav"
      className="sticky z-40 glass"
      style={{ top: '56px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1.5 px-3 py-3 overflow-x-auto scrollbar-hide"
      >
        {allTabs.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              data-cat={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap flex-shrink-0 transition-all duration-300 min-h-[44px]"
              style={
                isActive
                  ? { backgroundColor: '#c9993d', color: '#07070f', fontWeight: 700 }
                  : { color: '#7a7268' }
              }
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="text-base leading-none" aria-hidden="true">
                {cat.icon}
              </span>
              <span style={{ fontFamily: "'Cairo', 'Inter', system-ui, sans-serif" }}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}