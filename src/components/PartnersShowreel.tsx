import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimationWrapper from './animations/AnimationWrapper';
import { CRMService } from '../services/crmService';
import { Content } from '../lib/supabase';

export const PartnersShowreel: React.FC = () => {
  const [partners, setPartners] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        // Fetch published partner content
        const content = await CRMService.getAllContent({
          type: 'partner',
          status: 'published',
          limit: 20
        });
        setPartners(content);
      } catch (error) {
        console.error('Error loading partners:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-max section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null; // Don't show section if no partners
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-max section-padding">
        <AnimationWrapper animation="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Partnered With
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proud to collaborate with leading beauty brands and organizations
            </p>
          </div>
        </AnimationWrapper>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <AnimationWrapper
              key={partner.id}
              animation="slideUp"
              delay={index * 0.05}
            >
              <motion.div
                className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={partner.file_path || ''}
                  alt={partner.alt_text || partner.title}
                  className="w-full h-24 object-contain"
                  title={partner.title}
                />
              </motion.div>
            </AnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};
