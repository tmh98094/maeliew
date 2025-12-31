import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight } from 'lucide-react'
import { CRMDashboard } from '../src/components/CRMDashboard'
import { PortfolioManager } from '../src/components/PortfolioManager'
import { BlogManager } from '../src/components/BlogManager'
import { CategoryManager } from '../src/components/CategoryManager'
import { PartnersManager } from '../src/components/PartnersManager'
import { FeaturedManager } from '../src/components/FeaturedManager'
import { CuratedCollectionManager } from '../src/components/CuratedCollectionManager'
import { AdminAuth } from '../src/components/AdminAuth'

type TabType = 'dashboard' | 'portfolio' | 'blog' | 'partners' | 'featured' | 'curated' | 'categories'

export const CRMAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu on tab change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [activeTab])

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Overview & Stats' },
    { id: 'portfolio', label: 'Portfolio', icon: '🎨', description: 'Manage portfolio images' },
    { id: 'blog', label: 'Blog Posts', icon: '📝', description: 'Write & publish articles' },
    { id: 'partners', label: 'Partners', icon: '🤝', description: 'Brand collaborations' },
    { id: 'featured', label: 'Featured On', icon: '⭐', description: 'Publications & features' },
    { id: 'curated', label: 'Curated Collections', icon: '🖼️', description: 'Homepage collections' },
    { id: 'categories', label: 'Categories', icon: '🏷️', description: 'Organize content' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CRMDashboard />
      case 'portfolio':
        return <PortfolioManager />
      case 'blog':
        return <BlogManager />
      case 'partners':
        return <PartnersManager />
      case 'featured':
        return <FeaturedManager />
      case 'curated':
        return <CuratedCollectionManager />
      case 'categories':
        return <CategoryManager />
      default:
        return <CRMDashboard />
    }
  }

  const currentTab = tabs.find(t => t.id === activeTab)

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 md:py-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-3xl font-bold">Mae Liew Admin</h1>
                <p className="text-blue-100 mt-1 text-sm md:text-base hidden sm:block">Manage your portfolio and blog content</p>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && isMobile && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
            >
              {/* Mobile Menu Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full p-4 rounded-lg mb-1 flex items-center gap-3 transition-all ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <span className="text-2xl">{tab.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{tab.label}</div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
                    </div>
                    <ChevronRight size={18} className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Navigation Tabs */}
        <nav className="bg-white border-b shadow-sm hidden lg:block sticky top-[88px] z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`group relative py-4 px-4 xl:px-6 font-medium text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg xl:text-xl">{tab.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{tab.label}</div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-700 hidden xl:block">
                        {tab.description}
                      </div>
                    </div>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Current Tab Indicator */}
        <div className="lg:hidden bg-white border-b px-4 py-3 sticky top-[64px] z-20">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center gap-3 w-full"
          >
            <span className="text-2xl">{currentTab?.icon}</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900">{currentTab?.label}</div>
              <div className="text-xs text-gray-500">{currentTab?.description}</div>
            </div>
            <Menu size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </AdminAuth>
  )
}

export default CRMAdmin