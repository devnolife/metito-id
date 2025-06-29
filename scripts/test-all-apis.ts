import fs from 'fs';
import path from 'path';

// Base URL untuk testing
const BASE_URL = 'http://localhost:3000';

// Interface untuk hasil testing
interface TestResult {
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  message: string;
  responseTime: number;
  error?: string;
}

// Interface untuk test case
interface TestCase {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  description: string;
  requiresAuth?: boolean;
}

class APITester {
  private results: TestResult[] = [];
  private authToken: string | null = null;

  // Test cases untuk semua API endpoints
  private testCases: TestCase[] = [
    // Auth endpoints
    {
      endpoint: '/api/auth/register',
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      },
      description: 'Register new user'
    },
    {
      endpoint: '/api/auth/login',
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123'
      },
      description: 'Login user'
    },
    {
      endpoint: '/api/auth/me',
      method: 'GET',
      description: 'Get current user profile',
      requiresAuth: true
    },
    {
      endpoint: '/api/auth/logout',
      method: 'POST',
      description: 'Logout user',
      requiresAuth: true
    },

    // Products endpoints
    {
      endpoint: '/api/products',
      method: 'GET',
      description: 'Get all products'
    },
    {
      endpoint: '/api/products',
      method: 'POST',
      body: {
        name: 'Test Product',
        description: 'Test product description',
        price: 100000,
        category: 'test-category',
        images: [],
        specifications: {},
        inStock: true
      },
      description: 'Create new product',
      requiresAuth: true
    },
    {
      endpoint: '/api/products/1',
      method: 'GET',
      description: 'Get product by ID'
    },
    {
      endpoint: '/api/products/1',
      method: 'PUT',
      body: {
        name: 'Updated Test Product',
        description: 'Updated description',
        price: 150000
      },
      description: 'Update product',
      requiresAuth: true
    },
    {
      endpoint: '/api/products/1',
      method: 'DELETE',
      description: 'Delete product',
      requiresAuth: true
    },

    // Categories endpoints
    {
      endpoint: '/api/categories',
      method: 'GET',
      description: 'Get all categories'
    },
    {
      endpoint: '/api/categories',
      method: 'POST',
      body: {
        name: 'Test Category',
        description: 'Test category description',
        slug: 'test-category'
      },
      description: 'Create new category',
      requiresAuth: true
    },

    // Services endpoints
    {
      endpoint: '/api/services',
      method: 'GET',
      description: 'Get all services'
    },
    {
      endpoint: '/api/services',
      method: 'POST',
      body: {
        title: 'Test Service',
        description: 'Test service description',
        features: ['Feature 1', 'Feature 2'],
        price: 500000
      },
      description: 'Create new service',
      requiresAuth: true
    },

    // Blog endpoints
    {
      endpoint: '/api/blog',
      method: 'GET',
      description: 'Get all blog posts'
    },
    {
      endpoint: '/api/blog',
      method: 'POST',
      body: {
        title: 'Test Blog Post',
        content: 'Test blog content',
        excerpt: 'Test excerpt',
        slug: 'test-blog-post',
        published: true
      },
      description: 'Create new blog post',
      requiresAuth: true
    },

    // Gallery endpoints
    {
      endpoint: '/api/gallery',
      method: 'GET',
      description: 'Get all gallery images'
    },
    {
      endpoint: '/api/gallery',
      method: 'POST',
      body: {
        title: 'Test Gallery Image',
        description: 'Test image description',
        imageUrl: '/images/test.jpg',
        category: 'test'
      },
      description: 'Create new gallery image',
      requiresAuth: true
    },

    // Testimonials endpoints
    {
      endpoint: '/api/testimonials',
      method: 'GET',
      description: 'Get all testimonials'
    },
    {
      endpoint: '/api/testimonials',
      method: 'POST',
      body: {
        name: 'Test Customer',
        company: 'Test Company',
        message: 'Great service!',
        rating: 5,
        imageUrl: '/images/test-user.jpg'
      },
      description: 'Create new testimonial',
      requiresAuth: true
    },

    // Certifications endpoints
    {
      endpoint: '/api/certifications',
      method: 'GET',
      description: 'Get all certifications'
    },
    {
      endpoint: '/api/certifications',
      method: 'POST',
      body: {
        name: 'Test Certification',
        issuer: 'Test Issuer',
        dateIssued: new Date().toISOString(),
        certificateUrl: '/certificates/test.pdf'
      },
      description: 'Create new certification',
      requiresAuth: true
    },

    // Contact endpoints
    {
      endpoint: '/api/contact',
      method: 'POST',
      body: {
        name: 'Test Contact',
        email: 'contact@example.com',
        phone: '08123456789',
        subject: 'Test Subject',
        message: 'Test message'
      },
      description: 'Submit contact form'
    },

    // Newsletter endpoints
    {
      endpoint: '/api/newsletter',
      method: 'POST',
      body: {
        email: 'newsletter@example.com'
      },
      description: 'Subscribe to newsletter'
    },

    // Cart endpoints
    {
      endpoint: '/api/cart',
      method: 'GET',
      description: 'Get cart items',
      requiresAuth: true
    },
    {
      endpoint: '/api/cart',
      method: 'POST',
      body: {
        productId: 1,
        quantity: 2
      },
      description: 'Add item to cart',
      requiresAuth: true
    },

    // Settings endpoints
    {
      endpoint: '/api/settings',
      method: 'GET',
      description: 'Get all settings'
    },
    {
      endpoint: '/api/settings',
      method: 'POST',
      body: {
        key: 'test_setting',
        value: 'test_value',
        type: 'string'
      },
      description: 'Create/update setting',
      requiresAuth: true
    },

    // Upload endpoints
    {
      endpoint: '/api/upload',
      method: 'GET',
      description: 'Get upload info'
    }
  ];

  async runTest(testCase: TestCase): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...testCase.headers
      };

      // Add auth token if required
      if (testCase.requiresAuth && this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const options: RequestInit = {
        method: testCase.method,
        headers
      };

      if (testCase.body && testCase.method !== 'GET') {
        options.body = JSON.stringify(testCase.body);
      }

      const response = await fetch(`${BASE_URL}${testCase.endpoint}`, options);
      const responseTime = Date.now() - startTime;

      // Try to parse response
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      const success = response.status < 400;

      return {
        endpoint: testCase.endpoint,
        method: testCase.method,
        status: response.status,
        success,
        message: testCase.description,
        responseTime,
        error: success ? undefined : `Status: ${response.status}, Response: ${JSON.stringify(responseData)}`
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        endpoint: testCase.endpoint,
        method: testCase.method,
        status: 0,
        success: false,
        message: testCase.description,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async authenticateUser(): Promise<void> {
    console.log('🔐 Attempting to authenticate user...');

    try {
      // Try to login with existing user
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@metito.id',
          password: 'admin123'
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        this.authToken = loginData.token;
        console.log('✅ Authentication successful');
      } else {
        console.log('⚠️  Login failed, will test without authentication');
      }
    } catch (error) {
      console.log('⚠️  Authentication error:', error);
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting API Testing...\n');

    // Try to authenticate first
    await this.authenticateUser();

    console.log(`📋 Running ${this.testCases.length} test cases...\n`);

    for (const testCase of this.testCases) {
      console.log(`Testing: ${testCase.method} ${testCase.endpoint} - ${testCase.description}`);

      const result = await this.runTest(testCase);
      this.results.push(result);

      const statusIcon = result.success ? '✅' : '❌';
      const authInfo = testCase.requiresAuth ? (this.authToken ? '[AUTH]' : '[NO AUTH]') : '';

      console.log(`${statusIcon} ${result.status} ${authInfo} (${result.responseTime}ms)`);

      if (!result.success && result.error) {
        console.log(`   Error: ${result.error}`);
      }

      console.log('');

      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.generateReport();
  }

  generateReport(): void {
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;

    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log('');

    // Group results by status
    const statusGroups = this.results.reduce((acc, result) => {
      const statusRange = Math.floor(result.status / 100) * 100;
      const key = statusRange === 0 ? 'Network/Connection Errors' :
        statusRange === 200 ? '2xx Success' :
          statusRange === 300 ? '3xx Redirection' :
            statusRange === 400 ? '4xx Client Errors' :
              statusRange === 500 ? '5xx Server Errors' : 'Other';

      if (!acc[key]) acc[key] = [];
      acc[key].push(result);
      return acc;
    }, {} as Record<string, TestResult[]>);

    Object.entries(statusGroups).forEach(([group, results]) => {
      console.log(`\n${group}:`);
      results.forEach(result => {
        const icon = result.success ? '✅' : '❌';
        console.log(`  ${icon} ${result.method} ${result.endpoint} (${result.status}) - ${result.responseTime}ms`);
        if (result.error) {
          console.log(`     ${result.error}`);
        }
      });
    });

    // Save detailed report to file
    this.saveReportToFile();
  }

  saveReportToFile(): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `api-test-report-${timestamp}.json`;
    const filepath = path.join(process.cwd(), 'scripts', filename);

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.success).length,
        failed: this.results.filter(r => !r.success).length,
        successRate: (this.results.filter(r => r.success).length / this.results.length) * 100
      },
      results: this.results
    };

    try {
      fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Detailed report saved to: ${filename}`);
    } catch (error) {
      console.log('⚠️  Could not save report file:', error);
    }
  }
}

// Main execution
async function main() {
  const tester = new APITester();
  await tester.runAllTests();
}

// Check if server is running
async function checkServer(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/settings`);
    return true;
  } catch {
    return false;
  }
}

// Run the tests
checkServer().then(isRunning => {
  if (!isRunning) {
    console.log('❌ Server is not running on http://localhost:3000');
    console.log('Please start the server with: npm run dev');
    process.exit(1);
  }

  main().catch(console.error);
}); 
