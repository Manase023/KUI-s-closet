'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// ── TYPES ──────────────────────────────────────────────────────────────
export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  salePrice: number | null;
  stock: number;
  sizes: string;
  colors: string;
  description: string;
  photos: string[];
  emoji: string;
  status: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  status: string;
};

export type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: string;
  date: string;
};

export type HeroSettings = {
  id: number;
  tag: string;
  headline: string;
  description: string;
  cta: string;
  counter: string;
  marquee: string;
  bg_image: string | null;
};

export type StoreSettings = {
  id: number;
  store_name: string;
  currency: string;
  contact_email: string;
  free_shipping_threshold: number;
  show_sale_badge: number;
  wishlist_feature: number;
  newsletter_popup: number;
  maintenance_mode: number;
  whatsapp_number: string | null;
};

export type DashboardStats = {
  revenueToday: number;
  ordersToday: number;
  totalProducts: number;
  visitorsToday: number;
};

export type AnalyticsReport = {
  dailyRevenue: { date: string, val: number }[];
  dailyVisitors: { date: string, val: number }[];
  monthlyRevenue: number;
  monthlyOrders: number;
  topProducts: { name: string, count: number }[];
};

// ── AUTH ───────────────────────────────────────────────────────────────
export async function adminLogin(username: string, password: string): Promise<boolean> {
  const db = await getDb();
  const user = await db.get('SELECT id FROM users WHERE username = ? AND password = ?', [username, password]);
  return !!user;
}

export async function changeAdminCredentials(username: string, password: string): Promise<void> {
  const db = await getDb();
  await db.run('UPDATE users SET username = ?, password = ? WHERE id = 1', [username, password]);
}

// ── PRODUCTS ───────────────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const db = await getDb();
  const rows = await db.all('SELECT * FROM products ORDER BY id DESC');
  return rows.map((r) => ({ ...r, photos: JSON.parse(r.photos || '[]') }));
}

