export type IceLevel = 'none' | 'little' | 'normal' | 'extra';

export interface CartCustomization {
  quantity: number;
  sugar?: number;       // 0–4 معالق
  ice?: IceLevel;
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