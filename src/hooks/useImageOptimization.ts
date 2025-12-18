import { useState, useEffect, useCallback } from 'react';
import { getOptimalFormat, supportsWebP, supportsAVIF } from '../utils/imageUtils';

export interface ImageOptimizationState {
  preferredFormat: 'avif' | 'webp' | 'jpg';
  supportsWebP: boolean;
  supportsAVIF: boolean;
  isLoading: boolean;
}

export const useImageOptimization = () => {
  const [state, setState] = useState<ImageOptimizationState>({
    preferredFormat: 'jpg',
    supportsWebP: false,
    supportsAVIF: false,
    isLoading: true
  });

  useEffect(() => {
    const checkFormats = async () => {
      try {
        const [webpSupport, avifSupport] = await Promise.all([
          supportsWebP(),
          supportsAVIF()
        ]);

        const preferredFormat = await getOptimalFormat();

        setState({
          preferredFormat,
          supportsWebP: webpSupport,
          supportsAVIF: avifSupport,
          isLoading: false
        });
      } catch (error) {
        console.warn('Error checking image format support:', error);
        setState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    };

    checkFormats();
  }, []);

  const getOptimizedImageUrl = useCallback((
    category: string,
    filename: string
  ): string => {
    if (state.isLoading) {
      return `/images/${category}/${filename}`;
    }

    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    
    if (state.supportsAVIF) {
      return `/images/${category}/${nameWithoutExt}.avif`;
    }
    
    if (state.supportsWebP) {
      return `/images/${category}/${nameWithoutExt}.webp`;
    }
    
    return `/images/${category}/${filename}`;
  }, [state]);

  return {
    ...state,
    getOptimizedImageUrl
  };
};

export default useImageOptimization;