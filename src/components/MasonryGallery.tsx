import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Heart, Share2 } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  aspectRatio: number;
  title?: string;
  description?: string;
}

interface MasonryGalleryProps {
  images: GalleryImage[];
  columns?: { mobile: number; tablet: number; desktop: number };
  gap?: number;
  enableLightbox?: boolean;
  enableFiltering?: boolean;
  categories?: string[];
}

export const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  images,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 16,
  enableLightbox = true,
  enableFiltering = true,
  categories = []
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(images);
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const [currentColumns, setCurrentColumns] = useState(columns.desktop);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Responsive column calculation
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCurrentColumns(columns.mobile);
      } else if (width < 1024) {
        setCurrentColumns(columns.tablet);
      } else {
        setCurrentColumns(columns.desktop);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columns]);

  // Initialize column heights
  useEffect(() => {
    setColumnHeights(new Array(currentColumns).fill(0));
  }, [currentColumns]);

  // Filter images
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === activeCategory));
    }
  }, [activeCategory, images]);

  // Calculate image positions for masonry layout
  const getImagePosition = (index: number, imageHeight: number) => {
    const columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    const x = columnIndex * (100 / currentColumns);
    const y = columnHeights[columnIndex];
    
    columnHeights[columnIndex] += imageHeight + gap;
    
    return { x: `${x}%`, y };
  };

  const allCategories = ['all', ...categories];

  return (
    <div className="w-full">
      {/* Category Filter */}
      {enableFiltering && categories.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {allCategories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 text-sm uppercase tracking-wider transition-all duration-300 ${
                activeCategory === category
                  ? 'text-accent-red border-b-2 border-accent-red'
                  : 'text-deep-charcoal hover:text-accent-red'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      )}

      {/* Masonry Grid */}
      <div 
        ref={galleryRef}
        className="relative w-full"
        style={{ height: Math.max(...columnHeights) }}
      >
        <AnimatePresence>
          {filteredImages.map((image, index) => {
            const imageHeight = 300 / image.aspectRatio; // Base height calculation
            const position = getImagePosition(index, imageHeight);
            
            return (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: position.x,
                  y: position.y
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute image-hover-effect"
                style={{
                  width: `calc(${100 / currentColumns}% - ${gap * (currentColumns - 1) / currentColumns}px)`,
                  height: imageHeight
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => enableLightbox && setSelectedImage(image)}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-soft-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white">
                    {image.title && (
                      <h3 className="font-serif text-lg mb-1">{image.title}</h3>
                    )}
                    {image.description && (
                      <p className="text-sm opacity-80">{image.description}</p>
                    )}
                  </div>
                  
                  {enableLightbox && (
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      <ZoomIn size={16} className="text-white" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-soft-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-full object-contain"
              />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
              
              {/* Action Buttons */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <Heart size={16} className="text-white" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <Share2 size={16} className="text-white" />
                </button>
              </div>
              
              {/* Image Info */}
              {(selectedImage.title || selectedImage.description) && (
                <div className="absolute bottom-4 left-4 text-white max-w-md">
                  {selectedImage.title && (
                    <h3 className="font-serif text-xl mb-2">{selectedImage.title}</h3>
                  )}
                  {selectedImage.description && (
                    <p className="text-sm opacity-80">{selectedImage.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
