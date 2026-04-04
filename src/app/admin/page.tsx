export const dynamic = 'force-dynamic';
import { getProducts, getCategories, getOrders, getHeroSettings, getStoreSettings } from '../actions';
import AdminApp from './AdminApp';

export default async function AdminPage() {
  const [products, categories, orders, hero, store] = await Promise.all([
    getProducts(),
    getCategories(),
    getOrders(),
    getHeroSettings(),
    getStoreSettings()
  ]);

  return (
    <div className="admin-app">
      <AdminApp
        initialProducts={products}
        initialCategories={categories}
        initialOrders={orders}
        initialHero={hero}
        initialStore={store}
      />
    </div>
  );
}
