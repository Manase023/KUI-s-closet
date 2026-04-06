'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../store/CartContext';
import ClientWrapper from '../components/ClientWrapper';

type Props = {
  storeName: string;
  whatsappNumber?: string | null;
};

export default function CheckoutClient({ storeName, whatsappNumber }: Props) {
  const { cart, cartTotal, emptyCart } = useCart();
  const [orderComplete, setOrderComplete] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
    emptyCart();
  };

  const handleWhatsAppOrder = () => {
    const itemsList = cart.map(item => `- ${item.name} (${item.selectedSize}/${item.selectedColor}) x${item.qty} - $${(item.salePrice || item.price) * item.qty}`).join('\n');
    const msg = encodeURIComponent(`Hi! I'd like to place an order for:\n\n${itemsList}\n\nTotal: $${cartTotal}`);
    window.open(`https://wa.me/${whatsappNumber?.replace(/\+/g, '') || '1234567890'}?text=${msg}`, '_blank');
  };

  if (orderComplete) {
    return (
      <ClientWrapper storeName={storeName} whatsappNumber={whatsappNumber}>
        <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '100vh', background: 'var(--bg2)' }}>
          <div style={{ fontSize: '60px', marginBottom: '24px' }}>✨</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '42px', color: 'var(--cream)', marginBottom: '16px' }}>Thank You for Your Order</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '40px' }}>Your order has been placed successfully and is being processed.</p>
          <Link href="/">
            <button className="btn-primary">Back to Shop</button>
          </Link>
        </div>
      </ClientWrapper>
    );
  }

  return (
    <ClientWrapper storeName={storeName} whatsappNumber={whatsappNumber}>
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '60px 48px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '64px' }} className="checkout-container">
          
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '32px', color: 'var(--cream)', marginBottom: '20px' }}>Shipping Information</h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '40px' }}>Complete your details below or <button onClick={handleWhatsAppOrder} style={{ background: 'none', border: 'none', color: '#25D366', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>Order via WhatsApp</button> for faster checkout.</p>
            
            <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input type="text" placeholder="First Name" required className="newsletter-input" style={{ width: '100%' }} />
                <input type="text" placeholder="Last Name" required className="newsletter-input" style={{ width: '100%' }} />
              </div>
              <input type="email" placeholder="Email Address" required className="newsletter-input" style={{ width: '100%' }} />
              <input type="text" placeholder="Address" required className="newsletter-input" style={{ width: '100%' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <input type="text" placeholder="City" required className="newsletter-input" style={{ width: '100%' }} />
                <input type="text" placeholder="State/Province" required className="newsletter-input" style={{ width: '100%' }} />
                <input type="text" placeholder="Postal Code" required className="newsletter-input" style={{ width: '100%' }} />
              </div>

              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '32px', color: 'var(--cream)', marginTop: '40px', marginBottom: '40px' }}>Payment</h2>
              <input type="text" placeholder="Card Number" required className="newsletter-input" style={{ width: '100%' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input type="text" placeholder="MM/YY" required className="newsletter-input" style={{ width: '100%' }} />
                <input type="text" placeholder="CVC" required className="newsletter-input" style={{ width: '100%' }} />
              </div>

              <button type="submit" className="btn-checkout" style={{ marginTop: '40px', height: '60px' }}>Place Order - ${cartTotal}</button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary" style={{ background: 'var(--bg2)', padding: '40px', border: '1px solid var(--border)', height: 'fit-content' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '24px', color: 'var(--cream)', marginBottom: '32px' }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cart.map((item) => (
                <div key={item.cartId} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '60px', height: '75px', background: 'var(--bg)', flexShrink: 0 }}>
                    {item.photos[0] ? (
                      <img src={item.photos[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.emoji}</div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--cream)', fontSize: '14px' }}>{item.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '4px' }}>
                      Qty: {item.qty} {item.selectedSize ? ` / Size: ${item.selectedSize}` : ''}
                    </div>
                  </div>
                  <div style={{ color: 'var(--cream)', fontSize: '14px' }}>${(item.salePrice || item.price) * item.qty}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Subtotal</span>
                <span style={{ color: 'var(--cream)', fontSize: '14px' }}>${cartTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Shipping</span>
                <span style={{ color: 'var(--cream)', fontSize: '14px' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontWeight: 'bold' }}>
                <span style={{ color: 'var(--cream)', fontSize: '18px' }}>Total</span>
                <span style={{ color: 'var(--cream)', fontSize: '18px' }}>${cartTotal}</span>
              </div>
            </div>

            <button 
              onClick={handleWhatsAppOrder}
              style={{
                width: '100%',
                padding: '16px',
                marginTop: '32px',
                background: '#25D366',
                color: '#fff',
                border: 'none',
                fontFamily: 'var(--sans)',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              Order via WhatsApp
            </button>
          </div>

        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .checkout-container { grid-template-columns: 1fr !important; gap: 40px !important; }
          .order-summary { order: -1; }
        }
      `}</style>
    </ClientWrapper>
  );
}
