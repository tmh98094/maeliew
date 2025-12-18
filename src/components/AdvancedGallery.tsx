import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Filter, Grid, List } from 'lucide-react'
import LazyImage from './LazyImage'
import { ImageAsset } from '../utils/imageUtils'

interface AdvancedGalleryProps {
  images: ImageAsset[]
  layout?: 'masonry' | 'grid' | 'list'
  showFilters?: boolean
  showSearch?: boolean
  itemsPerPage?: number
  className?: string
}

export const AdvancedGallery: React.FC<AdvancedGalleryProps> = ({
  images,
  layout = 'masonry',
  showFilters = true,
  showSearch = true,
  itemsPerPage = 12,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentLayout, setCurrentLayout] = useState(layout)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...Array.from(new Set(images.map(img => img.category)))]
    return cats
  }, [images])

  // Filter and search images
  const filteredImages = useMemo(() => {
    let filtered = images

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [images, selectedCategory, searchTerm])

  // Pagination
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage)
  const paginatedImages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredImages.slice(start, start + itemsPerPage)
  }, [filteredImages, currentPage, itemsPerPage])

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const nextImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length)
    }
  }, [lightboxIndex, filteredImages.length])

  const prevImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1)
    }
  }, [lightboxIndex, filteredImages.length])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex !== null) {
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') closeLightbox()
    }
  }, [lightboxIndex, nextImage, prevImage, closeLightbox])

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const layoutClasses = {
    masonry: 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
    list: 'space-y-6'
  }

  return (
    <div className={`advanced-gallery ${className}`}>
      {/* Controls */}
      <div className="mb-8 space-y-4">
        {/* Search and Layout Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {showSearch && (
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentLayout('masonry')}
              className={`p-2 rounded ${currentLayout === 'masonry' ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setCurrentLayout('grid')}
              className={`p-2 rounded ${currentLayout === 'grid' ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setCurrentLayout('list')}
              className={`p-2 rounded ${currentLayout === 'list' ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <motion.button
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <span className="ml-2 text-xs opacity-75">
                  ({category === 'all' ? images.length : images.filter(img => img.category === category).length})
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {paginatedImages.length} of {filteredImages.length} images
        {searchTerm && ` for "${searchTerm}"`}
      </div>

      {/* Gallery */}
      <motion.div
        className={layoutClasses[currentLayout]}
        layout
      >
        <AnimatePresence mode="popLayout">
          {paginatedImages.map((image, index) => (
            <motion.div
              key={`${image.id}-${currentPage}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`
                ${currentLayout === 'masonry' ? 'break-inside-avoid mb-4' : ''}
                ${currentLayout === 'list' ? 'flex gap-4 items-center p-4 bg-white rounded-lg shadow' : ''}
                cursor-pointer group
              `}
              onClick={() => openLightbox((currentPage - 1) * itemsPerPage + index)}
            >
              {currentLayout === 'list' ? (
                <>
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded">
                    <LazyImage
                      category={image.category}
                      filename={image.filename}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{image.alt}</h3>
                    <p className="text-sm text-gray-500 capitalize">{image.category}</p>
                  </div>
                </>
              ) : (
                <div className="relative overflow-hidden rounded-lg">
                  <LazyImage
                    category={image.category}
                    filename={image.filename}
                    alt={image.alt}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
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
                  
                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-sm font-medium truncate">{image.alt}</h3>
                    <p className="text-xs opacity-75 capitalize">{image.category}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
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
                category={filteredImages[lightboxIndex].category}
                filename={filteredImages[lightboxIndex].filename}
                alt={filteredImages[lightboxIndex].alt}
                className="w-full h-auto rounded-lg"
                priority
              />
              
              {/* Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
              
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                <X size={20} />
              </button>
              
              {/* Image info */}
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-medium">{filteredImages[lightboxIndex].alt}</h3>
                <p className="text-sm opacity-75 capitalize">{filteredImages[lightboxIndex].category}</p>
                <p className="text-xs opacity-50 mt-1">
                  {lightboxIndex + 1} of {filteredImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdvancedGallery