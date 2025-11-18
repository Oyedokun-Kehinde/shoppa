const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shoppa.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@shoppa.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create test user
  const testUserPassword = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@test.com',
      password: testUserPassword,
      role: 'user',
    },
  });
  console.log('✅ Created test user:', testUser.email);

  // Create sample products with detailed specifications
  const products = [
    {
      name: 'Premium Wireless Noise-Canceling Headphones',
      slug: 'premium-wireless-noise-canceling-headphones',
      description: 'Experience studio-quality sound with advanced active noise cancellation technology. These premium wireless headphones deliver exceptional audio clarity and comfort for extended listening sessions. Features 40mm drivers, Bluetooth 5.0, and up to 30 hours of battery life. Perfect for music lovers, travelers, and professionals who demand the best in audio quality.',
      price: 125000,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      stock: 50,
      rating: 4.5,
      numReviews: 12,
    },
    {
      name: 'Advanced Fitness Smart Watch',
      slug: 'advanced-fitness-smart-watch',
      description: 'Track your health and fitness goals with this feature-packed smartwatch. Includes heart rate monitoring, sleep tracking, GPS, water resistance up to 50m, and over 100 workout modes. Compatible with iOS and Android. Built-in NFC for contactless payments. 1.4" AMOLED display with customizable watch faces. Battery life up to 7 days on a single charge.',
      price: 185000,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      stock: 30,
      rating: 4.7,
      numReviews: 24,
    },
    {
      name: 'Classic Genuine Leather Jacket',
      slug: 'classic-genuine-leather-jacket',
      description: 'Elevate your style with this timeless genuine leather jacket crafted from premium full-grain cowhide. Features asymmetrical zipper closure, adjustable waist belts, multiple pockets, and quilted lining for warmth. Available in classic black and brown. Suitable for all seasons. Professional leather treatment ensures durability and develops a unique patina over time.',
      price: 245000,
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
      stock: 20,
      rating: 4.8,
      numReviews: 15,
    },
    {
      name: 'Professional Running Shoes',
      slug: 'professional-running-shoes',
      description: 'Engineered for performance and comfort, these professional running shoes feature responsive cushioning, breathable mesh upper, and durable rubber outsole with multi-directional traction. Reflective elements for visibility in low light. Ortholite insole provides superior moisture management and long-term cushioning. Ideal for road running, jogging, and gym workouts.',
      price: 75000,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      stock: 100,
      rating: 4.6,
      numReviews: 45,
    },
    {
      name: 'Smart Programmable Coffee Maker',
      slug: 'smart-programmable-coffee-maker',
      description: 'Start your day right with this intelligent coffee maker featuring WiFi connectivity and smartphone app control. Brew up to 12 cups with precise temperature control (195°F-205°F). Programmable 24-hour timer, auto-shutoff, and keep-warm function. Permanent gold-tone filter and charcoal water filter included. Compatible with ground coffee and reusable K-cup pods.',
      price: 95000,
      category: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6',
      stock: 40,
      rating: 4.4,
      numReviews: 18,
    },
    {
      name: 'Premium Non-Slip Yoga Mat',
      slug: 'premium-non-slip-yoga-mat',
      description: 'Practice with confidence on this eco-friendly TPE yoga mat. 6mm thick cushioning provides optimal support while maintaining stability. Double-sided non-slip texture ensures grip in any pose. Lightweight and portable with included carrying strap. Free from PVC, latex, and harmful chemicals. Dimensions: 72" x 24". Available in multiple colors. Easy to clean and maintain.',
      price: 28500,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
      stock: 75,
      rating: 4.3,
      numReviews: 8,
    },
    {
      name: 'Modern LED Desk Lamp with USB Charging',
      slug: 'modern-led-desk-lamp-with-usb-charging',
      description: 'Illuminate your workspace with this sleek LED desk lamp featuring 5 color temperatures (3000K-6500K) and 5 brightness levels. Touch-sensitive controls, flexible gooseneck design, and memory function. Built-in USB charging port for your devices. Eye-care technology reduces flicker and blue light. Energy-efficient LEDs last up to 50,000 hours. Perfect for reading, studying, and working.',
      price: 42000,
      category: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
      stock: 60,
      rating: 4.5,
      numReviews: 10,
    },
    {
      name: 'Travel Laptop Backpack with USB Port',
      slug: 'travel-laptop-backpack-with-usb-port',
      description: 'Stay organized on the go with this multi-functional travel backpack. Features dedicated padded laptop compartment (fits up to 17" laptops), multiple storage pockets, anti-theft design with hidden zippers, and built-in USB charging port. Water-resistant polyester fabric, ergonomic padded straps, and luggage strap. Capacity: 35L. Ideal for business, travel, and daily use.',
      price: 55000,
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
      stock: 45,
      rating: 4.6,
      numReviews: 22,
    },
  ];

  console.log('\n📦 Creating products...');
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    console.log(`  ✅ ${product.name}`);
  }

  // Create sample blog posts
  const blogPosts = [
    {
      title: 'Top 10 Tech Gadgets of 2024',
      slug: 'top-10-tech-gadgets-2024',
      excerpt: 'Discover the most innovative tech gadgets that are revolutionizing the market this year.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'Technology',
      author: 'John Doe',
      featuredImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      published: true,
    },
    {
      title: 'Fashion Trends for Spring 2024',
      slug: 'fashion-trends-spring-2024',
      excerpt: 'Stay ahead with the latest fashion trends that are taking over this spring season.',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      category: 'Fashion',
      author: 'Jane Smith',
      featuredImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
      published: true,
    },
  ];

  console.log('\n📝 Creating blog posts...');
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
    console.log(`  ✅ ${post.title}`);
  }

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - ${await prisma.user.count()} users`);
  console.log(`  - ${await prisma.product.count()} products`);
  console.log(`  - ${await prisma.blogPost.count()} blog posts`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
