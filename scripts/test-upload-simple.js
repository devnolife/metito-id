const fs = require('fs');
const path = require('path');

// Test upload API
async function testUpload() {
  try {
    console.log('Testing upload API...');

    // Create a simple test image
    const testImagePath = path.join(__dirname, 'test-image.txt');
    fs.writeFileSync(testImagePath, 'This is a test image content');

    const formData = new FormData();
    const file = new File(['This is a test image content'], 'test-image.txt', { type: 'text/plain' });
    formData.append('file', file);
    formData.append('category', 'products');

    console.log('Sending request to /api/upload...');

    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const result = await response.json();
    console.log('Success response:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Check if upload directories exist
function checkDirectories() {
  console.log('\nChecking upload directories...');

  const dirs = [
    'public/images/products',
    'public/images/gallery',
    'public/images/users',
    'public/images/testimonials',
    'public/images/blog',
    'public/certificates',
    'public/documents/products'
  ];

  dirs.forEach(dir => {
    const exists = fs.existsSync(dir);
    console.log(`${dir}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);

    if (!exists) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  ✅ Created ${dir}`);
      } catch (err) {
        console.error(`  ❌ Failed to create ${dir}:`, err.message);
      }
    }
  });
}

// Check database connection
async function checkDatabase() {
  console.log('\nChecking database connection...');

  try {
    const response = await fetch('http://localhost:3000/api/auth/me', {
      credentials: 'include'
    });

    console.log('Auth check status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Auth data:', data);
    } else {
      console.log('Auth failed - this might be expected if not logged in');
    }
  } catch (error) {
    console.error('Database check failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('=== Upload API Debug Test ===\n');

  checkDirectories();
  await checkDatabase();
  await testUpload();

  console.log('\n=== Test Complete ===');
}

runTests(); 
