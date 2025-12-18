import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function cleanupDuplicateBlogs() {
  console.log('Cleaning up duplicate blog posts...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get all blog posts
    const { data: blogPosts, error } = await supabase
      .from('content')
      .select('id, title, created_at')
      .eq('type', 'blog')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return;
    }

    if (!blogPosts || blogPosts.length === 0) {
      console.log('No blog posts found');
      return;
    }

    console.log(`Found ${blogPosts.length} blog posts`);

    // Group by title to find duplicates
    const titleGroups: { [key: string]: any[] } = {};
    
    blogPosts.forEach(post => {
      if (!titleGroups[post.title]) {
        titleGroups[post.title] = [];
      }
      titleGroups[post.title].push(post);
    });

    // Find and remove duplicates (keep the first one, delete the rest)
    let deletedCount = 0;
    
    for (const [title, posts] of Object.entries(titleGroups)) {
      if (posts.length > 1) {
        console.log(`\n📝 Found ${posts.length} duplicates of: "${title}"`);
        
        // Keep the first one (oldest), delete the rest
        const toKeep = posts[0];
        const toDelete = posts.slice(1);
        
        console.log(`   ✅ Keeping: ${toKeep.id} (created: ${toKeep.created_at})`);
        
        for (const duplicate of toDelete) {
          const { error: deleteError } = await supabase
            .from('content')
            .delete()
            .eq('id', duplicate.id);

          if (deleteError) {
            console.error(`   ❌ Error deleting ${duplicate.id}:`, deleteError);
          } else {
            console.log(`   🗑️  Deleted: ${duplicate.id} (created: ${duplicate.created_at})`);
            deletedCount++;
          }
        }
      }
    }

    if (deletedCount === 0) {
      console.log('\n✅ No duplicates found! All blog posts are unique.');
    } else {
      console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} duplicate blog posts.`);
    }

    // Show final count
    const { data: finalPosts } = await supabase
      .from('content')
      .select('id')
      .eq('type', 'blog');

    console.log(`📊 Final count: ${finalPosts?.length || 0} unique blog posts`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

cleanupDuplicateBlogs();