'use client';

import { useState } from 'react';
import { useAdmin } from './AdminContext';
import { 
  type Product, type Category, type Order, type HeroSettings, type StoreSettings, 
  type DashboardStats, type AnalyticsReport,
  deleteProduct, deleteCategory, saveHeroSettings, saveStoreSettings, updateOrderStatus
} from '../actions';
import ProductModal from './ProductModal';
import CategoryModal from './CategoryModal';

type Props = {
  initialProducts: Product[];
  initialCategories: Category[];
  initialOrders: Order[];
  initialHero: HeroSettings | null;
  initialStore: StoreSettings | null;
  initialStats: DashboardStats;
  initialAnalytics: AnalyticsReport;
};

export default function AdminApp({ initialProducts, initialCategories, initialOrders, initialHero, initialStore, initialStats, initialAnalytics }: Props) {
  const { isLoggedIn, login, logout, activePage, setActivePage } = useAdmin();

  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [error, setError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Product Editor State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Category Editor State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleLogin = async () => {
    const ok = await login(u, p);
    if (!ok) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-app">
        <div className="admin-login">
          <div className="login-card">
            <div className="sidebar-logo-text" style={{marginBottom:4, letterSpacing: '8px'}}>KUI WOMEN</div>
            <div className="sidebar-logo-badge" style={{marginBottom:40}}>Admin Portal</div>
            
            <div style={{textAlign:'left', fontSize:11, color:'#9ca3af', marginBottom:8, letterSpacing:1.5}}>USERNAME</div>
            <input className="login-input" value={u} onChange={e=>setU(e.target.value)} placeholder="admin" />
            
            <div style={{textAlign:'left', fontSize:11, color:'#9ca3af', marginBottom:8, letterSpacing:1.5}}>PASSWORD</div>
            <input className="login-input" type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
            
            <button className="login-btn" onClick={handleLogin}>Sign In to Dashboard</button>
            
            <a href="/" className="login-back" style={{ display: 'block', marginTop: 24, fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#9ca3af', textDecoration: 'none' }}>
              ← Back to Storefront
            </a>

            {error && <div style={{color:'#ef4444', fontSize:12, marginTop:12}}>Incorrect credentials.</div>}
          </div>
        </div>
      </div>
    );
  }

  const titles: Record<string, string> = {
    dashboard: 'Dashboard', products: 'Products', orders: 'Orders',
    media: 'Media Library', hero: 'Hero Banner', settings: 'Settings', categories: 'Categories',
    analytics: 'Analytics & Reports'
  };

  return (
    <div className={`admin-app ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-close-mobile" onClick={() => setIsSidebarOpen(false)}>×</div>
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">KUI WOMEN</div>
          <div className="sidebar-logo-badge">Admin Panel</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-group-label">Overview</div>
          <div className={`nav-item ${activePage==='dashboard'?'active':''}`} onClick={()=>{setActivePage('dashboard'); setIsSidebarOpen(false);}}>
            <span className="nav-icon">◈</span> Dashboard
          </div>
          <div className={`nav-item ${activePage==='orders'?'active':''}`} onClick={()=>{setActivePage('orders'); setIsSidebarOpen(false);}}>
            <span className="nav-icon">◻</span> Orders <span className="nav-badge">{initialOrders.length}</span>
          </div>
          <div className={`nav-item ${activePage==='analytics'?'active':''}`} onClick={()=>{setActivePage('analytics'); setIsSidebarOpen(false);}}>
            <span className="nav-icon">📊</span> Analytics
          </div>
          <div className="nav-group-label">Catalogue</div>
          <div className={`nav-item ${activePage==='products'?'active':''}`} onClick={()=>{setActivePage('products'); setIsSidebarOpen(false);}}>
            <span className="nav-icon">◇</span> Products
          </div>
          <div className={`nav-item ${activePage==='categories'?'active':''}`} onClick={()=>{setActivePage('categories'); setIsSidebarOpen(false);}}>
            <span className="nav-icon">⊞</span> Categories
          </div>
          <div className="nav-group-label">Store</div>
          <div className={`nav-item ${activePage==='hero'?'active':''}`} onClick={()=>{setActivePage('hero'); setIsSidebarOpen(false);}}>
            <span className="nav-icon">✦</span> Hero Banner
          </div>
          <div className={`nav-item ${activePage==='settings'?'active':''}`} onClick={()=>{setActivePage('settings'); setIsSidebarOpen(false);}}>
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
          <button className="burger-menu" onClick={() => setIsSidebarOpen(true)}>☰</button>
          <div className="topbar-title">{titles[activePage]}</div>
          <span className="topbar-pill pill-live">● Live</span>
          <button className="topbar-btn" onClick={()=>window.open('/', '_blank')}>↗ View Store</button>
        </div>
        <div className="content">
          {activePage === 'dashboard' && <DashboardView products={initialProducts} orders={initialOrders} stats={initialStats} />}
          {activePage === 'products' && (
            <ProductsView 
              initialProducts={initialProducts} 
              onEdit={openEditModal} 
              onAdd={openAddModal} 
            />
          )}
          {activePage === 'categories' && (
            <CategoriesView 
              initialCategories={initialCategories} 
              onEdit={openEditCategoryModal} 
              onAdd={openAddCategoryModal} 
            />
          )}
          {activePage === 'orders' && <OrdersView orders={initialOrders} />}
          {activePage === 'hero' && <HeroView hero={initialHero} />}
          {activePage === 'settings' && <SettingsView store={initialStore} />}
          {activePage === 'analytics' && <AnalyticsView report={initialAnalytics} orders={initialOrders} />}
        </div>
      </div>

      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        product={editingProduct}
        categories={initialCategories}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={editingCategory}
      />
    </div>
  );
}

function DashboardView({ products, orders, stats }: { products: Product[], orders: Order[], stats: DashboardStats }) {
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Revenue Today <span className="stat-icon">$</span></div>
          <div className="stat-value">${stats.revenueToday.toLocaleString()}</div>
          <div className="stat-delta delta-up">↑ live from orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Orders Today <span className="stat-icon">◻</span></div>
          <div className="stat-value">{stats.ordersToday}</div>
          <div className="stat-delta delta-up">↑ {stats.ordersToday} new orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Visitors Today <span className="stat-icon">👁</span></div>
          <div className="stat-value">{stats.visitorsToday}</div>
          <div className="stat-delta text-muted">active users</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Products <span className="stat-icon">◇</span></div>
          <div className="stat-value">{stats.totalProducts}</div>
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

function ProductsView({ initialProducts, onEdit, onAdd }: { initialProducts: Product[], onEdit: (p: Product) => void, onAdd: () => void }) {
  const handleDelete = async (id: number) => {
    if(confirm('Are you sure?')) {
      await deleteProduct(id);
      alert('Deleted!');
    }
  };
  return (
    <div className="card">
      <div className="card-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span className="card-title">Product Catalogue</span>
        <button className="btn btn-save" onClick={onAdd}>+ Add Product</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {initialProducts.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="flex align-center gap-12">
                    <div className="td-img">{p.photos[0] ? <img src={p.photos[0]} /> : <span style={{fontSize:22}}>{p.emoji}</span>}</div>
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
                  <div className="flex gap-8">
                    <button className="action-btn" onClick={() => onEdit(p)}>Edit</button>
                    <button className="action-btn danger" onClick={()=>handleDelete(p.id)}>Delete</button>
                  </div>
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
  const handleMarkDelivered = async (id: string) => {
    if (confirm('Mark this order as delivered?')) {
      await updateOrderStatus(id, 'delivered');
      alert('Order updated!');
    }
  };

  return (
    <div className="card">
      <div className="table-wrap">
        <table>
          <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td className="td-mono">{o.id}</td>
                <td>{o.customer}</td>
                <td className="td-mono">{o.items}</td>
                <td className="td-mono">${o.total}</td>
                <td><span className={`badge badge-${o.status==='delivered'?'published':'new'}`}>{o.status}</span></td>
                <td className="text-muted">{o.date}</td>
                <td>
                  {o.status !== 'delivered' && (
                    <button className="action-btn" onClick={() => handleMarkDelivered(o.id)}>Mark Delivered</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesView({ initialCategories, onEdit, onAdd }: { initialCategories: Category[], onEdit: (c: Category) => void, onAdd: () => void }) {
  const handleDelete = async (id: number) => {
    if(confirm('Are you sure you want to delete this category? This might affect products using it.')) {
      await deleteCategory(id);
      alert('Deleted!');
    }
  };

  return (
    <div className="card">
      <div className="card-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span className="card-title">Manage Categories</span>
        <button className="btn btn-save" onClick={onAdd}>+ Add Category</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Category</th><th>Slug</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {initialCategories.map(c => (
              <tr key={c.id}>
                <td className="td-name">{c.name}</td>
                <td className="td-mono">{c.slug}</td>
                <td><span className={`badge badge-${c.status === 'published' ? 'published' : (c.status === 'draft' ? 'draft' : 'out')}`}>{c.status}</span></td>
                <td>
                  <div className="flex gap-8">
                    <button className="action-btn" onClick={() => onEdit(c)}>Edit</button>
                    <button className="action-btn danger" onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                </td>
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
  const save = async () => { await saveHeroSettings(h); alert('Saved!'); };

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
  const save = async () => { await saveStoreSettings(s); alert('Saved!'); };

  return (
    <div className="card">
      <div className="card-header"><span className="card-title">Store Settings</span></div>
      <div className="card-body">
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Store Name</label><input className="form-input" value={s.store_name||''} onChange={e=>setS({...s, store_name: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Contact Email</label><input className="form-input" value={s.contact_email||''} onChange={e=>setS({...s, contact_email: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">WhatsApp Number</label><input className="form-input" value={s.whatsapp_number||''} onChange={e=>setS({...s, whatsapp_number: e.target.value})} placeholder="+1234567890" /></div>
        </div>
        <button className="btn btn-save" style={{marginTop: 20}} onClick={save}>Save Settings</button>
      </div>
    </div>
  );
}

function AnalyticsView({ report, orders }: { report: AnalyticsReport, orders: Order[] }) {
  return (
    <div className="analytics-view">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Monthly Revenue <span className="stat-icon">$</span></div>
          <div className="stat-value">${report.monthlyRevenue.toLocaleString()}</div>
          <div className="stat-delta delta-up">Total for {new Date().toLocaleString('default', { month: 'long' })}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Monthly Orders <span className="stat-icon">📦</span></div>
          <div className="stat-value">{report.monthlyOrders}</div>
          <div className="stat-delta text-muted">{report.monthlyOrders > 0 ? 'Consistent traffic' : 'Awaiting first drop'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AOV (Avg. Order Value) <span className="stat-icon">📈</span></div>
          <div className="stat-value">${report.monthlyOrders > 0 ? Math.floor(report.monthlyRevenue / report.monthlyOrders) : 0}</div>
          <div className="stat-delta text-muted">per transaction</div>
        </div>
      </div>

      <div className="form-grid">
        <div className="card form-group full">
          <div className="card-header"><span className="card-title">Daily Revenue (Last 30 Days)</span></div>
          <div className="card-body">
            <div className="chart-placeholder">
              {report.dailyRevenue.length === 0 ? (
                <div style={{color:'#999', textAlign:'center', padding: '40px 0'}}>Not enough data points yet. Start selling to see your growth.</div>
              ) : (
                <div style={{display:'flex', alignItems:'flex-end', height: 200, gap: 4}}>
                   {report.dailyRevenue.map((d: { date: string, val: number }, i: number) => (
                    <div key={i} style={{flex:1, background:'var(--gold)', height: `${Math.min(100, (d.val / report.monthlyRevenue) * 500)}%`, minWidth: 4, borderRadius: '2px 2px 0 0'}} title={`${d.date}: $${d.val}`}></div>
                  ))}
                </div>
              )}
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:10, fontSize:10, color:'#999'}}>
              <span>30 Days Ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        <div className="card form-group full">
          <div className="card-header"><span className="card-title">Daily Visitors (Last 30 Days)</span></div>
          <div className="card-body">
            <div className="chart-placeholder">
              {report.dailyVisitors.length === 0 ? (
                <div style={{color:'#999', textAlign:'center', padding: '40px 0'}}>Tracking traffic...</div>
              ) : (
                <div style={{display:'flex', alignItems:'flex-end', height: 150, gap: 4}}>
                   {report.dailyVisitors.map((v: { date: string, val: number }, i: number) => (
                    <div key={i} style={{flex:1, background:'var(--blue)', height: `${Math.min(100, (v.val / 100) * 100)}%`, minWidth: 4, borderRadius: '2px 2px 0 0'}} title={`${v.date}: ${v.val} visits`}></div>
                  ))}
                </div>
              )}
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:10, fontSize:10, color:'#999'}}>
              <span>30 Days Ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Full Transaction Report</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {orders.slice(0, 20).map(o => (
                <tr key={o.id}>
                  <td className="text-muted">{o.date}</td>
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
