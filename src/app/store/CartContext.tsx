'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  const addToCart = (p: Product, size?: string, color?: string) => {
    const internalId = `${p.id}-${size || ''}-${color || ''}`;
    setCart((prev) => {
      const ex = prev.find((i) => i.cartId === internalId);
      if (ex) return prev.map((i) => (i.cartId === internalId ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1, cartId: internalId, selectedSize: size, selectedColor: color }];
    });
    setCartOpen(true);
  };

  const updateQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.cartId === cartId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter(i => i.cartId !== cartId));
  };

  const emptyCart = () => setCart([]);

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = cart.reduce((acc, i) => acc + (i.salePrice || i.price) * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, emptyCart, isCartOpen, setCartOpen, cartCount, cartTotal }}
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