export async function getProductById(id: number): Promise<Product | null> {
  const db = await getDb();
  const row = await db.get('SELECT * FROM products WHERE id = ?', [id]);
  if (!row) return null;
  return { ...row, photos: JSON.parse(row.photos || '[]') };
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<void> {
  const db = await getDb();
  await db.run(
    'INSERT INTO products (name, category, price, salePrice, stock, sizes, colors, description, photos, emoji, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [data.name, data.category, data.price, data.salePrice, data.stock, data.sizes, data.colors, data.description, JSON.stringify(data.photos), data.emoji, data.status]
  );
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<void> {
  const db = await getDb();
  const p = await db.get('SELECT * FROM products WHERE id = ?', [id]);
  if (!p) return;
  const merged = { ...p, ...data, photos: JSON.stringify(data.photos ?? JSON.parse(p.photos || '[]')) };
  await db.run(
    'UPDATE products SET name=?, category=?, price=?, salePrice=?, stock=?, sizes=?, colors=?, description=?, photos=?, emoji=?, status=? WHERE id=?',
    [merged.name, merged.category, merged.price, merged.salePrice, merged.stock, merged.sizes, merged.colors, merged.description, merged.photos, merged.emoji, merged.status, id]
  );
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await getDb();
  await db.run('DELETE FROM products WHERE id = ?', [id]);
  revalidatePath('/');
  revalidatePath('/admin');
}

// ── CATEGORIES ─────────────────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  return db.all('SELECT * FROM categories ORDER BY id ASC');
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = await getDb();
  const row = await db.get('SELECT * FROM categories WHERE slug = ?', [slug]);
  return row ?? null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const db = await getDb();
  const cat = await db.get('SELECT name FROM categories WHERE slug = ?', [slug]);
  if (!cat) return [];
  const rows = await db.all('SELECT * FROM products WHERE category = ? ORDER BY id DESC', [cat.name]);
  return rows.map((r) => ({ ...r, photos: JSON.parse(r.photos || '[]') }));
}

export async function createCategory(name: string, slug: string, status: string): Promise<void> {
  const db = await getDb();
  await db.run('INSERT INTO categories (name, slug, status) VALUES (?,?,?)', [name, slug, status]);
  revalidatePath('/admin');
}

export async function deleteCategory(id: number): Promise<void> {
  const db = await getDb();
  await db.run('DELETE FROM categories WHERE id = ?', [id]);
  revalidatePath('/admin');
}

// ── ORDERS ─────────────────────────────────────────────────────────────
export async function getOrders(): Promise<Order[]> {
  const db = await getDb();
  return db.all('SELECT * FROM orders ORDER BY rowid DESC');
}

// ── HERO SETTINGS ──────────────────────────────────────────────────────
export async function getHeroSettings(): Promise<HeroSettings | null> {
  const db = await getDb();
  const result = await db.get<HeroSettings>('SELECT * FROM hero_settings WHERE id = 1');
  return result ?? null;
}

export async function saveHeroSettings(data: Partial<HeroSettings>): Promise<void> {
  const db = await getDb();
  await db.run(
    'UPDATE hero_settings SET tag=?, headline=?, description=?, cta=?, counter=?, marquee=?, bg_image=? WHERE id=1',
    [data.tag, data.headline, data.description, data.cta, data.counter, data.marquee, data.bg_image ?? null]
  );
  revalidatePath('/');
}

// ── STORE SETTINGS ─────────────────────────────────────────────────────
export async function getStoreSettings(): Promise<StoreSettings | null> {
  const db = await getDb();
  const result = await db.get<StoreSettings>('SELECT * FROM store_settings WHERE id = 1');
  return result ?? null;
}

export async function saveStoreSettings(data: Partial<StoreSettings>): Promise<void> {
  const db = await getDb();
  await db.run(
    'UPDATE store_settings SET store_name=?, currency=?, contact_email=?, free_shipping_threshold=?, show_sale_badge=?, wishlist_feature=?, newsletter_popup=?, maintenance_mode=?, whatsapp_number=? WHERE id=1',
    [data.store_name, data.currency, data.contact_email, data.free_shipping_threshold, data.show_sale_badge ? 1 : 0, data.wishlist_feature ? 1 : 0, data.newsletter_popup ? 1 : 0, data.maintenance_mode ? 1 : 0, data.whatsapp_number ?? null]
  );
  revalidatePath('/');
}

// ── DASHBOARD & TRACKING ──────────────────────────────────────────────
export async function trackVisit(path: string, ip?: string, userAgent?: string): Promise<void> {
  const db = await getDb();
  await db.run(
    'INSERT INTO visits (path, ip, user_agent) VALUES (?, ?, ?)',
    [path, ip || 'unknown', userAgent || 'unknown']
  );
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getDb();
  
  const today = new Date().toISOString().split('T')[0];
  
  const revenue = await db.get('SELECT SUM(total) as val FROM orders WHERE date LIKE ?', [`%${today}%`]);
  const ordersCount = await db.get('SELECT COUNT(*) as val FROM orders WHERE date LIKE ?', [`%${today}%`]);
  const productsCount = await db.get('SELECT COUNT(*) as val FROM products');
  const visitorsCount = await db.get('SELECT COUNT(DISTINCT ip) as val FROM visits WHERE timestamp >= date("now")');

  return {
    revenueToday: revenue?.val || 0,
    ordersToday: ordersCount?.val || 0,
    totalProducts: productsCount?.val || 0,
    visitorsToday: visitorsCount?.val || 0,
  };
}

export async function getAnalyticsReport(): Promise<AnalyticsReport> {
  const db = await getDb();
  
  // Last 30 days daily revenue
  const dailyRev = await db.all(`
    SELECT date(date) as d, SUM(total) as v 
    FROM orders 
    WHERE date >= date('now', '-30 days')
    GROUP BY d
    ORDER BY d ASC
  `);

  // Last 30 days daily visitors
  const dailyVis = await db.all(`
    SELECT date(timestamp) as d, COUNT(DISTINCT ip) as v 
    FROM visits 
    WHERE timestamp >= date('now', '-30 days')
    GROUP BY d
    ORDER BY d ASC
  `);

  // Monthly stats
  const monthStart = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monRev = await db.get('SELECT SUM(total) as val FROM orders WHERE date LIKE ?', [`%${monthStart}%`]);
  const monOrd = await db.get('SELECT COUNT(*) as val FROM orders WHERE date LIKE ?', [`%${monthStart}%`]);

  // Top Products (simulated since we don't have order_items yet)
  const topProd: { name: string, count: number }[] = [];

  return {
    dailyRevenue: dailyRev.map(r => ({ date: r.d, val: r.v })),
    dailyVisitors: dailyVis.map(v => ({ date: v.d, val: v.v })),
    monthlyRevenue: monRev?.val || 0,
    monthlyOrders: monOrd?.val || 0,
    topProducts: topProd
  };
}
