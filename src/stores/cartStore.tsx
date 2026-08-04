import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { CartItem } from '@/types/cart';

/* ── State & Actions ─────────────────────────────────── */
interface CartState { items: CartItem[]; }

type CartAction =
  | { type: 'ADD';        item: CartItem }
  | { type: 'REMOVE';     cartId: string }
  | { type: 'UPDATE_QTY'; cartId: string; qty: number }
  | { type: 'CLEAR' };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD':
      return { ...state, items: [...state.items, action.item] };

    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.cartId !== action.cartId) };

    case 'UPDATE_QTY':
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.cartId !== action.cartId) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.cartId === action.cartId
            ? { ...i, customization: { ...i.customization, quantity: action.qty } }
            : i
        ),
      };

    case 'CLEAR':
      return { items: [] };

    default:
      return state;
  }
}

/* ── Context ─────────────────────────────────────────── */
interface CartContextValue {
  items: CartItem[];
  addItem:    (item: CartItem) => void;
  removeItem: (cartId: string) => void;
  updateQty:  (cartId: string, qty: number) => void;
  clearCart:  () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const value: CartContextValue = {
    items:      state.items,
    addItem:    (item)          => dispatch({ type: 'ADD', item }),
    removeItem: (cartId)        => dispatch({ type: 'REMOVE', cartId }),
    updateQty:  (cartId, qty)   => dispatch({ type: 'UPDATE_QTY', cartId, qty }),
    clearCart:  ()              => dispatch({ type: 'CLEAR' }),
    totalItems: state.items.reduce((s, i) => s + i.customization.quantity, 0),
    totalPrice: state.items.reduce((s, i) => s + i.price * i.customization.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}