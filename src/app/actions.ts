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
    'UPDATE store_settings SET store_name=?, currency=?, contact_email=?, free_shipping_threshold=?, show_sale_badge=?, wishlist_feature=?, newsletter_popup=?, maintenance_mode=? WHERE id=1',
    [data.store_name, data.currency, data.contact_email, data.free_shipping_threshold, data.show_sale_badge ? 1 : 0, data.wishlist_feature ? 1 : 0, data.newsletter_popup ? 1 : 0, data.maintenance_mode ? 1 : 0]
  );
}
