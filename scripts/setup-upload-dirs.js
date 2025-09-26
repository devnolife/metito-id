const fs = require('fs');
const path = require('path');

const uploadDirs = [
  'public/images/products',
  'public/images/gallery',
  'public/images/users',
  'public/images/testimonials',
  'public/images/blog',
  'public/certificates',
  'public/documents/products'
];

function ensureDirectoryExists(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating directory: ${fullPath}`);
    fs.mkdirSync(fullPath, { recursive: true });
    
    // Create .gitkeep file to ensure directory is tracked in git
    const gitkeepPath = path.join(fullPath, '.gitkeep');
    fs.writeFileSync(gitkeepPath, '');
    console.log(`Created .gitkeep in: ${dirPath}`);
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
}

console.log('Setting up upload directories...');

uploadDirs.forEach(ensureDirectoryExists);

console.log('✅ All upload directories are ready!');