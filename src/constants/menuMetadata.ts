import { ItemMetadata } from '@/types/recommendation';

/* ── Category-level defaults ───────────────────────────────────────────── */
const DEFAULTS: Record<string, ItemMetadata> = {
  'hot-drinks':   { temperature: 'hot',  moods: ['relax'],               flavorFamily: 'herbs',  sweetness: 'light'  },
  'coffee':       { temperature: 'hot',  moods: ['energize'],            flavorFamily: 'coffee', sweetness: 'medium' },
  'ice-coffee':   { temperature: 'cold', moods: ['energize', 'refresh'], flavorFamily: 'coffee', sweetness: 'medium' },
  'milk-shake':   { temperature: 'cold', moods: ['sweet'],               flavorFamily: 'milk',   sweetness: 'high'   },
  'fresh-juice':  { temperature: 'cold', moods: ['refresh'],             flavorFamily: 'fruits', sweetness: 'light'  },
  'mix-fresh':    { temperature: 'cold', moods: ['refresh'],             flavorFamily: 'fruits', sweetness: 'medium' },
  'smoothies':    { temperature: 'cold', moods: ['refresh'],             flavorFamily: 'fruits', sweetness: 'medium' },
  'yogurt':       { temperature: 'cold', moods: ['relax'],               flavorFamily: 'milk',   sweetness: 'light'  },
  'ice-cream':    { temperature: 'cold', moods: ['sweet'],               flavorFamily: 'milk',   sweetness: 'high'   },
  'soft-drink':   { temperature: 'cold', moods: ['refresh'],             flavorFamily: 'fruits', sweetness: 'medium' },
  'soda-flavors': { temperature: 'cold', moods: ['refresh'],             flavorFamily: 'fruits', sweetness: 'medium' },
  'desserts':     { temperature: 'cold', moods: ['sweet'],               flavorFamily: 'milk',   sweetness: 'high'   },
  'fruit-salad':  { temperature: 'cold', moods: ['refresh', 'relax'],   flavorFamily: 'fruits', sweetness: 'light'  },
  'shisha':       { temperature: 'hot',  moods: ['relax'],               flavorFamily: 'herbs',  sweetness: 'light'  },
};

/* ── Item-level overrides (only items that differ from category default) ── */
const OVERRIDES: Record<string, Partial<ItemMetadata>> = {
  // hot-drinks: milk-based
  'hd-4':  { flavorFamily: 'milk', sweetness: 'medium' },  // شاي كرك حليب
  'hd-5':  { flavorFamily: 'milk' },                        // شاي حليب
  'hd-10': { flavorFamily: 'milk', sweetness: 'medium' },  // قرفة حليب
  'hd-12': { flavorFamily: 'milk' },                        // زنجبيل حليب
  'hd-14': { sweetness: 'medium' },                         // ميكس أعشاب بالعسل
  'hd-17': { flavorFamily: 'milk', sweetness: 'medium' },  // سحلب مكسرات
  'hd-18': { flavorFamily: 'fruits', sweetness: 'medium' }, // سحلب فواكه
  'hd-19': { flavorFamily: 'fruits', sweetness: 'medium' }, // سحلب مكسرات وفواكه
  'hd-20': { moods: ['sweet', 'relax'], flavorFamily: 'milk', sweetness: 'high' }, // هوت شوكليت
  'hd-21': { moods: ['sweet', 'relax'], flavorFamily: 'milk', sweetness: 'high' }, // هوت اوريو

  // coffee: sweetness/mood overrides
  'cf-1':  { sweetness: 'light' },  'cf-2':  { sweetness: 'light' },
  'cf-7':  { moods: ['sweet', 'energize'], sweetness: 'high' },
  'cf-8':  { sweetness: 'light' },  'cf-9':  { sweetness: 'light' },
  'cf-10': { sweetness: 'light' },
  'cf-18': { moods: ['sweet', 'energize'] },
  'cf-19': { moods: ['sweet', 'energize'], sweetness: 'high' },
  'cf-20': { moods: ['sweet', 'energize'], sweetness: 'high' },
  'cf-21': { sweetness: 'light' },
  'cf-23': { sweetness: 'light' },  'cf-25': { sweetness: 'light' },

  // ice-coffee
  'ic-6':  { sweetness: 'light' },  'ic-7':  { sweetness: 'light' },

  // fresh-juice: light sweetness or milk variants
  'fj-1':  { sweetness: 'light' },  'fj-2':  { sweetness: 'light' },
  'fj-5':  { flavorFamily: 'milk' }, 'fj-7': { flavorFamily: 'milk' },
  'fj-9':  { flavorFamily: 'milk' },
  'fj-10': { flavorFamily: 'milk', sweetness: 'medium' },
  'fj-11': { flavorFamily: 'milk', sweetness: 'medium' },
  'fj-13': { flavorFamily: 'milk' },
  'fj-16': { sweetness: 'light' },  'fj-17': { sweetness: 'medium' },

  // yogurt
  'yg-3':  { sweetness: 'medium' },
  'yg-4':  { moods: ['relax', 'sweet'], sweetness: 'medium' },

  // soft-drink: energy drinks
  'sd-5':  { moods: ['energize', 'refresh'] },
  'sd-6':  { moods: ['energize', 'refresh'] },

  // soda-flavors: energy combos
  'sf-8':  { moods: ['energize', 'refresh'] },
  'sf-9':  { moods: ['energize', 'refresh'] },
};

export function getItemMetadata(itemId: string, category: string): ItemMetadata {
  const base     = DEFAULTS[category] ?? DEFAULTS['hot-drinks'];
  const override = OVERRIDES[itemId]  ?? {};
  return { ...base, ...override };
}