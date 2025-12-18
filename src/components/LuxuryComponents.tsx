import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Magnetic Button Component
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}> = ({ children, className = '', onClick, variant = 'primary' }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.1);
    y.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span>{children}</span>
    </motion.button>
  );
};

// Parallax Text Component
export const ParallaxText: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const yTransform = useTransform(y, [0, 1], [0, speed * 100]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      y.set(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [y]);

  return (
    <motion.div
      ref={ref}
      style={{ y: yTransform }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Shimmer Loading Effect
export const ShimmerLoader: React.FC<{
  width?: string;
  height?: string;
  className?: string;
}> = ({ width = 'w-full', height = 'h-4', className = '' }) => {
  return (
    <div className={`${width} ${height} bg-champagne/30 rounded relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
    </div>
  );
};

// Luxury Card with Hover Effects
export const LuxuryCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}> = ({ children, className = '', hoverEffect = true }) => {
  return (
    <motion.div
      className={`luxury-card p-8 ${className}`}
      whileHover={hoverEffect ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

// Floating Action Button
export const FloatingActionButton: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}> = ({ icon, onClick, position = 'bottom-right', className = '' }) => {
  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
  };

  return (
    <motion.button
      className={`fixed ${positionClasses[position]} w-14 h-14 bg-gradient-to-r from-accent-red to-muted-gold rounded-full shadow-2xl flex items-center justify-center text-white z-50 ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ 
        y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        hover: { duration: 0.2 }
      }}
    >
      {icon}
    </motion.button>
  );
};

// Text Reveal Animation
export const TextReveal: React.FC<{
  text: string;
  className?: string;
  delay?: number;
}> = ({ text, className = '', delay = 0 }) => {
  const words = text.split(' ');

  return (
    <div className={`text-reveal ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.1,
            ease: [0.77, 0, 0.175, 1]
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};
