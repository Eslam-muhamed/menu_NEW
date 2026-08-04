export interface CategoryOptions {
  sugar?: boolean;
  ice?: boolean;
  extraShot?: boolean;
  cream?: boolean;
  honey?: boolean;
}

export const CATEGORY_OPTIONS: Record<string, CategoryOptions> = {
  'hot-drinks':   { sugar: true },
  'coffee':       { sugar: true, extraShot: true },
  'ice-coffee':   { sugar: true, ice: true },
  'milk-shake':   {},
  'fresh-juice':  { sugar: true, ice: true },
  'mix-fresh':    { ice: true },
  'smoothies':    {},
  'yogurt':       { cream: true, honey: true },
  'ice-cream':    {},
  'soft-drink':   {},
  'soda-flavors': { ice: true },
  'desserts':     {},
  'fruit-salad':  { cream: true, honey: true },
  'shisha':       {},
};