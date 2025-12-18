import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function moveAboutContent() {
  console.log('Moving About category content...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get Wedding category ID
    const { data: weddingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', 'Wedding')
      .single();

    if (!weddingCategory) {
      console.error('❌ Wedding category not found');
      return;
    }

    // Get About category
    const { data: aboutCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', 'About')
      .single();

    if (!aboutCategory) {
      console.log('✅ About category already removed');
      return;
    }

    // Move all content from About to Wedding
    const { error: updateError } = await supabase
      .from('content')
      .update({ category_id: weddingCategory.id })
      .eq('category_id', aboutCategory.id);

    if (updateError) {
      console.error('❌ Error moving content:', updateError);
      return;
    }

    console.log('✅ Moved content from About to Wedding category');

    // Now delete the About category
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', aboutCategory.id);

    if (deleteError) {
      console.error('❌ Error deleting About category:', deleteError);
    } else {
      console.log('✅ Deleted About category');
    }

    console.log('\n✅ Content migration complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

moveAboutContent();