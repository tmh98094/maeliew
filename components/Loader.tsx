import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

const images = [
  "/images/loading/Loading1.webp",
  "/images/loading/Loading5.webp",
  "/images/loading/Loading3.webp",
  "/images/loading/Loading4.webp",
  "/images/loading/Loading2.webp",
];

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [imagesLoaded, setImagesLoaded] = React.useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const minDisplayTime = 6000; // 6 seconds - enough for all 5 images to fade in (0.8s * 5 = 4s + 2s buffer)

    // Preload all images
    const imagePromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setImagesLoaded(true);
      })
      .catch(() => {
        // Even if some images fail, show the loader
        setImagesLoaded(true);
      });

    // Ensure minimum display time - wait for all animations to complete
    const timer = setTimeout(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      setTimeout(() => {
        onComplete();
      }, remainingTime);
    }, 100);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Neo-Swiss style positions - sharp edges, full bleed, minimal whitespace (75-80% coverage)
  // Mobile: Grid-based, edge-to-edge with small gaps
  // Desktop: Structured collage with slight rotations
  const mobilePositions = [
    { top: '0', left: '0', width: '65%', height: '35%' },
    { top: '0', right: '0', width: '33%', height: '25%' },
    { top: '26%', right: '0', width: '33%', height: '30%' },
    { top: '36%', left: '0', width: '45%', height: '32%' },
    { bottom: '0', left: '0', width: '100%', height: '30%' },
  ];

  const desktopPositions = [
    { top: '0%', left: '0%', width: '45vw', rotate: -2 },
    { top: '25%', right: '0%', width: '50vw', rotate: 3 },
    { bottom: '0%', left: '0%', width: '40vw', rotate: -1 },
    { top: '15%', left: '35%', width: '30vw', rotate: 2 },
    { bottom: '8%', right: '15%', width: '35vw', rotate: -3 },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#fdfbf7] via-[#f8f4f0] to-[#f0ebe5] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
    >
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Mobile Layout - Neo-Swiss Style: Sharp edges, full bleed, one-by-one fade in */}
      <div className={`md:hidden relative w-full h-full transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {images.map((src, index) => {
          const pos = mobilePositions[index];
          return (
            <motion.div
              key={`mobile-${index}`}
              className="absolute overflow-hidden"
              style={{ 
                top: pos.top,
                left: pos.left,
                right: pos.right,
                bottom: pos.bottom,
                width: pos.width,
                height: pos.height,
                zIndex: index + 1,
              }}
              initial={{ 
                opacity: 0, 
                scale: 1.05,
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
              }}
              transition={{
                duration: 1.0,
                delay: index * 0.8, // 0.8 seconds between each image
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <img 
                src={src} 
                alt={`Mae Liew Atelier Work ${index + 1}`} 
                className="w-full h-full object-cover"
                loading="eager"
              />
            </motion.div>
          );
        })}
        
        {/* Neo-Swiss grid lines overlay */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-[35%] left-0 right-0 h-[2px] bg-white/30"></div>
          <div className="absolute top-[68%] left-0 right-0 h-[2px] bg-white/30"></div>
          <div className="absolute left-[65%] top-0 bottom-[30%] w-[2px] bg-white/30"></div>
        </div>
      </div>

      {/* Desktop Layout - Structured Collage */}
      <div className={`hidden md:block relative w-full h-full transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {images.map((src, index) => {
          const pos = desktopPositions[index];
          return (
            <motion.div
              key={`desktop-${index}`}
              className="absolute bg-gray-900 overflow-hidden shadow-2xl aspect-[3/4]"
              style={{ 
                top: pos.top,
                left: pos.left,
                right: pos.right,
                bottom: pos.bottom,
                width: pos.width,
                zIndex: index + 1,
                transform: `rotate(${pos.rotate}deg)`,
              }}
              initial={{ opacity: 0, scale: 1.1, y: 50, rotate: pos.rotate - 5 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotate: pos.rotate
              }}
              transition={{
                duration: 1.2,
                delay: index * 0.8, 
                ease: "circOut"
              }}
              whileHover={{ 
                scale: 1.02, 
                rotate: pos.rotate + 1,
                transition: { duration: 0.3 } 
              }}
            >
              <img 
                src={src} 
                alt={`Mae Liew Atelier Work ${index + 1}`} 
                className="w-full h-full object-cover transition-all duration-1000"
                loading="eager"
              />
            </motion.div>
          );
        })}
      </div>

      {imagesLoaded && (
        <>
          {/* Mobile: Neo-Swiss text overlay - bottom left, sharp edges, fades in after images */}
          <motion.div 
            className="md:hidden absolute bottom-0 left-0 z-50 bg-white p-4 pr-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 4.5 }} // Appears after all images (5 * 0.8 = 4s + 0.5s buffer)
          >
            <h1 className="text-3xl font-serif tracking-tight text-gray-900 leading-none">
              MAE LIEW
            </h1>
            <div className="h-[3px] bg-[#E63946] my-2 w-16"></div>
            <div className="flex gap-4 text-[10px] tracking-[0.3em] uppercase font-bold text-gray-600">
              <span>Atelier</span>
              <span>Est. 2008</span>
            </div>
          </motion.div>

          {/* Desktop: Original styled text */}
          <div className="hidden md:block absolute bottom-10 left-6 z-50">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg border-l-4 border-[#E63946] shadow-xl">
              <h1 className="text-5xl lg:text-8xl font-serif tracking-tighter text-gray-900 mb-4">
                MAE LIEW
              </h1>
              <div className="h-[2px] bg-[#E63946] my-4"></div>
              <div className="flex justify-between items-center text-xs tracking-[0.4em] uppercase font-bold text-gray-700 min-w-[200px]">
                <span>Atelier</span>
                <span>Est. 2008</span>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Loader;