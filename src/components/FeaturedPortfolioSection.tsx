import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { CRMService } from '../services/crmService';
import { Content } from '../lib/supabase';

interface FeaturedPortfolioSectionProps {
    className?: string;
}

const FeaturedPortfolioSection: React.FC<FeaturedPortfolioSectionProps> = ({ className = '' }) => {
    const [featuredItems, setFeaturedItems] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    useEffect(() => {
        loadFeaturedItems();
    }, []);

    // Auto-scroll carousel every 4 seconds (pause on hover)
    useEffect(() => {
        if (featuredItems.length <= 1 || isHovered) return;

        const totalPages = Math.ceil(featuredItems.length / 6);
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalPages);
        }, 4000);

        return () => clearInterval(interval);
    }, [featuredItems.length, isHovered]);

    // Scroll to current index when it changes
    useEffect(() => {
        if (scrollRef.current && featuredItems.length > 0) {
            const scrollAmount = scrollRef.current.clientWidth * currentIndex;
            scrollRef.current.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }, [currentIndex, featuredItems.length]);

    const loadFeaturedItems = async () => {
        try {
            setLoading(true);
            const data = await CRMService.getFeaturedContent('image');
            // Show all featured items, paginated 6 at a time
            setFeaturedItems(data);
        } catch (error) {
            console.error('Error loading featured content:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollTo = (direction: 'left' | 'right') => {
        const totalPages = Math.ceil(featuredItems.length / 6);
        if (direction === 'left') {
            setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
        } else {
            setCurrentIndex((prev) => (prev + 1) % totalPages);
        }
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Get current page items (6 at a time)
    const currentPageItems = featuredItems.slice(currentIndex * 6, (currentIndex + 1) * 6);
    const totalPages = Math.ceil(featuredItems.length / 6);

    // Don't render if no featured items
    if (!loading && featuredItems.length === 0) {
        return null;
    }

    return (
        <section
            ref={sectionRef}
            className={`py-16 md:py-24 overflow-hidden ${className}`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Section Header */}
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Star className="text-[#E63946]" size={18} fill="#E63946" />
                            <span className="text-[#E63946] uppercase tracking-[0.3em] text-xs font-bold">Featured Work</span>
                        </div>
                        <h2 className="font-serif text-3xl md:text-5xl text-gray-900 leading-tight">
                            Spotlight <span className="italic text-gray-400">Gallery</span>
                        </h2>
                    </div>
                    <Link
                        to="/portfolio"
                        className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:text-[#E63946] transition-colors group"
                    >
                        View All
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946]"></div>
                    </div>
                )}

                {/* Featured Carousel */}
                {!loading && featuredItems.length > 0 && (
                    <div
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Navigation Arrows - Desktop Only */}
                        {totalPages > 1 && (
                            <>
                                <button
                                    onClick={() => scrollTo('left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden md:flex w-12 h-12 bg-white shadow-lg rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={() => scrollTo('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden md:flex w-12 h-12 bg-white shadow-lg rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Carousel Container */}
                        <motion.div
                            className="overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div
                                ref={scrollRef}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                            >
                                {currentPageItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <div className="group relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                            <img
                                                src={item.file_path || '/images/placeholder.webp'}
                                                alt={item.alt_text || item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/images/placeholder.webp';
                                                }}
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Content Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Star size={12} className="text-yellow-400" fill="currentColor" />
                                                    <span className="text-white/80 text-xs uppercase tracking-wider">Featured</span>
                                                </div>
                                                <h3 className="text-white font-serif text-lg md:text-xl line-clamp-2">
                                                    {item.title}
                                                </h3>
                                                {item.category_name && (
                                                    <p className="text-white/70 text-sm mt-1">{item.category_name}</p>
                                                )}
                                            </div>

                                            {/* Featured Badge */}
                                            <div className="absolute top-3 right-3">
                                                <span className="px-2 py-1 bg-yellow-400/90 text-yellow-900 text-xs font-bold rounded-full flex items-center gap-1">
                                                    <Star size={10} fill="currentColor" />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Page Indicators */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-8">
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-[#E63946]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        aria-label={`Go to page ${index + 1}`}
                                    />
                                ))}
                                <span className="text-sm text-gray-500 ml-2">
                                    {currentIndex + 1} / {totalPages}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedPortfolioSection;
