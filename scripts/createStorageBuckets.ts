import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for admin operations

async function createStorageBuckets() {
  console.log('Creating storage buckets...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  // Use service role key for admin operations
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const buckets = [
    { name: 'portfolio-images', public: true },
    { name: 'featured-images', public: true }
  ];

  for (const bucket of buckets) {
    try {
      // Check if bucket exists
      const { data: existingBucket } = await supabase.storage.getBucket(bucket.name);
      
      if (existingBucket) {
        console.log(`✅ Bucket '${bucket.name}' already exists`);
        continue;
      }

      // Create bucket
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
        fileSizeLimit: 10485760 // 10MB
      });

      if (error) {
        console.error(`❌ Failed to create bucket '${bucket.name}':`, error.message);
      } else {
        console.log(`✅ Created bucket '${bucket.name}'`);
      }
    } catch (err) {
      console.error(`❌ Error with bucket '${bucket.name}':`, err);
    }
  }

  // Create storage policies
  console.log('\nCreating storage policies...');
  
  const policies = [
    {
      name: 'Allow public uploads to portfolio-images',
      sql: `
        CREATE POLICY "Allow public uploads" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');
      `
    },
    {
      name: 'Allow public access to portfolio-images',
      sql: `
        CREATE POLICY "Allow public access" ON storage.objects
        FOR SELECT USING (bucket_id = 'portfolio-images');
      `
    },
    {
      name: 'Allow public uploads to featured-images',
      sql: `
        CREATE POLICY "Allow public uploads featured" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'featured-images');
      `
    },
    {
      name: 'Allow public access to featured-images',
      sql: `
        CREATE POLICY "Allow public access featured" ON storage.objects
        FOR SELECT USING (bucket_id = 'featured-images');
      `
    }
  ];

  for (const policy of policies) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: policy.sql });
      if (error) {
        console.log(`⚠️  Policy might already exist: ${policy.name}`);
      } else {
        console.log(`✅ Created policy: ${policy.name}`);
      }
    } catch (err) {
      console.log(`⚠️  Policy creation skipped: ${policy.name}`);
    }
  }

  console.log('\n✅ Storage setup complete!');
}

createStorageBuckets();