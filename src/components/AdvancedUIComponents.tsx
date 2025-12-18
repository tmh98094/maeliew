import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, AlertCircle, Info, X } from 'lucide-react'

// Loading Skeleton Components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 rounded h-4 w-3/4"></div>
      <div className="bg-gray-200 rounded h-4 w-1/2"></div>
      <div className="bg-gray-200 rounded h-3 w-full"></div>
      <div className="bg-gray-200 rounded h-3 w-2/3"></div>
    </div>
  </div>
)

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <div 
        key={i}
        className={`bg-gray-200 rounded h-4 ${
          i === lines - 1 ? 'w-2/3' : 'w-full'
        }`}
      />
    ))}
  </div>
)

// Advanced Loading Spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'black' | 'white' | 'gray'
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'black',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    black: 'text-black',
    white: 'text-white',
    gray: 'text-gray-500'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
      {text && (
        <p className={`text-sm ${colorClasses[color]}`}>{text}</p>
      )}
    </div>
  )
}

// Toast Notification System
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ 
  toast, 
  onRemove 
}) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const Icon = icons[toast.type]

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`p-4 rounded-lg border shadow-lg max-w-sm w-full ${colors[toast.type]}`}
    >
      <div className="flex items-start">
        <Icon size={20} className="mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium">{toast.title}</p>
          {toast.message && (
            <p className="text-sm opacity-90 mt-1">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 11)
    setToasts(prev => [...prev, { ...toast, id, duration: toast.duration || 5000 }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// Interactive Hover Effects
interface HoverRevealProps {
  children: React.ReactNode
  overlay: React.ReactNode
  className?: string
}

export const HoverReveal: React.FC<HoverRevealProps> = ({ 
  children, 
  overlay, 
  className = '' 
}) => {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {overlay}
        </motion.div>
      </motion.div>
    </div>
  )
}

// Smooth Page Transitions
interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export const SmoothPageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  )
}

// Interactive Image Gallery with Lightbox
interface LightboxImage {
  src: string
  alt: string
  caption?: string
}

interface InteractiveGalleryProps {
  images: LightboxImage[]
  columns?: number
  className?: string
}

export const InteractiveGallery: React.FC<InteractiveGalleryProps> = ({ 
  images, 
  columns = 3,
  className = '' 
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const handleKeyPress = React.useCallback((e: KeyboardEvent) => {
    if (selectedImage !== null) {
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') setSelectedImage(null)
    }
  }, [selectedImage])

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return (
    <>
      <div 
        className={`grid gap-4 ${className}`}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-lg cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                View Full Size
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="w-full h-auto rounded-lg"
              />
              
              {/* Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                ←
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                →
              </button>
              
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                <X size={20} />
              </button>
              
              {/* Caption */}
              {images[selectedImage].caption && (
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <p className="bg-black bg-opacity-50 rounded px-4 py-2">
                    {images[selectedImage].caption}
                  </p>
                </div>
              )}
              
              {/* Counter */}
              <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 rounded px-3 py-1 text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Touch-friendly Mobile Interactions
interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  className = '' 
}) => {
  return (
    <motion.div
      className={`touch-pan-y ${className}`}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100 && onSwipeRight) {
          onSwipeRight()
        } else if (info.offset.x < -100 && onSwipeLeft) {
          onSwipeLeft()
        }
      }}
      whileDrag={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  )
}


// Performance monitoring hook
export const usePerformanceMonitor = () => {
  React.useEffect(() => {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with a real performance monitoring service
      console.log('Performance monitoring initialized')
    }

    // Monitor memory usage
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory
      console.log('Memory usage:', {
        used: Math.round(memoryInfo.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memoryInfo.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memoryInfo.jsHeapSizeLimit / 1048576) + ' MB'
      })
    }
  }, [])
}