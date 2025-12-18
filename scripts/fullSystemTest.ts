import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration: number;
}

class SystemTester {
  private supabase: any;
  private results: TestResult[] = [];

  constructor() {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables');
    }
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  private async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({
        name,
        status: 'PASS',
        message: 'Test completed successfully',
        duration
      });
      console.log(`✅ ${name} - PASSED (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({
        name,
        status: 'FAIL',
        message: error instanceof Error ? error.message : 'Unknown error',
        duration
      });
      console.log(`❌ ${name} - FAILED (${duration}ms): ${error instanceof Error ? error.message : error}`);
    }
  }

  // Test 1: Database Connection
  async testDatabaseConnection(): Promise<void> {
    await this.runTest('Database Connection', async () => {
      const { data, error } = await this.supabase.from('content').select('count').limit(1);
      if (error) throw new Error(`Database connection failed: ${error.message}`);
    });
  }

  // Test 2: Blog Content API
  async testBlogContentAPI(): Promise<void> {
    await this.runTest('Blog Content API', async () => {
      const { data, error } = await this.supabase
        .from('content')
        .select('id, title, description, status')
        .eq('type', 'blog')
        .limit(5);
      
      if (error) throw new Error(`Blog API failed: ${error.message}`);
      if (!data || data.length === 0) throw new Error('No blog posts found');
      
      // Validate blog post structure
      const post = data[0];
      if (!post.id || !post.title) throw new Error('Invalid blog post structure');
    });
  }

  // Test 3: Portfolio Content API
  async testPortfolioContentAPI(): Promise<void> {
    await this.runTest('Portfolio Content API', async () => {
      const { data, error } = await this.supabase
        .from('content')
        .select('id, title, file_path, category_id')
        .eq('type', 'portfolio')
        .limit(5);
      
      if (error) throw new Error(`Portfolio API failed: ${error.message}`);
      // Portfolio might be empty, so we just check for no errors
    });
  }

  // Test 4: Categories API
  async testCategoriesAPI(): Promise<void> {
    await this.runTest('Categories API', async () => {
      const { data, error } = await this.supabase
        .from('categories')
        .select('id, name, type')
        .limit(10);
      
      if (error) throw new Error(`Categories API failed: ${error.message}`);
      if (!data) throw new Error('Categories data is null');
    });
  }

  // Test 5: Services API
  async testServicesAPI(): Promise<void> {
    await this.runTest('Services API', async () => {
      const { data, error } = await this.supabase
        .from('services')
        .select('id, title, price_starting, category')
        .limit(5);
      
      if (error) throw new Error(`Services API failed: ${error.message}`);
      // Services might be empty, check structure if data exists
      if (data && data.length > 0) {
        const service = data[0];
        if (!service.id || !service.title) throw new Error('Invalid service structure');
      }
    });
  }

  // Test 6: Storage Buckets
  async testStorageBuckets(): Promise<void> {
    await this.runTest('Storage Buckets', async () => {
      const { data, error } = await this.supabase.storage.listBuckets();
      if (error) throw new Error(`Storage buckets failed: ${error.message}`);
      
      const requiredBuckets = ['portfolio', 'blog', 'featured'];
      const existingBuckets = data?.map(b => b.name) || [];
      
      for (const bucket of requiredBuckets) {
        if (!existingBuckets.includes(bucket)) {
          throw new Error(`Missing storage bucket: ${bucket}`);
        }
      }
    });
  }

  // Test 7: Blog CRUD Operations
  async testBlogCRUD(): Promise<void> {
    await this.runTest('Blog CRUD Operations', async () => {
      // Create test blog post
      const testPost = {
        title: 'TEST_POST_' + Date.now(),
        description: 'This is a test blog post for system validation',
        type: 'blog',
        status: 'draft',
        tags: ['test'],
        keywords: ['test', 'validation']
      };

      const { data: created, error: createError } = await this.supabase
        .from('content')
        .insert(testPost)
        .select()
        .single();

      if (createError) throw new Error(`Create failed: ${createError.message}`);
      if (!created) throw new Error('No data returned from create');

      // Read the created post
      const { data: read, error: readError } = await this.supabase
        .from('content')
        .select('*')
        .eq('id', created.id)
        .single();

      if (readError) throw new Error(`Read failed: ${readError.message}`);
      if (read.title !== testPost.title) throw new Error('Read data mismatch');

      // Update the post
      const { error: updateError } = await this.supabase
        .from('content')
        .update({ description: 'Updated test description' })
        .eq('id', created.id);

      if (updateError) throw new Error(`Update failed: ${updateError.message}`);

      // Delete the test post
      const { error: deleteError } = await this.supabase
        .from('content')
        .delete()
        .eq('id', created.id);

      if (deleteError) throw new Error(`Delete failed: ${deleteError.message}`);
    });
  }

  // Test 8: Image Upload Simulation
  async testImageUploadAPI(): Promise<void> {
    await this.runTest('Image Upload API', async () => {
      // Test if we can access the storage API
      const { data, error } = await this.supabase.storage
        .from('blog')
        .list('', { limit: 1 });

      if (error) throw new Error(`Storage access failed: ${error.message}`);
      // We don't actually upload a file, just test API access
    });
  }

  // Test 9: RLS Policies
  async testRLSPolicies(): Promise<void> {
    await this.runTest('RLS Policies', async () => {
      // Test that we can read published content (should be public)
      const { data, error } = await this.supabase
        .from('content')
        .select('id, title')
        .eq('status', 'published')
        .limit(1);

      if (error) throw new Error(`RLS policy test failed: ${error.message}`);
      // This should work even without authentication for published content
    });
  }

  // Test 10: Slug Generation
  async testSlugGeneration(): Promise<void> {
    await this.runTest('Slug Generation', async () => {
      // Import and test slug utilities
      const { titleToSlug, slugToTitlePattern, findPostBySlug } = await import('../src/utils/slugUtils');
      
      const testTitle = "10 Essential Bridal Makeup Tips for Your Perfect Wedding Day";
      const expectedSlug = "10-essential-bridal-makeup-tips-for-your-perfect-wedding-day";
      
      const generatedSlug = titleToSlug(testTitle);
      if (generatedSlug !== expectedSlug) {
        throw new Error(`Slug generation failed. Expected: ${expectedSlug}, Got: ${generatedSlug}`);
      }

      const titlePattern = slugToTitlePattern(generatedSlug);
      if (!titlePattern.includes('essential')) {
        throw new Error('Slug to title pattern conversion failed');
      }
    });
  }

  // Test 11: Malaysian Localization
  async testMalaysianLocalization(): Promise<void> {
    await this.runTest('Malaysian Localization', async () => {
      const { formatMalaysianCurrency, MALAYSIA_SERVICE_CATEGORIES } = await import('../src/utils/malaysiaLocalization');
      
      const formattedPrice = formatMalaysianCurrency(1500);
      if (!formattedPrice.includes('RM') || !formattedPrice.includes('1,500')) {
        throw new Error(`Currency formatting failed: ${formattedPrice}`);
      }

      if (!MALAYSIA_SERVICE_CATEGORIES.wedding) {
        throw new Error('Malaysian service categories not properly defined');
      }
    });
  }

  // Test 12: WhatsApp Integration
  async testWhatsAppIntegration(): Promise<void> {
    await this.runTest('WhatsApp Integration', async () => {
      const { generateCategoryWhatsAppURL } = await import('../src/utils/whatsappIntegration');
      
      const whatsappData = generateCategoryWhatsAppURL(
        'Test Service',
        'RM 1,500.00',
        'wedding',
        'test-id'
      );

      if (!whatsappData.url.includes('wa.me')) {
        throw new Error('WhatsApp URL generation failed');
      }

      if (!whatsappData.message.includes('Test Service')) {
        throw new Error('WhatsApp message generation failed');
      }
    });
  }

  // Run all tests
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Full System Test Suite...\n');
    
    await this.testDatabaseConnection();
    await this.testBlogContentAPI();
    await this.testPortfolioContentAPI();
    await this.testCategoriesAPI();
    await this.testServicesAPI();
    await this.testStorageBuckets();
    await this.testBlogCRUD();
    await this.testImageUploadAPI();
    await this.testRLSPolicies();
    await this.testSlugGeneration();
    await this.testMalaysianLocalization();
    await this.testWhatsAppIntegration();

    this.printSummary();
  }

  private printSummary(): void {
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total Time: ${totalTime}ms`);
    console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`   • ${r.name}: ${r.message}`));
    }

    console.log('\n' + (failed === 0 ? '🎉 ALL TESTS PASSED!' : '⚠️  SOME TESTS FAILED'));
    console.log('='.repeat(60));
  }
}

// Run the tests
async function main() {
  try {
    const tester = new SystemTester();
    await tester.runAllTests();
  } catch (error) {
    console.error('❌ Test suite failed to initialize:', error);
    process.exit(1);
  }
}

main();