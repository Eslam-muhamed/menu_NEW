export type IceLevel = 'none' | 'little' | 'normal' | 'extra';
export type DrinkSize = 'S' | 'M' | 'L';
export type MilkType = 'whole' | 'skim' | 'oat';

export interface CartCustomization {
  quantity: number;
  size?: DrinkSize;
  sugar?: number;       // 0–4 معالق
  ice?: IceLevel;
  milk?: MilkType;
  extraShot?: boolean;
  cream?: boolean;
  honey?: boolean;
  notes?: string;
}

export interface CartItem {
  cartId: string;
  menuItemId: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  customization: CartCustomization;
}