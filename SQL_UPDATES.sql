-- ===================================
-- SHOPPA DATABASE UPDATES
-- Run this SQL to add all required features
-- ===================================

USE shoppa;

-- 1. ADD SLUG TO PRODUCTS TABLE
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE AFTER name,
ADD COLUMN IF NOT EXISTS long_description LONGTEXT AFTER description,
ADD COLUMN IF NOT EXISTS specifications TEXT AFTER long_description,
ADD COLUMN IF NOT EXISTS features TEXT AFTER specifications;

-- Create slugs for existing products (if any)
UPDATE products SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '''', '')) WHERE slug IS NULL OR slug = '';

-- 2. ADD USER PROFILE FIELDS
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) AFTER email,
ADD COLUMN IF NOT EXISTS address_street VARCHAR(255) AFTER phone,
ADD COLUMN IF NOT EXISTS address_city VARCHAR(100) AFTER address_street,
ADD COLUMN IF NOT EXISTS address_state VARCHAR(100) AFTER address_city,
ADD COLUMN IF NOT EXISTS address_postal_code VARCHAR(20) AFTER address_state,
ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500) AFTER address_postal_code;

-- 3. CREATE PAYMENT CARDS TABLE
CREATE TABLE IF NOT EXISTS payment_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  card_type VARCHAR(50) NOT NULL,
  card_last_four VARCHAR(4) NOT NULL,
  card_holder_name VARCHAR(255) NOT NULL,
  expiry_month INT NOT NULL,
  expiry_year INT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CREATE PRODUCT REVIEWS TABLE
CREATE TABLE IF NOT EXISTS product_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_user_id (user_id),
  UNIQUE KEY unique_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CREATE BLOG COMMENTS TABLE
CREATE TABLE IF NOT EXISTS blog_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blog_post_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_blog_post_id (blog_post_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. CREATE BLOG REACTIONS TABLE (for logged in AND logged out users)
CREATE TABLE IF NOT EXISTS blog_reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blog_post_id INT NOT NULL,
  user_id INT NULL,
  session_id VARCHAR(255) NULL,
  reaction_type ENUM('like', 'love', 'insightful', 'celebrate') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_blog_post_id (blog_post_id),
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ADD REACTION COUNTS TO BLOG POSTS
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0 AFTER published,
ADD COLUMN IF NOT EXISTS loves_count INT DEFAULT 0 AFTER likes_count,
ADD COLUMN IF NOT EXISTS insightful_count INT DEFAULT 0 AFTER loves_count,
ADD COLUMN IF NOT EXISTS celebrate_count INT DEFAULT 0 AFTER insightful_count,
ADD COLUMN IF NOT EXISTS comments_count INT DEFAULT 0 AFTER celebrate_count;

-- 8. INSERT SAMPLE PRODUCTS WITH SLUGS (only if products table is empty)
INSERT INTO products (name, slug, description, long_description, price, image, category, stock, rating, num_reviews, specifications, features) VALUES
('Premium Wireless Headphones', 'premium-wireless-headphones', 
 'High-quality noise-cancelling wireless headphones', 
 'Experience superior sound quality with our Premium Wireless Headphones. Featuring advanced noise-cancelling technology, 30-hour battery life, and premium comfort padding. Perfect for music lovers, travelers, and professionals who demand the best audio experience.',
 45999.99, 
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 
 'Electronics', 50, 4.8, 245,
 'Driver Size: 40mm | Frequency Response: 20Hz-20kHz | Impedance: 32Ω | Battery Life: 30 hours | Charging Time: 2 hours | Bluetooth: 5.0',
 'Active Noise Cancellation | Premium Leather Padding | Foldable Design | Built-in Microphone | Multi-device Pairing'
),
('Smart Watch Pro', 'smart-watch-pro',
 'Advanced fitness tracking smartwatch with GPS',
 'Stay connected and healthy with the Smart Watch Pro. Track your fitness goals, monitor your heart rate 24/7, receive notifications, and navigate with built-in GPS. Water-resistant up to 50m and featuring a stunning AMOLED display.',
 89999.99,
 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
 'Electronics', 30, 4.7, 189,
 'Display: 1.4" AMOLED | Resolution: 454x454 | Battery: 7 days | Water Resistance: 5ATM | Sensors: Heart Rate, SpO2, GPS, Gyroscope',
 'Always-on Display | Heart Rate Monitor | Sleep Tracking | 100+ Sports Modes | Music Control | Voice Assistant'
),
('Leather Wallet', 'leather-wallet',
 'Genuine leather wallet with RFID protection',
 'Crafted from premium genuine leather, this elegant wallet combines style with security. Features RFID-blocking technology to protect your cards from electronic theft. Multiple card slots, ID window, and a spacious bill compartment.',
 12999.99,
 'https://images.unsplash.com/photo-1627123423553-9ab57ad56a67?w=500',
 'Fashion', 100, 4.6, 312,
 'Material: Genuine Leather | Dimensions: 11cm x 9cm x 2cm | Card Slots: 8 | RFID Protection: Yes',
 'RFID Blocking Technology | Premium Leather | Multiple Card Slots | ID Window | Coin Pocket | Gift Box Included'
),
('Running Shoes Pro', 'running-shoes-pro',
 'Lightweight performance running shoes',
 'Engineered for speed and comfort, these professional running shoes feature advanced cushioning technology and breathable mesh upper. Perfect for marathon training or casual jogging. Lightweight design reduces fatigue during long runs.',
 24999.99,
 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
 'Sports', 75, 4.9, 567,
 'Upper Material: Breathable Mesh | Sole: EVA Foam + Rubber | Weight: 250g per shoe | Sizes: 38-45',
 'Advanced Cushioning | Breathable Design | Anti-slip Sole | Reflective Elements | Arch Support | Shock Absorption'
),
('Smart Coffee Maker', 'smart-coffee-maker',
 'Programmable coffee maker with thermal carafe',
 'Wake up to freshly brewed coffee every morning. This programmable coffee maker features a thermal carafe that keeps coffee hot for hours, customizable brew strength, and a built-in grinder for the freshest taste possible.',
 34999.99,
 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
 'Home & Living', 40, 4.5, 178,
 'Capacity: 12 cups | Carafe: Thermal Stainless Steel | Power: 1200W | Timer: 24-hour programmable',
 'Built-in Grinder | Programmable Timer | Thermal Carafe | Auto Shut-off | Brew Strength Control | Easy Clean'
),
('Premium Laptop Backpack', 'premium-laptop-backpack',
 'Water-resistant backpack with USB charging port',
 'The ultimate backpack for professionals and students. Features a dedicated padded laptop compartment (fits up to 17"), USB charging port for on-the-go device charging, and water-resistant material to protect your valuables.',
 18999.99,
 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
 'Fashion', 60, 4.7, 234,
 'Material: Water-resistant Nylon | Laptop Compartment: Up to 17" | Dimensions: 45cm x 30cm x 15cm | Weight: 800g',
 'USB Charging Port | Water-resistant | Anti-theft Zipper | Padded Straps | Multiple Compartments | Luggage Strap'
),
('Eco Yoga Mat Premium', 'eco-yoga-mat-premium',
 'Non-slip eco-friendly yoga mat',
 'Practice yoga in comfort and style with our premium eco-friendly yoga mat. Made from sustainable materials, featuring excellent grip and cushioning. Includes carrying strap and online workout guide.',
 8999.99,
 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
 'Sports', 120, 4.8, 456,
 'Material: TPE (eco-friendly) | Dimensions: 183cm x 61cm | Thickness: 6mm | Weight: 1.2kg',
 'Non-slip Surface | Eco-friendly Material | Extra Cushioning | Carrying Strap | Easy to Clean | Odor-free'
),
('LED Desk Lamp Pro', 'led-desk-lamp-pro',
 'Adjustable LED lamp with USB charging',
 'Illuminate your workspace with this modern LED desk lamp. Features adjustable brightness, color temperature control, USB charging port for devices, and a flexible arm that positions light exactly where you need it.',
 15999.99,
 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
 'Home & Living', 85, 4.6, 198,
 'LED Lifespan: 50,000 hours | Power: 12W | Brightness Levels: 5 | Color Temperature: 3000K-6000K',
 'Adjustable Brightness | Color Temperature Control | USB Charging Port | Touch Control | Memory Function | Eye-care Technology'
),
('Designer Sunglasses', 'designer-sunglasses',
 'Polarized UV protection sunglasses',
 'Protect your eyes in style with these designer sunglasses. Features polarized lenses for superior glare reduction, 100% UV protection, and a durable yet lightweight frame. Comes with protective case and cleaning cloth.',
 35999.99,
 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
 'Fashion', 45, 4.5, 123,
 'Lens: Polarized TAC | UV Protection: 100% UVA/UVB | Frame Material: Acetate | Weight: 28g',
 'Polarized Lenses | UV400 Protection | Lightweight Frame | Scratch-resistant | Protective Case | Microfiber Cloth'
),
('Portable Bluetooth Speaker', 'portable-bluetooth-speaker',
 'Waterproof speaker with 360° sound',
 'Take your music anywhere with this portable Bluetooth speaker. Features 360° surround sound, IPX7 waterproof rating, 12-hour battery life, and built-in microphone for hands-free calls. Perfect for parties, beach trips, and outdoor adventures.',
 28999.99,
 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
 'Electronics', 55, 4.8, 389,
 'Battery Life: 12 hours | Bluetooth: 5.0 | Range: 30m | Output: 20W | Water Resistance: IPX7',
 '360° Surround Sound | Waterproof IPX7 | Long Battery Life | Hands-free Calls | Dual Pairing | Portable Design'
)
ON DUPLICATE KEY UPDATE slug=VALUES(slug);

-- 9. VERIFY EVERYTHING
SELECT 'Database updates completed successfully!' AS Status;
SELECT COUNT(*) as products_count FROM products;
SELECT COUNT(*) as users_count FROM users;
SELECT COUNT(*) as blog_posts_count FROM blog_posts;

-- Show table structures
SHOW COLUMNS FROM products;
SHOW COLUMNS FROM users;
SHOW TABLES;

SELECT '✅ ALL TABLES AND FEATURES READY!' AS Result;
