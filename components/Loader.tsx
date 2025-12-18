import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

const images = [
  "/images/loading/Loading1.jpeg",
  "/images/loading/Loading5.jpeg",
  "/images/loading/Loading3.jpeg",
  "/images/loading/Loading4.jpeg",
  "/images/loading/Loading2.jpeg",
];

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [imagesLoaded, setImagesLoaded] = React.useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const minDisplayTime = 6000; // Minimum 6 seconds display time for better viewing

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

  // Organic collage positions - mobile aesthetic, desktop structured
  const positions = [
    { 
      mobile: { top: '8%', left: '15%', width: '35%', height: '28%', rotate: -8 },
      desktop: { top: '0%', left: '0%', width: '45vw', height: 'auto', rotate: -2 },
      zIndex: 1 
    },
    { 
      mobile: { top: '12%', right: '8%', width: '42%', height: '32%', rotate: 12 },
      desktop: { top: '25%', right: '0%', width: '50vw', height: 'auto', rotate: 3 },
      zIndex: 2 
    },
    { 
      mobile: { top: '38%', left: '8%', width: '38%', height: '26%', rotate: -15 },
      desktop: { bottom: '0%', left: '0%', width: '40vw', height: 'auto', rotate: -1 },
      zIndex: 3 
    },
    { 
      mobile: { top: '42%', left: '45%', width: '48%', height: '35%', rotate: 8 },
      desktop: { top: '15%', left: '35%', width: '30vw', height: 'auto', rotate: 2 },
      zIndex: 4 
    },
    { 
      mobile: { bottom: '8%', left: '20%', width: '55%', height: '30%', rotate: -5 },
      desktop: { bottom: '8%', right: '15%', width: '35vw', height: 'auto', rotate: -3 },
      zIndex: 5 
    }
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#fdfbf7] via-[#f8f4f0] to-[#f0ebe5] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
    >
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-800 text-center">
            <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm tracking-widest uppercase text-gray-700">Loading Atelier</p>
          </div>
        </div>
      )}
      
      {/* Mobile Layout - Organic Collage */}
      <div className={`md:hidden relative w-full h-full transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {images.map((src, index) => {
          const pos = positions[index];
          return (
            <motion.div
              key={`mobile-${index}`}
              className="absolute overflow-hidden shadow-xl"
              style={{ 
                top: pos.mobile.top,
                left: pos.mobile.left,
                right: pos.mobile.right,
                bottom: pos.mobile.bottom,
                width: pos.mobile.width,
                height: pos.mobile.height,
                zIndex: pos.zIndex,
                borderRadius: `${15 + Math.random() * 10}px`,
                transform: `rotate(${pos.mobile.rotate}deg)`,
              }}
              initial={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 60 + Math.random() * 40, 
                rotate: pos.mobile.rotate + (Math.random() * 20 - 10)
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotate: pos.mobile.rotate
              }}
              transition={{
                duration: 1.4 + Math.random() * 0.4,
                delay: index * 0.6 + Math.random() * 0.3, 
                ease: "easeOut",
                type: "spring",
                damping: 12
              }}
            >
              <img 
                src={src} 
                alt={`Mae Liew Atelier Work ${index + 1}`} 
                className="w-full h-full object-cover"
                loading="eager"
                style={{
                  filter: `brightness(${0.95 + Math.random() * 0.1}) contrast(${1.05 + Math.random() * 0.1})`,
                }}
              />
              {/* Subtle overlay for depth */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5"
                style={{ opacity: 0.3 + Math.random() * 0.2 }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Desktop Layout - Structured Collage */}
      <div className={`hidden md:block relative w-full h-full transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {images.map((src, index) => {
          const pos = positions[index];
          return (
            <motion.div
              key={`desktop-${index}`}
              className="absolute bg-gray-900 overflow-hidden shadow-2xl aspect-[3/4]"
              style={{ 
                top: pos.desktop.top,
                left: pos.desktop.left,
                right: pos.desktop.right,
                bottom: pos.desktop.bottom,
                width: pos.desktop.width,
                zIndex: pos.zIndex,
                transform: `rotate(${pos.desktop.rotate}deg)`,
              }}
              initial={{ opacity: 0, scale: 1.1, y: 50, rotate: pos.desktop.rotate - 5 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotate: pos.desktop.rotate
              }}
              transition={{
                duration: 1.2,
                delay: index * 0.8, 
                ease: "circOut"
              }}
              whileHover={{ 
                scale: 1.02, 
                rotate: pos.desktop.rotate + 1,
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
        <div className="absolute bottom-4 left-4 md:bottom-10 md:left-6 z-50">
           {/* Background for better text visibility */}
           <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-lg border-l-4 border-[#E63946] shadow-xl">
             <h1 className="text-3xl md:text-5xl lg:text-8xl font-serif tracking-tighter text-gray-900 mb-2 md:mb-4">
                MAE LIEW
             </h1>
             <div className="h-[2px] bg-[#E63946] my-2 md:my-4"></div>
             <div className="flex justify-between text-xs tracking-[0.4em] uppercase font-bold text-gray-700">
                <span>Atelier</span>
                <span>Est. 2008</span>
             </div>
           </div>
        </div>
      )}
    </motion.div>
  );
};

export default Loader;