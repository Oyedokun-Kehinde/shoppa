const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteTestOrders() {
  try {
    console.log('🗑️  Deleting all test orders...');
    
    // Delete all orders (cascade will delete order_items too)
    const result = await prisma.order.deleteMany({});
    
    console.log(`✅ Deleted ${result.count} orders`);
    console.log('✅ Database cleaned!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteTestOrders();
