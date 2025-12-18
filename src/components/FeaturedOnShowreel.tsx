import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimationWrapper from './animations/AnimationWrapper';
import { CRMService } from '../services/crmService';
import { Content } from '../lib/supabase';

export const FeaturedOnShowreel: React.FC = () => {
  const [featured, setFeatured] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        // Fetch published featured content
        const content = await CRMService.getAllContent({
          type: 'featured',
          status: 'published',
          limit: 20
        });
        setFeatured(content);
      } catch (error) {
        console.error('Error loading featured:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container-max section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (featured.length === 0) {
    return null; // Don't show section if no featured items
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-max section-padding">
        <AnimationWrapper animation="fadeIn">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
              Featured On
            </h2>
            <p className="text-gray-600">
              Recognized by leading publications and platforms
            </p>
          </div>
        </AnimationWrapper>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {featured.map((item, index) => (
            <AnimationWrapper
              key={item.id}
              animation="slideUp"
              delay={index * 0.1}
            >
              <motion.div
                className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={item.file_path || ''}
                  alt={item.alt_text || item.title}
                  className="h-12 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity"
                  title={item.title}
                />
              </motion.div>
            </AnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};