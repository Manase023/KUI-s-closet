'use client';
import { useState } from 'react';
import { useCart } from '../store/CartContext';
import type { Product } from '../actions';

type Props = {
  product: Product;
};

export default function ProductOptions({ product }: Props) {
  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];
  const colors = product.colors ? product.colors.split(',').map(c => c.trim()) : [];

  const [size, setSize] = useState(sizes[0] || '');
  const [color, setColor] = useState(colors[0] || '');

  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, size, color);
  };

  const isOutOfStock = product.stock === 0 || product.status === 'out';

  return (
    <div style={{ marginTop: '32px' }}>
      {sizes.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '12px' }}>Select Size</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {sizes.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={{
                  padding: '10px 16px',
                  background: size === s ? 'var(--cream)' : 'transparent',
                  color: size === s ? 'var(--bg)' : 'var(--cream)',
                  border: `1px solid ${size === s ? 'var(--cream)' : 'var(--border)'}`,
                  fontSize: '12px',
                  cursor: 'none',
                  transition: 'all 0.2s',
                  borderRadius: '2px'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '12px' }}>Select Color</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  padding: '10px 16px',
                  background: color === c ? 'var(--cream)' : 'transparent',
                  color: color === c ? 'var(--bg)' : 'var(--cream)',
                  border: `1px solid ${color === c ? 'var(--cream)' : 'var(--border)'}`,
                  fontSize: '12px',
                  cursor: 'none',
                  transition: 'all 0.2s',
                  borderRadius: '2px'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={isOutOfStock}
        style={{
          width: '100%',
          padding: '18px',
          background: isOutOfStock ? 'page.tsx' : 'var(--accent)',
          color: isOutOfStock ? 'var(--muted)' : 'white',
          border: 'none',
          fontFamily: 'var(--sans)',
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: '500',
          cursor: isOutOfStock ? 'not-allowed' : 'none',
          opacity: isOutOfStock ? 0.5 : 1,
          transition: 'transform 0.2s, background 0.2s'
        }}
        onMouseOver={e => {
          if(!isOutOfStock) e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={e => {
          if(!isOutOfStock) e.currentTarget.style.transform = 'none';
        }}
      >
        {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
      </button>
    </div>
  );
}
