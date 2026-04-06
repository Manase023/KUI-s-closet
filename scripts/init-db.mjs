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

console.log('Initializing database schema...');
await db.exec(`
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS orders;
  DROP TABLE IF EXISTS hero_settings;
  DROP TABLE IF EXISTS store_settings;
  DROP TABLE IF EXISTS visits;

  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published'
  );

  CREATE TABLE products (
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

  CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    items INTEGER DEFAULT 1,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing',
    date TEXT NOT NULL
  );

  CREATE TABLE hero_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    tag TEXT,
    headline TEXT,
    description TEXT,
    cta TEXT,
    counter TEXT,
    marquee TEXT,
    bg_image TEXT
  );

  CREATE TABLE store_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    store_name TEXT DEFAULT 'KUI''s CLOSET',
    currency TEXT DEFAULT 'USD',
    contact_email TEXT,
    free_shipping_threshold REAL DEFAULT 150,
    show_sale_badge INTEGER DEFAULT 1,
    wishlist_feature INTEGER DEFAULT 1,
    newsletter_popup INTEGER DEFAULT 0,
    maintenance_mode INTEGER DEFAULT 0,
    whatsapp_number TEXT
  );

  CREATE TABLE visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT,
    ip TEXT,
    user_agent TEXT,
    timestamp DATETIME DEFAULT (datetime('now'))
  );
`);

console.log('Seeding data...');

// Seed admin user
await db.run("INSERT INTO users (username, password) VALUES ('admin', 'admin123')");

// Seed categories
const cats = [
  { name: 'Tops',                  slug: 'tops',                status: 'published' },
  { name: 'Dresses',               slug: 'dresses',             status: 'published' },
  { name: 'Bottoms',               slug: 'bottoms',             status: 'published' },
  { name: 'Shoes',                 slug: 'shoes',               status: 'published' },
  { name: 'Outerwear',             slug: 'outerwear',           status: 'published' },
  { name: 'Lingerie & Sleepwear',  slug: 'lingerie-sleepwear',  status: 'published' },
  { name: 'Activewear',            slug: 'activewear',          status: 'published' },
  { name: 'Jumpsuits & Rompers',   slug: 'jumpsuits-rompers',   status: 'published' },
];
for (const c of cats) {
  await db.run('INSERT INTO categories (name, slug, status) VALUES (?, ?, ?)', [c.name, c.slug, c.status]);
}

