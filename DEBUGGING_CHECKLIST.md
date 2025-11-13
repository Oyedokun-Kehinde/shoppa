# 🔧 DEBUGGING CHECKLIST FOR SHOPPA

## ✅ COMPLETED FIXES:

1. **Nigerian Details Updated** ✓
   - Phone: +234 812 345 6789
   - Email: support@shoppa.com.ng
   - Location: Akure, Ondo State, Nigeria
   - Testimonials: Nigerian names (Adewale, Funmilayo, Oluwaseun)

2. **Cart/Wishlist Icons on Home Page** ✓
   - Icons ARE in the code (see Home.tsx lines 261-278)
   - They appear on HOVER over product images
   - Cart icon (shopping cart) - top left
   - Wishlist icon (heart) - below cart icon
   - **HOVER OVER PRODUCTS TO SEE THEM!**

3. **Product URLs** ✓
   - Now use slugs: /product/premium-wireless-headphones
   - SEO-friendly

---

## 🚨 CRITICAL ISSUES TO FIX NOW:

### Issue #1: Products Not Loading from Database

**Root Cause:** Products table might be EMPTY

**Fix:** Run this SQL NOW:

```sql
USE shoppa;

-- Check if products exist
SELECT COUNT(*) FROM products;

-- If 0, insert products:
INSERT INTO products (name, description, price, image, category, stock, rating, num_reviews) VALUES
('Wireless Headphones', 'Premium noise-cancelling wireless headphones', 129.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Electronics', 50, 4.8, 245),
('Smart Watch Pro', 'Advanced fitness tracking smartwatch', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'Electronics', 30, 4.7, 189),
('Leather Wallet', 'Genuine leather RFID wallet', 49.99, 'https://images.unsplash.com/photo-1627123423553-9ab57ad56a67?w=500', 'Fashion', 100, 4.6, 312),
('Running Shoes', 'Lightweight running shoes', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'Sports', 75, 4.9, 567),
('Coffee Maker', 'Programmable drip coffee maker', 79.99, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 'Home & Living', 40, 4.5, 178),
('Backpack', 'Water-resistant laptop backpack', 59.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 'Fashion', 60, 4.7, 234),
('Yoga Mat', 'Eco-friendly yoga mat', 34.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 'Sports', 120, 4.8, 456),
('Desk Lamp', 'LED desk lamp with USB port', 44.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', 'Home & Living', 85, 4.6, 198),
('Sunglasses', 'Polarized UV sunglasses', 119.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 'Fashion', 45, 4.5, 123),
('Bluetooth Speaker', 'Waterproof portable speaker', 79.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 'Electronics', 55, 4.8, 389);

-- Verify
SELECT * FROM products;
```

---

### Issue #2: Blog Not Loading

**Root Cause:** blog_posts table doesn't exist

**Fix:** Run this SQL:

```sql
USE shoppa;

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  category VARCHAR(100),
  author VARCHAR(255) DEFAULT 'Admin',
  featured_image VARCHAR(500),
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_category (category),
  INDEX idx_published (published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, author, featured_image) VALUES
('Top 10 Fashion Trends for 2024', 'top-10-fashion-trends-2024', 'Discover the hottest fashion trends', 'Stay ahead with our fashion guide...', 'Fashion', 'Sarah Johnson', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500'),
('Ultimate Guide to Smart Shopping', 'ultimate-guide-smart-shopping', 'Learn how to shop smarter', 'Shopping tips and tricks...', 'Shopping Tips', 'Michael Chen', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500'),
('Best Tech Gadgets of the Season', 'best-tech-gadgets-season', 'Top tech picks for this season', 'Technology is evolving...', 'Technology', 'David Park', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500');

-- Verify
SELECT * FROM blog_posts;
```

---

## 🧪 HOW TO TEST:

### Test Cart/Wishlist Icons on Home:
1. Go to homepage (http://localhost:5173)
2. Scroll to "Featured Products" section
3. **HOVER your mouse over a product image**
4. You should see 2 round white buttons on top-left:
   - 🛒 Shopping Cart icon (top)
   - ❤️ Heart icon (bottom)
5. Click them (requires login)

### Test Products API:
1. Open browser console (F12)
2. Go to Network tab
3. Visit http://localhost:5173/shop
4. Look for request to `/api/products`
5. Check response - should show array of products

### Test Blog API:
1. Visit http://localhost:5173/blog
2. Open console (F12)
3. Look for request to `/api/blog/posts`
4. Check if it returns blog posts

---

## 📊 VERIFY DATABASE:

Run these commands in MySQL:

```sql
USE shoppa;

-- Show all tables
SHOW TABLES;

-- Count records in each table
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'chat_inquiries', COUNT(*) FROM chat_inquiries;

-- Check MySQL connection
SELECT 'MySQL is working!' as status;
```

---

## 🔍 CHECK BACKEND LOGS:

Look at your server terminal for errors. You should see:
```
Server running on port 5000
MySQL Connected Successfully
```

If you see table errors, run the SQL above!

---

## ✅ FINAL CHECKLIST:

- [ ] MySQL tables exist (run SHOW TABLES)
- [ ] Products table has 10 rows
- [ ] Blog_posts table has 3+ rows
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] No errors in browser console
- [ ] HOVER over products to see icons
- [ ] Nigerian details showing (Akure location)

---

## 🆘 STILL NOT WORKING?

1. **Check browser console** (F12) for errors
2. **Check network tab** to see API calls
3. **Restart backend server** (Ctrl+C, then npm run dev)
4. **Hard refresh browser** (Ctrl+Shift+R)
5. **Clear browser cache**

---

Remember: Cart/Wishlist icons appear ON HOVER! Don't just look, HOVER your mouse over the product images! 🖱️
