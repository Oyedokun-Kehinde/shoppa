-- Create database
CREATE DATABASE IF NOT EXISTS shoppa;
USE shoppa;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100),
  stock INT DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0.0,
  num_reviews INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  shipping_price DECIMAL(10, 2) DEFAULT 0.00,
  tax_price DECIMAL(10, 2) DEFAULT 0.00,
  shipping_address_address VARCHAR(255),
  shipping_address_city VARCHAR(100),
  shipping_address_postal_code VARCHAR(20),
  shipping_address_country VARCHAR(100),
  payment_method VARCHAR(50) DEFAULT 'Paystack',
  payment_result_id VARCHAR(255),
  payment_result_status VARCHAR(50),
  payment_result_email VARCHAR(255),
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP NULL,
  is_delivered BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_paid (is_paid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  image VARCHAR(500),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist (user_id, product_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS newsletter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP NULL,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample products
-- Chat inquiries table
CREATE TABLE IF NOT EXISTS chat_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  status ENUM('pending', 'in-progress', 'resolved') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog posts table
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

-- Insert sample products
INSERT INTO products (name, description, price, image, category, stock, rating, num_reviews) VALUES
('Wireless Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life', 129.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Electronics', 50, 4.8, 245),
('Smart Watch Pro', 'Advanced fitness tracking with heart rate monitor and GPS', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'Electronics', 30, 4.7, 189),
('Leather Wallet', 'Genuine leather bifold wallet with RFID protection', 49.99, 'https://images.unsplash.com/photo-1627123423553-9ab57ad56a67?w=500', 'Fashion', 100, 4.6, 312),
('Running Shoes', 'Lightweight performance running shoes with cushioned sole', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'Sports', 75, 4.9, 567),
('Coffee Maker', 'Programmable drip coffee maker with thermal carafe', 79.99, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 'Home & Living', 40, 4.5, 178),
('Backpack', 'Water-resistant laptop backpack with USB charging port', 59.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 'Fashion', 60, 4.7, 234),
('Yoga Mat', 'Non-slip eco-friendly yoga mat with carry strap', 34.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 'Sports', 120, 4.8, 456),
('Desk Lamp', 'LED desk lamp with adjustable brightness and USB port', 44.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', 'Home & Living', 85, 4.6, 198),
('Sunglasses', 'Polarized UV protection sunglasses with designer frame', 119.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 'Fashion', 45, 4.5, 123),
('Bluetooth Speaker', 'Portable waterproof speaker with 360° sound', 79.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 'Electronics', 55, 4.8, 389);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, author, featured_image, published) VALUES
('Top 10 Fashion Trends for 2024', 'top-10-fashion-trends-2024', 'Discover the hottest fashion trends that will dominate this year', 'Stay ahead of the curve with our comprehensive guide to 2024 fashion trends. From vibrant colors to sustainable fabrics, we explore everything you need to know to upgrade your wardrobe this season.', 'Fashion', 'Sarah Johnson', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500', TRUE),
('Ultimate Guide to Smart Shopping', 'ultimate-guide-smart-shopping', 'Learn how to shop smarter and save more with these expert tips', 'Shopping doesn''t have to break the bank. In this guide, we share insider secrets on how to find the best deals, use coupons effectively, and make informed purchasing decisions that you won''t regret.', 'Shopping Tips', 'Michael Chen', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500', TRUE),
('Best Tech Gadgets of the Season', 'best-tech-gadgets-season', 'Check out our top picks for must-have technology this season', 'Technology is evolving rapidly. We''ve rounded up the most innovative and useful tech gadgets that will make your life easier and more enjoyable. From smart home devices to portable chargers, these are the items worth investing in.', 'Technology', 'David Park', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', TRUE),
('Sustainable Living: Eco-Friendly Products', 'sustainable-living-eco-friendly-products', 'Make a positive impact with these environmentally conscious choices', 'Going green has never been easier. Explore our curated collection of eco-friendly products that help reduce your carbon footprint while maintaining quality and style. Small changes can make a big difference.', 'Lifestyle', 'Emma Wilson', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500', TRUE),
('Wireless Headphones Buying Guide', 'wireless-headphones-buying-guide', 'Everything you need to know before buying wireless headphones', 'With so many options available, choosing the perfect wireless headphones can be overwhelming. Our comprehensive buying guide covers sound quality, battery life, comfort, and price points to help you make the right choice.', 'Product Reviews', 'Alex Turner', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', TRUE);
