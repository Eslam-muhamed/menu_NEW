export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  badge?: 'Popular' | 'New' | "Chef's Choice";
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}
