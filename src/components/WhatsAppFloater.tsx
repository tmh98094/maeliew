import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { generateFloaterWhatsAppURL, openWhatsApp } from '../utils/whatsappIntegration';

export interface WhatsAppFloaterProps {
  position?: 'bottom-right' | 'bottom-left';
  offset?: { x: number; y: number };
  zIndex?: number;
  showDelay?: number;
  hideOnScroll?: boolean;
}

export const WhatsAppFloater: React.FC<WhatsAppFloaterProps> = ({
  position = 'bottom-left',
  offset = { x: 20, y: 20 },
  zIndex = 1000,
  showDelay = 3000,
  hideOnScroll = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Show floater after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [showDelay]);

  useEffect(() => {
    if (!hideOnScroll) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down, hide floater
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up, show floater
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, hideOnScroll]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleClick = () => {
    const whatsappMessage = generateFloaterWhatsAppURL();
    openWhatsApp(whatsappMessage);
    
    // Track interaction
    console.log('WhatsApp floater clicked');
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const expandDirection = position === 'bottom-right' ? 'right' : 'left';

  const positionStyles = {
    position: 'fixed' as const,
    zIndex,
    ...(position === 'bottom-right' 
      ? { bottom: `${offset.y}px`, right: `${offset.x}px` }
      : { bottom: `${offset.y}px`, left: `${offset.x}px` }
    )
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed"
          style={positionStyles}
        >
          <div className="relative">
            {/* Simple tooltip */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`absolute bottom-full mb-3 ${
                    expandDirection === 'right' ? 'right-0' : 'left-0'
                  } whitespace-nowrap`}
                >
                  <div className="bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-lg">
                    Chat with Mae on WhatsApp
                    {/* Simple arrow */}
                    <div 
                      className={`absolute top-full ${
                        expandDirection === 'right' ? 'right-3' : 'left-3'
                      } w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main floating button */}
            <motion.button
              onClick={handleClick}
              onMouseEnter={() => {
                // Clear any existing timeout
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                }
                // Only show tooltip after a brief delay to avoid flickering
                const timeout = setTimeout(() => setIsExpanded(true), 800);
                setHoverTimeout(timeout);
              }}
              onMouseLeave={() => {
                // Clear timeout and hide tooltip immediately
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                  setHoverTimeout(null);
                }
                setIsExpanded(false);
              }}
              className="w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group border-4 border-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Chat with Mae on WhatsApp"
            >
              <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Compact version for mobile
export const CompactWhatsAppFloater: React.FC<{
  position?: 'bottom-right' | 'bottom-left';
  offset?: { x: number; y: number };
}> = ({ position = 'bottom-right', offset = { x: 16, y: 16 } }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const whatsappMessage = generateFloaterWhatsAppURL();
    openWhatsApp(whatsappMessage);
  };

  const compactPositionStyles = {
    position: 'fixed' as const,
    zIndex: 50,
    ...(position === 'bottom-right' 
      ? { bottom: `${offset.y}px`, right: `${offset.x}px` }
      : { bottom: `${offset.y}px`, left: `${offset.x}px` }
    )
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClick}
          className="fixed w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center"
          style={compactPositionStyles}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Chat on WhatsApp"
        >
          <MessageCircle size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Hook for managing floater visibility
export const useWhatsAppFloater = (options?: {
  showDelay?: number;
  hideOnScroll?: boolean;
  hideOnPages?: string[];
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { showDelay = 2000, hideOnScroll = false, hideOnPages = [] } = options || {};

  useEffect(() => {
    // Check if current page should hide floater
    const currentPath = window.location.pathname;
    const shouldHide = hideOnPages.some(page => currentPath.includes(page));
    
    if (shouldHide) {
      setIsVisible(false);
      return;
    }

    // Show after delay
    const timer = setTimeout(() => setIsVisible(true), showDelay);
    return () => clearTimeout(timer);
  }, [showDelay, hideOnPages]);

  useEffect(() => {
    if (!hideOnScroll) return;

    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll]);

  return { isVisible, setIsVisible };
};