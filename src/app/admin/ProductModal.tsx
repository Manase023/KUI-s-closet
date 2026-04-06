'use client';
import { useState, useEffect } from 'react';
import { Product, Category } from '../actions';
import * as actions from '../actions';
import ImageUploader from './ImageUploader';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: Category[];
};

export default function ProductModal({ isOpen, onClose, product, categories }: Props) {
  const [form, setForm] = useState<Partial<Product>>({
    name: '',
    category: categories[0]?.name || '',
    price: 0,
    salePrice: null,
    stock: 0,
    sizes: 'XS,S,M,L,XL',
    colors: '',
    description: '',
    photos: [],
    emoji: '👕',
    status: 'published'
  });

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm({
        name: '',
        category: categories[0]?.name || '',
        price: 0,
        salePrice: null,
        stock: 0,
        sizes: 'XS,S,M,L,XL',
        colors: '',
        description: '',
        photos: [],
        emoji: '👕',
        status: 'published'
      });
    }
  }, [product, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product?.id) {
        await actions.updateProduct(product.id, form);
      } else {
        await actions.createProduct(form as Omit<Product, 'id'>);
      }
      onClose();
      alert('Product saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save product.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">Product Name</label>
              <input 
                className="form-input" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
                placeholder="e.g. Linen Oversized Blazer"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-input" 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-input" 
                value={form.status} 
                onChange={e => setForm({...form, status: e.target.value})}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input 
                type="number" 
                className="form-input" 
                value={form.price} 
                onChange={e => setForm({...form, price: parseFloat(e.target.value)})} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sale Price ($)</label>
              <input 
                type="number" 
                className="form-input" 
                value={form.salePrice || ''} 
                onChange={e => setForm({...form, salePrice: e.target.value ? parseFloat(e.target.value) : null})} 
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Inventory</label>
              <input 
                type="number" 
                className="form-input" 
                value={form.stock} 
                onChange={e => setForm({...form, stock: parseInt(e.target.value)})} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emoji Icon</label>
              <input 
                className="form-input" 
                value={form.emoji} 
                onChange={e => setForm({...form, emoji: e.target.value})} 
                placeholder="👕"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sizes</label>
              <input 
                className="form-input" 
                value={form.sizes} 
                onChange={e => setForm({...form, sizes: e.target.value})} 
                placeholder="XS, S, M, L, XL"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Colors</label>
              <input 
                className="form-input" 
                value={form.colors} 
                onChange={e => setForm({...form, colors: e.target.value})} 
                placeholder="Black, White, Ivory"
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Description</label>
              <textarea 
                className="form-textarea" 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                rows={3}
                placeholder="Enter product details..."
              />
            </div>

            <div className="form-group full">
              <label className="form-label" style={{marginBottom: 8, display: 'block'}}>Product Photos</label>
              <ImageUploader 
                photos={form.photos || []} 
                onChange={(p) => setForm({...form, photos: p})} 
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-save">{product ? 'Update Product' : 'Create Product'}</button>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-card {
          background: white;
          width: 100%;
          max-width: 640px;
          border-radius: 16px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
        }
        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
        }
        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 28px;
          color: #9ca3af;
          cursor: pointer;
          line-height: 1;
        }
        .modal-body {
          padding: 24px;
        }
        .modal-footer {
          padding: 24px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: #f9fafb;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
        }
      `}</style>
    </div>
  );
}
