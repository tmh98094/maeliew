import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

async function createServicesTable() {
  if (!supabase) {
    console.error('Supabase is not configured. Please check your environment variables.');
    return;
  }

  try {
    console.log('Creating services table...');
    
    // Create the services table using SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create services table for CMS management
        CREATE TABLE IF NOT EXISTS services (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) NOT NULL,
            category VARCHAR(50) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            currency VARCHAR(3) DEFAULT 'RM',
            features JSONB NOT NULL DEFAULT '[]',
            description TEXT,
            duration VARCHAR(100),
            note TEXT,
            images JSONB DEFAULT '[]',
            status VARCHAR(20) DEFAULT 'active',
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
        CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
        CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);

        -- Enable Row Level Security
        ALTER TABLE services ENABLE ROW LEVEL SECURITY;

        -- Services policies (public read for active services, authenticated write)
        DROP POLICY IF EXISTS "Active services are viewable by everyone" ON services;
        CREATE POLICY "Active services are viewable by everyone" ON services
            FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');

        DROP POLICY IF EXISTS "Authenticated users can insert services" ON services;
        CREATE POLICY "Authenticated users can insert services" ON services
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');

        DROP POLICY IF EXISTS "Authenticated users can update services" ON services;
        CREATE POLICY "Authenticated users can update services" ON services
            FOR UPDATE USING (auth.role() = 'authenticated');

        DROP POLICY IF EXISTS "Authenticated users can delete services" ON services;
        CREATE POLICY "Authenticated users can delete services" ON services
            FOR DELETE USING (auth.role() = 'authenticated');
      `
    });

    if (error) {
      console.error('Error creating services table:', error);
      return;
    }

    console.log('Services table created successfully!');

  } catch (error) {
    console.error('Failed to create services table:', error);
  }
}

createServicesTable();