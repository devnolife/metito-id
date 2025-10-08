const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function fixProductImages() {
  try {
    console.log('🔍 Checking product images...');

    // Get all products with images
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        images: true
      }
    });

    console.log(`Found ${products.length} products`);

    // Get all actual image files
    const imageDir = path.join(process.cwd(), 'public', 'images', 'products');
    const actualFiles = fs.readdirSync(imageDir)
      .filter(file => file.match(/\.(jpg|jpeg|png|webp|gif)$/i))
      .filter(file => !file.startsWith('.'));

    console.log(`Found ${actualFiles.length} actual image files:`, actualFiles.slice(0, 5), '...');

    for (const product of products) {
      if (product.images && product.images.length > 0) {
        console.log(`\n📝 Checking product: ${product.name}`);
        console.log(`Current images: ${product.images}`);

        // Check which images actually exist
        const validImages = [];
        const invalidImages = [];

        for (const imagePath of product.images) {
          // Extract filename from path like /api/images/products/filename.jpg
          const filename = imagePath.split('/').pop();
          const fullPath = path.join(imageDir, filename);

          if (fs.existsSync(fullPath)) {
            validImages.push(imagePath);
            console.log(`  ✅ Valid: ${filename}`);
          } else {
            invalidImages.push(imagePath);
            console.log(`  ❌ Missing: ${filename}`);
          }
        }

        // If no valid images, assign a random existing image or placeholder
        if (validImages.length === 0 && actualFiles.length > 0) {
          // Use the most recent uploaded image
          const latestImage = actualFiles
            .filter(f => f.match(/^\d+_/)) // Files with timestamp prefix
            .sort()
            .pop() || actualFiles[0];

          const newImagePath = `/api/images/products/${latestImage}`;
          validImages.push(newImagePath);
          console.log(`  🔄 Assigned new image: ${latestImage}`);
        }

        // Update product if there are changes
        if (invalidImages.length > 0 || validImages.length !== product.images.length) {
          await prisma.product.update({
            where: { id: product.id },
            data: { images: validImages }
          });
          console.log(`  💾 Updated product images`);
        }
      }
    }

    console.log('\n✅ Image cleanup complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixProductImages();
