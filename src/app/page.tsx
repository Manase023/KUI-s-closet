export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts, getCategories, getHeroSettings, getStoreSettings } from './actions';
import ClientWrapper from './components/ClientWrapper';
import AddToCartButton from './components/AddToCartButton';

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStoreSettings();
  const storeName = store?.store_name || "KUI WOMEN";
  
  return {
    title: `${storeName} — Modern Femininity`,
    description: 'Curated pieces for the modern woman — where trend-forward design meets enduring grace.',
  };
}

export default async function Storefront() {
  const [products, categories, hero, store] = await Promise.all([
    getProducts(),
    getCategories(),
    getHeroSettings(),
    getStoreSettings()
  ]);

  const activeProducts = products.filter(p => p.status !== 'draft');
  const storeName = store?.store_name || "KUI WOMEN";

  return (
    <ClientWrapper storeName={storeName} whatsappNumber={store?.whatsapp_number}>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">{hero?.tag || 'NEW SEASON DROP'}</div>
          <h1 
            className="hero-title"
            dangerouslySetInnerHTML={{ __html: hero?.headline || 'Unveiling the Future of <em>Femininity</em>' }}
          />
          <p className="hero-desc">{hero?.description}</p>
          <div className="hero-actions">
            <a href="#collection" className="btn-primary">{hero?.cta || 'Shop Collection'}</a>
          </div>
        </div>
        <div className="hero-visual">
          <img src="/images/hero.png" alt="Featured Collection" className="hero-img" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee">
          {Array(10).fill(hero?.marquee || 'Luxe Satin Drop · Global Shipping · New Season Arrivals · Eco-Conscious Fabrics').map((m, i) => (
            <span key={i} className="marquee-item">{m} <span className="marquee-dot">·</span></span>
          ))}
        </div>
      </div>

      {/* CATEGORY EXPLORER */}
      <div className="category-strip">
        <Link href="/category/all" className="cat-pill">All Collections</Link>
        {categories.filter(c => c.status !== 'hidden').map((c) => (
          <Link key={c.id} href={`/category/${c.slug}`} className="cat-pill">
            {c.name}
          </Link>
        ))}
      </div>

      {/* PRODUCTS */}
      <section className="products" id="collection">
        <div className="section-header">
          <div>
            <div className="eyebrow">Latest Drops</div>
            <h2 className="section-title">New <em>Arrivals</em></h2>
          </div>
          <Link href="/lookup" className="nav-icon-btn">Explore Everything</Link>
        </div>

        <div className="product-grid">
          {activeProducts.map((p, i) => (
            <div key={p.id} className="product-card">
              <div className="product-img-wrap">
                <Link href={`/product/${p.id}`}>
                  {p.photos && p.photos[0] ? (
                    <img src={p.photos[0]} alt={p.name} className="product-img" />
                  ) : (
                    <div className="product-emoji-placeholder">{p.emoji}</div>
                  )}
                </Link>
                
                {p.status === 'out' && <div className="product-badge">Sold Out</div>}
                {(store?.show_sale_badge === 1 && p.salePrice) && <div className="product-badge badge-sale">Limited Offer</div>}
                
                <div className="quick-add">
                   <AddToCartButton product={p} />
                </div>
              </div>
                
              <div className="product-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="product-category">{p.category}</div>
                    <Link href={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 className="product-name">{p.name}</h3>
                    </Link>
                  </div>
                  {store?.wishlist_feature === 1 && <button className="btn-wish">♡</button>}
                </div>
                
                <div className="product-price">
                  {p.salePrice ? (
                    <>
                      <span className="price-old">${Math.floor(p.price)}</span>
                      <span>${Math.floor(p.salePrice)}</span>
                    </>
                  ) : (
                    <span>${Math.floor(p.price)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="editorial" id="editorial">
        <img src="/images/editorial.png" alt="Editorial" className="editorial-img" />
        <div className="editorial-content">
          <div className="eyebrow" style={{ color: 'var(--accent)' }}>Material Matters</div>
          <h2 className="editorial-title" style={{ color: 'white' }}>The <em>Art</em> of Craft</h2>
          <p className="editorial-text">
            We believe that true luxury lies in intention. From ethically sourced fibers to meticulous construction, each garment is designed not just to be worn, but to be lived in. Discover the process behind our silhouettes.
          </p>
          <Link href="/lookbook" className="btn-primary" style={{ background: 'white', color: 'black', width: 'fit-content' }}>
            View Lookbook
          </Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter" style={{ padding: '120px 5vw', background: 'var(--bg2)', textAlign: 'center' }}>
        <div className="eyebrow">Join the Club</div>
        <h2 className="section-title">Newsletter <em>Signup</em></h2>
        <p className="hero-desc" style={{ margin: '2rem auto' }}>Unlock early access to new collections and exclusive editorial content.</p>
        <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', gap: '10px' }}>
          <input type="email" placeholder="email@example.com" className="form-input" style={{ flex: 1 }} />
          <button className="btn-primary">Join</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-col">
            <Link href="/" className="footer-logo">{storeName}</Link>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '2rem' }}>
              Modern fashion for the conscious wardrobe. Crafted with intention, worn with confidence.
            </p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul className="footer-links">
              <li><Link href="/category/all">Collections</Link></li>
              <li><Link href="/category/dresses">Dresses</Link></li>
              <li><Link href="/category/tops">New Drops</Link></li>
              <li><Link href="/category/outerwear">Outerwear</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link href="/story">Our Story</Link></li>
              <li><Link href="/sustainability">Sustainability</Link></li>
              <li><Link href="/journal">Journal</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/shipping">Shipping</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div style={{ paddingTop: '50px', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', color: '#444', fontSize: '12px' }}>
          <div>© {new Date().getFullYear()} {storeName}. All rights reserved. • <Link href="/admin" style={{ color: 'inherit' }}>Admin</Link></div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/privacy" style={{ color: 'inherit' }}>Privacy</Link>
            <Link href="/terms" style={{ color: 'inherit' }}>Terms</Link>
          </div>
        </div>
      </footer>
    </ClientWrapper>
  );
}
