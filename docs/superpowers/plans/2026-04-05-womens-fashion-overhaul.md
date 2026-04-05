# Women's Fashion Storefront Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform KUI's Closet into a women's-only clothing storefront with 8 categories, new seed products, and a modern/trendy visual direction.

**Architecture:** No structural changes — same Next.js 16 + SQLite + server actions architecture. We update seed data (categories + products), restyle CSS for modern/trendy look, and update hardcoded content in page components (nav links, footer, hero copy, editorial).

**Tech Stack:** Next.js 16, React 19, SQLite, pure CSS

---

### Task 1: Update seed data — categories and products

**Files:**
- Modify: `scripts/init-db.mjs:94-127`

- [ ] **Step 1: Replace seed categories**

In `scripts/init-db.mjs`, replace lines 97-102 (the `cats` array) with:

```javascript
  const cats = [
    { name: 'Tops',                  slug: 'tops',                 status: 'published' },
    { name: 'Dresses',               slug: 'dresses',              status: 'published' },
    { name: 'Bottoms',               slug: 'bottoms',              status: 'published' },
    { name: 'Shoes',                 slug: 'shoes',                status: 'published' },
    { name: 'Outerwear',             slug: 'outerwear',            status: 'published' },
    { name: 'Lingerie & Sleepwear',  slug: 'lingerie-sleepwear',   status: 'published' },
    { name: 'Activewear',            slug: 'activewear',           status: 'published' },
    { name: 'Jumpsuits & Rompers',   slug: 'jumpsuits-rompers',    status: 'published' },
  ];
```

- [ ] **Step 2: Replace seed products**

In `scripts/init-db.mjs`, replace lines 111-126 (the `prods` array) with:

```javascript
  const prods = [
    // Tops
    { name: 'Satin Wrap Blouse',       category: 'Tops',       price: 78,  salePrice: null, stock: 20, sizes: 'XS,S,M,L',     colors: 'Champagne,Black',         description: 'Luxe satin blouse with a flattering wrap front and flowy sleeves.',           photos: '[]', emoji: '👚', status: 'published' },
    { name: 'Cropped Ribbed Tank',     category: 'Tops',       price: 32,  salePrice: null, stock: 45, sizes: 'XS,S,M,L,XL',  colors: 'White,Sage,Black',        description: 'Essential ribbed tank in a cropped length — pair with everything.',            photos: '[]', emoji: '👕', status: 'published' },
    { name: 'Oversized Linen Shirt',   category: 'Tops',       price: 95,  salePrice: null, stock: 18, sizes: 'S,M,L,XL',     colors: 'Ivory,Sky Blue',          description: 'Relaxed linen shirt with a breezy oversized fit for warm days.',              photos: '[]', emoji: '👔', status: 'published' },
    // Dresses
    { name: 'Floral Midi Wrap Dress',  category: 'Dresses',    price: 128, salePrice: 98,   stock: 12, sizes: 'XS,S,M,L',     colors: 'Rose Print,Navy Print',   description: 'Romantic floral wrap dress that falls to mid-calf with a tie waist.',         photos: '[]', emoji: '👗', status: 'published' },
    { name: 'Bodycon Mini Dress',      category: 'Dresses',    price: 65,  salePrice: null, stock: 30, sizes: 'XS,S,M',       colors: 'Black,Red',               description: 'Figure-hugging mini dress for a night out — bold and confident.',             photos: '[]', emoji: '👗', status: 'published' },
    { name: 'Tiered Maxi Sundress',    category: 'Dresses',    price: 145, salePrice: null, stock: 8,  sizes: 'S,M,L,XL',     colors: 'Terracotta,White',        description: 'Flowing tiered maxi dress with delicate straps and a bohemian silhouette.',   photos: '[]', emoji: '👗', status: 'published' },
    // Bottoms
    { name: 'High-Rise Wide Leg Jeans', category: 'Bottoms',   price: 110, salePrice: null, stock: 25, sizes: '24,26,28,30,32', colors: 'Indigo,Light Wash',      description: 'Flattering high-rise jeans with a dramatic wide leg in premium denim.',       photos: '[]', emoji: '👖', status: 'published' },
    { name: 'Pleated Midi Skirt',      category: 'Bottoms',    price: 88,  salePrice: null, stock: 15, sizes: 'XS,S,M,L',     colors: 'Camel,Black',             description: 'Elegant pleated skirt that moves beautifully — office to evening.',           photos: '[]', emoji: '👗', status: 'published' },
    { name: 'Cargo Jogger Pants',      category: 'Bottoms',    price: 72,  salePrice: 55,   stock: 35, sizes: 'XS,S,M,L,XL',  colors: 'Olive,Black',             description: 'Relaxed cargo joggers blending streetwear edge with everyday comfort.',       photos: '[]', emoji: '👖', status: 'published' },
    // Shoes
    { name: 'Strappy Block Heels',     category: 'Shoes',      price: 135, salePrice: null, stock: 10, sizes: '36,37,38,39,40,41', colors: 'Nude,Black',          description: 'Versatile block heels with delicate ankle straps — dance-floor ready.',       photos: '[]', emoji: '👠', status: 'published' },
    { name: 'Platform Sneakers',       category: 'Shoes',      price: 98,  salePrice: null, stock: 22, sizes: '36,37,38,39,40,41,42', colors: 'White,Pink',       description: 'Chunky platform sneakers that add height and street-style attitude.',         photos: '[]', emoji: '👟', status: 'published' },
    // Outerwear
    { name: 'Cropped Leather Jacket',  category: 'Outerwear',  price: 245, salePrice: null, stock: 7,  sizes: 'XS,S,M,L',     colors: 'Black,Tan',               description: 'Butter-soft cropped leather jacket — the ultimate layering staple.',          photos: '[]', emoji: '🧥', status: 'published' },
    { name: 'Oversized Blazer',        category: 'Outerwear',  price: 168, salePrice: 138,  stock: 14, sizes: 'S,M,L,XL',     colors: 'Charcoal,Cream',          description: 'Relaxed oversized blazer that transitions effortlessly from desk to drinks.', photos: '[]', emoji: '🧥', status: 'published' },
    // Lingerie & Sleepwear
    { name: 'Silk Cami Set',           category: 'Lingerie & Sleepwear', price: 85, salePrice: null, stock: 18, sizes: 'XS,S,M,L', colors: 'Blush,Black',      description: 'Indulgent silk cami and shorts set for luxurious nights in.',                 photos: '[]', emoji: '👙', status: 'published' },
    { name: 'Lace Bralette',           category: 'Lingerie & Sleepwear', price: 42, salePrice: null, stock: 40, sizes: 'XS,S,M,L', colors: 'Ivory,Mauve',      description: 'Delicate lace bralette that looks just as good layered under a blazer.',      photos: '[]', emoji: '👙', status: 'published' },
    // Activewear
    { name: 'Seamless Leggings',       category: 'Activewear', price: 58,  salePrice: null, stock: 50, sizes: 'XS,S,M,L,XL',  colors: 'Charcoal,Dusty Rose',     description: 'Buttery-soft seamless leggings with sculpting compression — gym to street.',  photos: '[]', emoji: '🩳', status: 'published' },
    { name: 'Sports Bra & Shorts Set', category: 'Activewear', price: 68,  salePrice: null, stock: 28, sizes: 'XS,S,M,L',     colors: 'Black,Sage',              description: 'Matching sports bra and biker shorts set for high-impact workouts.',          photos: '[]', emoji: '🩳', status: 'published' },
    // Jumpsuits & Rompers
    { name: 'Wide Leg Jumpsuit',       category: 'Jumpsuits & Rompers', price: 155, salePrice: null, stock: 9, sizes: 'XS,S,M,L', colors: 'Navy,Olive',        description: 'Effortlessly chic wide-leg jumpsuit — one piece, endless compliments.',       photos: '[]', emoji: '👗', status: 'published' },
    { name: 'Linen Romper',            category: 'Jumpsuits & Rompers', price: 92,  salePrice: 72,  stock: 16, sizes: 'XS,S,M',   colors: 'White,Terracotta',  description: 'Breezy linen romper with a cinched waist — perfect for sunny weekends.',      photos: '[]', emoji: '👗', status: 'published' },
  ];
```

- [ ] **Step 3: Re-initialize the database**

```bash
rm data/kui.db data/kui.db-shm data/kui.db-wal 2>/dev/null; node scripts/init-db.mjs
```

Expected: `✓ Database initialized successfully.`

- [ ] **Step 4: Commit**

```bash
git add scripts/init-db.mjs data/kui.db
git commit -m "feat: replace categories with 8 women's clothing categories and 20 seed products"
```

---

### Task 2: Update navigation links