// Seed products
const prods = [
  // Tops
  { name: 'Satin Wrap Blouse',       category: 'Tops',       price: 78,  salePrice: null, stock: 20, sizes: 'XS,S,M,L',         colors: 'Champagne,Black',       description: 'Luxe satin blouse with a flattering wrap front and flowy sleeves.',           photos: '[]', emoji: '👚', status: 'published' },
  { name: 'Cropped Ribbed Tank',     category: 'Tops',       price: 32,  salePrice: null, stock: 45, sizes: 'XS,S,M,L,XL',      colors: 'White,Sage,Black',      description: 'Essential ribbed tank in a cropped length — pair with everything.',            photos: '[]', emoji: '👕', status: 'published' },
  { name: 'Oversized Linen Shirt',   category: 'Tops',       price: 95,  salePrice: null, stock: 18, sizes: 'S,M,L,XL',         colors: 'Ivory,Sky Blue',        description: 'Relaxed linen shirt with a breezy oversized fit for warm days.',              photos: '[]', emoji: '👔', status: 'published' },
  // Dresses
  { name: 'Floral Midi Wrap Dress',  category: 'Dresses',    price: 128, salePrice: 98,   stock: 12, sizes: 'XS,S,M,L',         colors: 'Rose Print,Navy Print', description: 'Romantic floral wrap dress that falls to mid-calf with a tie waist.',         photos: '[]', emoji: '👗', status: 'published' },
  { name: 'Bodycon Mini Dress',      category: 'Dresses',    price: 65,  salePrice: null, stock: 30, sizes: 'XS,S,M',           colors: 'Black,Red',             description: 'Figure-hugging mini dress for a night out — bold and confident.',             photos: '[]', emoji: '👗', status: 'published' },
  { name: 'Tiered Maxi Sundress',    category: 'Dresses',    price: 145, salePrice: null, stock: 8,  sizes: 'S,M,L,XL',         colors: 'Terracotta,White',      description: 'Flowing tiered maxi dress with delicate straps and a bohemian silhouette.',   photos: '[]', emoji: '👗', status: 'published' },
  // Bottoms
  { name: 'High-Rise Wide Leg Jeans', category: 'Bottoms',   price: 110, salePrice: null, stock: 25, sizes: '24,26,28,30,32',   colors: 'Indigo,Light Wash',     description: 'Flattering high-rise jeans with a dramatic wide leg in premium denim.',       photos: '[]', emoji: '👖', status: 'published' },
  { name: 'Pleated Midi Skirt',      category: 'Bottoms',    price: 88,  salePrice: null, stock: 15, sizes: 'XS,S,M,L',         colors: 'Camel,Black',           description: 'Elegant pleated skirt that moves beautifully — office to evening.',           photos: '[]', emoji: '👗', status: 'published' },
  { name: 'Cargo Jogger Pants',      category: 'Bottoms',    price: 72,  salePrice: 55,   stock: 35, sizes: 'XS,S,M,L,XL',      colors: 'Olive,Black',           description: 'Relaxed cargo joggers blending streetwear edge with everyday comfort.',       photos: '[]', emoji: '👖', status: 'published' },
  // Shoes
  { name: 'Strappy Block Heels',     category: 'Shoes',      price: 135, salePrice: null, stock: 10, sizes: '36,37,38,39,40,41', colors: 'Nude,Black',            description: 'Versatile block heels with delicate ankle straps — dance-floor ready.',       photos: '[]', emoji: '👠', status: 'published' },
  { name: 'Platform Sneakers',       category: 'Shoes',      price: 98,  salePrice: null, stock: 22, sizes: '36,37,38,39,40,41,42', colors: 'White,Pink',         description: 'Chunky platform sneakers that add height and street-style attitude.',         photos: '[]', emoji: '👟', status: 'published' },
  // Outerwear
  { name: 'Cropped Leather Jacket',  category: 'Outerwear',  price: 245, salePrice: null, stock: 7,  sizes: 'XS,S,M,L',         colors: 'Black,Tan',             description: 'Butter-soft cropped leather jacket — the ultimate layering staple.',          photos: '[]', emoji: '🧥', status: 'published' },
  { name: 'Oversized Blazer',        category: 'Outerwear',  price: 168, salePrice: 138,  stock: 14, sizes: 'S,M,L,XL',         colors: 'Charcoal,Cream',        description: 'Relaxed oversized blazer that transitions effortlessly from desk to drinks.', photos: '[]', emoji: '🧥', status: 'published' },
  // Lingerie & Sleepwear
  { name: 'Silk Cami Set',           category: 'Lingerie & Sleepwear', price: 85, salePrice: null, stock: 18, sizes: 'XS,S,M,L', colors: 'Blush,Black',    description: 'Indulgent silk cami and shorts set for luxurious nights in.',                 photos: '[]', emoji: '👙', status: 'published' },
  { name: 'Lace Bralette',           category: 'Lingerie & Sleepwear', price: 42, salePrice: null, stock: 40, sizes: 'XS,S,M,L', colors: 'Ivory,Mauve',    description: 'Delicate lace bralette that looks just as good layered under a blazer.',      photos: '[]', emoji: '👙', status: 'published' },
  // Activewear
  { name: 'Seamless Leggings',       category: 'Activewear', price: 58,  salePrice: null, stock: 50, sizes: 'XS,S,M,L,XL',      colors: 'Charcoal,Dusty Rose',   description: 'Buttery-soft seamless leggings with sculpting compression — gym to street.',  photos: '[]', emoji: '🩳', status: 'published' },
  { name: 'Sports Bra & Shorts Set', category: 'Activewear', price: 68,  salePrice: null, stock: 28, sizes: 'XS,S,M,L',         colors: 'Black,Sage',            description: 'Matching sports bra and biker shorts set for high-impact workouts.',          photos: '[]', emoji: '🩳', status: 'published' },
  // Jumpsuits & Rompers
  { name: 'Wide Leg Jumpsuit',       category: 'Jumpsuits & Rompers', price: 155, salePrice: null, stock: 9, sizes: 'XS,S,M,L',  colors: 'Navy,Olive',     description: 'Effortlessly chic wide-leg jumpsuit — one piece, endless compliments.',       photos: '[]', emoji: '👗', status: 'published' },
  { name: 'Linen Romper',            category: 'Jumpsuits & Rompers', price: 92,  salePrice: 72,  stock: 16, sizes: 'XS,S,M',    colors: 'White,Terracotta', description: 'Breezy linen romper with a cinched waist — perfect for sunny weekends.',     photos: '[]', emoji: '👗', status: 'published' },
];
for (const p of prods) {
  await db.run(
    'INSERT INTO products (name, category, price, salePrice, stock, sizes, colors, description, photos, emoji, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [p.name, p.category, p.price, p.salePrice, p.stock, p.sizes, p.colors, p.description, p.photos, p.emoji, p.status]
  );
}

// Seed orders
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

// Seed hero settings
await db.run(`INSERT INTO hero_settings (id, tag, headline, description, cta, counter, marquee) VALUES (1, ?, ?, ?, ?, ?, ?)`,
  ['NEW SEASON DROP', 'Unveiling the Future of <em>Femininity</em>', 'Discover curated collection of essential pieces for the modern woman — balancing trend-forward design with timeless grace.', 'Shop Collection', '240+', 'Luxe Satin Drop · Global Shipping · New Season Arrivals · Eco-Conscious Fabrics']);

// Seed store settings
await db.run(`INSERT INTO store_settings (id, store_name, currency, free_shipping_threshold) VALUES (1, 'KUI WOMEN', 'USD', 120)`);

console.log('✓ Database re-initialized and seeded for KUI WOMEN.');
await db.close();
