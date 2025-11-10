import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

dotenv.config();

const products = [
  // Electronics
  { name: 'Premium Wireless Headphones', description: 'High-quality wireless headphones with noise cancellation and superior sound.', price: 299.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', stock: 50, rating: 4.8, numReviews: 245 },
  { name: 'Smart Watch Pro', description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and GPS.', price: 399.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', stock: 35, rating: 4.7, numReviews: 189 },
  { name: 'Bluetooth Speaker', description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.', price: 89.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', stock: 100, rating: 4.5, numReviews: 320 },
  { name: 'Wireless Earbuds Pro', description: 'True wireless earbuds with active noise cancellation and long battery life.', price: 179.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', stock: 80, rating: 4.6, numReviews: 402 },
  { name: '4K Ultra HD Camera', description: 'Professional-grade 4K camera with image stabilization and Wi-Fi connectivity.', price: 899.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500', stock: 15, rating: 4.9, numReviews: 87 },
  { name: 'Gaming Mouse RGB', description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.', price: 59.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', stock: 120, rating: 4.4, numReviews: 156 },
  { name: 'Mechanical Keyboard', description: 'Premium mechanical keyboard with RGB backlight and tactile switches.', price: 149.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', stock: 45, rating: 4.7, numReviews: 201 },
  { name: 'USB-C Hub Multi-Port', description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.', price: 49.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500', stock: 200, rating: 4.3, numReviews: 294 },
  { name: 'Wireless Charging Pad', description: 'Fast wireless charging pad compatible with all Qi-enabled devices.', price: 34.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1591290619762-a5d4caacd9df?w=500', stock: 150, rating: 4.2, numReviews: 178 },
  { name: 'Portable Power Bank 20000mAh', description: 'High-capacity power bank with fast charging and multiple USB ports.', price: 45.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1609592043337-1173f1e93e0c?w=500', stock: 90, rating: 4.5, numReviews: 267 },
  { name: 'LED Ring Light', description: 'Adjustable LED ring light perfect for photography, videos, and streaming.', price: 79.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1599386703997-b8fcf89f51cf?w=500', stock: 60, rating: 4.6, numReviews: 143 },
  { name: 'Laptop Stand Aluminum', description: 'Ergonomic aluminum laptop stand with adjustable height and ventilation.', price: 39.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=500', stock: 110, rating: 4.4, numReviews: 189 },
  { name: 'Webcam 1080p HD', description: 'Full HD webcam with auto-focus and built-in microphone for video calls.', price: 69.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=500', stock: 75, rating: 4.3, numReviews: 211 },
  { name: 'Smart Home Hub', description: 'Central smart home hub compatible with Alexa, Google Home, and more.', price: 129.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1558089687-f282b793b37d?w=500', stock: 40, rating: 4.6, numReviews: 98 },

  // Fashion
  { name: 'Designer Leather Bag', description: 'Elegant leather handbag with premium craftsmanship and timeless design.', price: 189.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', stock: 25, rating: 4.8, numReviews: 132 },
  { name: 'Athletic Sneakers', description: 'Comfortable athletic sneakers with breathable mesh and cushioned sole.', price: 129.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', stock: 65, rating: 4.7, numReviews: 289 },
  { name: 'Designer Sunglasses', description: 'Stylish designer sunglasses with UV protection and polarized lenses.', price: 159.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', stock: 50, rating: 4.6, numReviews: 176 },
  { name: 'Leather Wallet Classic', description: 'Genuine leather wallet with RFID protection and multiple card slots.', price: 49.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', stock: 100, rating: 4.5, numReviews: 245 },
  { name: 'Silk Scarf Luxury', description: 'Premium silk scarf with elegant patterns and soft texture.', price: 79.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1601924357840-3095f2c5be1b?w=500', stock: 40, rating: 4.7, numReviews: 87 },
  { name: 'Denim Jacket Vintage', description: 'Classic vintage-style denim jacket with distressed finish.', price: 89.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', stock: 55, rating: 4.6, numReviews: 198 },
  { name: 'Running Shoes Pro', description: 'Professional running shoes with advanced cushioning and grip.', price: 149.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500', stock: 70, rating: 4.8, numReviews: 312 },
  { name: 'Crossbody Bag Mini', description: 'Compact crossbody bag perfect for everyday use and travel.', price: 69.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500', stock: 90, rating: 4.4, numReviews: 154 },
  { name: 'Wool Beanie Winter', description: 'Warm wool beanie with soft lining, perfect for cold weather.', price: 24.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500', stock: 150, rating: 4.3, numReviews: 267 },
  { name: 'Leather Belt Classic', description: 'Genuine leather belt with polished buckle and adjustable fit.', price: 39.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=500', stock: 120, rating: 4.5, numReviews: 189 },
  { name: 'Canvas Backpack', description: 'Durable canvas backpack with laptop compartment and multiple pockets.', price: 79.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', stock: 80, rating: 4.6, numReviews: 223 },
  { name: 'Sports Watch Digital', description: 'Digital sports watch with stopwatch, alarm, and water resistance.', price: 54.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500', stock: 95, rating: 4.4, numReviews: 167 },
  { name: 'Aviator Sunglasses', description: 'Classic aviator sunglasses with metal frame and gradient lenses.', price: 119.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', stock: 60, rating: 4.7, numReviews: 145 },

  // Home & Living
  { name: 'Modern Table Lamp', description: 'Contemporary table lamp with adjustable brightness and USB charging port.', price: 79.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', stock: 45, rating: 4.6, numReviews: 98 },
  { name: 'Throw Pillow Set', description: 'Set of 4 decorative throw pillows with premium fabric and hidden zippers.', price: 59.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500', stock: 70, rating: 4.5, numReviews: 156 },
  { name: 'Wall Art Canvas Print', description: 'Large canvas wall art print with modern abstract design.', price: 89.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500', stock: 35, rating: 4.7, numReviews: 87 },
  { name: 'Aromatherapy Diffuser', description: 'Ultrasonic aromatherapy diffuser with LED lights and timer settings.', price: 34.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1601046668428-94ea13437736?w=500', stock: 120, rating: 4.4, numReviews: 234 },
  { name: 'Bamboo Storage Organizer', description: 'Eco-friendly bamboo storage organizer for kitchen or bathroom.', price: 44.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500', stock: 85, rating: 4.5, numReviews: 178 },
  { name: 'Memory Foam Bath Mat', description: 'Ultra-soft memory foam bath mat with non-slip backing.', price: 29.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500', stock: 150, rating: 4.3, numReviews: 289 },
  { name: 'Ceramic Vase Set', description: 'Set of 3 decorative ceramic vases in modern minimalist style.', price: 49.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500', stock: 60, rating: 4.6, numReviews: 124 },
  { name: 'Blackout Curtains', description: 'Thermal insulated blackout curtains with grommet top, set of 2.', price: 64.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=500', stock: 75, rating: 4.7, numReviews: 201 },
  { name: 'Coffee Table Modern', description: 'Sleek modern coffee table with glass top and metal frame.', price: 199.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500', stock: 20, rating: 4.8, numReviews: 67 },
  { name: 'Wall Mirror Round', description: 'Large round wall mirror with metal frame, perfect for any room.', price: 79.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=500', stock: 40, rating: 4.5, numReviews: 143 },
  { name: 'Area Rug 5x7', description: 'Soft area rug with modern geometric pattern, 5x7 feet.', price: 129.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=500', stock: 30, rating: 4.6, numReviews: 98 },
  { name: 'Floor Lamp Arc', description: 'Contemporary arc floor lamp with adjustable height and marble base.', price: 149.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1567225591450-b55c0e9337a6?w=500', stock: 25, rating: 4.7, numReviews: 89 },
  { name: 'Planter Set Indoor', description: 'Set of 3 ceramic planters with drainage holes and saucers.', price: 39.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', stock: 100, rating: 4.4, numReviews: 187 },

  // Sports
  { name: 'Yoga Mat Premium', description: 'Extra thick yoga mat with non-slip surface and carrying strap.', price: 49.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', stock: 80, rating: 4.7, numReviews: 234 },
  { name: 'Dumbbell Set Adjustable', description: 'Adjustable dumbbell set with multiple weight options, 5-50 lbs.', price: 199.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1638805981949-d062bb7b6f47?w=500', stock: 35, rating: 4.8, numReviews: 156 },
  { name: 'Resistance Bands Set', description: 'Set of 5 resistance bands with different resistance levels and handles.', price: 29.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500', stock: 120, rating: 4.5, numReviews: 298 },
  { name: 'Foam Roller Massage', description: 'High-density foam roller for muscle recovery and massage therapy.', price: 24.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500', stock: 150, rating: 4.4, numReviews: 267 },
  { name: 'Water Bottle Insulated', description: 'Stainless steel insulated water bottle keeps drinks cold for 24 hours.', price: 34.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', stock: 200, rating: 4.6, numReviews: 401 },
  { name: 'Jump Rope Speed', description: 'Professional speed jump rope with adjustable length and ball bearings.', price: 19.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500', stock: 180, rating: 4.3, numReviews: 189 },
  { name: 'Gym Bag Duffel', description: 'Spacious gym duffel bag with shoe compartment and multiple pockets.', price: 49.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', stock: 70, rating: 4.5, numReviews: 178 },
  { name: 'Boxing Gloves Pro', description: 'Professional boxing gloves with wrist support and shock absorption.', price: 79.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1587317474328-37e9e81509b8?w=500', stock: 45, rating: 4.7, numReviews: 134 },
  { name: 'Tennis Racket Carbon', description: 'Lightweight carbon fiber tennis racket for advanced players.', price: 149.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1617883861744-ddde82fa6b3c?w=500', stock: 30, rating: 4.8, numReviews: 87 },
  { name: 'Yoga Block Set', description: 'Set of 2 high-density foam yoga blocks for support and alignment.', price: 24.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', stock: 110, rating: 4.4, numReviews: 198 },

  // Books
  { name: 'The Art of Mindfulness', description: 'Bestselling guide to practicing mindfulness in daily life.', price: 19.99, category: 'Books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', stock: 100, rating: 4.8, numReviews: 567 },
  { name: 'Coding for Beginners', description: 'Comprehensive introduction to programming and software development.', price: 34.99, category: 'Books', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500', stock: 80, rating: 4.7, numReviews: 423 },
  { name: 'The Entrepreneur\'s Guide', description: 'Essential strategies for starting and growing a successful business.', price: 29.99, category: 'Books', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500', stock: 90, rating: 4.6, numReviews: 312 },
  { name: 'Healthy Cooking Cookbook', description: 'Collection of nutritious and delicious recipes for every meal.', price: 24.99, category: 'Books', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500', stock: 70, rating: 4.5, numReviews: 289 },
  { name: 'World History Encyclopedia', description: 'Comprehensive guide to world history from ancient to modern times.', price: 49.99, category: 'Books', image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500', stock: 50, rating: 4.9, numReviews: 178 },
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});

    // Insert new products
    const createdProducts = await Product.insertMany(products);

    console.log(`✅ ${createdProducts.length} products seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