**Files:**
- Modify: `src/app/components/ClientWrapper.tsx:19-24`

- [ ] **Step 1: Replace nav links**

In `ClientWrapper.tsx`, replace the nav-links div (lines 19-24) with:

```tsx
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/category/dresses">Dresses</Link>
        <Link href="/category/tops">Tops</Link>
        <Link href="/category/bottoms">Bottoms</Link>
        <Link href="/category/shoes">Shoes</Link>
      </div>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/ClientWrapper.tsx
git commit -m "feat: update nav links to women's categories"
```

---

### Task 3: Update hero copy, footer, and editorial

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update hero defaults**

In `page.tsx`, change the hero section defaults (lines 33-39):
- Tag: `'New Season 2026 Collection'`
- Headline: `'Your Style, Your Rules'`
- Description (fallback): `'Bold, curated pieces for the modern woman — from trending streetwear to timeless elegance.'`
- CTA stays: `'Shop Collection'`
- Second CTA: change `'View Lookbook'` to `'Explore Categories'` and href to `#new`

- [ ] **Step 2: Update marquee default**

Line 58 — change default text to:
`'New Drops Weekly · Free Shipping Over $100 · Trending Now · Style Inspo · Women First'`

- [ ] **Step 3: Update editorial section**

Lines 135-145 — update the editorial content:
- `editorial-quote`: `'Designed for Her'`
- `editorial-heading`: `'The <em>Power</em> of Style'`
- `editorial-text`: `'We design for the woman who leads with confidence. Every piece in our collection is crafted to make you feel unstoppable — from boardroom blazers to weekend dresses, each garment tells your story.'`
- Button text: `'Shop the Edit'`

- [ ] **Step 4: Update footer Shop links**

Lines 160-166 — replace the Shop column links:

```tsx
          <div>
            <div className="footer-col-title">Shop</div>
            <ul className="footer-links">
              <li><Link href="/category/tops">Tops</Link></li>
              <li><Link href="/category/dresses">Dresses</Link></li>
              <li><Link href="/category/bottoms">Bottoms</Link></li>
              <li><Link href="/category/shoes">Shoes</Link></li>
              <li><Link href="/category/outerwear">Outerwear</Link></li>
            </ul>
          </div>
```

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update hero, editorial, and footer to women's fashion focus"
```

---

### Task 4: Update CSS color palette and buttons

**Files:**
- Modify: `src/app/globals.css:17-27` (variables), and button styles

- [ ] **Step 1: Update CSS custom properties**

Replace the `:root` block (lines 17-27) with:

```css
:root {
  --bg: #ffffff;
  --bg2: #faf8f6;
  --cream: #0f172a;
  --muted: #64748b;
  --accent: #ff2a75;
  --accent2: #7c3aed;
  --border: rgba(15,23,42,0.08);
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans: 'DM Sans', sans-serif;
}
```

- [ ] **Step 2: Update button styles**

Replace `.btn-primary` (lines 202-215):

```css
.btn-primary {
  display: inline-flex; align-items: center; gap: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-decoration: none;
  padding: 16px 36px;
  border-radius: 4px;
  transition: all 0.3s;
}
.btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,42,117,0.3); }
```

- [ ] **Step 3: Add border-radius to product images**

Add after `.product-img-wrap` (line 431):

```css
.product-img-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3/4;
  background: var(--bg2);
  margin-bottom: 16px;
  border-radius: 6px;
}
```

Update `.product-badge` to have rounded corners:

```css
.product-badge {
  position: absolute;
  top: 12px; left: 12px;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 5px 12px;
  font-weight: 600;
  border-radius: 4px;
}
```

- [ ] **Step 4: Add hover effect to product cards**

Replace empty `.product-card` rule (line 428-429):

```css
.product-card {
  transition: transform 0.3s ease;
}
.product-card:hover {
  transform: translateY(-4px);
}
```

- [ ] **Step 5: Update .btn-add and .btn-checkout border-radius**

Add `border-radius: 4px;` to `.btn-add` and `.btn-checkout`.

- [ ] **Step 6: Update marquee to gradient**

Replace `.marquee-wrap` background:

```css
.marquee-wrap {
  overflow: hidden;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  padding: 14px 0;
}
```

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css
git commit -m "style: update color palette, buttons, and cards for modern/trendy look"
```

---

### Task 5: Redesign category grid for 8 categories

**Files:**
- Modify: `src/app/globals.css` (category styles)

