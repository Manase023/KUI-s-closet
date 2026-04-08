'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '@/app/actions';

export type CartItem = Product & { qty: number; cartId: string; selectedSize?: string; selectedColor?: string };

type CartContextType = {
  cart: CartItem[];
  addToCart: (p: Product, size?: string, color?: string) => void;
  updateQty: (cartId: string, delta: number) => void;
  removeFromCart: (cartId: string) => void;
  emptyCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('kui-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('kui-cart', JSON.stringify(cart));
    } catch { /* quota exceeded or unavailable */ }
  }, [cart]);

  const addToCart = (p: Product, size?: string, color?: string) => {
    const internalId = `${p.id}-${size || ''}-${color || ''}`;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartId === internalId);
      
      if (existingIndex > -1) {
        // Item exists, increment quantity
        const updatedCart = [...prev];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          qty: (updatedCart[existingIndex].qty || 0) + 1
        };
        return updatedCart;
      }
      
      // Item doesn't exist, add new
      return [...prev, { ...p, qty: 1, cartId: internalId, selectedSize: size, selectedColor: color }];
    });
    setCartOpen(true);
  };

  const updateQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.cartId === cartId ? { ...i, qty: Math.max(0, (i.qty || 0) + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const emptyCart = () => setCart([]);

  const cartCount = cart.reduce((acc, i) => acc + (i.qty || 0), 0);
  const cartTotal = cart.reduce((acc, i) => acc + (i.salePrice || i.price) * (i.qty || 0), 0);

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        addToCart, 
        updateQty, 
        removeFromCart: (id) => updateQty(id, -999999), 
        emptyCart, 
        isCartOpen, 
        setCartOpen, 
        cartCount, 
        cartTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be wrapped inside CartProvider');
  return ctx;
};
