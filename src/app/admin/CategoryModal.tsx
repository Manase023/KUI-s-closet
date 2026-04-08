'use client';

import { useState, useEffect } from 'react';
import { Category, createCategory, updateCategory } from '../actions';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
};

export default function CategoryModal({ isOpen, onClose, category }: Props) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('published');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setStatus(category.status);
    } else {
      setName('');
      setSlug('');
      setStatus('published');
    }
  }, [category, isOpen]);

  const autoSlug = (val: string) => {
    setName(val);
    if (!category) {
      setSlug(val.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handleSave = async () => {
    if (!name || !slug) return alert('Name and Slug are required');
    setLoading(true);
    try {
      if (category) {
        await updateCategory(category.id, name, slug, status);
      } else {
        await createCategory(name, slug, status);
      }
      onClose();
    } catch (e) {
      alert('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{maxWidth: 500}}>
        <div className="modal-header">
          <h2 className="modal-title">{category ? 'Edit Category' : 'Add New Category'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">Category Name</label>
              <input 
                className="form-input" 
                value={name} 
                onChange={e => autoSlug(e.target.value)} 
                placeholder="e.g. Summer Collection"
              />
            </div>
            <div className="form-group full">
              <label className="form-label">Slug</label>
              <input 
                className="form-input" 
                value={slug} 
                onChange={e => setSlug(e.target.value)} 
                placeholder="summer-collection"
              />
              <div className="text-sm text-muted" style={{marginTop: 4}}>URL-friendly identifier used for filtering</div>
            </div>
            <div className="form-group full">
              <label className="form-label">Status</label>
              <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-save" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
          </button>
        </div>
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
