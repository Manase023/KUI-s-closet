'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Product } from '../actions';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
};

export default function SearchModal({ isOpen, onClose, products }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <input 
            type="text" 
            placeholder="Search our collections..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            autoFocus
          />
          <button className="search-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="search-results">
          {results.length > 0 ? (
            <div className="results-grid">
              {results.map(p => (
                <Link key={p.id} href={`/product/${p.id}`} className="result-item" onClick={onClose}>
                  <div className="result-img">
                    {p.photos[0] ? (
                      <img src={p.photos[0]} alt={p.name} />
                    ) : (
                      <span>{p.emoji}</span>
                    )}
                  </div>
                  <div className="result-info">
                    <div className="result-name">{p.name}</div>
                    <div className="result-category">{p.category}</div>
                    <div className="result-price">${Math.floor(p.salePrice || p.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="no-results">No products found for "{query}"</div>
          ) : (
            <div className="search-placeholder">Start typing to find products...</div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-overlay {
          position: fixed; inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex; justify-content: center; padding-top: 100px;
        }
        .search-modal {
          width: 90%; max-width: 800px;
          background: var(--bg2);
          border: 1px solid var(--border);
          max-height: 80vh; display: flex; flex-direction: column;
          box-shadow: 0 40px 100px rgba(0,0,0,0.4);
        }
        .search-header {
          padding: 32px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 24px;
        }
        .search-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: var(--serif); font-size: 32px; color: var(--cream);
          font-weight: 300;
        }
        .search-input::placeholder { color: var(--muted); opacity: 0.5; }
        .search-close { background: none; border: none; color: var(--muted); font-size: 24px; cursor: pointer; transition: color 0.3s; }
        .search-close:hover { color: var(--cream); }
        .search-results { flex: 1; overflow-y: auto; padding: 32px; }
        .results-grid { display: grid; gap: 24px; }
        .result-item { 
          display: flex; gap: 24px; text-decoration: none; align-items: center; 
          padding: 16px; transition: background 0.3s; border-radius: 4px;
        }
        .result-item:hover { background: rgba(255,255,255,0.05); }
        .result-img { 
          width: 80px; height: 100px; background: var(--bg); flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .result-img img { width: 100%; height: 100%; object-fit: cover; }
        .result-img span { font-size: 40px; }
        .result-name { font-family: var(--serif); fontSize: 20px; color: var(--cream); margin-bottom: 4px; }
        .result-category { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin-bottom: 8px; }
        .result-price { font-size: 16px; color: var(--cream); }
        .no-results, .search-placeholder { text-align: center; color: var(--muted); padding: 60px 0; font-weight: 300; font-size: 18px; }
      `}</style>
    </div>
  );
}
