'use client';
import Link from 'next/link';
import { useCart } from '../store/CartContext';
import { createOrder } from '../actions';

export default function CartSidebar({ whatsappNumber }: { whatsappNumber?: string | null }) {
  const { cart, updateQty, isCartOpen, setCartOpen, cartTotal } = useCart();

  const handleWhatsAppOrder = async () => {
    // Record in DB
    const itemsCount = cart.reduce((acc, i) => acc + i.qty, 0);
    await createOrder('WhatsApp Customer', itemsCount, cartTotal, 'pending');

    const itemsList = cart.map(item => `- ${item.name} (${item.selectedSize}/${item.selectedColor}) x${item.qty} - $${(item.salePrice || item.price) * item.qty}`).join('\n');
    const msg = encodeURIComponent(`Hi! I'd like to place an order for:\n\n${itemsList}\n\nTotal: $${cartTotal}`);
    window.open(`https://wa.me/${whatsappNumber?.replace(/\+/g, '') || '1234567890'}?text=${msg}`, '_blank');
  };

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)}></div>
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">Your Cart</div>
          <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              Your cart is empty.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="cart-item">
                <div className="cart-item-img">
                  {item.photos[0] ? (
                     <img src={item.photos[0]} alt={item.name} />
                  ) : (
                    <span>{item.emoji}</span>
                  )}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-detail">
                    {item.selectedSize ? `Size: ${item.selectedSize}` : 'One Size'} 
                    {item.selectedColor ? ` / Color: ${item.selectedColor}` : ''}
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => updateQty(item.cartId, -1)}>−</button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.cartId, 1)}>+</button>
                    </div>
                    <div className="cart-item-price">${(item.salePrice || item.price) * item.qty}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="cart-total-label">Subtotal</span>
              <span className="cart-total-price">${cartTotal}</span>
            </div>
            <Link href="/checkout" onClick={() => setCartOpen(false)} style={{ textDecoration: 'none' }}>
              <button className="btn-checkout">Proceed to Checkout</button>
            </Link>
            <button 
              className="btn-whatsapp" 
              onClick={handleWhatsAppOrder}
              style={{
                width: '100%',
                padding: '16px',
                marginTop: '12px',
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
              Order All via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
