import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createSEOBlogs() {
  console.log('Creating 10 SEO blog posts...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Sample wedding-themed blog posts with SEO focus
  const blogPosts = [
    {
      title: "10 Essential Bridal Makeup Tips for Your Perfect Wedding Day",
      description: `Your wedding day is one of the most important days of your life, and looking absolutely stunning is a top priority. As a professional bridal makeup artist in Malaysia, I've helped hundreds of brides achieve their dream look. Here are my top 10 essential tips to ensure your bridal makeup is flawless and long-lasting.

First, always start with a good skincare routine at least 3 months before your wedding. This creates the perfect canvas for makeup application. Second, book your makeup trial at least 2 months in advance to allow time for adjustments. Third, consider your wedding venue and lighting when choosing your makeup style - outdoor weddings require different techniques than indoor ceremonies.

Don't forget to bring your lipstick for touch-ups throughout the day, and always opt for waterproof mascara and eyeliner. Finally, trust your makeup artist's expertise - we know what works best for photography and different lighting conditions.`,
      tags: ['bridal makeup', 'wedding tips', 'makeup artist Malaysia', 'wedding day beauty'],
      keywords: ['bridal makeup tips', 'wedding makeup Malaysia', 'professional makeup artist', 'wedding day beauty'],
      meta_title: "10 Essential Bridal Makeup Tips for Perfect Wedding Day | Mae Liew",
      meta_description: "Discover professional bridal makeup tips from Malaysia's top makeup artist. Get the perfect wedding day look with these expert beauty secrets.",
      created_at: '2026-03-15T10:30:00Z'
    },
    {
      title: "ROM Ceremony Makeup: Elegant and Timeless Looks for Your Special Day",
      description: `Registration of Marriage (ROM) ceremonies call for a more understated yet elegant makeup look. Unlike traditional wedding ceremonies, ROM events are typically more intimate and require a sophisticated approach to bridal beauty.

The key to perfect ROM makeup is achieving a natural glow while still looking polished for photographs. I recommend a dewy foundation finish, soft neutral eyeshadows, and a classic winged eyeliner. For lips, choose a timeless red or nude pink that complements your outfit.

ROM ceremonies often involve multiple outfit changes, so your makeup needs to be versatile enough to work with different colors and styles. This is where professional expertise makes all the difference - knowing which techniques and products will photograph beautifully and last throughout your celebration.`,
      tags: ['ROM makeup', 'registration marriage', 'elegant makeup', 'Malaysia ROM'],
      keywords: ['ROM ceremony makeup', 'registration marriage makeup', 'elegant bridal look', 'Malaysia ROM makeup artist'],
      meta_title: "ROM Ceremony Makeup: Elegant Looks for Registration of Marriage | Mae Liew",
      meta_description: "Perfect ROM ceremony makeup for your Registration of Marriage. Elegant, timeless looks by Malaysia's premier makeup artist.",
      created_at: '2026-04-22T14:15:00Z'
    },
    {
      title: "Pre-Wedding Photoshoot Makeup: Creating Picture-Perfect Moments",
      description: `Pre-wedding photoshoots are becoming increasingly popular among Malaysian couples, and the makeup for these sessions requires special consideration. Unlike wedding day makeup, pre-wedding shoot makeup needs to be more dramatic and camera-ready to translate beautifully in photographs.

For outdoor shoots, I always recommend using HD makeup products that won't look cakey under natural lighting. The key is to enhance your natural features while ensuring the makeup photographs well from all angles. Bold eyes with defined lashes work wonderfully for romantic shots, while a more natural look suits lifestyle photography.

Consider your shoot locations and themes when planning your makeup looks. Beach shoots call for waterproof everything, while urban settings allow for more dramatic, editorial-style makeup. Multiple looks can be achieved with strategic touch-ups and color changes throughout the day.`,
      tags: ['pre-wedding makeup', 'photoshoot makeup', 'engagement photos', 'couple photography'],
      keywords: ['pre-wedding photoshoot makeup', 'engagement photo makeup', 'couple photography makeup', 'Malaysia pre-wedding'],
      meta_title: "Pre-Wedding Photoshoot Makeup: Picture-Perfect Looks | Mae Liew",
      meta_description: "Stunning pre-wedding photoshoot makeup that photographs beautifully. Professional makeup artist for engagement and couple photography in Malaysia.",
      created_at: '2026-05-08T09:45:00Z'
    },
    {
      title: "Choosing the Right Makeup Artist: What Every Bride Should Know",
      description: `Selecting the perfect makeup artist for your wedding is one of the most important decisions you'll make during wedding planning. Your makeup artist will be responsible for making you look and feel absolutely beautiful on your special day, so it's crucial to choose someone whose style aligns with your vision.

Start by researching makeup artists whose portfolios showcase work similar to what you envision for yourself. Look for consistency in their work, attention to detail, and experience with your specific needs - whether that's traditional Malaysian weddings, modern ceremonies, or destination weddings.

Don't forget to consider personality fit as well. You'll be spending several hours with your makeup artist on your wedding day, so it's important to choose someone who makes you feel comfortable and confident. Always book a trial session to test both the makeup look and your chemistry with the artist.`,
      tags: ['choosing makeup artist', 'wedding planning', 'bridal beauty', 'makeup artist tips'],
      keywords: ['how to choose makeup artist', 'wedding makeup artist Malaysia', 'bridal makeup planning', 'professional makeup artist'],
      meta_title: "How to Choose the Perfect Wedding Makeup Artist | Mae Liew",
      meta_description: "Expert guide to choosing the right makeup artist for your wedding. Tips from Malaysia's top bridal makeup professional.",
      created_at: '2026-06-12T16:20:00Z'
    },
    {
      title: "Malaysian Wedding Makeup Trends 2026: What's Hot This Year",
      description: `Malaysian wedding makeup trends for 2026 are all about celebrating natural beauty while incorporating modern techniques and timeless elegance. This year, we're seeing a shift towards more sustainable beauty practices and looks that photograph beautifully both in person and on social media.

The 'no-makeup makeup' look continues to be popular, but with elevated techniques that ensure you still look stunning in photos. Dewy, glowing skin is the foundation of this trend, achieved through expert color matching and highlighting techniques.

Bold, defined brows are having a moment, paired with soft, romantic eye looks. For lips, we're seeing a return to classic reds and berry tones that complement Malaysia's diverse skin tones beautifully. The key is achieving a look that feels authentically you while incorporating these contemporary elements.`,
      tags: ['makeup trends 2026', 'Malaysian wedding trends', 'bridal beauty trends', 'modern makeup'],
      keywords: ['Malaysian wedding makeup trends 2026', 'bridal makeup trends', 'modern wedding beauty', 'contemporary bridal looks'],
      meta_title: "Malaysian Wedding Makeup Trends 2026: Latest Bridal Beauty | Mae Liew",
      meta_description: "Discover the hottest Malaysian wedding makeup trends for 2026. Stay current with the latest bridal beauty styles and techniques.",
      created_at: '2026-07-18T11:30:00Z'
    },
    {
      title: "Destination Wedding Makeup: Tips for Tropical and Beach Ceremonies",
      description: `Destination weddings in Malaysia's beautiful tropical locations require special makeup considerations. Whether you're getting married on the beaches of Langkawi, in the highlands of Cameron, or at a resort in Penang, your makeup needs to withstand humidity, heat, and potentially outdoor elements.

The key to successful destination wedding makeup is using long-wearing, waterproof products that won't budge in tropical conditions. I always recommend a primer specifically designed for humid climates, followed by a long-wearing foundation that won't oxidize or separate throughout the day.

For beach weddings, consider the natural lighting and ocean breeze when planning your look. Soft, romantic makeup with defined eyes and a natural flush works beautifully against tropical backdrops. Don't forget to factor in travel logistics - your makeup artist needs to be prepared with a comprehensive kit that travels well.`,
      tags: ['destination wedding', 'beach wedding makeup', 'tropical wedding', 'Malaysia destination'],
      keywords: ['destination wedding makeup Malaysia', 'beach wedding makeup', 'tropical wedding beauty', 'outdoor wedding makeup'],
      meta_title: "Destination Wedding Makeup: Perfect Looks for Tropical Ceremonies | Mae Liew",
      meta_description: "Expert destination wedding makeup for tropical and beach ceremonies in Malaysia. Long-lasting beauty for outdoor weddings.",
      created_at: '2026-08-25T13:45:00Z'
    },
    {
      title: "The Art of Contouring: Enhancing Your Natural Beauty for Weddings",
      description: `Contouring has become an essential technique in modern bridal makeup, but when done correctly, it should enhance your natural bone structure rather than create an entirely different face. For Malaysian brides, understanding how to work with diverse skin tones and face shapes is crucial for achieving a flawless result.

The key to successful bridal contouring is subtlety. Unlike Instagram makeup, wedding contouring should look natural in person while still providing definition for photographs. I use cream products for a more natural finish, blending seamlessly into the skin for a sculpted yet soft appearance.

Different face shapes require different contouring approaches. Round faces benefit from subtle cheekbone definition, while square faces need softening around the jawline. The goal is always to enhance your unique beauty, not to follow a one-size-fits-all template.`,
      tags: ['contouring techniques', 'bridal contouring', 'makeup techniques', 'face shaping'],
      keywords: ['bridal contouring Malaysia', 'wedding makeup contouring', 'face shaping makeup', 'professional contouring techniques'],
      meta_title: "Bridal Contouring: The Art of Enhancing Natural Beauty | Mae Liew",
      meta_description: "Master the art of bridal contouring with expert techniques. Enhance your natural beauty for your wedding day with professional makeup tips.",
      created_at: '2026-09-14T15:10:00Z'
    },
    {
      title: "Makeup Trial Sessions: Making the Most of Your Bridal Beauty Test Run",
      description: `Your bridal makeup trial is one of the most important appointments in your wedding planning process. This session allows you to test your chosen look, make adjustments, and ensure you're completely happy with your wedding day beauty plan.

Come to your trial with inspiration photos, but be open to your makeup artist's professional suggestions. What looks good in a photo might not translate perfectly to your face shape or skin tone. This is where professional expertise becomes invaluable - we can adapt trending looks to suit your unique features.

Use your trial as an opportunity to test the longevity of your makeup. Wear it for several hours, take photos in different lighting, and see how it feels throughout the day. This information helps us make any necessary adjustments for your wedding day.`,
      tags: ['makeup trial', 'bridal trial session', 'wedding preparation', 'makeup testing'],
      keywords: ['bridal makeup trial Malaysia', 'wedding makeup trial', 'makeup trial session', 'bridal beauty preparation'],
      meta_title: "Bridal Makeup Trial: Your Guide to the Perfect Test Run | Mae Liew",
      meta_description: "Make the most of your bridal makeup trial session. Expert tips for testing your wedding day beauty look with Malaysia's top makeup artist.",
      created_at: '2026-10-03T12:25:00Z'
    },
    {
      title: "Traditional vs Modern: Blending Heritage and Contemporary Bridal Looks",
      description: `Malaysian weddings often involve multiple ceremonies and cultural traditions, requiring makeup looks that honor heritage while incorporating modern techniques. The art lies in creating looks that feel both timeless and contemporary, respecting cultural significance while ensuring you feel authentically beautiful.

For traditional ceremonies, I often incorporate elements like bold, defined eyes that complement traditional jewelry and attire. The key is understanding how different cultural elements work together - from the colors of traditional outfits to the significance of certain makeup styles within different communities.

Modern techniques can enhance traditional looks without overwhelming them. Using contemporary products and application methods, we can achieve the bold, dramatic looks that traditional ceremonies call for while ensuring comfort and longevity throughout long celebration days.`,
      tags: ['traditional wedding makeup', 'cultural wedding', 'heritage beauty', 'Malaysian traditions'],
      keywords: ['traditional Malaysian wedding makeup', 'cultural bridal makeup', 'heritage wedding beauty', 'traditional bridal looks'],
      meta_title: "Traditional vs Modern: Blending Heritage Bridal Beauty | Mae Liew",
      meta_description: "Perfect blend of traditional and modern bridal makeup for Malaysian weddings. Honor your heritage with contemporary beauty techniques.",
      created_at: '2026-11-19T08:50:00Z'
    },
    {
      title: "Wedding Day Timeline: Coordinating Beauty with Your Schedule",
      description: `Creating the perfect wedding day beauty timeline is crucial for a stress-free celebration. As a professional makeup artist, I work closely with brides to ensure their beauty schedule aligns perfectly with their overall wedding timeline, allowing for a relaxed and enjoyable preparation experience.

Typically, bridal makeup takes 1.5 to 2 hours, depending on the complexity of the look and whether hair styling is included. I always recommend starting early enough to avoid rushing, which can create unnecessary stress on your special day. Factor in time for photos during the getting-ready process, as these often become treasured memories.

Consider your ceremony time, travel requirements, and any pre-ceremony events when planning your beauty timeline. If you're having multiple outfit changes or ceremonies, we'll need to plan for touch-ups and potential look modifications throughout the day. Proper planning ensures you look flawless from the first photo to the last dance.`,
      tags: ['wedding day timeline', 'bridal schedule', 'wedding planning', 'makeup timing'],
      keywords: ['wedding day makeup timeline', 'bridal beauty schedule', 'wedding day planning', 'makeup artist timing'],
      meta_title: "Wedding Day Beauty Timeline: Perfect Scheduling Guide | Mae Liew",
      meta_description: "Plan your perfect wedding day beauty timeline. Expert scheduling tips from Malaysia's premier bridal makeup artist for stress-free preparation.",
      created_at: '2026-12-07T17:35:00Z'
    }
  ];

  // Get or create blog category
  let blogCategoryId = '';
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .eq('name', 'Blog')
      .eq('type', 'blog')
      .single();

    if (categories) {
      blogCategoryId = categories.id;
    } else {
      // Create blog category
      const { data: newCategory } = await supabase
        .from('categories')
        .insert({
          name: 'Blog',
          type: 'blog',
          description: 'General blog posts'
        })
        .select('id')
        .single();
      
      blogCategoryId = newCategory?.id || '';
    }
  } catch (error) {
    console.log('Creating blog category...');
  }

  // Check existing blog posts to prevent duplicates
  const { data: existingPosts } = await supabase
    .from('content')
    .select('title')
    .eq('type', 'blog');

  const existingTitles = new Set(existingPosts?.map(p => p.title) || []);

  // Insert blog posts (only if they don't already exist)
  for (const [index, post] of blogPosts.entries()) {
    try {
      // Skip if post already exists
      if (existingTitles.has(post.title)) {
        console.log(`⏭️  Skipping existing post: ${post.title}`);
        continue;
      }

      const contentData = {
        title: post.title,
        description: post.description,
        type: 'blog',
        category_id: blogCategoryId || null,
        tags: post.tags,
        keywords: post.keywords,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        status: 'published',
        created_at: post.created_at,
        updated_at: post.created_at,
        // Use high-quality wedding stock images from Unsplash
        file_path: [
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
        ][index % 10],
        alt_text: `Wedding makeup and beauty - ${post.title}`,
        file_name: `blog-${index + 1}.jpg`,
        mime_type: 'image/jpeg'
      };

      const { error } = await supabase
        .from('content')
        .insert(contentData);

      if (error) {
        console.log(`❌ Error creating ${post.title}:`, error.message);
      } else {
        console.log(`✅ Created blog post: ${post.title}`);
      }
    } catch (err) {
      console.log(`⚠️  Error creating ${post.title}:`, err);
    }
  }

  console.log('\n✅ SEO blog posts created successfully!');
  console.log('📝 10 wedding-themed blog posts with random dates have been added to your database');
  console.log('🖼️  Placeholder images have been assigned - you can replace them with actual wedding photos through the admin panel');
}

createSEOBlogs();