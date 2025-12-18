import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { LazyComponent } from '../src/components/PerformanceOptimizer';
import { SmoothPageTransition } from '../src/components/AdvancedUIComponents';
import { CRMService } from '../src/services/crmService';
import { Content, Category } from '../src/lib/supabase';

const Portfolio: React.FC = () => {
  const [portfolioContent, setPortfolioContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

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
        setPortfolioContent(content);
        setFilteredContent(content);
        setCategories(cats);
      } catch (error) {
        console.error('Error loading portfolio:', error);
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
            {/* Portfolio Grid from Supabase - Fixed Size Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {filteredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group overflow-hidden cursor-pointer rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Fixed aspect ratio container */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={item.file_path} 
                      alt={item.alt_text || item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback for broken images
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x533?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  
                  {/* Subtle hover effect only */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>


    </SmoothPageTransition>
  );
};

export default Portfolio;