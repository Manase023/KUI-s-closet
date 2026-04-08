'use client';
import { useCart } from '../store/CartContext';
import type { Product } from '@/app/actions';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <button className="btn-add" onClick={() => addToCart(product)}>Add to Cart</button>
  );
}
