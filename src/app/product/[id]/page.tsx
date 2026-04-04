import { notFound } from 'next/navigation';
import { getProductById, getStoreSettings } from '@/app/actions';
import ClientWrapper from '@/app/components/ClientWrapper';
import ProductOptions from '@/app/components/ProductOptions';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const store = await getStoreSettings();
  const product = await getProductById(parseInt(resolvedParams.id, 10));

  if (!product) {
    notFound();
  }

  const storeName = store?.store_name || "KUI'S CLOSET";
  const hasPhotos = product.photos && product.photos.length > 0;

  return (
    <ClientWrapper storeName={storeName}>
      <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', background: 'var(--bg2)' }}>
        
        {/* Left Side: Photo Viewer */}
        <div style={{ flex: 1, padding: '48px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg)', aspectRatio: '3/4', position: 'relative' }}>
            {hasPhotos ? (
              <img src={product.photos[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '100px' }}>
                {product.emoji}
              </div>
            )}
            {(store?.show_sale_badge === 1 && product.salePrice) && (
              <div className="product-badge badge-sale" style={{ position: 'absolute', top: 20, left: 20 }}>Sale</div>
            )}
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div style={{ flex: 1, padding: '48px 48px 48px 0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ maxWidth: '440px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent)', marginBottom: '16px' }}>
              {product.category}
            </div>
            
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '42px', fontWeight: 300, color: 'var(--cream)', marginBottom: '16px', lineHeight: 1.1 }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div style={{ fontSize: '22px', color: 'var(--muted)', fontWeight: 300 }}>
                {product.salePrice ? (
                  <>
                    <strong style={{ color: 'var(--cream)', fontWeight: 400 }}>${Math.floor(product.salePrice)}</strong>
                    <span style={{ margin: '0 12px', fontSize: '18px', textDecoration: 'line-through' }}>${Math.floor(product.price)}</span>
                  </>
                ) : (
                  <strong style={{ color: 'var(--cream)', fontWeight: 400 }}>${Math.floor(product.price)}</strong>
                )}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '1px' }}>
                ★★★★★ (42)
              </div>
            </div>

            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--muted)', marginBottom: '32px', fontWeight: 300 }}>
              {product.description || 'This beautifully crafted piece brings an elegant, timeless quality to any wardrobe. Featuring luxurious materials and exquisite attention to detail.'}
            </p>

            <div style={{ height: '1px', background: 'var(--border)', margin: '32px 0' }}></div>

            <ProductOptions product={product} />
            
            {/* Additional editorial copy typical for fashion pdp */}
            <div style={{ marginTop: '48px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--cream)', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                Details & Care <span style={{float:'right'}}>+</span>
              </div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--cream)', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                Shipping & Returns <span style={{float:'right'}}>+</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </ClientWrapper>
  );
}
