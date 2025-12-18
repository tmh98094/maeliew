import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getImagePath, generateImageSources, generateSrcSet, getThumbnailPath } from '../utils/imageUtils';

export interface LazyImageProps {
  category: 'portfolio' | 'about' | 'services' | 'blog' | 'general';
  filename: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

export const LazyImage: React.FC<LazyImageProps> = ({
  category,
  filename,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  placeholder = 'blur',
  onLoad,
  onError,
  aspectRatio,
  objectFit = 'cover'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageSources = generateImageSources(category, filename);
  const srcSet = generateSrcSet(category, filename);
  const thumbnailPath = getThumbnailPath(category, filename);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* Placeholder/Thumbnail */}
      {placeholder === 'blur' && !isLoaded && (
        <motion.img
          src={thumbnailPath}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          style={{ objectFit }}
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && placeholder === 'empty' && (
        <motion.div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <picture>
          {imageSources.avif && (
            <source srcSet={imageSources.avif} type="image/avif" />
          )}
          {imageSources.webp && (
            <source srcSet={imageSources.webp} type="image/webp" />
          )}
          <motion.img
            ref={imgRef}
            src={imageSources.fallback}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            className="w-full h-full object-cover"
            style={{ objectFit }}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </picture>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Image not available</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;