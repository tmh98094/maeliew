import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Save, X, FileText, Calendar, Tag } from 'lucide-react';
import { CRMService } from '../services/crmService';
import { StorageService } from '../services/storageService';
import { Content, Category } from '../lib/supabase';

interface BlogFormData {
  title: string;
  description: string;
  category_id: string;
  alt_text: string;
  tags: string[];
  keywords: string[];
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published' | 'archived' | 'deleted';
}

export const BlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    description: '',
    category_id: '',
    alt_text: '',
    tags: [],
    keywords: [],
    meta_title: '',
    meta_description: '',
    status: 'draft'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [blogData, categoryData] = await Promise.all([
        CRMService.getAllContent({ type: 'blog' }),
        CRMService.getAllCategories()
      ]);
      
      setBlogs(blogData);
      setCategories(categoryData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ')
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let fileData = {};
      
      if (selectedFile) {
        const publicUrl = await StorageService.uploadImage(selectedFile, 'blog');
        
        const img = new Image();
        const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.src = URL.createObjectURL(selectedFile);
        });
        
        fileData = {
          file_path: publicUrl,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          width: dimensions.width,
          height: dimensions.height,
        };
      }

      const contentData = {
        ...formData,
        ...fileData,
        type: 'blog' as const,
      };

      if (editingId) {
        await CRMService.updateContent(editingId, contentData);
      } else {
        await CRMService.createContent(contentData);
      }

      await loadData();
      resetForm();
      alert('Blog post saved successfully!');
    } catch (error) {
      console.error('Error saving blog:', error);
      alert(`Error saving blog: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  const handleEdit = (blog: Content) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      description: blog.description || '',
      category_id: blog.category_id || '',
      alt_text: blog.alt_text || '',
      tags: blog.tags || [],
      keywords: blog.keywords || [],
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      status: blog.status
    });
    setPreviewUrl(blog.file_path || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const blog = blogs.find(b => b.id === id);
        
        await CRMService.deleteContent(id);
        
        if (blog?.file_path && blog.file_path.includes('supabase.co')) {
          try {
            await StorageService.deleteImage(blog.file_path);
          } catch (storageError) {
            console.warn('Could not delete image from storage:', storageError);
          }
        }
        
        await loadData();
        alert('Blog post deleted successfully!');
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category_id: '',
      alt_text: '',
      tags: [],
      keywords: [],
      meta_title: '',
      meta_description: '',
      status: 'draft'
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleTagInput = (value: string, field: 'tags' | 'keywords') => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-gray-600 mt-2">Manage your blog articles and featured images</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Blog Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">{blogs.length}</p>
            </div>
            <FileText className="text-blue-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-3xl font-bold text-green-600">
                {blogs.filter(b => b.status === 'published').length}
              </p>
            </div>
            <Eye className="text-green-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-3xl font-bold text-yellow-600">
                {blogs.filter(b => b.status === 'draft').length}
              </p>
            </div>
            <Edit className="text-yellow-600" size={32} />
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">All Blog Posts</h3>
          
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg mb-2">No blog posts yet</p>
              <p className="text-gray-400 text-sm">Create your first blog post to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {blog.file_path && (
                    <img
                      src={blog.file_path}
                      alt={blog.alt_text || blog.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{blog.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{blog.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        blog.status === 'published' ? 'bg-green-100 text-green-700' :
                        blog.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {blog.status}
                      </span>
                      {blog.category_name && (
                        <span className="text-xs text-gray-500">
                          📁 {blog.category_name}
                        </span>
                      )}
                      {blog.tags && blog.tags.length > 0 && (
                        <span className="text-xs text-gray-500">
                          🏷️ {blog.tags.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {editingId ? 'Edit Blog Post' : 'New Blog Post'}
                </h3>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="mt-4 w-full h-48 object-cover rounded" />
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleTagInput(e.target.value, 'tags')}
                    placeholder="beauty, makeup, tutorial"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingId ? 'Update' : 'Create'} Blog Post
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
