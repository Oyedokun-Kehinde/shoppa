const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updatePrices() {
  try {
    console.log('💰 Updating product prices to Nigerian Naira...\n');

    const updates = [
      { slug: 'premium-wireless-noise-canceling-headphones', price: 125000 },
      { slug: 'wireless-headphones', price: 125000 }, // Old slug
      { slug: 'advanced-fitness-smart-watch', price: 185000 },
      { slug: 'smart-watch', price: 185000 }, // Old slug
      { slug: 'classic-genuine-leather-jacket', price: 245000 },
      { slug: 'leather-jacket', price: 245000 }, // Old slug
      { slug: 'professional-running-shoes', price: 75000 },
      { slug: 'running-shoes', price: 75000 }, // Old slug
      { slug: 'smart-programmable-coffee-maker', price: 95000 },
      { slug: 'coffee-maker', price: 95000 }, // Old slug
      { slug: 'premium-non-slip-yoga-mat', price: 28500 },
      { slug: 'yoga-mat', price: 28500 }, // Old slug
      { slug: 'modern-led-desk-lamp-with-usb-charging', price: 42000 },
      { slug: 'desk-lamp', price: 42000 }, // Old slug
      { slug: 'travel-laptop-backpack-with-usb-port', price: 55000 },
      { slug: 'backpack', price: 55000 }, // Old slug
    ];

    for (const { slug, price } of updates) {
      try {
        const result = await prisma.product.updateMany({
          where: { slug },
          data: { price }
        });
        
        if (result.count > 0) {
          console.log(`✅ ${slug}: ₦${price.toLocaleString()}`);
        }
      } catch (error) {
        // Slug might not exist, continue
      }
    }

    console.log('\n🎉 All product prices updated!');
    
    // Show summary
    const products = await prisma.product.findMany({
      select: { name: true, price: true }
    });
    
    console.log('\n📊 Current prices:');
    products.forEach(p => {
      console.log(`  ${p.name}: ₦${parseFloat(p.price).toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePrices();
