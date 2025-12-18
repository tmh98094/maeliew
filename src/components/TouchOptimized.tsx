import React, { useRef, useState, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';

// Swipeable Card Stack
export const SwipeableCards: React.FC<{
  cards: Array<{
    id: string;
    image: string;
    title: string;
    subtitle?: string;
    content?: string;
  }>;
  onSwipe?: (direction: 'left' | 'right', card: any) => void;
}> = ({ cards, onSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= threshold) {
      const direction = offset > 0 ? 'right' : 'left';
      setExitDirection(direction);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
        setExitDirection(null);
        onSwipe?.(direction, cards[currentIndex]);
      }, 200);
    }
  };

  const currentCard = cards[currentIndex];
  const nextCard = cards[(currentIndex + 1) % cards.length];

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {/* Next Card (Background) */}
      {nextCard && (
        <motion.div
          className="absolute inset-0 bg-white rounded-2xl shadow-lg"
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 0.95, opacity: 0.8 }}
        >
          <img
            src={nextCard.image}
            alt={nextCard.title}
            className="w-full h-2/3 object-cover rounded-t-2xl"
          />
          <div className="p-6">
            <h3 className="font-serif text-xl mb-2">{nextCard.title}</h3>
            {nextCard.subtitle && (
              <p className="text-sm text-gray-600">{nextCard.subtitle}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Current Card */}
      <motion.div
        key={currentCard.id}
        className="absolute inset-0 bg-white rounded-2xl shadow-xl cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={exitDirection ? {
          x: exitDirection === 'right' ? 300 : -300,
          rotate: exitDirection === 'right' ? 15 : -15,
          opacity: 0
        } : {
          x: 0,
          rotate: 0,
          opacity: 1
        }}
        transition={{ duration: 0.2 }}
        whileDrag={{ scale: 1.05, rotate: 5 }}
      >
        <img
          src={currentCard.image}
          alt={currentCard.title}
          className="w-full h-2/3 object-cover rounded-t-2xl"
        />
        <div className="p-6">
          <h3 className="font-serif text-xl mb-2">{currentCard.title}</h3>
          {currentCard.subtitle && (
            <p className="text-sm text-gray-600 mb-3">{currentCard.subtitle}</p>
          )}
          {currentCard.content && (
            <p className="text-sm text-gray-700">{currentCard.content}</p>
          )}
        </div>
      </motion.div>

      {/* Swipe Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-accent-red' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Pull-to-Refresh Component
export const PullToRefresh: React.FC<{
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}> = ({ onRefresh, children, threshold = 80 }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const scale = useTransform(y, [0, threshold], [0.8, 1]);

  const handleDrag = (event: any, info: PanInfo) => {
    if (window.scrollY === 0 && info.offset.y > 0) {
      setPullDistance(info.offset.y);
      y.set(Math.min(info.offset.y, threshold * 1.5));
    }
  };

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
    y.set(0);
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      className="relative"
    >
      {/* Pull Indicator */}
      <motion.div
        style={{ opacity, scale }}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full p-4"
      >
        <div className={`w-8 h-8 rounded-full border-2 border-accent-red ${
          isRefreshing ? 'animate-spin' : ''
        } flex items-center justify-center`}>
          <div className="w-2 h-2 bg-accent-red rounded-full" />
        </div>
      </motion.div>

      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </motion.div>
  );
};

// Infinite Scroll Hook
export const useInfiniteScroll = (
  callback: () => void,
  threshold: number = 100
) => {
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, threshold]);
};

// Touch-Friendly Button
export const TouchButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ children, onClick, variant = 'primary', size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm min-h-[44px]',
    medium: 'px-6 py-3 text-base min-h-[48px]',
    large: 'px-8 py-4 text-lg min-h-[52px]'
  };

  return (
    <motion.button
      className={`${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${sizeClasses[size]} ${className} touch-manipulation`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.button>
  );
};
