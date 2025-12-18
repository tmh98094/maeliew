import React, { useState, useEffect } from 'react'
import { CRMService } from '../services/crmService'
import { Content, Category, Project, ContentType, ContentStatus } from '../lib/supabase'

export const ContentManager: React.FC = () => {
  const [content, setContent] = useState<Content[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<ContentStatus | ''>('')
  const [filterType, setFilterType] = useState<ContentType | ''>('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    type: 'image' as ContentType,
    status: 'draft' as ContentStatus,
    file_path: '',
    file_name: '',
    alt_text: '',
    tags: [] as string[],
    category_id: '',
    project_id: ''
  })

  useEffect(() => {
    loadData()
  }, [filterStatus, filterType, filterCategory])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [contentData, categoriesData, projectsData] = await Promise.all([
        CRMService.getAllContent({
          status: filterStatus || undefined,
          type: filterType || undefined,
          categoryId: filterCategory || undefined
        }),
        CRMService.getAllCategories(),
        CRMService.getAllProjects()
      ])
      
      setContent(contentData)
      setCategories(categoriesData)
      setProjects(projectsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const results = await CRMService.searchContent(searchTerm)
        setContent(results)
      } catch (error) {
        console.error('Error searching:', error)
      }
    } else {
      loadData()
    }
  }

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await CRMService.createContent({
        ...newContent,
        tags: newContent.tags.filter(tag => tag.trim() !== '')
      })
      
      setNewContent({
        title: '',
        description: '',
        type: 'image',
        status: 'draft',
        file_path: '',
        file_name: '',
        alt_text: '',
        tags: [],
        category_id: '',
        project_id: ''
      })
      setShowAddForm(false)
      loadData()
    } catch (error) {
      console.error('Error adding content:', error)
    }
  }

  const handleStatusChange = async (contentId: string, newStatus: ContentStatus) => {
    try {
      await CRMService.updateContent(contentId, { status: newStatus })
      loadData()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim())
    setNewContent({ ...newContent, tags })
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Manager</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : 'Add Content'}
        </button>
      </div>

      {/* Add Content Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Content</h2>
          <form onSubmit={handleAddContent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={newContent.type}
                onChange={(e) => setNewContent({ ...newContent, type: e.target.value as ContentType })}
                className="w-full p-2 border rounded"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
                <option value="text">Text</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newContent.description}
                onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">File Path</label>
              <input
                type="text"
                value={newContent.file_path}
                onChange={(e) => setNewContent({ ...newContent, file_path: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="/public/images/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Alt Text</label>
              <input
                type="text"
                value={newContent.alt_text}
                onChange={(e) => setNewContent({ ...newContent, alt_text: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={newContent.category_id}
                onChange={(e) => setNewContent({ ...newContent, category_id: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Project</label>
              <select
                value={newContent.project_id}
                onChange={(e) => setNewContent({ ...newContent, project_id: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Project</option>
                {projects.map(proj => (
                  <option key={proj.id} value={proj.id}>{proj.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={newContent.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="photography, portfolio, nature"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Add Content
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ContentStatus | '')}
            className="p-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ContentType | '')}
            className="p-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="text">Text</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {content.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{item.type}</td>
                  <td className="px-6 py-4">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as ContentStatus)}
                      className={`text-sm px-2 py-1 rounded ${
                        item.status === 'published' ? 'bg-green-100 text-green-800' :
                        item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.category_name && (
                      <span className="inline-flex items-center">
                        <div 
                          className="w-3 h-3 rounded mr-2"
                          style={{ backgroundColor: item.category_color || '#gray' }}
                        ></div>
                        {item.category_name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{item.view_count}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}