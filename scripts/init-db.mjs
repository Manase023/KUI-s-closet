import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const db = await open({
  filename: path.join(dataDir, 'kui.db'),
  driver: sqlite3.Database,
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published'
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    salePrice REAL,
    stock INTEGER DEFAULT 0,
    sizes TEXT,
    colors TEXT,
    description TEXT,
    photos TEXT DEFAULT '[]',
    emoji TEXT DEFAULT '👕',
    status TEXT NOT NULL DEFAULT 'published',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    items INTEGER DEFAULT 1,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing',
    date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS hero_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    tag TEXT,
    headline TEXT,
    description TEXT,
    cta TEXT,
    counter TEXT,
    marquee TEXT,
    bg_image TEXT
  );

  CREATE TABLE IF NOT EXISTS store_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    store_name TEXT DEFAULT 'KUI''s CLOSET',
    currency TEXT DEFAULT 'USD',
    contact_email TEXT,
    free_shipping_threshold REAL DEFAULT 150,
    show_sale_badge INTEGER DEFAULT 1,
    wishlist_feature INTEGER DEFAULT 1,
    newsletter_popup INTEGER DEFAULT 0,
    maintenance_mode INTEGER DEFAULT 0
  );
`);

// Seed admin user
const existing = await db.get("SELECT id FROM users WHERE username = 'admin'");
if (!existing) {
  await db.run("INSERT INTO users (username, password) VALUES ('admin', 'admin123')");
}

// Seed categories
const catCount = await db.get('SELECT COUNT(*) as c FROM categories');
if (catCount.c === 0) {
  const cats = [
    { name: "Women's Wear", slug: 'womens-wear', status: 'published' },
    { name: "Men's Wear",   slug: 'mens-wear',   status: 'published' },
    { name: 'Footwear',     slug: 'footwear',     status: 'published' },
    { name: 'Accessories',  slug: 'accessories',  status: 'published' },
  ];
  for (const c of cats) {
    await db.run('INSERT INTO categories (name, slug, status) VALUES (?, ?, ?)', [c.name, c.slug, c.status]);
  }
}

// Seed products
const prodCount = await db.get('SELECT COUNT(*) as c FROM products');
if (prodCount.c === 0) {
  const prods = [
    { name: 'Linen Oversized Blazer', category: "Women's Wear", price: 289, salePrice: null, stock: 14, sizes: 'XS,S,M,L', colors: 'Ivory,Sand', description: 'Relaxed linen blazer with dropped shoulders and double-breasted front.', photos: '[]', emoji: '🧥', status: 'published' },
    { name: 'Silk Midi Dress', category: "Women's Wear", price: 195, salePrice: 260, stock: 8, sizes: 'XS,S,M', colors: 'Sage,Black', description: 'Fluid silk dress with a delicate wrap silhouette.', photos: '[]', emoji: '👗', status: 'published' },
    { name: 'Cotton Tailored Trouser', category: "Men's Wear", price: 145, salePrice: null, stock: 22, sizes: '30,32,34,36', colors: 'Ecru,Navy', description: 'Sharp tailored trouser in premium cotton twill.', photos: '[]', emoji: '👖', status: 'published' },
    { name: 'Merino Knit Sweater', category: "Women's Wear", price: 178, salePrice: null, stock: 0, sizes: 'S,M,L,XL', colors: 'Camel,White', description: 'Fine merino knit with a relaxed boxy fit.', photos: '[]', emoji: '🧶', status: 'out' },
    { name: 'Structured Mini Bag', category: 'Accessories', price: 220, salePrice: 280, stock: 6, sizes: 'One Size', colors: 'Tan,Black', description: 'Structured leather bag with gold-tone hardware.', photos: '[]', emoji: '👜', status: 'published' },
    { name: 'Relaxed Linen Shirt', category: "Men's Wear", price: 112, salePrice: null, stock: 31, sizes: 'S,M,L,XL,XXL', colors: 'White,Blue', description: 'Breathable linen shirt with a relaxed collar.', photos: '[]', emoji: '👔', status: 'published' },
    { name: 'Wide Leg Denim', category: "Women's Wear", price: 165, salePrice: null, stock: 12, sizes: '28,30,32,34', colors: 'Indigo,Ecru', description: 'High-rise wide leg jeans in a clean indigo wash.', photos: '[]', emoji: '👖', status: 'draft' },
    { name: 'Leather Loafers', category: 'Footwear', price: 315, salePrice: null, stock: 9, sizes: '38,39,40,41,42', colors: 'Cognac,Black', description: 'Full grain leather loafers with memory foam insole.', photos: '[]', emoji: '👟', status: 'published' },
  ];
  for (const p of prods) {
    await db.run(
      'INSERT INTO products (name, category, price, salePrice, stock, sizes, colors, description, photos, emoji, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [p.name, p.category, p.price, p.salePrice, p.stock, p.sizes, p.colors, p.description, p.photos, p.emoji, p.status]
    );
  }
}

// Seed orders
const ordCount = await db.get('SELECT COUNT(*) as c FROM orders');
if (ordCount.c === 0) {
  const ords = [
    { id: '#VR-0041', customer: 'Amara Osei',      items: 2, total: 484, status: 'processing', date: 'Today 09:12' },
    { id: '#VR-0040', customer: 'Lena Müller',      items: 1, total: 315, status: 'shipped',    date: 'Today 08:30' },
    { id: '#VR-0039', customer: 'James Kimani',     items: 3, total: 527, status: 'delivered',  date: 'Yesterday' },
    { id: '#VR-0038', customer: 'Sofia Rossi',      items: 1, total: 195, status: 'delivered',  date: 'Yesterday' },
    { id: '#VR-0037', customer: 'Chen Wei',         items: 4, total: 892, status: 'cancelled',  date: 'Apr 1' },
    { id: '#VR-0036', customer: 'Fatima Al-Said',   items: 2, total: 413, status: 'delivered',  date: 'Apr 1' },
  ];
  for (const o of ords) {
    await db.run('INSERT INTO orders VALUES (?,?,?,?,?,?)', [o.id, o.customer, o.items, o.total, o.status, o.date]);
  }
}

// Seed hero settings
const heroExist = await db.get('SELECT id FROM hero_settings WHERE id = 1');
if (!heroExist) {
  await db.run(`INSERT INTO hero_settings (id, tag, headline, description, cta, counter, marquee) VALUES (1, ?, ?, ?, ?, ?, ?)`,
    ['Spring / Summer 2025 Collection', 'Wear Your Story', 'Curated pieces for the modern wardrobe — where minimalist design meets enduring elegance.', 'Shop Collection', '240+', 'New Season Arrivals · Free Returns · Sustainable Materials']);
}

// Seed store settings
const storeExist = await db.get('SELECT id FROM store_settings WHERE id = 1');
if (!storeExist) {
  await db.run(`INSERT INTO store_settings (id) VALUES (1)`);
}

console.log('✓ Database initialized successfully.');
await db.close();
