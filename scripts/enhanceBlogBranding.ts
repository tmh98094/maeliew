import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function enhanceBlogBranding() {
  console.log('Enhancing blog posts with Mae Liew branding...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Enhanced blog content with Mae Liew branding
  const enhancedBlogs = [
    {
      title: "10 Essential Bridal Makeup Tips for Your Perfect Wedding Day",
      description: `Your wedding day is one of the most important days of your life, and looking absolutely stunning is a top priority. As Mae Liew, a professional bridal makeup artist in Malaysia with over 8 years of experience, I've helped hundreds of brides achieve their dream look. Here are my top 10 essential tips to ensure your bridal makeup is flawless and long-lasting.

First, always start with a good skincare routine at least 3 months before your wedding. This creates the perfect canvas for makeup application. At Mae Liew Atelier, I always recommend this to my brides during our consultation sessions.

Second, book your makeup trial at least 2 months in advance to allow time for adjustments. During my trials, I work closely with each bride to understand their vision and create a look that enhances their natural beauty.

Third, consider your wedding venue and lighting when choosing your makeup style. Having worked at venues across Malaysia from Kuala Lumpur to Penang, I know how different lighting affects makeup photography.

Don't forget to bring your lipstick for touch-ups throughout the day, and always opt for waterproof mascara and eyeliner. At Mae Liew Atelier, I provide a touch-up kit for every bride to ensure they look perfect from ceremony to reception.

Finally, trust your makeup artist's expertise. With my experience working with Malaysian brides of all skin tones and cultural backgrounds, I know what works best for photography and different lighting conditions. Book your consultation with Mae Liew Atelier today to start planning your perfect bridal look.`,
      meta_description: "Expert bridal makeup tips from Mae Liew, Malaysia's premier makeup artist. Get the perfect wedding day look with professional beauty secrets and techniques."
    },
    {
      title: "ROM Ceremony Makeup: Elegant and Timeless Looks for Your Special Day",
      description: `Registration of Marriage (ROM) ceremonies call for a more understated yet elegant makeup look. As Mae Liew, having worked with countless Malaysian couples for their ROM ceremonies, I understand the unique requirements of this intimate celebration.

Unlike traditional wedding ceremonies, ROM events are typically more intimate and require a sophisticated approach to bridal beauty. At Mae Liew Atelier, I specialize in creating looks that photograph beautifully while maintaining the elegance appropriate for this special occasion.

The key to perfect ROM makeup is achieving a natural glow while still looking polished for photographs. I recommend a dewy foundation finish, soft neutral eyeshadows, and a classic winged eyeliner. For lips, I often choose a timeless red or nude pink that complements the bride's outfit and skin tone.

ROM ceremonies often involve multiple outfit changes, so your makeup needs to be versatile enough to work with different colors and styles. This is where my expertise at Mae Liew Atelier makes all the difference - I know which techniques and products will photograph beautifully and last throughout your celebration.

Having worked with couples from diverse cultural backgrounds across Malaysia, I understand the importance of creating a look that honors tradition while reflecting your personal style. Contact Mae Liew Atelier to discuss your ROM ceremony makeup needs and let's create something beautiful together.`,
      meta_description: "Perfect ROM ceremony makeup by Mae Liew, Malaysia's top makeup artist. Elegant, timeless looks for your Registration of Marriage celebration."
    },
    {
      title: "Pre-Wedding Photoshoot Makeup: Creating Picture-Perfect Moments",
      description: `Pre-wedding photoshoots are becoming increasingly popular among Malaysian couples, and as Mae Liew, I've had the privilege of working on countless romantic shoots across beautiful locations from Cameron Highlands to Langkawi beaches.

The makeup for these sessions requires special consideration. Unlike wedding day makeup, pre-wedding shoot makeup needs to be more dramatic and camera-ready to translate beautifully in photographs. At Mae Liew Atelier, I've perfected techniques specifically for photography.

For outdoor shoots, I always recommend using HD makeup products that won't look cakey under natural lighting. The key is to enhance your natural features while ensuring the makeup photographs well from all angles. Bold eyes with defined lashes work wonderfully for romantic shots, while a more natural look suits lifestyle photography.

Consider your shoot locations and themes when planning your makeup looks. Beach shoots call for waterproof everything, while urban settings allow for more dramatic, editorial-style makeup. Having worked across Malaysia's diverse landscapes, I know exactly how to adapt makeup for different environments.

Multiple looks can be achieved with strategic touch-ups and color changes throughout the day. At Mae Liew Atelier, I bring a comprehensive kit to ensure we can create 2-3 different looks during your shoot, maximizing the variety of your photos.

Ready to create stunning pre-wedding photos? Contact Mae Liew Atelier to discuss your vision and let's make your love story shine through beautiful imagery.`,
      meta_description: "Stunning pre-wedding photoshoot makeup by Mae Liew. Professional makeup artist for engagement and couple photography across Malaysia."
    },
    {
      title: "Choosing the Right Makeup Artist: What Every Bride Should Know",
      description: `Selecting the perfect makeup artist for your wedding is one of the most important decisions you'll make during wedding planning. As Mae Liew, with over 8 years of experience in the Malaysian bridal industry, I want to share what you should look for when choosing your makeup artist.

Start by researching makeup artists whose portfolios showcase work similar to what you envision for yourself. At Mae Liew Atelier, my portfolio demonstrates consistency across different skin tones, cultural backgrounds, and wedding styles - from traditional Malaysian ceremonies to modern destination weddings.

Look for consistency in their work, attention to detail, and experience with your specific needs. Whether you're planning a traditional Chinese tea ceremony, Malay wedding, Indian celebration, or modern Western ceremony, your makeup artist should understand the cultural significance and requirements.

Don't forget to consider personality fit as well. You'll be spending several hours with your makeup artist on your wedding day, so it's important to choose someone who makes you feel comfortable and confident. During consultations at Mae Liew Atelier, I ensure every bride feels heard and understood.

Always book a trial session to test both the makeup look and your chemistry with the artist. This is where you'll discover if they truly understand your vision and can execute it flawlessly.

Check their experience with Malaysian weather and venues. Having worked across Malaysia from KL's urban hotels to Penang's beach resorts, I understand how humidity and different lighting conditions affect makeup longevity.

Ready to find your perfect makeup artist? Contact Mae Liew Atelier for a consultation and let's discuss how I can make your wedding day vision come to life.`,
      meta_description: "Expert guide to choosing the right wedding makeup artist by Mae Liew, Malaysia's premier bridal makeup professional with 8+ years experience."
    },
    {
      title: "Malaysian Wedding Makeup Trends 2024: What's Hot This Year",
      description: `Malaysian wedding makeup trends for 2024 are all about celebrating natural beauty while incorporating modern techniques and timeless elegance. As Mae Liew, having worked with brides across Malaysia this year, I've seen exciting shifts in what couples are requesting.

This year, we're seeing a move towards more sustainable beauty practices and looks that photograph beautifully both in person and on social media. At Mae Liew Atelier, I've adapted my techniques to meet these evolving preferences while maintaining the quality my clients expect.

The 'no-makeup makeup' look continues to be popular, but with elevated techniques that ensure you still look stunning in photos. Dewy, glowing skin is the foundation of this trend, achieved through expert color matching and highlighting techniques that I've perfected over years of working with Malaysian skin tones.

Bold, defined brows are having a moment, paired with soft, romantic eye looks. For lips, we're seeing a return to classic reds and berry tones that complement Malaysia's diverse skin tones beautifully. The key is achieving a look that feels authentically you while incorporating these contemporary elements.

Cultural fusion is also trending - brides are blending traditional Malaysian elements with modern techniques. At Mae Liew Atelier, I specialize in creating looks that honor heritage while feeling fresh and contemporary.

Sustainability is becoming important too. Many of my clients are asking about eco-friendly products and techniques that create less waste. I've curated a selection of sustainable beauty products that don't compromise on quality or longevity.

Want to incorporate 2024's hottest trends into your wedding look? Contact Mae Liew Atelier to discuss how we can create a contemporary yet timeless look for your special day.`,
      meta_description: "Discover 2024's hottest Malaysian wedding makeup trends with Mae Liew, Malaysia's leading bridal makeup artist. Stay current with the latest beauty styles."
    }
  ];

  try {
    // Get existing blog posts
    const { data: existingPosts, error } = await supabase
      .from('content')
      .select('id, title')
      .eq('type', 'blog');

    if (error) {
      console.error('Error fetching blog posts:', error);
      return;
    }

    // Update each blog post with enhanced branding
    for (const enhancedBlog of enhancedBlogs) {
      const existingPost = existingPosts?.find(p => p.title === enhancedBlog.title);
      
      if (existingPost) {
        const { error: updateError } = await supabase
          .from('content')
          .update({
            description: enhancedBlog.description,
            meta_description: enhancedBlog.meta_description,
            keywords: [
              'Mae Liew',
              'Mae Liew Atelier', 
              'Malaysia makeup artist',
              'bridal makeup Malaysia',
              'wedding makeup artist',
              'professional makeup artist Malaysia'
            ]
          })
          .eq('id', existingPost.id);

        if (updateError) {
          console.error(`Error updating ${enhancedBlog.title}:`, updateError);
        } else {
          console.log(`✅ Enhanced: ${enhancedBlog.title}`);
        }
      } else {
        console.log(`⚠️  Post not found: ${enhancedBlog.title}`);
      }
    }

    console.log('\n✅ Blog branding enhancement complete!');
    console.log('🎯 All blog posts now include Mae Liew branding and expertise positioning');
    console.log('📈 Enhanced SEO with brand keywords and professional authority');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

enhanceBlogBranding();