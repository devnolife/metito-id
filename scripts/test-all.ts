import { spawn } from 'child_process';
import path from 'path';

interface TestResult {
  name: string;
  success: boolean;
  output: string;
  duration: number;
}

class MasterTester {
  private results: TestResult[] = [];

  async runScript(scriptName: string, description: string): Promise<TestResult> {
    console.log(`\n🔍 Running ${description}...`);
    console.log('='.repeat(50));

    const startTime = Date.now();

    return new Promise((resolve) => {
      const scriptPath = path.join(process.cwd(), 'scripts', scriptName);
      const child = spawn('npx', ['tsx', scriptPath], {
        stdio: 'pipe',
        shell: true
      });

      let output = '';
      let errorOutput = '';

      child.stdout?.on('data', (data) => {
        const text = data.toString();
        output += text;
        process.stdout.write(text);
      });

      child.stderr?.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        process.stderr.write(text);
      });

      child.on('close', (code) => {
        const duration = Date.now() - startTime;
        const success = code === 0;

        resolve({
          name: description,
          success,
          output: output + errorOutput,
          duration
        });
      });

      child.on('error', (error) => {
        const duration = Date.now() - startTime;
        resolve({
          name: description,
          success: false,
          output: `Error: ${error.message}`,
          duration
        });
      });
    });
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 MASTER TEST RUNNER');
    console.log('Running comprehensive tests for Metito ID application');
    console.log('='.repeat(60));

    const tests = [
      { script: 'test-database.ts', description: 'Database Connection & Schema Test' },
      { script: 'test-file-system.ts', description: 'File System & Upload Directories Test' },
      { script: 'quick-api-test.ts', description: 'Quick API Endpoints Test' },
      { script: 'test-all-apis.ts', description: 'Comprehensive API Test' }
    ];

    for (const test of tests) {
      try {
        const result = await this.runScript(test.script, test.description);
        this.results.push(result);

        if (result.success) {
          console.log(`\n✅ ${test.description} completed successfully (${result.duration}ms)`);
        } else {
          console.log(`\n❌ ${test.description} failed (${result.duration}ms)`);
        }
      } catch (error) {
        console.log(`\n❌ ${test.description} failed with error:`, error);
        this.results.push({
          name: test.description,
          success: false,
          output: error instanceof Error ? error.message : 'Unknown error',
          duration: 0
        });
      }
    }

    this.generateFinalReport();
  }

  generateFinalReport(): void {
    console.log('\n\n📊 FINAL TEST REPORT');
    console.log('='.repeat(60));

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`📋 Total Test Suites: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⏱️  Total Duration: ${Math.round(totalDuration / 1000)}s`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    console.log('\n📝 Test Results:');
    this.results.forEach((result, index) => {
      const icon = result.success ? '✅' : '❌';
      const duration = Math.round(result.duration / 1000);
      console.log(`${index + 1}. ${icon} ${result.name} (${duration}s)`);
    });

    if (failedTests > 0) {
      console.log('\n🔧 ISSUES FOUND:');
      console.log('The following test suites failed:');
      this.results
        .filter(r => !r.success)
        .forEach((result, index) => {
          console.log(`${index + 1}. ${result.name}`);
        });

      console.log('\n💡 RECOMMENDATIONS:');
      console.log('1. Check if the development server is running (npm run dev)');
      console.log('2. Verify database connection and run migrations if needed');
      console.log('3. Ensure all required directories exist');
      console.log('4. Check environment variables (.env file)');
      console.log('5. Run individual test scripts for detailed error information');
    } else {
      console.log('\n🎉 ALL TESTS PASSED!');
      console.log('Your Metito ID application is ready to go!');
    }

    console.log('\n📚 Available test commands:');
    console.log('  npm run test-api-quick  - Quick API test');
    console.log('  npm run test-api        - Full API test');
    console.log('  npm run test-db         - Database test');
    console.log('  npm run test-fs         - File system test');
    console.log('  npm run test-all        - Run all tests');
  }
}

// Check if server is running
async function checkServer(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3000/api/settings');
    return true;
  } catch {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if development server is running...');

  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('\n⚠️  WARNING: Development server is not running on http://localhost:3000');
    console.log('Some API tests may fail. Please start the server with: npm run dev');
    console.log('Continuing with other tests...\n');
  } else {
    console.log('✅ Development server is running\n');
  }

  const tester = new MasterTester();
  await tester.runAllTests();
}

main().catch(console.error); 
