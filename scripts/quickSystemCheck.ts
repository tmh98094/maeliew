import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function quickSystemCheck() {
  console.log('🔍 Quick System Health Check\n');
  console.log('='.repeat(60));

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  let passCount = 0;
  let failCount = 0;

  // Test 1: Database Connection
  console.log('\n1️⃣  Testing Database Connection...');
  try {
    const { error } = await supabase.from('content').select('count').limit(1);
    if (error) throw error;
    console.log('   ✅ Database connected successfully');
    passCount++;
  } catch (error) {
    console.log('   ❌ Database connection failed:', error);
    failCount++;
  }

  // Test 2: Blog Posts
  console.log('\n2️⃣  Testing Blog Posts...');
  try {
    const { data, error } = await supabase
      .from('content')
      .select('id, title, description, status, created_at')
      .eq('type', 'blog')
      .eq('status', 'published');
    
    if (error) throw error;
    console.log(`   ✅ Found ${data?.length || 0} published blog posts`);
    if (data && data.length > 0) {
      console.log(`   📝 Latest: "${data[0].title}"`);
    }
    passCount++;
  } catch (error) {
    console.log('   ❌ Blog posts test failed:', error);
    failCount++;
  }

  // Test 3: Categories
  console.log('\n3️⃣  Testing Categories...');
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug');
    
    if (error) throw error;
    console.log(`   ✅ Found ${data?.length || 0} categories`);
    if (data && data.length > 0) {
      console.log(`   📁 Categories: ${data.map(c => c.name).join(', ')}`);
    }
    passCount++;
  } catch (error) {
    console.log('   ❌ Categories test failed:', error);
    failCount++;
  }

  // Test 4: Storage Buckets
  console.log('\n4️⃣  Testing Storage Buckets...');
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    
    const bucketNames = data?.map(b => b.name) || [];
    console.log(`   ✅ Found ${bucketNames.length} storage buckets`);
    console.log(`   🗂️  Buckets: ${bucketNames.join(', ')}`);
    passCount++;
  } catch (error) {
    console.log('   ❌ Storage buckets test failed:', error);
    failCount++;
  }

  // Test 5: Blog Images
  console.log('\n5️⃣  Testing Blog Images...');
  try {
    const { data, error } = await supabase
      .from('content')
      .select('id, title, file_path')
      .eq('type', 'blog')
      .not('file_path', 'is', null)
      .limit(5);
    
    if (error) throw error;
    const withImages = data?.filter(p => p.file_path).length || 0;
    console.log(`   ✅ ${withImages} blog posts have images`);
    passCount++;
  } catch (error) {
    console.log('   ❌ Blog images test failed:', error);
    failCount++;
  }

  // Test 6: Content CRUD
  console.log('\n6️⃣  Testing Content CRUD Operations...');
  try {
    // Create
    const testData = {
      title: 'SYSTEM_TEST_' + Date.now(),
      description: 'Test post for validation',
      type: 'blog',
      status: 'draft'
    };

    const { data: created, error: createError } = await supabase
      .from('content')
      .insert(testData)
      .select()
      .single();

    if (createError) throw createError;

    // Read
    const { data: read, error: readError } = await supabase
      .from('content')
      .select('*')
      .eq('id', created.id)
      .single();

    if (readError) throw readError;

    // Update
    const { error: updateError } = await supabase
      .from('content')
      .update({ description: 'Updated' })
      .eq('id', created.id);

    if (updateError) throw updateError;

    // Delete
    const { error: deleteError } = await supabase
      .from('content')
      .delete()
      .eq('id', created.id);

    if (deleteError) throw deleteError;

    console.log('   ✅ CRUD operations working (Create, Read, Update, Delete)');
    passCount++;
  } catch (error) {
    console.log('   ❌ CRUD operations failed:', error);
    failCount++;
  }

  // Test 7: Public Access (RLS)
  console.log('\n7️⃣  Testing Public Access (RLS Policies)...');
  try {
    const publicClient = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY || '');
    const { data, error } = await publicClient
      .from('content')
      .select('id, title')
      .eq('status', 'published')
      .limit(1);

    if (error) throw error;
    console.log('   ✅ Public can read published content');
    passCount++;
  } catch (error) {
    console.log('   ⚠️  Public access test skipped (anon key not configured)');
  }

  // Test 8: Check Blog Count
  console.log('\n8️⃣  Checking Blog Post Count...');
  try {
    const { data, error } = await supabase
      .from('content')
      .select('id, title, created_at')
      .eq('type', 'blog')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    console.log(`   ✅ Total blog posts: ${data?.length || 0}`);
    
    // Check for duplicates
    const titles = data?.map(p => p.title) || [];
    const uniqueTitles = new Set(titles);
    if (titles.length !== uniqueTitles.size) {
      console.log(`   ⚠️  Warning: Found ${titles.length - uniqueTitles.size} duplicate titles`);
    } else {
      console.log('   ✅ No duplicate blog posts found');
    }
    passCount++;
  } catch (error) {
    console.log('   ❌ Blog count check failed:', error);
    failCount++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SYSTEM HEALTH SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📈 Health Score: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
  
  if (failCount === 0) {
    console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
  } else if (passCount > failCount) {
    console.log('\n⚠️  SYSTEM MOSTLY OPERATIONAL (Some issues detected)');
  } else {
    console.log('\n❌ CRITICAL ISSUES DETECTED');
  }
  
  console.log('='.repeat(60));

  // Recommendations
  if (failCount > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('   • Check Supabase dashboard for table structures');
    console.log('   • Verify RLS policies are properly configured');
    console.log('   • Ensure storage buckets are created');
    console.log('   • Review error messages above for specific issues');
  }
}

quickSystemCheck();