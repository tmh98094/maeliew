/**
 * Image configuration and constants
 */

export const IMAGE_CATEGORIES = {
  PORTFOLIO: 'portfolio',
  ABOUT: 'about',
  SERVICES: 'services',
  BLOG: 'blog',
  GENERAL: 'general'
} as const;

export const IMAGE_FORMATS = {
  AVIF: 'avif',
  WEBP: 'webp',
  JPG: 'jpg',
  PNG: 'png'
} as const;

export const RESPONSIVE_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
  LARGE: 1920
} as const;

export const IMAGE_SIZES = [320, 640, 768, 1024, 1200, 1920] as const;

export const DEFAULT_IMAGE_CONFIG = {
  quality: 85,
  format: IMAGE_FORMATS.WEBP,
  lazy: true,
  placeholder: 'blur',
  aspectRatio: '16/9'
} as const;

export const GALLERY_LAYOUTS = {
  GRID: 'grid',
  MASONRY: 'masonry',
  CAROUSEL: 'carousel'
} as const;

export const ANIMATION_CONFIG = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: 'easeOut' }
  }
} as const;

export const INTERSECTION_OBSERVER_CONFIG = {
  rootMargin: '50px',
  threshold: 0.1
} as const;