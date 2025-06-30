// Test API endpoints
async function testProductAPI() {
  const baseUrl = 'http://localhost:3000/api';

  console.log('🧪 Testing Product Management API...\n');

  try {
    // Test 1: Get Categories
    console.log('1. Testing GET /api/categories...');
    const categoriesResponse = await fetch(`${baseUrl}/categories`);
    const categoriesData = await categoriesResponse.json();

    if (categoriesResponse.ok) {
      console.log('✅ Categories loaded successfully');
      console.log(`   Found ${categoriesData.data?.length || 0} categories`);
      if (categoriesData.data?.length > 0) {
        console.log(`   First category: ${categoriesData.data[0].name}`);
      }
    } else {
      console.log('❌ Failed to load categories:', categoriesData.message);
    }

    // Test 2: Get Products
    console.log('\n2. Testing GET /api/products...');
    const productsResponse = await fetch(`${baseUrl}/products`);
    const productsData = await productsResponse.json();

    if (productsResponse.ok) {
      console.log('✅ Products loaded successfully');
      console.log(`   Found ${productsData.data?.products?.length || 0} products`);
      if (productsData.data?.products?.length > 0) {
        console.log(`   First product: ${productsData.data.products[0].name}`);
      }
    } else {
      console.log('❌ Failed to load products:', productsData.message);
    }

    // Test 3: Test Authentication
    console.log('\n3. Testing Authentication...');
    const authResponse = await fetch(`${baseUrl}/auth/me`, {
      credentials: 'include'
    });

    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Authentication check passed');
      console.log(`   User role: ${authData.data?.role}`);
    } else {
      console.log('⚠️  Authentication required (this is expected if not logged in)');
    }

    console.log('\n🎉 API Test Complete!');
    console.log('\n📝 Next Steps:');
    console.log('1. Make sure you are logged in as admin');
    console.log('2. Try adding a product through the UI');
    console.log('3. Check if the product appears in the list');
    console.log('4. Try editing and deleting products');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the development server is running (npm run dev)');
    console.log('2. Check if the database is connected');
    console.log('3. Verify that the seed data is loaded');
  }
}

// Run the test
testProductAPI(); 
