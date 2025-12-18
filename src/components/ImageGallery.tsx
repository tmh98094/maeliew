import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from './LazyImage';
import { ImageAsset } from '../utils/imageUtils';

export interface ImageGalleryProps {
  images: ImageAsset[];
  layout?: 'masonry' | 'grid' | 'carousel';
  columns?: number;
  gap?: number;
  filterEnabled?: boolean;
  lightboxEnabled?: boolean;
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  layout = 'grid',
  columns = 3,
  gap = 16,
  filterEnabled = false,
  lightboxEnabled = true,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<ImageAsset | null>(null);

  // Filter images based on selected category
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(images.map(img => img.category)))];

  const handleImageClick = useCallback((image: ImageAsset) => {
    if (lightboxEnabled) {
      setLightboxImage(image);
    }
  }, [lightboxEnabled]);

  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
  }, []);

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
  };

  const masonryStyles = {
    columnCount: columns,
    columnGap: `${gap}px`,
  };

  return (
    <div className={`image-gallery ${className}`}>
      {/* Category Filter */}
      {filterEnabled && (
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>
      )}

      {/* Image Grid */}
      <motion.div
        style={layout === 'masonry' ? masonryStyles : gridStyles}
        className={layout === 'carousel' ? 'flex overflow-x-auto gap-4 pb-4' : ''}
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`
                ${layout === 'masonry' ? 'break-inside-avoid mb-4' : ''}
                ${layout === 'carousel' ? 'flex-shrink-0 w-64' : ''}
                cursor-pointer group
              `}
              onClick={() => handleImageClick(image)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative overflow-hidden rounded-lg">
                <LazyImage
                  category={image.category}
                  filename={image.filename}
                  alt={image.alt}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  aspectRatio={layout === 'grid' ? '1/1' : undefined}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    View Image
                  </motion.div>
                </div>
              </div>
              
              {/* Image Info */}
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {image.alt}
                </h3>
                <p className="text-xs text-gray-500 capitalize">
                  {image.category}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <LazyImage
                category={lightboxImage.category}
                filename={lightboxImage.filename}
                alt={lightboxImage.alt}
                className="w-full h-auto rounded-lg"
                priority
              />
              
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                ✕
              </button>
              
              {/* Image info */}
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-medium">{lightboxImage.alt}</h3>
                <p className="text-sm opacity-75 capitalize">{lightboxImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;