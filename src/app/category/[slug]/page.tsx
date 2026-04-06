import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getProductsByCategory, getStoreSettings } from '@/app/actions';
import ClientWrapper from '@/app/components/ClientWrapper';
import AddToCartButton from '@/app/components/AddToCartButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.slug);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} — KUI'S CLOSET`,
    description: `Browse our ${category.name} collection at KUI'S CLOSET.`,
  };
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const store = await getStoreSettings();
  const category = await getCategoryBySlug(resolvedParams.slug);
  
  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(resolvedParams.slug);
  const storeName = store?.store_name || "KUI'S CLOSET";

  return (
    <ClientWrapper storeName={storeName} whatsappNumber={store?.whatsapp_number}>
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg)' }}>
        
        {/* CATEGORY HEADER */}
        <div style={{ padding: '60px 48px', textAlign: 'center', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', marginBottom: '48px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent)', marginBottom: '16px' }}>
            Collection
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '56px', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1 }}>
            {category.name}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '16px', fontWeight: 300 }}>
            {products.length} {products.length === 1 ? 'Item' : 'Items'}
          </p>
        </div>

        {/* PRODUCT GRID */}
        <div style={{ padding: '0 48px 100px' }}>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--muted)', fontWeight: 300 }}>
              No products found in this category yet.
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p, i) => (
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
                          <strong style={{color:'var(--cream)'}}>${Math.floor(p.salePrice)}</strong> 
                          <del style={{marginLeft:8}}>${Math.floor(p.price)}</del>
                        </>
                      ) : (
                        <strong style={{color:'var(--cream)'}}>${Math.floor(p.price)}</strong>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </ClientWrapper>
  );
}
