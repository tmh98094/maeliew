/**
 * Image utility functions for optimization and management
 */

export interface ImageAsset {
  id: string;
  filename: string;
  path: string;
  alt: string;
  category: 'portfolio' | 'about' | 'services' | 'blog' | 'general';
  dimensions: {
    width: number;
    height: number;
  };
  optimized: {
    webp?: string;
    avif?: string;
    thumbnail: string;
  };
  metadata: {
    uploadDate: Date;
    fileSize: number;
    tags: string[];
  };
}

export interface ImageConfig {
  quality: number;
  format: 'webp' | 'avif' | 'jpg' | 'png';
  sizes: number[];
  lazy: boolean;
}

/**
 * Generate responsive image path based on category and filename
 */
export const getImagePath = (category: string, filename: string): string => {
  return `/images/${category}/${filename}`;
};

/**
 * Generate optimized image sources for different formats
 */
export const generateImageSources = (
  category: string,
  filename: string,
  config: Partial<ImageConfig> = {}
): { webp?: string; avif?: string; fallback: string } => {
  const basePath = getImagePath(category, filename);
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  return {
    webp: config.format !== 'webp' ? `${getImagePath(category, nameWithoutExt)}.webp` : undefined,
    avif: config.format !== 'avif' ? `${getImagePath(category, nameWithoutExt)}.avif` : undefined,
    fallback: basePath
  };
};

/**
 * Generate srcSet for responsive images
 */
export const generateSrcSet = (
  category: string,
  filename: string,
  sizes: number[] = [320, 640, 1024, 1920]
): string => {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const ext = filename.split('.').pop();
  
  return sizes
    .map(size => `${getImagePath(category, `${nameWithoutExt}-${size}w.${ext}`)} ${size}w`)
    .join(', ');
};

/**
 * Validate image category
 */
export const isValidImageCategory = (category: string): category is ImageAsset['category'] => {
  return ['portfolio', 'about', 'services', 'blog', 'general'].includes(category);
};

/**
 * Create thumbnail path
 */
export const getThumbnailPath = (category: string, filename: string): string => {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const ext = filename.split('.').pop();
  return getImagePath(category, `${nameWithoutExt}-thumb.${ext}`);
};

/**
 * Check if WebP is supported
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Check if AVIF is supported
 */
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalFormat = async (): Promise<'avif' | 'webp' | 'jpg'> => {
  if (await supportsAVIF()) return 'avif';
  if (await supportsWebP()) return 'webp';
  return 'jpg';
};