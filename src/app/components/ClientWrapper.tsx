'use client';
import Link from 'next/link';

import { ReactNode } from 'react';
import { CartProvider, useCart } from '../store/CartContext';
import CartSidebar from './CartSidebar';
import Cursor from './Cursor';

function Nav({ storeName }: { storeName: string }) {
  const { cartCount, setCartOpen } = useCart();
  
  return (
    <nav>
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/category/womens-wear">Women</Link>
        <Link href="/category/mens-wear">Men</Link>
        <Link href="/category/accessories">Accessories</Link>
      </div>
      <Link href="/" className="nav-logo">{storeName}</Link>
      <div className="nav-actions">
        <button>Search</button>
        <button>Account</button>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          Cart <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}

export default function ClientWrapper({ children, storeName }: { children: ReactNode, storeName: string }) {
  return (
    <CartProvider>
      <Cursor />
      <Nav storeName={storeName} />
      <CartSidebar />
      {children}
    </CartProvider>
  );
}