- [ ] **Step 1: Replace category grid CSS**

Replace `.cat-grid` through `.cat-card:first-child .cat-art` (lines 362-419) with:

```css
.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 260px 260px;
  gap: 4px;
}
.cat-card {
  position: relative;
  overflow: hidden;
  display: flex; align-items: flex-end;
  padding: 28px;
  text-decoration: none;
  border-radius: 4px;
}
.cat-bg {
  position: absolute; inset: 0;
  transition: transform 0.6s ease;
}
.cat-card:hover .cat-bg { transform: scale(1.08); }
.cat-bg-1 { background: linear-gradient(135deg, #ff2a75, #ff6b9d); }
.cat-bg-2 { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
.cat-bg-3 { background: linear-gradient(135deg, #0f172a, #334155); }
.cat-bg-4 { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
.cat-bg-5 { background: linear-gradient(135deg, #06b6d4, #22d3ee); }
.cat-bg-6 { background: linear-gradient(135deg, #ec4899, #f9a8d4); }
.cat-bg-7 { background: linear-gradient(135deg, #10b981, #34d399); }
.cat-bg-8 { background: linear-gradient(135deg, #8b5cf6, #c4b5fd); }
.cat-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 70%);
}
.cat-info { position: relative; z-index: 1; }
.cat-label {
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  margin-bottom: 6px;
}
.cat-name {
  font-family: var(--serif);
  font-size: 24px;
  font-weight: 400;
  color: #ffffff;
}
.cat-art {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.15;
  font-size: 80px;
  color: #ffffff;
  transition: opacity 0.4s;
}
.cat-card:hover .cat-art { opacity: 0.3; }
```

- [ ] **Step 2: Update category grid mobile styles**

In the `@media (max-width: 768px)` block, replace the cat-grid rules:

```css
  .cat-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
  .cat-card { height: 200px; }
```

In the `@media (max-width: 480px)` block, add:

```css
  .cat-grid { grid-template-columns: 1fr; }
```

- [ ] **Step 3: Update category art symbols in page.tsx**

In `src/app/page.tsx`, line 77, update the art symbols array to have 8 characters:

```tsx
              <div className="cat-art">{'👚👗👖👠🧥💜🏃✨'[i % 8]}</div>
```

Also remove the `.cat-card:first-child` span-2 behavior — the grid is now uniform 4-col.

In `page.tsx` line 75, change `cat-bg-${(i % 5) + 1}` to `cat-bg-${(i % 8) + 1}`.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/page.tsx
git commit -m "style: redesign category grid with gradient backgrounds for 8 categories"
```

---

### Task 6: Polish — section titles, hero stat, overall tightening

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Make section titles bolder**

Update `.section-title` font-weight from 300 to 400, and `.section-eyebrow` to use accent gradient text:

```css
.section-title {
  font-family: var(--serif);
  font-size: clamp(36px, 4vw, 56px);
  font-weight: 400;
  line-height: 1.1;
  color: var(--cream);
}
```

- [ ] **Step 2: Update hero stat styling for white text on images**

In `.hero-stat-number` and `.hero-stat-label`, the colors reference `--cream` (navy) and `--muted`. These display on top of the hero image. Update:

```css
.hero-stat-number {
  font-family: var(--serif);
  font-size: 48px;
  font-weight: 300;
  color: #ffffff;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.hero-stat-label {
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.8);
  margin-top: 4px;
}
```

- [ ] **Step 3: Tighten product grid gap and improve card spacing**

Update `.product-grid` gap from 24px to 20px. Add bottom margin to product cards:

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: polish section titles, hero overlay, product grid spacing"
```

---

### Task 7: Verify the app runs

**Files:** None (verification only)

- [ ] **Step 1: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000` in browser. Verify:
- Hero shows updated women's copy
- 8 category cards with gradient backgrounds display in a 4-col grid
- Product grid shows women's products only
- Footer has updated links (no Men's/Accessories)
- Nav links point to women's categories
- Category pages (`/category/tops`, `/category/dresses`, etc.) show correct products
- Buttons have gradient styling and border-radius
- Marquee has gradient background

- [ ] **Step 2: Verify admin works**

Open `/admin`, login with admin/admin123. Verify:
- Categories page shows the 8 new categories
- Products page shows the 20 new women's products
- Adding a product with category dropdown works

- [ ] **Step 3: Run build to check for errors**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address any issues found during verification"
```
