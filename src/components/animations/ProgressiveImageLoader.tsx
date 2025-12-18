import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProgressiveImageLoaderProps {
  src: string
  alt: string
  className?: string
  placeholderSrc?: string
  blurAmount?: number
}

export const ProgressiveImageLoader: React.FC<ProgressiveImageLoaderProps> = ({
  src,
  alt,
  className = '',
  placeholderSrc,
  blurAmount = 10
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Blur */}
      <AnimatePresence>
        {!imageLoaded && !imageError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gray-200"
          >
            {placeholderSrc && (
              <img
                src={placeholderSrc}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: `blur(${blurAmount}px)` }}
              />
            )}
            {/* Loading skeleton */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Image */}
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: imageLoaded ? 1 : 0,
          scale: imageLoaded ? 1 : 1.1
        }}
        transition={{ 
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* Error State */}
      {imageError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
        >
          <div className="text-gray-400 text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Image not available</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProgressiveImageLoader