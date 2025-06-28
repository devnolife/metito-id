const fs = require('fs');
const path = require('path');

// Create a simple test image
const testImagePath = path.join(__dirname, 'test-image.txt');
fs.writeFileSync(testImagePath, 'This is a test file for upload testing');

async function testUploadAPI() {
  try {
    console.log('Testing upload API...');

    // Create a simple test file
    const testFile = fs.createReadStream(testImagePath);

    const formData = new FormData();
    formData.append('file', testFile, 'test-image.txt');
    formData.append('category', 'products');
    formData.append('productId', 'test-product-123');

    console.log('FormData created with test file');
    console.log('Note: This test requires a running server and authentication');
    console.log('To test manually:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Login as admin');
    console.log('3. Try uploading a file through the UI');
    console.log('4. Check the browser console for detailed error messages');

  } catch (error) {
    console.error('Test setup error:', error);
  } finally {
    // Clean up test file
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  }
}

testUploadAPI(); 
