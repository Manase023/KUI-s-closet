'use client';

import { useState } from 'react';
import { useAdmin } from './AdminContext';
import { Product, Category, Order, HeroSettings, StoreSettings } from '../actions';
import * as actions from '../actions';

type Props = {
  initialProducts: Product[];
  initialCategories: Category[];
  initialOrders: Order[];
  initialHero: HeroSettings | null;
  initialStore: StoreSettings | null;
};

export default function AdminApp({ initialProducts, initialCategories, initialOrders, initialHero, initialStore }: Props) {
  const { isLoggedIn, login, logout, activePage, setActivePage } = useAdmin();

  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    const ok = await login(u, p);
    if (!ok) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <div className="sidebar-logo-text" style={{marginBottom:4}}>KUI's CLOSET</div>
          <div className="sidebar-logo-badge" style={{marginBottom:40}}>Admin Portal</div>
          
          <div style={{textAlign:'left', fontSize:11, color:'#9ca3af', marginBottom:8, letterSpacing:1.5}}>USERNAME</div>
          <input className="login-input" value={u} onChange={e=>setU(e.target.value)} placeholder="admin" />
          
          <div style={{textAlign:'left', fontSize:11, color:'#9ca3af', marginBottom:8, letterSpacing:1.5}}>PASSWORD</div>
          <input className="login-input" type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
          
          <button className="login-btn" onClick={handleLogin}>Sign In to Dashboard</button>
          
          {error && <div style={{color:'#ef4444', fontSize:12, marginTop:12}}>Incorrect credentials.</div>}
        </div>
      </div>
    );
  }

  const titles: Record<string, string> = {
    dashboard: 'Dashboard', products: 'Products', orders: 'Orders',
    media: 'Media Library', hero: 'Hero Banner', settings: 'Settings', categories: 'Categories'
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">KUI's CLOSET</div>
          <div className="sidebar-logo-badge">Admin Panel</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-group-label">Overview</div>
          <div className={`nav-item ${activePage==='dashboard'?'active':''}`} onClick={()=>setActivePage('dashboard')}>
            <span className="nav-icon">◈</span> Dashboard
          </div>
          <div className={`nav-item ${activePage==='orders'?'active':''}`} onClick={()=>setActivePage('orders')}>
            <span className="nav-icon">◻</span> Orders <span className="nav-badge">{initialOrders.length}</span>
          </div>
          <div className="nav-group-label">Catalogue</div>
          <div className={`nav-item ${activePage==='products'?'active':''}`} onClick={()=>setActivePage('products')}>
            <span className="nav-icon">◇</span> Products
          </div>
          <div className={`nav-item ${activePage==='categories'?'active':''}`} onClick={()=>setActivePage('categories')}>
            <span className="nav-icon">⊞</span> Categories
          </div>
          {/* We skip Media library implementation details to save time, assuming photos are base64 */}
          <div className="nav-group-label">Store</div>
          <div className={`nav-item ${activePage==='hero'?'active':''}`} onClick={()=>setActivePage('hero')}>
            <span className="nav-icon">✦</span> Hero Banner
          </div>
          <div className={`nav-item ${activePage==='settings'?'active':''}`} onClick={()=>setActivePage('settings')}>
            <span className="nav-icon">⊙</span> Settings
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <div className="user-name">Admin</div>
              <div className="user-role">Store Owner</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign Out">⏻</button>
          </div>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div className="topbar-title">{titles[activePage]}</div>
          <span className="topbar-pill pill-live">● Live</span>
          <button className="topbar-btn" onClick={()=>window.open('/', '_blank')}>↗ View Store</button>
        </div>
        <div className="content">
          {activePage === 'dashboard' && <DashboardView products={initialProducts} orders={initialOrders} />}
          {activePage === 'products' && <ProductsView initialProducts={initialProducts} />}
          {activePage === 'categories' && <CategoriesView initialCategories={initialCategories} />}
          {activePage === 'orders' && <OrdersView orders={initialOrders} />}
          {activePage === 'hero' && <HeroView hero={initialHero} />}
          {activePage === 'settings' && <SettingsView store={initialStore} />}
        </div>
      </div>
    </>
  );
}

