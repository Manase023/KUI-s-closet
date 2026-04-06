'use client';
import Link from 'next/link';

import { ReactNode, useState, useEffect } from 'react';
import { CartProvider, useCart } from '../store/CartContext';
import CartSidebar from './CartSidebar';
import Cursor from './Cursor';
import SearchModal from './SearchModal';
import * as actions from '../actions';
import { type Product } from '../actions';

function Nav({ storeName, onSearchOpen }: { storeName: string, onSearchOpen: () => void }) {
  const { cartCount, setCartOpen } = useCart();
  
  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo">{storeName}</Link>
      
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/category/new-arrivals">New Drops</Link>
        <Link href="/category/dresses">Dresses</Link>
        <Link href="/category/lingerie-sleepwear">Lingerie</Link>
      </div>

      <div className="nav-actions">
        <button className="nav-icon-btn" onClick={onSearchOpen} aria-label="Search">
          <span className="icon-label">Search</span>
        </button>
        <Link href="/admin" className="nav-icon-btn" aria-label="Account">
          <span className="icon-label">Account</span>
        </Link>
        <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
          <span className="icon-label">Bag</span>
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}

export default function ClientWrapper({ children, storeName, whatsappNumber }: { children: ReactNode, storeName: string, whatsappNumber?: string | null }) {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Record visit
    actions.trackVisit(window.location.pathname, 'pending', navigator.userAgent);
    
    if (isSearchOpen && products.length === 0) {
      actions.getProducts().then(setProducts);
    }
  }, [isSearchOpen, products.length]);

  return (
    <CartProvider>
      <Cursor />
      <Nav storeName={storeName} onSearchOpen={() => setSearchOpen(true)} />
      <CartSidebar whatsappNumber={whatsappNumber} />
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setSearchOpen(false)} 
        products={products} 
      />
      {children}
    </CartProvider>
  );
}
