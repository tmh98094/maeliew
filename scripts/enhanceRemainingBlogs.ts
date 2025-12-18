import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function enhanceRemainingBlogs() {
  console.log('Enhancing remaining blog posts with Mae Liew branding...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Enhanced content for remaining blog posts
  const remainingBlogs = [
    {
      title: "Destination Wedding Makeup: Tips for Tropical and Beach Ceremonies",
      description: `Destination weddings in Malaysia's beautiful tropical locations require special makeup considerations. As Mae Liew, I've had the privilege of working on stunning destination weddings from the beaches of Langkawi to the highlands of Cameron, and I've learned exactly what it takes to create flawless looks in challenging environments.

Whether you're getting married on the beaches of Langkawi, in the highlands of Cameron, or at a resort in Penang, your makeup needs to withstand humidity, heat, and potentially outdoor elements. At Mae Liew Atelier, I've developed specialized techniques for Malaysia's tropical climate.

The key to successful destination wedding makeup is using long-wearing, waterproof products that won't budge in tropical conditions. I always recommend a primer specifically designed for humid climates, followed by a long-wearing foundation that won't oxidize or separate throughout the day.

For beach weddings, consider the natural lighting and ocean breeze when planning your look. Soft, romantic makeup with defined eyes and a natural flush works beautifully against tropical backdrops. Having worked across Malaysia's coastlines, I know how salt air and humidity affect different products.

Don't forget to factor in travel logistics - your makeup artist needs to be prepared with a comprehensive kit that travels well. At Mae Liew Atelier, I have specialized travel kits for destination weddings, ensuring every product can withstand the journey and perform perfectly on your special day.

I also coordinate with your photographer and wedding planner to understand the day's timeline and lighting conditions. This collaboration ensures your makeup looks stunning from the first photo to the last dance under the stars.

Planning a destination wedding in Malaysia? Contact Mae Liew Atelier to discuss how I can travel with you to create the perfect tropical wedding look that will withstand any weather while keeping you looking absolutely radiant.`,
      meta_description: "Expert destination wedding makeup for tropical ceremonies in Malaysia by Mae Liew. Long-lasting beauty for beach and outdoor weddings.",
      keywords: ['Mae Liew', 'destination wedding makeup Malaysia', 'beach wedding makeup', 'tropical wedding beauty', 'Malaysia wedding makeup artist']
    },
    {
      title: "The Art of Contouring: Enhancing Your Natural Beauty for Weddings",
      description: `Contouring has become an essential technique in modern bridal makeup, but when done correctly by a professional like Mae Liew, it should enhance your natural bone structure rather than create an entirely different face. At Mae Liew Atelier, I've perfected contouring techniques specifically for Malaysian brides with diverse facial structures and skin tones.

The key to successful bridal contouring is subtlety. Unlike Instagram makeup, wedding contouring should look natural in person while still providing definition for photographs. Having worked with brides across Malaysia's multicultural landscape, I understand how different face shapes and skin tones require unique approaches.

I use cream products for a more natural finish, blending seamlessly into the skin for a sculpted yet soft appearance. This technique has been refined through years of experience at Mae Liew Atelier, working with brides of Chinese, Malay, Indian, and mixed heritage backgrounds.

Different face shapes require different contouring approaches. Round faces benefit from subtle cheekbone definition, while square faces need softening around the jawline. Heart-shaped faces require different techniques than oval faces. At Mae Liew Atelier, I assess each bride's unique features during our consultation to create a personalized contouring plan.

The goal is always to enhance your unique beauty, not to follow a one-size-fits-all template. I believe every bride should look like the most beautiful version of herself, not like someone else entirely.

For Malaysian brides, I also consider how contouring will photograph under different lighting conditions - from the soft morning light during preparation photos to the dramatic evening lighting at your reception.

Want to learn how professional contouring can enhance your natural beauty for your wedding day? Book a consultation with Mae Liew Atelier and let's discover the perfect techniques for your unique features.`,
      meta_description: "Master bridal contouring techniques with Mae Liew, Malaysia's expert makeup artist. Enhance your natural beauty for your wedding day.",
      keywords: ['Mae Liew', 'bridal contouring Malaysia', 'wedding makeup contouring', 'face shaping makeup', 'professional contouring techniques Malaysia']
    },
    {
      title: "Makeup Trial Sessions: Making the Most of Your Bridal Beauty Test Run",
      description: `Your bridal makeup trial is one of the most important appointments in your wedding planning process. As Mae Liew, I've conducted hundreds of trials at Mae Liew Atelier, and I can tell you that this session is crucial for ensuring your wedding day look is absolutely perfect.

This session allows you to test your chosen look, make adjustments, and ensure you're completely happy with your wedding day beauty plan. At Mae Liew Atelier, I dedicate 2-3 hours for each trial to ensure we have time to perfect every detail.

Come to your trial with inspiration photos, but be open to my professional suggestions. What looks good in a photo might not translate perfectly to your face shape or skin tone. This is where my expertise becomes invaluable - I can adapt trending looks to suit your unique features while maintaining the essence of what you love.

During trials at Mae Liew Atelier, I also educate my brides about the products I'm using and why I've chosen them. This helps you understand the process and feel confident about your wedding day look.

Use your trial as an opportunity to test the longevity of your makeup. I encourage brides to wear their trial makeup for several hours, take photos in different lighting, and see how it feels throughout the day. This information helps us make any necessary adjustments for your wedding day.

We'll also discuss your wedding day timeline, venue lighting, and any special considerations like outdoor ceremonies or multiple outfit changes. At Mae Liew Atelier, I believe in thorough preparation to ensure everything runs smoothly on your special day.

Don't forget to bring your wedding jewelry and any hair accessories to the trial. This helps us see the complete look and make sure everything works harmoniously together.

Ready to book your bridal makeup trial? Contact Mae Liew Atelier to schedule your session and start perfecting your dream wedding look.`,
      meta_description: "Make the most of your bridal makeup trial with Mae Liew, Malaysia's top makeup artist. Expert tips for testing your wedding day beauty look.",
      keywords: ['Mae Liew', 'bridal makeup trial Malaysia', 'wedding makeup trial', 'makeup trial session', 'bridal beauty preparation Malaysia']
    },
    {
      title: "Traditional vs Modern: Blending Heritage and Contemporary Bridal Looks",
      description: `Malaysian weddings often involve multiple ceremonies and cultural traditions, requiring makeup looks that honor heritage while incorporating modern techniques. As Mae Liew, having worked with brides from all of Malaysia's diverse cultural backgrounds, I've mastered the art of creating looks that feel both timeless and contemporary.

At Mae Liew Atelier, I specialize in understanding the cultural significance of different wedding traditions while ensuring you feel authentically beautiful. Whether you're having a traditional Chinese tea ceremony, Malay akad nikah, Indian wedding, or a fusion celebration, I know how to create appropriate yet stunning looks.

For traditional ceremonies, I often incorporate elements like bold, defined eyes that complement traditional jewelry and attire. The key is understanding how different cultural elements work together - from the colors of traditional outfits to the significance of certain makeup styles within different communities.

Having worked across Malaysia's multicultural landscape for over 8 years, I understand the nuances of each tradition. For Chinese brides, I know the importance of red lips and how to make them photograph beautifully. For Malay brides, I understand the elegance required for traditional ceremonies. For Indian brides, I know how to create dramatic looks that complement intricate jewelry and vibrant colors.

Modern techniques can enhance traditional looks without overwhelming them. Using contemporary products and application methods, we can achieve the bold, dramatic looks that traditional ceremonies call for while ensuring comfort and longevity throughout long celebration days.

At Mae Liew Atelier, I also help brides navigate multiple ceremony looks. We plan how to transition from a traditional morning ceremony to a modern evening reception, ensuring each look is appropriate while maintaining your personal style throughout.

The beauty of Malaysian weddings is in their diversity and the opportunity to celebrate multiple cultures. I love helping couples honor their heritage while creating looks that feel fresh and personal to them.

Planning a traditional or fusion wedding? Contact Mae Liew Atelier to discuss how we can create beautiful looks that honor your heritage while reflecting your personal style.`,
      meta_description: "Perfect blend of traditional and modern bridal makeup for Malaysian weddings by Mae Liew. Honor your heritage with contemporary beauty techniques.",
      keywords: ['Mae Liew', 'traditional Malaysian wedding makeup', 'cultural bridal makeup', 'heritage wedding beauty', 'multicultural wedding makeup Malaysia']
    },
    {
      title: "Wedding Day Timeline: Coordinating Beauty with Your Schedule",
      description: `Creating the perfect wedding day beauty timeline is crucial for a stress-free celebration. As Mae Liew, with over 8 years of experience coordinating wedding day schedules across Malaysia, I work closely with brides to ensure their beauty schedule aligns perfectly with their overall wedding timeline.

At Mae Liew Atelier, I've learned that proper timing can make or break your wedding day experience. Typically, bridal makeup takes 1.5 to 2 hours, depending on the complexity of the look and whether hair styling is included. I always recommend starting early enough to avoid rushing, which can create unnecessary stress on your special day.

Factor in time for photos during the getting-ready process, as these often become treasured memories. I coordinate with your photographer to ensure we have beautiful lighting and enough time for those intimate preparation shots that capture the anticipation and excitement of your morning.

Consider your ceremony time, travel requirements, and any pre-ceremony events when planning your beauty timeline. If you're having multiple outfit changes or ceremonies - common in Malaysian multicultural weddings - we'll need to plan for touch-ups and potential look modifications throughout the day.

At Mae Liew Atelier, I also factor in time for your bridal party if they're getting their makeup done. I bring additional team members when needed to ensure everyone is ready on time without compromising quality.

Weather and venue logistics also affect timing. If you're getting ready at a hotel versus your family home, or if there's significant travel time to your ceremony venue, we adjust the schedule accordingly. Having worked across Malaysia from KL hotels to Penang beach resorts, I understand these logistical considerations.

I also build in buffer time for unexpected delays - because weddings rarely go exactly according to plan! This ensures you never feel rushed and can enjoy every moment of your preparation.

For destination weddings or outdoor ceremonies, we may need to adjust timing based on lighting conditions and weather. I work with your wedding planner to ensure perfect coordination.

Ready to create your perfect wedding day timeline? Contact Mae Liew Atelier to discuss your schedule and let's ensure your beauty preparation is seamless and stress-free.`,
      meta_description: "Plan your perfect wedding day beauty timeline with Mae Liew, Malaysia's premier bridal makeup artist. Expert scheduling for stress-free preparation.",
      keywords: ['Mae Liew', 'wedding day makeup timeline', 'bridal beauty schedule', 'wedding day planning Malaysia', 'makeup artist timing Malaysia']
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

    // Update each remaining blog post
    for (const blog of remainingBlogs) {
      const existingPost = existingPosts?.find(p => p.title === blog.title);
      
      if (existingPost) {
        const { error: updateError } = await supabase
          .from('content')
          .update({
            description: blog.description,
            meta_description: blog.meta_description,
            keywords: blog.keywords
          })
          .eq('id', existingPost.id);

        if (updateError) {
          console.error(`Error updating ${blog.title}:`, updateError);
        } else {
          console.log(`✅ Enhanced: ${blog.title}`);
        }
      } else {
        console.log(`⚠️  Post not found: ${blog.title}`);
      }
    }

    console.log('\n✅ All remaining blog posts enhanced!');
    console.log('🎯 Complete Mae Liew branding across all blog content');
    console.log('📈 Enhanced SEO with consistent brand authority and expertise positioning');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

enhanceRemainingBlogs();