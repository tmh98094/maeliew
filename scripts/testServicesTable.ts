import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

async function testServicesTable() {
  if (!supabase) {
    console.error('Supabase is not configured. Please check your environment variables.');
    return;
  }

  try {
    console.log('Testing services table...');
    
    // First try to create a simple service to test if table exists
    const testService = {
      title: 'Test Service',
      category: 'wedding',
      price: 100.00,
      currency: 'RM',
      features: ['Test feature'],
      status: 'active',
      sort_order: 1
    };

    const { data: insertData, error: insertError } = await supabase
      .from('services')
      .insert(testService)
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting test service:', insertError);
      
      // If table doesn't exist, let's check what tables do exist
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
        
      if (tablesError) {
        console.error('Error checking tables:', tablesError);
      } else {
        console.log('Available tables:', tables?.map(t => t.table_name));
      }
      return;
    }

    console.log('Services table exists and is accessible');
    console.log('Test service created:', insertData);
    
    // Clean up test service
    if (insertData) {
      await supabase.from('services').delete().eq('id', insertData.id);
      console.log('Test service cleaned up');
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testServicesTable();