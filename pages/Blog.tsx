import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CRMService } from '../src/services/crmService';
import { Content } from '../src/lib/supabase';
import { titleToSlug } from '../src/utils/slugUtils';

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

// Fallback blog posts for when Supabase is not available
const FALLBACK_BLOG_POSTS = [
  {
    id: 1,
    title: "Preparing your skin for the Big Day",
    category: "Skincare",
    date: "October 12, 2025",
    image: WEDDING_IMAGES[0],
    excerpt: "The secret to flawless makeup starts months before the wedding. Here is my 6-month skincare routine guide for brides-to-be. Discover the essential steps to achieve that perfect bridal glow..."
  },
  {
    id: 2,
    title: "2026 Bridal Makeup Trends Forecast",
    category: "Trends",
    date: "September 28, 2025",
    image: WEDDING_IMAGES[1],
    excerpt: "Moving away from heavy matte, 2026 is all about 'Glass Skin' and ethereal glows. Let's dive into the upcoming season's aesthetics and discover what's trending in bridal beauty..."
  },
  {
    id: 3,
    title: "Behind the Scenes: Tinashe's Tour Look",
    category: "Celebrity",
    date: "August 15, 2025",
    image: WEDDING_IMAGES[2],
    excerpt: "Creating a look that withstands sweat, lights, and quick changes requires specific techniques. Here's how we achieved it for one of Malaysia's biggest stars on her international tour..."
  },
  {
    id: 4,
    title: "Choosing the Right False Lashes",
    category: "Tips",
    date: "July 02, 2025",
    image: WEDDING_IMAGES[3],
    excerpt: "Not all eyes are the same. Learn how to pick the perfect lash style to open up your eyes without weighing them down. From natural to dramatic, find your perfect match..."
  },
  {
    id: 5,
    title: "Wedding Day Timeline: Beauty Schedule",
    category: "Planning",
    date: "June 18, 2025",
    image: WEDDING_IMAGES[4],
    excerpt: "Planning your wedding day beauty timeline is crucial for a stress-free celebration. Here's how to coordinate your makeup and hair schedule with your wedding day events..."
  },
  {
    id: 6,
    title: "Destination Wedding Makeup Tips",
    category: "Travel",
    date: "May 25, 2025",
    image: WEDDING_IMAGES[5],
    excerpt: "Getting married in a tropical paradise? Learn the essential tips for destination wedding makeup that will withstand humidity, heat, and ocean breezes while looking flawless..."
  }
];

interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  category?: string;
  date: string;
  image: string;
  excerpt: string;
}

const Blog: React.FC = () => {
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 5;

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      
      // Try to load blog posts from Supabase
      const blogContent = await CRMService.getAllContent({ 
        type: 'blog', 
        status: 'published' 
      });

      if (blogContent && blogContent.length > 0) {
        // Convert Supabase content to blog post format
        const formattedPosts: BlogPost[] = blogContent.map((content: Content, index: number) => ({
          id: content.id,
          title: content.title,
          slug: titleToSlug(content.title),
          category: content.category_name || 'Blog',
          date: content.published_at 
            ? new Date(content.published_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            : new Date(content.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }),
          image: content.file_path || WEDDING_IMAGES[index % WEDDING_IMAGES.length],
          excerpt: content.description ? content.description.substring(0, 200) + '...' : 'Read more about this topic...'
        }));
        
        setAllBlogPosts(formattedPosts);
      } else {
        // No blog posts found, use fallback
        const fallbackWithSlugs = FALLBACK_BLOG_POSTS.map(post => ({
          ...post,
          slug: titleToSlug(post.title)
        }));
        setAllBlogPosts(fallbackWithSlugs);
      }
    } catch (err) {
      console.error('Error loading blog posts:', err);
      // Fallback to static data if Supabase fails
      const fallbackWithSlugs = FALLBACK_BLOG_POSTS.map(post => ({
        ...post,
        slug: titleToSlug(post.title)
      }));
      setAllBlogPosts(fallbackWithSlugs);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(allBlogPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = allBlogPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#fdfbf7]">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fdfbf7]">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        
        <div className="text-center mb-24">
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-gray-500 uppercase tracking-widest text-xs mb-4"
           >
             The Atelier Journal
           </motion.p>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="font-serif text-5xl md:text-7xl"
           >
             Beauty Insights
           </motion.h1>
        </div>

        {allBlogPosts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg mb-4">No blog posts available at the moment.</p>
            <p className="text-gray-400 text-sm">Check back soon for new beauty insights and tips!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-20">
              {currentPosts.map((post, index) => (
              <Link to={`/blog/${post.slug}`} key={post.id}>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer flex flex-col md:flex-row gap-8 md:gap-16 items-start"
                >
                <div className="w-full md:w-1/2 aspect-video overflow-hidden bg-gray-200">
                   <img 
                     src={post.image} 
                     alt={post.title} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                </div>
                <div className="w-full md:w-1/2 pt-4">
                   <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-400 mb-4">
                      <span className="text-[#E63946] font-bold">{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                   </div>
                   <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight group-hover:text-[#E63946] transition-colors">
                     {post.title}
                   </h2>
                   <p className="text-gray-600 font-light leading-relaxed mb-6">
                     {post.excerpt}
                   </p>
                   <span className="text-xs uppercase tracking-widest border-b border-black pb-1 group-hover:border-[#E63946] group-hover:text-[#E63946] transition-all">Read Article</span>
                </div>
                </motion.div>
              </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center items-center gap-4 mt-24"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-[#E63946] hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded transition-colors ${
                        currentPage === page
                          ? 'bg-[#E63946] text-white'
                          : 'text-gray-600 hover:text-[#E63946] hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-[#E63946] hover:bg-gray-50'
                  }`}
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Blog;