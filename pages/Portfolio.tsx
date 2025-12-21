import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { LazyComponent } from '../src/components/PerformanceOptimizer';
import { SmoothPageTransition } from '../src/components/AdvancedUIComponents';
import { CRMService } from '../src/services/crmService';
import { Content, Category } from '../src/lib/supabase';
import { X } from 'lucide-react';
import SEO from '../src/components/SEO';
import StructuredData from '../src/components/StructuredData';

const Portfolio: React.FC = () => {
  const [portfolioContent, setPortfolioContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Content | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        // Fetch published content from Supabase
        const [content, cats] = await Promise.all([
          CRMService.getAllContent({
            type: 'image',
            status: 'published',
            limit: 100
          }),
          CRMService.getAllCategories()
        ]);
        setPortfolioContent(content || []);
        setFilteredContent(content || []);
        setCategories(cats || []);
      } catch (error) {
        console.error('Error loading portfolio:', error);
        // Set empty arrays on error to prevent crashes
        setPortfolioContent([]);
        setFilteredContent([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredContent(portfolioContent);
    } else {
      setFilteredContent(
        portfolioContent.filter(item => item.category_id === selectedCategory)
      );
    }
  }, [selectedCategory, portfolioContent]);

  if (loading) {
    return (
      <SmoothPageTransition className="pt-32 pb-24 min-h-screen">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading portfolio...</p>
          </div>
        </div>
      </SmoothPageTransition>
    );
  }

  return (
    <SmoothPageTransition className="pt-32 pb-24 min-h-screen">
      <SEO 
        title="Portfolio - Wedding & Bridal Makeup Gallery"
        description="Browse Mae Liew's stunning portfolio of bridal makeup, wedding makeup, ROM makeup, and celebrity makeup work. Award-winning makeup artistry showcased through beautiful transformations."
        keywords="makeup portfolio, bridal makeup gallery, wedding makeup photos, ROM makeup, celebrity makeup, makeup artist work, before after makeup, bridal transformation"
        url="https://www.maeliewatelier.com/portfolio"
        image="https://www.maeliewatelier.com/images/portfolio/wd.webp"
      />
      <div className="px-4 md:px-8">
        <div className="text-center mb-12">
           <h1 className="font-serif text-5xl md:text-7xl">Portfolio</h1>
           <p className="mt-4 text-gray-500 uppercase tracking-widest text-sm">A curation of beauty</p>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : undefined,
                  color: selectedCategory === category.id ? '#fff' : undefined
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {filteredContent.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No portfolio items yet</p>
            <p className="text-gray-400 text-sm">Add your first portfolio item in the admin panel</p>
          </div>
        ) : (
          <>
            {/* Portfolio Grid - Smaller on mobile, click to expand */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 mb-16">
              {filteredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
                  className="relative group overflow-hidden cursor-pointer bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedImage(item)}
                >
                  {/* Fixed aspect ratio container - smaller on mobile */}
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={item.file_path} 
                      alt={item.alt_text || item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  
                  {/* Subtle hover effect */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                  onClick={() => setSelectedImage(null)}
                >
                  <button
                    className="absolute top-4 right-4 text-white/80 hover:text-white z-50 p-2"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X size={32} />
                  </button>
                  
                  <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    src={selectedImage.file_path}
                    alt={selectedImage.alt_text || selectedImage.title}
                    className="max-w-full max-h-[90vh] object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>


    </SmoothPageTransition>
  );
};

export default Portfolio;