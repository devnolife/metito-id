import fs from 'fs';
import path from 'path';

async function testFileSystem() {
  console.log('📁 Testing File System and Upload Directories...\n');

  // Directories to check
  const requiredDirs = [
    'public/images',
    'public/images/products',
    'public/images/gallery',
    'public/images/blog',
    'public/images/testimonials',
    'public/images/users',
    'public/documents',
    'public/documents/products',
    'public/certificates'
  ];

  // Files to check
  const requiredFiles = [
    'public/placeholder.jpg',
    'public/placeholder.svg',
    'public/placeholder-logo.png',
    'public/placeholder-logo.svg',
    'public/placeholder-user.jpg',
    'public/images/logo.png'
  ];

  console.log('1. Checking required directories...');
  let dirErrors = 0;

  for (const dir of requiredDirs) {
    try {
      const fullPath = path.join(process.cwd(), dir);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        // Check if writable
        try {
          fs.accessSync(fullPath, fs.constants.W_OK);
          console.log(`✅ ${dir} - exists and writable`);
        } catch {
          console.log(`⚠️  ${dir} - exists but not writable`);
          dirErrors++;
        }
      } else {
        console.log(`❌ ${dir} - exists but not a directory`);
        dirErrors++;
      }
    } catch {
      console.log(`❌ ${dir} - does not exist`);
      dirErrors++;
    }
  }

  console.log('\n2. Checking required files...');
  let fileErrors = 0;

  for (const file of requiredFiles) {
    try {
      const fullPath = path.join(process.cwd(), file);
      const stats = fs.statSync(fullPath);

      if (stats.isFile()) {
        const sizeKB = Math.round(stats.size / 1024);
        console.log(`✅ ${file} - exists (${sizeKB} KB)`);
      } else {
        console.log(`❌ ${file} - exists but not a file`);
        fileErrors++;
      }
    } catch {
      console.log(`❌ ${file} - does not exist`);
      fileErrors++;
    }
  }

  console.log('\n3. Checking existing uploaded files...');

  // Check products images
  try {
    const productsDir = path.join(process.cwd(), 'public/images/products');
    const productFiles = fs.readdirSync(productsDir);
    console.log(`✅ Product images: ${productFiles.length} files`);

    if (productFiles.length > 0) {
      console.log(`   Latest: ${productFiles.slice(-3).join(', ')}`);
    }
  } catch (error) {
    console.log(`❌ Error reading product images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Check gallery images
  try {
    const galleryDir = path.join(process.cwd(), 'public/images/gallery');
    const galleryFiles = fs.readdirSync(galleryDir);
    console.log(`✅ Gallery images: ${galleryFiles.length} files`);
  } catch (error) {
    console.log(`❌ Error reading gallery images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Check certificates
  try {
    const certDir = path.join(process.cwd(), 'public/certificates');
    const certFiles = fs.readdirSync(certDir);
    console.log(`✅ Certificates: ${certFiles.length} files`);
  } catch (error) {
    console.log(`❌ Error reading certificates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  console.log('\n4. Testing file permissions...');

  // Test write permission by creating a temp file
  try {
    const tempFile = path.join(process.cwd(), 'public/images/test-write.tmp');
    fs.writeFileSync(tempFile, 'test');
    fs.unlinkSync(tempFile);
    console.log('✅ Write permissions - OK');
  } catch (error) {
    console.log(`❌ Write permissions - Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  console.log('\n5. Disk space check...');

  try {
    const publicDir = path.join(process.cwd(), 'public');
    const stats = fs.statSync(publicDir);

    // Calculate total size of public directory
    function calculateDirSize(dirPath: string): number {
      let totalSize = 0;

      try {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            totalSize += calculateDirSize(filePath);
          } else {
            totalSize += stat.size;
          }
        }
      } catch {
        // Ignore errors for individual files
      }

      return totalSize;
    }

    const totalSize = calculateDirSize(publicDir);
    const sizeMB = Math.round(totalSize / (1024 * 1024));

    console.log(`✅ Public directory size: ${sizeMB} MB`);

    if (sizeMB > 100) {
      console.log('⚠️  Public directory is quite large (>100MB)');
    }

  } catch (error) {
    console.log(`❌ Error calculating disk usage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Summary
  console.log('\n📊 FILE SYSTEM TEST SUMMARY');
  console.log('='.repeat(40));
  console.log(`Directory errors: ${dirErrors}`);
  console.log(`File errors: ${fileErrors}`);

  if (dirErrors === 0 && fileErrors === 0) {
    console.log('✅ All file system tests passed!');
  } else {
    console.log('❌ Some file system issues found');

    if (dirErrors > 0) {
      console.log('\n💡 To fix missing directories, run:');
      console.log('   npm run setup-dirs');
    }
  }
}

// Run the test
testFileSystem().catch(console.error); 
