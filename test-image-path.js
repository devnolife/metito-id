const fs = require('fs');
const path = require('path');

// Test image API path construction
const imagePath = 'products/1759918120353_pylm40il2bk.jpeg';
const fullPath = path.join(process.cwd(), 'public', 'images', imagePath);

console.log('Image path:', imagePath);
console.log('Full path:', fullPath);
console.log('File exists:', fs.existsSync(fullPath));

if (fs.existsSync(fullPath)) {
  const stats = fs.statSync(fullPath);
  console.log('File size:', stats.size);
  console.log('File type: image/jpeg (based on extension)');
}

// Test path parsing like the API does
const pathParts = imagePath.split('/');
console.log('Path parts:', pathParts);
console.log('Reconstructed path:', pathParts.join('/'));