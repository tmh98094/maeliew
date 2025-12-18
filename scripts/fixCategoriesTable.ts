import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function fixCategoriesTable() {
  console.log('🔧 Fixing Categories Table...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Check current categories structure
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (error) {
      console.log('Categories table might not exist, checking...');
      console.log('Error:', error.message);
    } else {
      console.log('✅ Categories table exists');
      console.log('Current structure:', Object.keys(categories[0] || {}));
    }

    // Try to get all categories
    const { data: allCategories, error: getAllError } = await supabase
      .from('categories')
      .select('id, name');

    if (getAllError) {
      console.log('❌ Error reading categories:', getAllError.message);
    } else {
      console.log(`✅ Found ${allCategories?.length || 0} categories`);
      if (allCategories && allCategories.length > 0) {
        console.log('Categories:', allCategories.map(c => c.name).join(', '));
      }
    }

    // Ensure we have the basic portfolio categories
    const requiredCategories = [
      { name: 'Wedding', description: 'Wedding photography and makeup' },
      { name: 'ROM', description: 'Registration of Marriage ceremonies' },
      { name: 'Celebrity', description: 'Celebrity and editorial work' }
    ];

    for (const category of requiredCategories) {
      try {
        // Check if category exists
        const { data: existing } = await supabase
          .from('categories')
          .select('id')
          .eq('name', category.name)
          .single();

        if (!existing) {
          // Create category
          const { error: insertError } = await supabase
            .from('categories')
            .insert({
              name: category.name,
              description: category.description
            });

          if (insertError) {
            console.log(`⚠️  Could not create ${category.name}:`, insertError.message);
          } else {
            console.log(`✅ Created category: ${category.name}`);
          }
        } else {
          console.log(`✅ Category exists: ${category.name}`);
        }
      } catch (err) {
        console.log(`⚠️  Error with ${category.name}:`, err);
      }
    }

    console.log('\n✅ Categories table check complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixCategoriesTable();