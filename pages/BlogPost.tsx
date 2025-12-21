import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { CRMService } from '../src/services/crmService';
import { Content } from '../src/lib/supabase';
import { findPostBySlug, titleToSlug } from '../src/utils/slugUtils';
import SEO from '../src/components/SEO';
import StructuredData from '../src/components/StructuredData';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Content | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadBlogPost(slug);
    }
  }, [slug]);

  const loadBlogPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all blog posts to find by slug
      const allPosts = await CRMService.getAllContent({ 
        type: 'blog', 
        status: 'published' 
      });
      
      // Find post by slug
      const blogPost = findPostBySlug(allPosts, postSlug);
      
      if (!blogPost || blogPost.type !== 'blog') {
        setError('Blog post not found');
        return;
      }
      
      setPost(blogPost);
      
      // Load related posts (exclude current post)
      const related = allPosts
        .filter(p => titleToSlug(p.title) !== postSlug)
        .slice(0, 3);
      
      setRelatedPosts(related);
      
    } catch (err) {
      console.error('Error loading blog post:', err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = window.location.href;
  const shareTitle = post?.title || '';

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#fdfbf7]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#fdfbf7]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center py-24">
            <h1 className="text-4xl font-serif mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 bg-[#E63946] text-white px-6 py-3 rounded hover:bg-red-700 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fdfbf7]">
      <SEO 
        title={`${post.title} | Mae Liew Atelier Blog`}
        description={post.description || `${post.content?.substring(0, 160)}...` || "Professional makeup tips and bridal beauty advice from Mae Liew Atelier"}
        keywords={`${post.title}, bridal makeup tips, wedding beauty, makeup advice, Mae Liew blog`}
        url={`https://www.maeliewatelier.com/blog/${slug}`}
        image={post.file_path || "https://www.maeliewatelier.com/images/about/mae.webp"}
        type="article"
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
        section="Beauty & Makeup"
        tags={[post.title, "Bridal Makeup", "Wedding Beauty", "Makeup Tips"]}
      />
      <StructuredData 
        type="article" 
        data={{
          title: post.title,
          description: post.description || post.content?.substring(0, 160),
          image: post.file_path,
          url: `https://www.maeliewatelier.com/blog/${slug}`,
          publishedTime: post.created_at,
          modifiedTime: post.updated_at
        }}
      />
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#E63946] transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            {post.category_name && (
              <>
                <span className="bg-[#E63946] text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                  {post.category_name}
                </span>
                <span>•</span>
              </>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.created_at)}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Tag size={16} />
                  <span>{post.tags.slice(0, 2).join(', ')}</span>
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
            {post.title}
          </h1>

          {/* Featured Image */}
          {post.file_path && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img
                src={post.file_path}
                alt={post.alt_text || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </motion.header>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none mb-16"
        >
          <div className="text-gray-700 leading-relaxed text-lg">
            {post.description?.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-200 pt-8 mb-16"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Share this article</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleShare('facebook')}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Share on Facebook"
              >
                <Facebook size={20} />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 text-gray-600 hover:text-blue-400 transition-colors"
                title="Share on Twitter"
              >
                <Twitter size={20} />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 text-gray-600 hover:text-blue-700 transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border-t border-gray-200 pt-16"
          >
            <h2 className="font-serif text-3xl mb-12 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${titleToSlug(relatedPost.title)}`}
                  className="group"
                >
                  <div className="aspect-video overflow-hidden rounded-lg mb-4">
                    <img
                      src={relatedPost.file_path || `https://picsum.photos/400/300?random=${relatedPost.id.slice(0, 8)}`}
                      alt={relatedPost.alt_text || relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif text-xl mb-2 group-hover:text-[#E63946] transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedPost.description?.substring(0, 120)}...
                  </p>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-24 bg-gray-50 p-12 rounded-lg"
        >
          <h2 className="font-serif text-3xl mb-4">Ready to Book Your Session?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your special day with professional makeup artistry. Let's create the perfect look for your celebration.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-[#E63946] text-white px-8 py-4 rounded hover:bg-red-700 transition-colors uppercase tracking-wider text-sm font-semibold"
          >
            Book Consultation
          </Link>
        </motion.section>

      </div>
    </div>
  );
};

export default BlogPost;