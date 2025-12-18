import React from 'react';
import { motion } from 'framer-motion';
import LazyImage, { LazyImageProps } from './LazyImage';

export interface ResponsiveImageProps extends Omit<LazyImageProps, 'sizes'> {
  breakpoints?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  maxWidth?: number;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  breakpoints = {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw'
  },
  maxWidth = 1920,
  ...props
}) => {
  // Generate sizes attribute based on breakpoints
  const sizes = `(max-width: 768px) ${breakpoints.mobile}, (max-width: 1200px) ${breakpoints.tablet}, ${breakpoints.desktop}`;

  return (
    <LazyImage
      {...props}
      sizes={sizes}
    />
  );
};

export default ResponsiveImage;