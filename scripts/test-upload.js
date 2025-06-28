const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await db.$connect();
    console.log('✅ Database connection successful');
    
    // Test Image model
    const imageCount = await db.image.count();
    console.log(`✅ Image table accessible. Count: ${imageCount}`);
    
    // Test User model
    const userCount = await db.user.count();
    console.log(`✅ User table accessible. Count: ${userCount}`);
    
    await db.$disconnect();
    console.log('✅ Database test completed successfully');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    await db.$disconnect();
  }
}

testDatabaseConnection(); 
