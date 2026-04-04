export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { getProducts, getCategories, getHeroSettings, getStoreSettings } from './actions';
import ClientWrapper from './components/ClientWrapper';
import AddToCartButton from './components/AddToCartButton';

export default async function Storefront() {
  const [products, categories, hero, store] = await Promise.all([
    getProducts(),
    getCategories(),
    getHeroSettings(),
    getStoreSettings()
  ]);

  const activeProducts = products.filter(p => p.status !== 'draft');
  const storeName = store?.store_name || "KUI'S CLOSET";

  return (
    <ClientWrapper storeName={storeName}>
      {/* HERO */}
      <section className="hero" id="hero" style={{ padding: 0 }}>
        <div className="hero-left">
          <div className="hero-tag">{hero?.tag || 'Spring / Summer 2025 Collection'}</div>
          <h1 className="hero-title">{hero?.headline || 'Wear Your Story'}</h1>
          <p className="hero-desc">{hero?.description}</p>
          <div className="hero-cta">
            <a href="#collection" className="btn-primary">{hero?.cta || 'Shop Collection'}</a>
            <a href="#editorial" className="btn-ghost">View Lookbook</a>
          </div>
          <div className="hero-scroll">
            <span>Scroll to explore</span>
            <div className="scroll-line"></div>
          </div>
        </div>
        <div className="hero-right">
          <img src={hero?.bg_image || '/images/hero.png'} alt="" className="hero-img" />
          <div className="hero-stat">
            <div className="hero-stat-number">{hero?.counter || '240+'}</div>
            <div className="hero-stat-label">Exclusive Pieces</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee">
          {Array(8).fill(hero?.marquee || 'New Season Arrivals · Free Returns · Sustainable Materials').map((m, i) => (
            <span key={i} className="marquee-item">{m} <span className="marquee-dot">·</span></span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="categories" id="new">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">The Curated</div>
            <h2 className="section-title">Shop by <em>Category</em></h2>
          </div>
        </div>
        <div className="cat-grid">
          {categories.filter(c => c.status !== 'hidden').map((c, i) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="cat-card">
              <div className={`cat-bg cat-bg-${(i % 5) + 1}`}></div>
              <div className="cat-overlay"></div>
              <div className="cat-art">{'✧✦✺⎈☼'[i % 5]}</div>
              <div className="cat-info">
                <div className="cat-label">Explore</div>
                <div className="cat-name">{c.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products" id="collection">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Latest Drops</div>
            <h2 className="section-title">New <em>Arrivals</em></h2>
          </div>
          <a href="#" className="section-link">View Everything</a>
        </div>
        <div className="product-grid">
          {activeProducts.map((p, i) => (
            <div key={p.id} className="product-card">
              <Link href={`/product/${p.id}`} className="product-img-wrap" style={{display: 'block'}}>
                {p.photos && p.photos[0] ? (
                  <img src={p.photos[0]} alt={p.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                ) : (
                  <div className={`product-img-placeholder p${(i % 4) + 1}`}>{p.emoji}</div>
                )}
                {p.status === 'out' && <div className="product-badge badge-sale">Out of Stock</div>}
                {(store?.show_sale_badge === 1 && p.salePrice) && <div className="product-badge badge-sale">Sale</div>}
              </Link>
                
              <div className="product-actions" style={{position:'relative', transform:'none', marginTop:8, marginBottom:16}}>
                <AddToCartButton product={p} />
                {store?.wishlist_feature === 1 && <button className="btn-wish">♡</button>}
              </div>

              <Link href={`/product/${p.id}`} style={{textDecoration:'none'}}>
                <h3 className="product-name">{p.name}</h3>
              </Link>
              <div className="product-meta">
                <div className="product-price">
                  {p.salePrice ? (
                    <>
                      <strong>${Math.floor(p.salePrice)}</strong> <del>${Math.floor(p.price)}</del>
                    </>
                  ) : (
                    <strong>${Math.floor(p.price)}</strong>
                  )}
                </div>
                <div className="product-rating">★★★★★</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="editorial" id="editorial">
        <div className="editorial-img">✺</div>
        <div className="editorial-content">
          <div className="editorial-quote">Material Matters</div>
          <h2 className="editorial-heading">The <em>Art</em> of Craft</h2>
          <p className="editorial-text">
            We believe that true luxury lies in intention. From ethically sourced fibers to meticulous construction, each garment is designed not just to be worn, but to be lived in. Discover the process behind our silhouettes.
          </p>
          <a href="#" className="btn-ghost" style={{width:'fit-content'}}>Read the Journal</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-brand-logo">{storeName}</div>
            <p className="footer-brand-desc">{store?.contact_email ? `Contact us: ${store.contact_email}` : 'Modern fashion for the conscious wardrobe. Crafted with intention, worn with confidence.'}</p>
            <div className="footer-socials">
              <a href="#" className="social-link">Ig</a>
              <a href="#" className="social-link">Tw</a>
              <a href="#" className="social-link">Pt</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Shop</div>
            <ul className="footer-links">
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#">Women's Wear</a></li>
              <li><a href="#">Men's Wear</a></li>
              <li><a href="#">Accessories</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">About</div>
            <ul className="footer-links">
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Journal</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Support</div>
            <ul className="footer-links">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Size Guide</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} {storeName}. All rights reserved.</div>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </ClientWrapper>
  );
}
