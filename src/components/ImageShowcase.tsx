import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage, ResponsiveImage, ImageGallery } from './index';
import { imageManifest, getImagesByCategory } from '../data/imageManifest';

/**
 * Example component demonstrating the image management system
 */
export const ImageShowcase: React.FC = () => {
  const portfolioImages = getImagesByCategory('portfolio');

  return (
    <div className="space-y-12 p-8">
      {/* Single LazyImage Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">LazyImage Component</h2>
        <div className="max-w-md">
          <LazyImage
            category="about"
            filename="mae-liew-professional-headshot.jpg"
            alt="Mae Liew professional headshot"
            className="rounded-lg shadow-lg"
            aspectRatio="3/4"
          />
        </div>
      </section>

      {/* ResponsiveImage Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">ResponsiveImage Component</h2>
        <ResponsiveImage
          category="portfolio"
          filename="bridal-makeup-elegant.jpg"
          alt="Elegant bridal makeup showcase"
          className="rounded-lg shadow-lg"
          breakpoints={{
            mobile: '100vw',
            tablet: '80vw',
            desktop: '60vw'
          }}
          aspectRatio="16/9"
        />
      </section>

      {/* ImageGallery Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">ImageGallery Component</h2>
        <ImageGallery
          images={portfolioImages}
          layout="grid"
          columns={3}
          filterEnabled={true}
          lightboxEnabled={true}
          className="max-w-6xl"
        />
      </section>

      {/* Masonry Layout Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Masonry Layout</h2>
        <ImageGallery
          images={imageManifest}
          layout="masonry"
          columns={4}
          filterEnabled={true}
          lightboxEnabled={true}
          className="max-w-6xl"
        />
      </section>

      {/* Performance Features Info */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Performance Features</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">🚀 Lazy Loading</h3>
            <p>Images load only when entering the viewport, improving initial page load times.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🎨 Format Optimization</h3>
            <p>Automatically serves WebP/AVIF formats when supported, with fallbacks.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">📱 Responsive Images</h3>
            <p>Serves appropriate image sizes based on device and viewport.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">✨ Smooth Animations</h3>
            <p>Progressive loading with blur placeholders and fade-in animations.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImageShowcase;