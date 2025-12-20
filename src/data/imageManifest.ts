import { ImageAsset } from '../utils/imageUtils';

/**
 * Image manifest for organizing and managing website images
 * This file serves as a central registry for all images used in the website
 */

export const imageManifest: ImageAsset[] = [
  // Portfolio Images
  {
    id: 'portfolio-bridal-1',
    filename: 'bridal-makeup-elegant.jpg',
    path: '/images/portfolio/bridal-makeup-elegant.webp',
    alt: 'Elegant bridal makeup with soft glam finish and natural glow',
    category: 'portfolio',
    dimensions: { width: 1920, height: 1280 },
    optimized: {
      webp: '/images/portfolio/bridal-makeup-elegant.webp',
      avif: '/images/portfolio/bridal-makeup-elegant.avif',
      thumbnail: '/images/portfolio/bridal-makeup-elegant-thumb.webp'
    },
    metadata: {
      uploadDate: new Date('2024-01-15'),
      fileSize: 245000,
      tags: ['bridal', 'elegant', 'soft-glam', 'natural']
    }
  },
  {
    id: 'portfolio-editorial-1',
    filename: 'editorial-fashion-bold.jpg',
    path: '/images/portfolio/editorial-fashion-bold.webp',
    alt: 'Bold editorial fashion makeup with dramatic eye design',
    category: 'portfolio',
    dimensions: { width: 1920, height: 1280 },
    optimized: {
      webp: '/images/portfolio/editorial-fashion-bold.webp',
      avif: '/images/portfolio/editorial-fashion-bold.avif',
      thumbnail: '/images/portfolio/editorial-fashion-bold-thumb.webp'
    },
    metadata: {
      uploadDate: new Date('2024-01-20'),
      fileSize: 312000,
      tags: ['editorial', 'fashion', 'bold', 'dramatic']
    }
  },
  {
    id: 'portfolio-celebrity-1',
    filename: 'celebrity-red-carpet.jpg',
    path: '/images/portfolio/celebrity-red-carpet.webp',
    alt: 'Glamorous red carpet makeup with sophisticated contouring',
    category: 'portfolio',
    dimensions: { width: 1920, height: 1280 },
    optimized: {
      webp: '/images/portfolio/celebrity-red-carpet.webp',
      avif: '/images/portfolio/celebrity-red-carpet.avif',
      thumbnail: '/images/portfolio/celebrity-red-carpet-thumb.webp'
    },
    metadata: {
      uploadDate: new Date('2024-02-01'),
      fileSize: 289000,
      tags: ['celebrity', 'red-carpet', 'glamorous', 'contouring']
    }
  },

  // About Page Images
  {
    id: 'about-headshot',
    filename: 'mae-liew-professional-headshot.jpg',
    path: '/images/about/mae-liew-professional-headshot.webp',
    alt: 'Mae Liew professional headshot in studio setting',
    category: 'about',
    dimensions: { width: 1200, height: 1600 },
    optimized: {
      webp: '/images/about/mae-liew-professional-headshot.webp',
      avif: '/images/about/mae-liew-professional-headshot.avif',
      thumbnail: '/images/about/mae-liew-professional-headshot-thumb.webp'
    },
    metadata: {
      uploadDate: new Date('2024-01-10'),
      fileSize: 198000,
      tags: ['headshot', 'professional', 'studio', 'portrait']
    }
  },
  {
    id: 'about-workspace',
    filename: 'makeup-studio-workspace.jpg',
    path: '/images/about/makeup-studio-workspace.webp',
    alt: 'Mae Liew makeup studio workspace with professional tools and lighting',
    category: 'about',
    dimensions: { width: 1920, height: 1280 },
    optimized: {
      webp: '/images/about/makeup-studio-workspace.webp',
      avif: '/images/about/makeup-studio-workspace.avif',
      thumbnail: '/images/about/makeup-studio-workspace-thumb.webp'
    },
    metadata: {
      uploadDate: new Date('2024-01-12'),
      fileSize: 267000,
      tags: ['studio', 'workspace', 'tools', 'behind-scenes']
    }
  },

  // Services Images
  {
    id: 'services-bridal-process',
    filename: 'bridal-makeup-process.jpg',
    path: '/images/services/bridal-makeup-process.webp',
    alt: 'Step-by-step bridal makeup application process',
    category: 'services',
    dimensions: { width: 1920, height: 1280 },
    optimized: {
      webp: '/images/services/bridal-makeup-process.webp',
      avif: '/images/services/bridal-makeup-process.avif',
      thumbnail: '/images/services/bridal-makeup-process-thumb.webp'
    },
    metadata: {
      uploadDate: new Date('2024-01-25'),
      fileSize: 234000,
      tags: ['bridal', 'process', 'step-by-step', 'tutorial']
    }
  },
  {
    id: 'services-consultation',
    filename: 'makeup-consultation-session.jpg',
    path: '/images/services/makeup-consultation-session.webp',
    alt: 'Personal makeup consultation and color matching session',
    category: 'services',
    dimensions: { width: 1920, height: 1280 },
    optimized: {
      webp: '/images/services/makeup-consultation-session.webp',
      avif: '/images/services/makeup-consultation-session.avif',
      thumbnail: '/images/services/makeup-consultation-session-thumb.webp'
    },
    metadata: {
      uploadDate: new Date('2024-02-05'),
      fileSize: 201000,
      tags: ['consultation', 'color-matching', 'personal', 'session']
    }
  },

  // Blog Images
  {
    id: 'blog-makeup-trends',
    filename: 'makeup-trends-2024.jpg',
    path: '/images/blog/makeup-trends-2024.webp',
    alt: '2024 makeup trends showcase with modern techniques',
    category: 'blog',
    dimensions: { width: 1920, height: 1080 },
    optimized: {
      webp: '/images/blog/makeup-trends-2024.webp',
      avif: '/images/blog/makeup-trends-2024.avif',
      thumbnail: '/images/blog/makeup-trends-2024-thumb.webp'
    },
    metadata: {
      uploadDate: new Date('2024-02-10'),
      fileSize: 278000,
      tags: ['trends', '2024', 'modern', 'techniques']
    }
  },

  // General Assets
  {
    id: 'general-logo',
    filename: 'mae-liew-atelier-logo.png',
    path: '/images/general/mae-liew-atelier-logo.webp',
    alt: 'Mae Liew Atelier logo',
    category: 'general',
    dimensions: { width: 400, height: 200 },
    optimized: {
      webp: '/images/general/mae-liew-atelier-logo.webp',
      thumbnail: '/images/general/mae-liew-atelier-logo-thumb.webp'
    },
    metadata: {
      uploadDate: new Date('2024-01-01'),
      fileSize: 45000,
      tags: ['logo', 'branding', 'identity']
    }
  }
];

/**
 * Get images by category
 */
export const getImagesByCategory = (category: ImageAsset['category']): ImageAsset[] => {
  return imageManifest.filter(image => image.category === category);
};

/**
 * Get image by ID
 */
export const getImageById = (id: string): ImageAsset | undefined => {
  return imageManifest.find(image => image.id === id);
};

/**
 * Get featured images (marked as featured or first few from each category)
 */
export const getFeaturedImages = (): ImageAsset[] => {
  const categories = ['portfolio', 'about', 'services'] as const;
  return categories.flatMap(category => 
    getImagesByCategory(category).slice(0, 2)
  );
};

export default imageManifest;