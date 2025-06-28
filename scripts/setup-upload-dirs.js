const fs = require('fs');
const path = require('path');

// Upload directories that need to be created
const uploadDirs = [
  'public/images/products',
  'public/images/gallery',
  'public/images/users',
  'public/images/testimonials',
  'public/images/blog',
  'public/certificates',
  'public/documents/products'
];

console.log('Setting up upload directories...');

uploadDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);

  if (!fs.existsSync(fullPath)) {
    try {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } catch (error) {
      console.error(`❌ Failed to create directory: ${dir}`, error.message);
    }
  } else {
    console.log(`✅ Directory already exists: ${dir}`);
  }
});

console.log('Upload directories setup complete!'); 
