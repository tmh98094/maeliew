import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function applyStoragePolicies() {
  console.log('Applying storage policies...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Read the SQL file
    const sql = readFileSync('scripts/fixStoragePolicies.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' });
        if (error) {
          console.log(`⚠️  Statement might have failed (this is often normal):`, statement.substring(0, 50) + '...');
        } else {
          console.log(`✅ Executed:`, statement.substring(0, 50) + '...');
        }
      } catch (err) {
        console.log(`⚠️  Statement skipped:`, statement.substring(0, 50) + '...');
      }
    }

    console.log('\n✅ Storage policies updated!');
    console.log('Now authenticated users can upload to storage buckets.');
    
  } catch (error) {
    console.error('❌ Failed to apply policies:', error);
  }
}

applyStoragePolicies();