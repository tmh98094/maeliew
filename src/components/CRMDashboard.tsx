import React, { useState, useEffect } from 'react'
import { CRMService } from '../services/crmService'
import { Content, Category, Project } from '../lib/supabase'

interface DashboardStats {
  totalContent: number
  publishedContent: number
  totalViews: number
  totalDownloads: number
}

export const CRMDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    publishedContent: 0,
    totalViews: 0,
    totalDownloads: 0
  })
  const [recentContent, setRecentContent] = useState<Content[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load recent content
      const content = await CRMService.getAllContent({ limit: 10 })
      setRecentContent(content)
      
      // Load categories and projects
      const [categoriesData, projectsData] = await Promise.all([
        CRMService.getAllCategories(),
        CRMService.getAllProjects()
      ])
      
      setCategories(categoriesData)
      setProjects(projectsData)
      
      // Calculate stats
      const allContent = await CRMService.getAllContent({ limit: 1000 })
      const publishedCount = allContent.filter(c => c.status === 'published').length
      const totalViews = allContent.reduce((sum, c) => sum + c.view_count, 0)
      const totalDownloads = allContent.reduce((sum, c) => sum + c.download_count, 0)
      
      setStats({
        totalContent: allContent.length,
        publishedContent: publishedCount,
        totalViews,
        totalDownloads
      })
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading CRM Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Content CRM Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Content</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalContent}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Published</h3>
          <p className="text-2xl font-bold text-green-600">{stats.publishedContent}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalViews}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Downloads</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.totalDownloads}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Content</h2>
          <div className="space-y-3">
            {recentContent.slice(0, 5).map((content) => (
              <div key={content.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h4 className="font-medium">{content.title}</h4>
                  <p className="text-sm text-gray-500">
                    {content.type} • {content.status} • {content.category_name}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>{content.view_count} views</div>
                  <div>{new Date(content.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3"
                    style={{ backgroundColor: category.color || '#gray' }}
                  ></div>
                  <span>{category.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {recentContent.filter(c => c.category_id === category.id).length} items
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Overview */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.filter(p => p.status === 'active').map((project) => (
            <div key={project.id} className="border rounded-lg p-4">
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-500">Status: {project.status}</span>
                <span className="text-gray-500">
                  {recentContent.filter(c => c.project_id === project.id).length} items
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}