import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  number: string;
  label: string;
  icon?: string;
  delay?: number;
}

interface StatsCardsProps {
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, icon, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay: isVisible ? delay : 0,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="text-center group focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-opacity-50 rounded-lg p-4"
      role="listitem"
      aria-label={`${number} ${label}`}
      tabIndex={0}
    >
      <div className="relative">
        {/* Elegant divider line above */}
        <div 
          className="w-12 h-[1px] bg-[#E63946] mx-auto mb-6 group-hover:w-16 transition-all duration-300"
          style={{ willChange: 'width' }}
        ></div>
        
        {/* Number */}
        <div className="text-5xl md:text-6xl font-serif font-light text-gray-900 mb-3 leading-none">
          {number || '—'}
        </div>
        
        {/* Label */}
        <div className="text-sm text-gray-600 uppercase tracking-[0.2em] font-light">
          {label || 'Statistic'}
        </div>
        
        {/* Subtle bottom accent */}
        <div 
          className="w-8 h-[1px] bg-gray-300 mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ willChange: 'opacity, width' }}
        ></div>
      </div>
    </motion.div>
  );
};

const StatsCards: React.FC<StatsCardsProps> = ({ className = '' }) => {
  const statsData = [
    {
      number: "20+",
      label: "Years Experience"
    },
    {
      number: "500",
      label: "Brides Served"
    },
    {
      number: "100%",
      label: "Satisfaction Rate"
    }
  ];

  return (
    <section className={`py-16 md:py-20 px-6 md:px-12 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="w-16 h-[2px] bg-[#E63946] mx-auto mb-6"></div>
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
            Excellence in Numbers
          </h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto">
            Two decades of artistry, hundreds of satisfied clients, and an unwavering commitment to perfection.
          </p>
        </div>

        {/* Stats Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-8"
          role="list"
          aria-label="Key statistics"
        >
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              number={stat.number}
              label={stat.label}
              delay={index * 0.15} // Stagger effect: 0s, 0.15s, 0.3s
            />
          ))}
        </div>

        {/* Award Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 md:mt-16"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-[1px] bg-[#E63946] mb-4"></div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏆</span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#E63946] font-medium">
                Recognition
              </span>
            </div>
            <h3 className="font-serif text-lg md:text-xl text-gray-900 max-w-md leading-relaxed">
              Top 10 Malaysian Bridal Makeup Artist
            </h3>
            <p className="text-gray-500 text-sm mt-1 tracking-wide">
              by Marie France Asia
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsCards;
export { StatCard };
export type { StatCardProps, StatsCardsProps };