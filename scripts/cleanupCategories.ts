import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function cleanupCategories() {
  console.log('Cleaning up categories...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get all categories
    const { data: categories, error: fetchError } = await supabase
      .from('categories')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching categories:', fetchError);
      return;
    }

    console.log('Current categories:', categories?.map(c => c.name));

    // Categories to keep (case insensitive)
    const keepCategories = ['wedding', 'bridal', 'photography', 'portfolio'];
    
    // Categories to remove
    const categoriesToRemove = categories?.filter(cat => 
      !keepCategories.some(keep => 
        cat.name.toLowerCase().includes(keep.toLowerCase())
      )
    ) || [];

    console.log('Categories to remove:', categoriesToRemove.map(c => c.name));

    // Remove unwanted categories
    for (const category of categoriesToRemove) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (error) {
        console.error(`❌ Error deleting ${category.name}:`, error);
      } else {
        console.log(`✅ Deleted category: ${category.name}`);
      }
    }

    // Ensure we have the 3 main categories
    const mainCategories = [
      { name: 'Wedding', description: 'Wedding makeup and styling', color: '#E63946' },
      { name: 'ROM', description: 'Registration of Marriage ceremonies', color: '#F77F00' },
      { name: 'Celebrity', description: 'Celebrity and editorial work', color: '#FCBF49' }
    ];

    for (const category of mainCategories) {
      // Check if category exists
      const { data: existing } = await supabase
        .from('categories')
        .select('*')
        .ilike('name', `%${category.name}%`)
        .single();

      if (!existing) {
        // Create the category
        const { error } = await supabase
          .from('categories')
          .insert(category);

        if (error) {
          console.error(`❌ Error creating ${category.name}:`, error);
        } else {
          console.log(`✅ Created category: ${category.name}`);
        }
      } else {
        console.log(`✅ Category already exists: ${category.name}`);
      }
    }

    console.log('\n✅ Category cleanup complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

cleanupCategories();