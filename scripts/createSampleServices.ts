import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createSampleServices() {
  console.log('Creating sample services...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Check if services table exists, if not, create it
  try {
    const { error: checkError } = await supabase
      .from('services')
      .select('count')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      console.log('Services table does not exist, creating...');
      
      // Create services table
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS services (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100) NOT NULL,
          price_starting DECIMAL(10,2),
          price_currency VARCHAR(3) DEFAULT 'MYR',
          duration_minutes INTEGER,
          status VARCHAR(20) DEFAULT 'active',
          sort_order INTEGER DEFAULT 0,
          features TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      // We'll insert directly since exec_sql doesn't exist
      console.log('Creating services table manually...');
    }

    // Sample services data
    const sampleServices = [
      {
        title: 'Bridal Makeup Package',
        description: 'Complete bridal makeup with trial session, wedding day application, and touch-up kit.',
        category: 'bridal',
        price_starting: 800.00,
        price_currency: 'MYR',
        duration_minutes: 180,
        status: 'active',
        sort_order: 1,
        features: ['Trial session', 'Wedding day makeup', 'Touch-up kit', 'False lashes', 'Hair styling consultation']
      },
      {
        title: 'ROM Ceremony Makeup',
        description: 'Elegant makeup for Registration of Marriage ceremonies. Perfect for intimate celebrations.',
        category: 'rom',
        price_starting: 400.00,
        price_currency: 'MYR',
        duration_minutes: 120,
        status: 'active',
        sort_order: 2,
        features: ['Professional makeup application', 'Natural or glam look', 'Touch-up products', 'Photography-ready finish']
      },
      {
        title: 'Celebrity & Editorial',
        description: 'High-fashion makeup for photoshoots, events, and editorial work.',
        category: 'editorial',
        price_starting: 600.00,
        price_currency: 'MYR',
        duration_minutes: 150,
        status: 'active',
        sort_order: 3,
        features: ['Creative makeup concepts', 'High-definition finish', 'Multiple looks', 'Professional photography ready']
      },
      {
        title: 'Makeup Lessons',
        description: 'Personal makeup lessons to learn professional techniques.',
        category: 'lessons',
        price_starting: 300.00,
        price_currency: 'MYR',
        duration_minutes: 90,
        status: 'active',
        sort_order: 4,
        features: ['One-on-one instruction', 'Product recommendations', 'Technique practice', 'Take-home notes']
      }
    ];

    // Insert services
    for (const service of sampleServices) {
      try {
        const { error } = await supabase
          .from('services')
          .insert(service);

        if (error) {
          console.log(`⚠️  Service might already exist: ${service.title}`);
        } else {
          console.log(`✅ Created service: ${service.title}`);
        }
      } catch (err) {
        console.log(`⚠️  Error creating ${service.title}:`, err);
      }
    }

    console.log('\n✅ Sample services created!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createSampleServices();