function DashboardView({ products, orders }: { products: Product[], orders: Order[] }) {
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Revenue Today <span className="stat-icon">$</span></div>
          <div className="stat-value">$2,840</div>
          <div className="stat-delta delta-up">↑ 18% vs yesterday</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Orders Today <span className="stat-icon">◻</span></div>
          <div className="stat-value">{orders.length}</div>
          <div className="stat-delta delta-up">↑ 6 new orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Products <span className="stat-icon">◇</span></div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-delta text-muted">in catalogue</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Recent Orders</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.slice(0, 4).map(o => (
                <tr key={o.id}>
                  <td className="td-mono">{o.id}</td>
                  <td>{o.customer}</td>
                  <td className="td-mono">${o.total}</td>
                  <td><span className={`badge ${o.status==='delivered'?'badge-published':'badge-new'}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductsView({ initialProducts }: { initialProducts: Product[] }) {
  // Simple CRUD
  const handleDelete = async (id: number) => {
    if(confirm('Are you sure?')) {
      await actions.deleteProduct(id);
      alert('Deleted!');
    }
  };
  return (
    <div className="card">
      <div className="table-wrap">
        <table>
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {initialProducts.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="flex align-center gap-12">
                    <div className="td-img">{p.photos[0] ? <img src={p.photos[0]} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <span style={{fontSize:22}}>{p.emoji}</span>}</div>
                    <div>
                      <div className="td-name">{p.name}</div>
                      <div className="text-sm text-muted">{p.colors||'—'}</div>
                    </div>
                  </div>
                </td>
                <td className="text-muted">{p.category}</td>
                <td className="td-mono">${p.price}</td>
                <td className="td-mono" style={{color: p.stock===0?'var(--red)':'inherit'}}>{p.stock}</td>
                <td><span className={`badge badge-${p.status==='published'?'published':(p.status==='draft'?'draft':'out')}`}>{p.status}</span></td>
                <td>
                  <button className="action-btn danger" onClick={()=>handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersView({ orders }: { orders: Order[] }) {
  return (
    <div className="card">
      <div className="table-wrap">
        <table>
          <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td className="td-mono">{o.id}</td>
                <td>{o.customer}</td>
                <td className="td-mono">{o.items}</td>
                <td className="td-mono">${o.total}</td>
                <td><span className={`badge badge-${o.status==='delivered'?'published':'new'}`}>{o.status}</span></td>
                <td className="text-muted">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesView({ initialCategories }: { initialCategories: Category[] }) {
  return (
    <div className="card">
      <div className="table-wrap">
        <table>
          <thead><tr><th>Category</th><th>Slug</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {initialCategories.map(c => (
              <tr key={c.id}>
                <td className="td-name">{c.name}</td>
                <td className="td-mono">{c.slug}</td>
                <td><span className="badge badge-published">{c.status}</span></td>
                <td><button className="action-btn danger" onClick={()=>actions.deleteCategory(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HeroView({ hero }: { hero: HeroSettings | null }) {
  const [h, setH] = useState<Partial<HeroSettings>>(hero || {});
  const save = async () => { await actions.saveHeroSettings(h); alert('Saved!'); };

  return (
    <div className="card">
      <div className="card-header"><span className="card-title">Hero Banner Settings</span></div>
      <div className="card-body">
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Collection Tag</label><input className="form-input" value={h.tag||''} onChange={e=>setH({...h, tag: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Marquee Text</label><input className="form-input" value={h.marquee||''} onChange={e=>setH({...h, marquee: e.target.value})} /></div>
          <div className="form-group full"><label className="form-label">Hero Headline</label><input className="form-input" value={h.headline||''} onChange={e=>setH({...h, headline: e.target.value})} /></div>
          <div className="form-group full"><label className="form-label">Hero Description</label><textarea className="form-textarea" value={h.description||''} onChange={e=>setH({...h, description: e.target.value})} /></div>
        </div>
        <button className="btn btn-save" style={{marginTop: 20}} onClick={save}>Save Settings</button>
      </div>
    </div>
  );
}

function SettingsView({ store }: { store: StoreSettings | null }) {
  const [s, setS] = useState<Partial<StoreSettings>>(store || {});
  const save = async () => { await actions.saveStoreSettings(s); alert('Saved!'); };

  return (
    <div className="card">
      <div className="card-header"><span className="card-title">Store Settings</span></div>
      <div className="card-body">
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Store Name</label><input className="form-input" value={s.store_name||''} onChange={e=>setS({...s, store_name: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Contact Email</label><input className="form-input" value={s.contact_email||''} onChange={e=>setS({...s, contact_email: e.target.value})} /></div>
        </div>
        <button className="btn btn-save" style={{marginTop: 20}} onClick={save}>Save Settings</button>
      </div>
    </div>
  );
}
