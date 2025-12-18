import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkBlogCount() {
  console.log('Checking current blog post count...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get all blog posts
    const { data: blogPosts, error } = await supabase
      .from('content')
      .select('id, title, created_at, status')
      .eq('type', 'blog')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return;
    }

    console.log(`\n📊 Total blog posts: ${blogPosts?.length || 0}`);
    
    if (blogPosts && blogPosts.length > 0) {
      console.log('\n📝 Blog posts:');
      blogPosts.forEach((post, index) => {
        const date = new Date(post.created_at).toLocaleDateString();
        console.log(`${index + 1}. ${post.title} (${post.status}) - ${date}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkBlogCount();