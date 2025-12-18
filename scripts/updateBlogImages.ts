import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function updateBlogImages() {
  console.log('Updating blog post images with high-quality wedding photos...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // High-quality wedding stock images from Unsplash
  const WEDDING_IMAGES = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Bridal makeup
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Wedding makeup artist
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Bridal beauty
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Wedding preparation
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Bride getting ready
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Wedding makeup tools
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Bridal portrait
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Wedding beauty
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Makeup application
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"  // Bridal makeup close-up
  ];

  try {
    // Get all blog posts
    const { data: blogPosts, error } = await supabase
      .from('content')
      .select('id, title, file_path')
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

    console.log(`Found ${blogPosts.length} blog posts to update`);

    // Update each blog post with a wedding image
    for (let i = 0; i < blogPosts.length; i++) {
      const post = blogPosts[i];
      const imageUrl = WEDDING_IMAGES[i % WEDDING_IMAGES.length];
      
      const { error: updateError } = await supabase
        .from('content')
        .update({
          file_path: imageUrl,
          alt_text: `Wedding makeup and beauty - ${post.title}`,
          file_name: `wedding-blog-${i + 1}.jpg`,
          mime_type: 'image/jpeg'
        })
        .eq('id', post.id);

      if (updateError) {
        console.error(`Error updating ${post.title}:`, updateError);
      } else {
        console.log(`✅ Updated: ${post.title}`);
      }
    }

    console.log('\n✅ Blog post images updated successfully!');
    console.log('🖼️  All blog posts now have high-quality wedding stock images');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateBlogImages();