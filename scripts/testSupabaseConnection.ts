import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase environment variables not found');
    console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
    return;
  }

  // Use service role for testing (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Test basic connection
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return;
    }
    console.log('✅ Database connection successful');

    // Test storage buckets
    const buckets = ['portfolio-images', 'featured-images'];
    
    for (const bucket of buckets) {
      try {
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucket);
        if (bucketError) {
          console.error(`❌ Bucket '${bucket}' error:`, bucketError.message);
        } else {
          console.log(`✅ Bucket '${bucket}' exists`);
        }
      } catch (err) {
        console.error(`❌ Bucket '${bucket}' check failed:`, err);
      }
    }

    // Test upload permissions
    try {
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload('test/test.txt', testFile);
      
      if (uploadError) {
        console.error('❌ Upload test failed:', uploadError.message);
      } else {
        console.log('✅ Upload test successful');
        
        // Clean up test file
        await supabase.storage.from('portfolio-images').remove(['test/test.txt']);
        console.log('✅ Test file cleaned up');
      }
    } catch (err) {
      console.error('❌ Upload test error:', err);
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testSupabaseConnection();