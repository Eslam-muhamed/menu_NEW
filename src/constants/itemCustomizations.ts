export interface CategoryOptions {
  sugar?: boolean;
  size?: boolean;
  ice?: boolean;
  milk?: boolean;
  extraShot?: boolean;
  cream?: boolean;
  honey?: boolean;
}

export const CATEGORY_OPTIONS: Record<string, CategoryOptions> = {
  'hot-drinks':   { sugar: true },
  'coffee':       { sugar: true, size: true, milk: true, extraShot: true },
  'ice-coffee':   { sugar: true, size: true, ice: true },
  'milk-shake':   { size: true },
  'fresh-juice':  { sugar: true, ice: true },
  'mix-fresh':    { ice: true },
  'smoothies':    { size: true },
  'yogurt':       { cream: true, honey: true },
  'ice-cream':    {},
  'soft-drink':   {},
  'soda-flavors': { ice: true },
  'desserts':     {},
  'fruit-salad':  { cream: true, honey: true },
  'shisha':       {},
};