const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    // Check products with images
    const product = await prisma.product.findFirst({
      where: { 
        images: { 
          isEmpty: false 
        } 
      },
      select: { 
        id: true, 
        name: true, 
        images: true 
      }
    });
    
    console.log('Product with images:', JSON.stringify(product, null, 2));
    
    // Also check the Image table
    const imageRecords = await prisma.image.findMany({
      where: { imageType: 'PRODUCT' },
      select: {
        id: true,
        fileName: true,
        filePath: true,
        productId: true
      },
      take: 5
    });
    
    console.log('\nImage records:', JSON.stringify(imageRecords, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
})();