import React, { Suspense, lazy, memo } from 'react'
import { motion } from 'framer-motion'

// Lazy load heavy components
const AdvancedGallery = lazy(() => import('./AdvancedGallery'))
const CRMImageGallery = lazy(() => import('./CRMImageGallery'))
const EnhancedContactForm = lazy(() => import('./EnhancedContactForm'))

// Loading skeleton component
const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 rounded h-4 w-3/4"></div>
      <div className="bg-gray-200 rounded h-4 w-1/2"></div>
    </div>
  </div>
)

// Memoized components for better performance
export const MemoizedAdvancedGallery = memo(AdvancedGallery)
export const MemoizedCRMImageGallery = memo(CRMImageGallery)
export const MemoizedEnhancedContactForm = memo(EnhancedContactForm)

// Lazy wrapper with suspense
interface LazyComponentProps {
  component: 'gallery' | 'crm-gallery' | 'contact-form'
  fallback?: React.ReactNode
  [key: string]: any
}

export const LazyComponent: React.FC<LazyComponentProps> = ({ 
  component, 
  fallback, 
  ...props 
}) => {
  const defaultFallback = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-12"
    >
      <LoadingSkeleton className="w-full max-w-4xl" />
    </motion.div>
  )

  const getComponent = () => {
    switch (component) {
      case 'gallery':
        return <MemoizedAdvancedGallery images={props.images || []} {...props} />
      case 'crm-gallery':
        return <MemoizedCRMImageGallery {...props} />
      case 'contact-form':
        return <MemoizedEnhancedContactForm {...props} />
      default:
        return null
    }
  }

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {getComponent()}
    </Suspense>
  )
}

// Image preloader utility
export const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  return Promise.all(
    imageUrls.map(url => 
      new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = reject
        img.src = url
      })
    )
  )
}

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, options])

  return isIntersecting
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

export default LazyComponent