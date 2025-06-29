// Quick API Test - Test endpoints penting saja
const BASE_URL = 'http://localhost:3000';

interface QuickTestResult {
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  error?: string;
}

// Test endpoints yang paling penting
const quickTests = [
  { endpoint: '/api/settings', method: 'GET', description: 'Settings API' },
  { endpoint: '/api/products', method: 'GET', description: 'Products API' },
  { endpoint: '/api/categories', method: 'GET', description: 'Categories API' },
  { endpoint: '/api/services', method: 'GET', description: 'Services API' },
  { endpoint: '/api/blog', method: 'GET', description: 'Blog API' },
  { endpoint: '/api/gallery', method: 'GET', description: 'Gallery API' },
  { endpoint: '/api/testimonials', method: 'GET', description: 'Testimonials API' },
  { endpoint: '/api/certifications', method: 'GET', description: 'Certifications API' },
  {
    endpoint: '/api/auth/login', method: 'POST', description: 'Auth Login',
    body: { email: 'admin@metito.id', password: 'admin123' }
  },
  {
    endpoint: '/api/contact', method: 'POST', description: 'Contact Form',
    body: { name: 'Test', email: 'test@test.com', subject: 'Test', message: 'Test message' }
  },
  {
    endpoint: '/api/newsletter', method: 'POST', description: 'Newsletter',
    body: { email: 'test@test.com' }
  }
];

async function runQuickTest(): Promise<void> {
  console.log('🚀 Running Quick API Tests...\n');

  const results: QuickTestResult[] = [];

  for (const test of quickTests) {
    try {
      const options: RequestInit = {
        method: test.method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(`${BASE_URL}${test.endpoint}`, options);
      const success = response.status < 400;

      results.push({
        endpoint: test.endpoint,
        method: test.method,
        status: response.status,
        success,
        error: success ? undefined : `HTTP ${response.status}`
      });

      const icon = success ? '✅' : '❌';
      console.log(`${icon} ${test.method} ${test.endpoint} - ${response.status} - ${test.description}`);

    } catch (error) {
      results.push({
        endpoint: test.endpoint,
        method: test.method,
        status: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      });

      console.log(`❌ ${test.method} ${test.endpoint} - Connection failed - ${test.description}`);
    }
  }

  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.length - passed;

  console.log('\n📊 QUICK TEST SUMMARY');
  console.log('='.repeat(30));
  console.log(`Total: ${results.length}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.method} ${r.endpoint}: ${r.error}`);
    });
  }
}

// Check server first
async function checkServer(): Promise<boolean> {
  try {
    await fetch(BASE_URL);
    return true;
  } catch {
    return false;
  }
}

checkServer().then(isRunning => {
  if (!isRunning) {
    console.log('❌ Server is not running on http://localhost:3000');
    console.log('Please start the server with: npm run dev');
    process.exit(1);
  }

  runQuickTest().catch(console.error);
}); 
