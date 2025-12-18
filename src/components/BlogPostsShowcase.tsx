import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import AnimationWrapper from './animations/AnimationWrapper';
import { CRMService } from '../services/crmService';
import { Content } from '../lib/supabase';
import { Link } from 'react-router-dom';

export const BlogPostsShowcase: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        // Fetch published blog posts
        const posts = await CRMService.getAllContent({
          type: 'blog',
          status: 'published',
          limit: 3
        });
        
        // Shuffle and pick random 3
        const shuffled = posts.sort(() => 0.5 - Math.random());
        setBlogPosts(shuffled.slice(0, 3));
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-max section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return null; // Don't show section if no blog posts
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-max section-padding">
        <AnimationWrapper animation="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">From the Blog</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tips, tutorials, and insights from the world of professional makeup artistry
            </p>
          </div>
        </AnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {blogPosts.map((post, index) => (
            <AnimationWrapper
              key={post.id}
              animation="slideUp"
              delay={index * 0.1}
            >
              <motion.div
                className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col"
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Featured Image */}
                {post.file_path && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.file_path}
                      alt={post.alt_text || post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <FileText size={16} />
                    <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{post.description}</p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More Link */}
                  <Link
                    to="/blog"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 group"
                  >
                    Read More
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </motion.div>
            </AnimationWrapper>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            View All Articles
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};
