'use client';
import { useCart } from '../store/CartContext';

export default function CartSidebar() {
  const { cart, updateQty, isCartOpen, setCartOpen, cartTotal } = useCart();

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
                     <img src={item.photos[0]} alt={item.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
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
            <button className="btn-checkout">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </>
  );
}
