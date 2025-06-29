import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection and Schema...\n');

  try {
    // Test connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test each table
    const tables = [
      { name: 'User', model: prisma.user },
      { name: 'Product', model: prisma.product },
      { name: 'Category', model: prisma.category },
      { name: 'Service', model: prisma.service },
      { name: 'BlogPost', model: prisma.blogPost },
      { name: 'Gallery', model: prisma.gallery },
      { name: 'Testimonial', model: prisma.testimonial },
      { name: 'Certification', model: prisma.certification },
      { name: 'Contact', model: prisma.contact },
      { name: 'Newsletter', model: prisma.newsletter },
      { name: 'Cart', model: prisma.cart },
      { name: 'CartItem', model: prisma.cartItem },
      { name: 'Setting', model: prisma.setting },
      { name: 'Image', model: prisma.image }
    ];

    console.log('\n2. Testing table access...');

    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(`✅ ${table.name}: ${count} records`);
      } catch (error) {
        console.log(`❌ ${table.name}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Test admin user exists
    console.log('\n3. Checking admin user...');
    try {
      const adminUser = await prisma.user.findFirst({
        where: { role: 'admin' }
      });

      if (adminUser) {
        console.log(`✅ Admin user found: ${adminUser.email}`);
      } else {
        console.log('⚠️  No admin user found');
      }
    } catch (error) {
      console.log(`❌ Error checking admin user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test settings
    console.log('\n4. Checking settings...');
    try {
      const settings = await prisma.setting.findMany();
      console.log(`✅ Settings found: ${settings.length} settings`);

      if (settings.length > 0) {
        console.log('   Settings keys:', settings.map(s => s.key).join(', '));
      }
    } catch (error) {
      console.log(`❌ Error checking settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test recent data
    console.log('\n5. Checking recent data...');
    try {
      const recentProducts = await prisma.product.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      });
      console.log(`✅ Recent products: ${recentProducts.length}`);

      const recentContacts = await prisma.contact.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      });
      console.log(`✅ Recent contacts: ${recentContacts.length}`);
    } catch (error) {
      console.log(`❌ Error checking recent data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    console.log('\n✅ Database test completed successfully!');

  } catch (error) {
    console.log(`❌ Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection().catch(console.error); 
