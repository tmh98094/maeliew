import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CRMService } from '../services/crmService';
import { Content } from '../lib/supabase';

interface PartnersGridProps {
  limit?: number;
  columns?: number;
  className?: string;
}

export const PartnersGrid: React.FC<PartnersGridProps> = ({
  limit = 12,
  columns = 6,
  className = ''
}) => {
  const [partners, setPartners] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true); // Start as visible for immediate loading



  // Load immediately for now (remove intersection observer complexity)
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const loadPartners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch published partner content
      const content = await CRMService.getAllContent({
        type: 'partner',
        status: 'published',
        limit
      });
      setPartners(content || []);
      
      // If no content, try to load any partner content regardless of status
      if (!content || content.length === 0) {
        const allPartners = await CRMService.getAllContent({
          type: 'partner',
          limit
        });
        
        if (allPartners && allPartners.length > 0) {
          setPartners(allPartners);
        } else {
          // Use fallback data for demonstration
          setPartners([
            {
              id: 'partner-fallback-1',
              title: 'MAC Cosmetics',
              file_path: '/public/images/featured/MAC-Cosmetics-logo.png',
              alt_text: 'MAC Cosmetics logo',
              type: 'partner' as const,
              status: 'published' as const,
              view_count: 0,
              download_count: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 'partner-fallback-2',
              title: 'Shu Uemura',
              file_path: '/public/images/featured/shu-uemura-logo.png',
              alt_text: 'Shu Uemura logo',
              type: 'partner' as const,
              status: 'published' as const,
              view_count: 0,
              download_count: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 'partner-fallback-3',
              title: 'RecommendMy',
              file_path: '/public/images/featured/recommendmy.svg',
              alt_text: 'RecommendMy logo',
              type: 'partner' as const,
              status: 'published' as const,
              view_count: 0,
              download_count: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
        }
      }
    } catch (err) {
      console.error('Error loading partners:', err);
      setError('Failed to load partners');
      setPartners([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (isVisible) {
      loadPartners();
    }
  }, [isVisible, loadPartners]);

  if (loading) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E63946]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className={`py-20 px-6 md:px-12 ${className}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-[2px] bg-[#E63946] mx-auto mb-6"></div>
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
              Trusted Partners
            </h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              Unable to load partner information at this time.
            </p>
          </div>
          
          {/* Fallback content */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg p-4 md:p-6 flex items-center justify-center"
                style={{ minHeight: '100px' }}
              >
                <div className="text-xs text-gray-400 text-center">
                  Partner<br/>Logo
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null; // Don't render if no partners
  }

  // Determine grid columns based on screen size and columns prop
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-3 md:grid-cols-6',
  }[Math.min(columns, 6)] || 'grid-cols-3 md:grid-cols-6';

  return (
    <section className={`py-16 md:py-20 px-6 md:px-12 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="w-16 h-[2px] bg-[#E63946] mx-auto mb-6"></div>
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
            Trusted Partners
          </h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto">
            Collaborating with prestigious brands and industry leaders to deliver exceptional results.
          </p>
        </div>

        {/* Partners Grid */}
        <div 
          className={`grid ${gridCols} gap-4 md:gap-6 lg:gap-8`}
          role="list"
          aria-label="Partner organizations"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="group relative bg-white rounded-lg p-4 md:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-opacity-50"
              style={{
                minHeight: '100px'
              }}
              role="listitem"
              aria-label={`Partner: ${partner.title}`}
              tabIndex={0}
            >
              <div className="flex items-center justify-center h-full">
                <img
                  src={partner.file_path || ''}
                  alt={partner.alt_text || partner.title}
                  className="max-w-full max-h-12 md:max-h-16 object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                  title={partner.title}
                  loading="lazy"
                  decoding="async"
                  style={{ willChange: 'transform, filter, opacity' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="text-xs text-gray-400 text-center">${partner.title}</div>`;
                    }
                  }}
                />
              </div>
              
              {/* Mobile-friendly touch overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 rounded-lg transition-all duration-300 flex items-end justify-center opacity-0 group-hover:opacity-100 md:group-hover:opacity-100">
                <div className="text-xs text-gray-600 font-medium p-2 text-center">
                  {partner.title}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show more indicator if there are more partners */}
        {partners.length === limit && (
          <div className="text-center mt-12">
            <div className="text-sm text-gray-500 font-light">
              And many more trusted partnerships...
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnersGrid;