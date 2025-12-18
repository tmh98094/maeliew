import React, { useState } from 'react'
import { CRMDashboard } from '../src/components/CRMDashboard'
import { PortfolioManager } from '../src/components/PortfolioManager'
import { BlogManager } from '../src/components/BlogManager'
import { CategoryManager } from '../src/components/CategoryManager'
import { PartnersManager } from '../src/components/PartnersManager'
import { FeaturedManager } from '../src/components/FeaturedManager'
import { ServicesManager } from '../src/components/ServicesManager'
import { CuratedCollectionManager } from '../src/components/CuratedCollectionManager'
import { AdminAuth } from '../src/components/AdminAuth'

type TabType = 'dashboard' | 'portfolio' | 'blog' | 'services' | 'partners' | 'featured' | 'curated' | 'categories'

export const CRMAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Overview & Stats' },
    { id: 'portfolio', label: 'Portfolio', icon: '🎨', description: 'Manage portfolio images' },
    { id: 'blog', label: 'Blog Posts', icon: '📝', description: 'Write & publish articles' },
    { id: 'services', label: 'Services', icon: '💄', description: 'Manage service packages' },
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
      case 'services':
        return <ServicesManager />
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

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold">Mae Liew Admin Panel</h1>
              <p className="text-blue-100 mt-1">Manage your portfolio and blog content</p>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`group relative py-4 px-6 font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tab.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold">{tab.label}</div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-700">
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </AdminAuth>
  )
}

export default CRMAdmin