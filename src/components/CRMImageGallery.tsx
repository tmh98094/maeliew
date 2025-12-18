import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from './LazyImage';
import { useCRM } from '../hooks/useCRM';
import { Content } from '../lib/supabase';

export interface CRMImageGalleryProps {
  layout?: 'masonry' | 'grid' | 'carousel';
  columns?: number;
  gap?: number;
  filterEnabled?: boolean;
  lightboxEnabled?: boolean;
  className?: string;
  categoryFilter?: string;
  projectFilter?: string;
  showOnlyPublished?: boolean;
}

export const CRMImageGallery: React.FC<CRMImageGalleryProps> = ({
  layout = 'grid',
  columns = 3,
  gap = 16,
  filterEnabled = true,
  lightboxEnabled = true,
  className = '',
  categoryFilter,
  projectFilter,
  showOnlyPublished = true
}) => {
  const { content, categories, loading, loadContent, trackView } = useCRM();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<Content | null>(null);

  // Filter for images only
  const imageContent = content.filter(item => 
    item.type === 'image' && 
    (showOnlyPublished ? item.status === 'published' : true)
  );

  // Apply additional filters
  const filteredImages = selectedCategory === 'all' 
    ? imageContent 
    : imageContent.filter(img => img.category_id === selectedCategory);

  // Get unique categories for filter
  const availableCategories = categories.filter(cat => 
    imageContent.some(img => img.category_id === cat.id)
  );

  useEffect(() => {
    loadContent({
      type: 'image',
      status: showOnlyPublished ? 'published' : undefined,
      categoryId: categoryFilter,
      projectId: projectFilter
    });
  }, [categoryFilter, projectFilter, showOnlyPublished]);

  const handleImageClick = useCallback(async (image: Content) => {
    if (lightboxEnabled) {
      setLightboxImage(image);
      // Track view in CRM
      await trackView(image.id);
    }
  }, [lightboxEnabled, trackView]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600">Loading images...</div>
      </div>
    );
  }

  return (
    <div className={`crm-image-gallery ${className}`}>
      {/* Category Filter */}
      {filterEnabled && availableCategories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <motion.button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          {availableCategories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : undefined
              }}
            >
              {category.name}
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
                {image.file_path ? (
                  <img
                    src={image.file_path}
                    alt={image.alt_text || image.title}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    style={{
                      aspectRatio: layout === 'grid' ? '1/1' : 
                        image.width && image.height ? `${image.width}/${image.height}` : 'auto'
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                
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

                {/* View count badge */}
                {image.view_count > 0 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {image.view_count} views
                  </div>
                )}
              </div>
              
              {/* Image Info */}
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {image.title}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {image.category_name}
                  </p>
                  {image.tags && image.tags.length > 0 && (
                    <div className="flex gap-1">
                      {image.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 px-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No images found</p>
        </div>
      )}

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
              {lightboxImage.file_path && (
                <img
                  src={lightboxImage.file_path}
                  alt={lightboxImage.alt_text || lightboxImage.title}
                  className="w-full h-auto rounded-lg"
                />
              )}
              
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                ✕
              </button>
              
              {/* Image info */}
              <div className="absolute bottom-4 left-4 text-white max-w-md">
                <h3 className="text-lg font-medium">{lightboxImage.title}</h3>
                {lightboxImage.description && (
                  <p className="text-sm opacity-75 mt-1">{lightboxImage.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm opacity-75">
                  <span>{lightboxImage.category_name}</span>
                  <span>{lightboxImage.view_count} views</span>
                  {lightboxImage.download_count > 0 && (
                    <span>{lightboxImage.download_count} downloads</span>
                  )}
                </div>
                {lightboxImage.tags && lightboxImage.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {lightboxImage.tags.map(tag => (
                      <span key={tag} className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CRMImageGallery;