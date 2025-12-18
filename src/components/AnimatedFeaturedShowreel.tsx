import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CRMService } from '../services/crmService';
import { Content } from '../lib/supabase';

interface AnimatedFeaturedShowreelProps {
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
  className?: string;
}

export const AnimatedFeaturedShowreel: React.FC<AnimatedFeaturedShowreelProps> = ({
  speed = 30,
  pauseOnHover = true,
  className = ''
}) => {
  const [featured, setFeatured] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Start as visible for immediate loading
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [translateX, setTranslateX] = useState(0);

  // Load immediately for now (remove intersection observer complexity)
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const loadFeatured = async () => {
      try {
        setError(null);
        // Fetch published featured content
        const content = await CRMService.getAllContent({
          type: 'featured',
          status: 'published',
          limit: 20
        });
        setFeatured(content || []);
        
        // If no content, try to load any featured content regardless of status
        if (!content || content.length === 0) {
          const allFeatured = await CRMService.getAllContent({
            type: 'featured',
            limit: 20
          });
          
          if (allFeatured && allFeatured.length > 0) {
            setFeatured(allFeatured);
          } else {
            // Use fallback data for demonstration
            setFeatured([
              {
                id: 'fallback-1',
                title: 'Marie France Asia',
                file_path: '/public/images/featured/MarieFrance.png',
                alt_text: 'Marie France Asia logo',
                type: 'featured' as const,
                status: 'published' as const,
                view_count: 0,
                download_count: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 'fallback-2',
                title: 'BrideStory',
                file_path: '/public/images/featured/BrideStory.png',
                alt_text: 'BrideStory logo',
                type: 'featured' as const,
                status: 'published' as const,
                view_count: 0,
                download_count: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 'fallback-3',
                title: 'Shu Uemura',
                file_path: '/public/images/featured/shu-uemura-logo.png',
                alt_text: 'Shu Uemura logo',
                type: 'featured' as const,
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
        console.error('Error loading featured content:', err);
        setError('Failed to load featured content');
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, [isVisible]);

  const startAnimation = useCallback(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused || featured.length === 0 || !isVisible) return;

    let animationStartTime = performance.now();

    const animate = () => {
      if (!isPaused && featured.length > 0) {
        const currentTime = performance.now();
        const elapsed = (currentTime - animationStartTime) / 1000; // Convert to seconds
        
        // Calculate the width of one set of original items
        // Item width: 120px + gap (24px on mobile, 32px on md, 48px on lg)
        // Using average gap of 32px for smooth calculation
        const itemWidth = 152; // 120px width + 32px gap
        const singleSetWidth = featured.length * itemWidth;
        
        // Calculate continuous movement distance
        const totalDistance = elapsed * speed;
        
        // Use modulo to create seamless infinite loop
        // This ensures smooth continuous movement without jumps
        const currentTranslate = -(totalDistance % singleSetWidth);
        
        setTranslateX(currentTranslate);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, featured.length, isVisible, speed]);

  useEffect(() => {
    // Clean up any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Start new animation if conditions are met
    if (!loading && featured.length > 0 && isVisible) {
      startAnimation();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [loading, featured, isPaused, speed, isVisible, startAnimation]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  if (loading) {
    return (
      <div className={`py-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E63946]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-8 ${className}`}>
        <div className="text-center">
          <div className="text-gray-500 mb-4">
            <p className="text-sm">Unable to load featured publications</p>
          </div>
          {/* Fallback content */}
          <div className="flex justify-center items-center gap-8 opacity-50">
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Featured</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Publication</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Logo</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (featured.length === 0) {
    return null; // Don't render if no featured items
  }

  // Create enough duplicated items for seamless infinite loop
  // We need at least 3 sets to ensure smooth looping
  const duplicatedItems = [...featured, ...featured, ...featured];

  return (
    <div className={`py-12 md:py-16 overflow-hidden ${className}`}>
      <div className="text-center mb-12 md:mb-16">
        <div className="w-16 h-[2px] bg-[#E63946] mx-auto mb-6"></div>
        <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
          Featured On
        </h2>
        <p className="text-gray-600 font-light max-w-2xl mx-auto">
          Recognized by leading publications and platforms
        </p>
      </div>
      
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="region"
        aria-label="Featured publications carousel"
        aria-live="polite"
      >
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-6 md:gap-8 lg:gap-12"
          style={{
            transform: `translateX(${translateX}px)`,
            willChange: isVisible ? 'transform' : 'auto'
          }}
          role="list"
          aria-label="Featured publication logos"
        >
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 flex items-center justify-center p-3 md:p-4 transition-all duration-300 grayscale hover:grayscale-0 touch-manipulation"
              style={{
                minWidth: '100px',
                width: '120px',
                height: '70px'
              }}
              role="listitem"
              aria-label={`Featured in ${item.title}`}
            >
              <img
                src={item.file_path || ''}
                alt={item.alt_text || item.title}
                className="h-8 md:h-10 lg:h-12 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                title={item.title}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = '0.7';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedFeaturedShowreel;