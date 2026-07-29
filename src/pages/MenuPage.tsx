import { useMemo, useState, useRef } from 'react';
import HeroSection from '@/components/features/HeroSection';
import CategoryNav from '@/components/features/CategoryNav';
import MenuSection from '@/components/features/MenuSection';
import SearchBar from '@/components/features/SearchBar';
import Footer from '@/components/layout/Footer';
import SurpriseButton from '@/components/features/SurpriseButton';
import WhatsAppButton from '@/components/features/WhatsAppButton';
import { categories, menuItems } from '@/constants/menuData';

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return categories
      .filter((cat) => activeCategory === 'all' || cat.id === activeCategory)
      .map((category) => ({
        category,
        items: menuItems
          .filter((item) => item.category === category.id)
          .filter((item) =>
            q === '' || item.name.includes(q) || item.name.toLowerCase().includes(q)
          ),
      }))
      .filter(({ items }) => items.length > 0);
  }, [searchQuery, activeCategory]);

  const totalResults = filteredSections.reduce((sum, s) => sum + s.items.length, 0);
  const isSearching = searchQuery.trim() !== '';

  const handleCategoryChange = (id: string) => {
    if (id === activeCategory) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    // Phase 1: fade + slide current content out
    setIsTransitioning(true);

    timerRef.current = setTimeout(() => {
      // Phase 2: swap content — new renderKey remounts sections so card animations replay
      setActiveCategory(id);
      setRenderKey((k) => k + 1);
      setIsTransitioning(false);

      // Scroll back to menu top
      const el = document.getElementById('menu-content');
      if (el) {
        const navH = document.getElementById('category-nav')?.offsetHeight ?? 52;
        const top = el.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 230);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#07070f', color: '#f0ece4' }}>
      {/* Hero */}
      <HeroSection />

      {/* Menu Content */}
      <div id="menu-content">
        {/* Sticky Category Filter Nav */}
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <main>
          {/* Search Bar */}
          <div className="px-4 md:px-6 max-w-5xl mx-auto pt-5 pb-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* Results count when searching */}
            {isSearching && (
              <p
                className="text-xs mt-2 text-right pr-1"
                dir="rtl"
                style={{
                  color: totalResults > 0 ? '#7a7268' : '#c9993d',
                  fontFamily: "'Cairo', 'Inter', system-ui, sans-serif",
                }}
              >
                {totalResults > 0
                  ? `${totalResults} نتيجة بحث`
                  : 'لا توجد نتائج مطابقة'}
              </p>
            )}
          </div>

          {/*
           * Animated wrapper:
           *  - fades out (opacity→0, translateY→12px) over 230ms when isTransitioning=true
           *  - after timeout, content swaps + fades back in (opacity→1, translateY→0)
           *  - renderKey change remounts MenuSection children → card useInView animations replay
           */}
          <div
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(12px)' : 'translateY(0)',
              transition: 'opacity 0.23s ease, transform 0.23s ease',
              willChange: 'opacity, transform',
            }}
          >
            {filteredSections.length === 0 ? (
              <div className="text-center py-24 px-6" dir="rtl">
                <p className="text-5xl mb-5 select-none">☕</p>
                <p
                  className="font-display text-xl mb-2"
                  style={{ color: '#f0ece4' }}
                >
                  لا توجد نتائج
                </p>
                <p
                  className="text-sm"
                  style={{
                    color: '#7a7268',
                    fontFamily: "'Cairo', 'Inter', system-ui, sans-serif",
                  }}
                >
                  {isSearching
                    ? 'جرب البحث بكلمة أخرى'
                    : 'اختر قسماً آخر من القائمة'}
                </p>
              </div>
            ) : (
              filteredSections.map(({ category, items }, sectionIndex) => (
                <MenuSection
                  key={`${renderKey}-${category.id}`}
                  category={category}
                  items={items}
                  sectionIndex={sectionIndex}
                />
              ))
            )}

            <div className="h-8" aria-hidden="true" />
          </div>
        </main>
      </div>

      {/* Floating action buttons */}
      <WhatsAppButton />
      <SurpriseButton />

      <Footer />
    </div>
  );
}
