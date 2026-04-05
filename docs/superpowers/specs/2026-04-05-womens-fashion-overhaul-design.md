# Women's Fashion Storefront Overhaul

## Goal
Transform KUI's Closet from a mixed-gender fashion store into a women's-only clothing storefront with a modern/trendy visual direction.

## Categories (8)

| Category | Slug | Sample Items |
|---|---|---|
| Tops | tops | Blouses, shirts, crop tops, t-shirts |
| Dresses | dresses | Midi, maxi, mini, wrap dresses |
| Bottoms | bottoms | Jeans, trousers, skirts, shorts |
| Shoes | shoes | Heels, sneakers, boots, sandals |
| Outerwear | outerwear | Jackets, coats, blazers, cardigans |
| Lingerie & Sleepwear | lingerie-sleepwear | Bras, pajamas, robes, loungewear |
| Activewear | activewear | Leggings, sports bras, gym sets |
| Jumpsuits & Rompers | jumpsuits-rompers | Jumpsuits, rompers, playsuits |

## Seed Products (~2-3 per category)

### Tops
- Satin Wrap Blouse — $78, XS-L, Champagne/Black, published
- Cropped Ribbed Tank — $32, XS-XL, White/Sage/Black, published
- Oversized Linen Shirt — $95, S-XL, Ivory/Sky Blue, published

### Dresses
- Floral Midi Wrap Dress — $128, XS-L, Rose Print/Navy Print, published
- Bodycon Mini Dress — $65, XS-M, Black/Red, published
- Tiered Maxi Sundress — $145, S-XL, Terracotta/White, published

### Bottoms
- High-Rise Wide Leg Jeans — $110, 24-32, Indigo/Light Wash, published
- Pleated Midi Skirt — $88, XS-L, Camel/Black, published
- Cargo Jogger Pants — $72, XS-XL, Olive/Black, published

### Shoes
- Strappy Block Heels — $135, 36-41, Nude/Black, published
- Platform Sneakers — $98, 36-42, White/Pink, published

### Outerwear
- Cropped Leather Jacket — $245, XS-L, Black/Tan, published
- Oversized Blazer — $168, S-XL, Charcoal/Cream, published

### Lingerie & Sleepwear
- Silk Cami Set — $85, XS-L, Blush/Black, published
- Lace Bralette — $42, XS-L, Ivory/Mauve, published

### Activewear
- Seamless Leggings — $58, XS-XL, Charcoal/Dusty Rose, published
- Sports Bra & Shorts Set — $68, XS-L, Black/Sage, published

### Jumpsuits & Rompers
- Wide Leg Jumpsuit — $155, XS-L, Navy/Olive, published
- Linen Romper — $92, XS-M, White/Terracotta, published

## Visual Changes: Modern/Trendy Direction

### Color Palette
- **Primary accent**: `#ff2a75` (hot pink) — keep but make more prominent
- **Secondary accent**: `#7c3aed` (vivid purple) — replace the blue (`#3b82f6`)
- **Background**: Keep white `#ffffff` primary
- **Bg2**: Slightly warmer `#faf8f6` instead of cold `#f8fafc`
- **Text**: Keep deep navy `#0f172a`
- **Muted**: Keep `#64748b`
- **New gradient accents**: Use pink-to-purple gradients for buttons and hover states

### Category Grid
- Redesign to 4-column grid (2 rows of 4) to accommodate 8 categories evenly
- Bold gradient backgrounds per category instead of grayscale filter
- Larger category names with modern sans-serif treatment
- Add product count badge per category

### Typography
- Keep Cormorant Garamond serif for headings — increase weight to 500 for more punch
- Keep DM Sans for body
- Slightly larger section titles

### Product Cards
- Add smooth scale + shadow on hover
- Cleaner sale badge with rounded corners
- Show color swatches below product name
- Subtle border-radius on image containers (4px)

### Hero Section
- Update copy: tag "New Season 2026", headline "Your Style, Your Rules", description women's-focused
- More dynamic CTA button with gradient background
- Update marquee text: "New Drops Weekly · Free Shipping Over $100 · Trending Now · Style Inspo"

### Buttons
- Primary buttons: gradient from accent to accent2 (`#ff2a75` to `#7c3aed`)
- Hover: shift gradient + slight scale
- Border-radius: 4px on all buttons (currently square)

### Footer
- Remove Men's Wear and Accessories links
- Replace with women's category links: Tops, Dresses, Bottoms, Shoes, Outerwear
- Update brand description to women's-focused copy

### Editorial Section
- Update copy to women's fashion focus
- Modernize heading

### General Polish
- Add `border-radius: 4px` to product images and cards
- Tighten product grid gap
- Improve mobile category grid (2-col on tablet, 1-col on phone)
- Fix category card text color for readability on gradient backgrounds

## What Stays the Same
- App architecture (Next.js 16, server actions, SQLite, no ORM)
- Admin dashboard functionality and structure
- Cart context and WhatsApp checkout flow
- Custom cursor feature
- Search modal

## Files to Modify
1. `scripts/init-db.mjs` — New categories and seed products
2. `src/app/globals.css` — Color palette, category grid, buttons, product cards, hover effects, polish
3. `src/app/page.tsx` — Hero copy, footer links, editorial copy, category grid layout
4. `src/app/admin/AdminApp.tsx` — Remove hardcoded men's/accessories references if any
5. `data/kui.db` — Will be re-initialized with new seed data
