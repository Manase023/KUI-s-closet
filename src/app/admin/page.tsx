export const dynamic = 'force-dynamic';
import { getProducts, getCategories, getOrders, getHeroSettings, getStoreSettings, getDashboardStats, getAnalyticsReport } from '../actions';
import AdminApp from './AdminApp';

export default async function AdminPage() {
  const [products, categories, orders, hero, store, stats, analytics] = await Promise.all([
    getProducts(),
    getCategories(),
    getOrders(),
    getHeroSettings(),
    getStoreSettings(),
    getDashboardStats(),
    getAnalyticsReport()
  ]);

  return (
    <AdminApp
      initialProducts={products}
      initialCategories={categories}
      initialOrders={orders}
      initialHero={hero}
      initialStore={store}
      initialStats={stats}
      initialAnalytics={analytics}
    />
  );
}
