import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Upload, Save, X, Image as ImageIcon, Tag, Calendar, UploadCloud } from 'lucide-react';
import { CRMService } from '../services/crmService';
import { StorageService } from '../services/storageService';
import { Content, Category, Project } from '../lib/supabase';

interface PortfolioFormData {
  title: string;
  description: string;
  category_id: string;
  project_id?: string;
  alt_text: string;
  tags: string[];
  keywords: string[];
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published' | 'archived' | 'deleted';
}

export const PortfolioManager: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [batchFormData, setBatchFormData] = useState<{[key: string]: {name: string, category: string}}>({});
  const [batchUploading, setBatchUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: 'pending' | 'uploading' | 'success' | 'error'}>({});
  
  const [formData, setFormData] = useState<PortfolioFormData>({
    title: '',
    description: '',
    category_id: '',
    project_id: '',
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
      const [portfolioData, categoryData, projectData] = await Promise.all([
        CRMService.getAllContent({ type: 'image' }),
        CRMService.getAllCategories(),
        CRMService.getAllProjects()
      ]);
      
      setPortfolios(portfolioData);
      setCategories(categoryData);
      setProjects(projectData);
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
      
      // Set default category to wedding if not already set
      if (!formData.category_id && categories.length > 0) {
        const weddingCategory = categories.find(cat => 
          cat.name.toLowerCase().includes('wedding') || 
          cat.name.toLowerCase().includes('bridal')
        );
        const defaultCategoryId = weddingCategory?.id || categories[0]?.id || '';
        
        setFormData(prev => ({
          ...prev,
          category_id: defaultCategoryId
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let fileData = {};
      
      // Upload file to Supabase Storage if a new file is selected
      if (selectedFile) {
        const publicUrl = await StorageService.uploadImage(selectedFile, 'portfolio');
        
        // Get image dimensions
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

      // Use filename as fallback if title is empty
      const title = formData.title.trim() || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') : 'Untitled');
      
      const contentData = {
        ...formData,
        title: title,
        alt_text: formData.alt_text || title,
        ...fileData,
        type: 'image' as const,
      };

      if (editingId) {
        await CRMService.updateContent(editingId, contentData);
      } else {
        await CRMService.createContent(contentData);
      }

      await loadData();
      resetForm();
      alert('Portfolio item saved successfully!');
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert(`Error saving portfolio: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  const handleEdit = (portfolio: Content) => {
    setEditingId(portfolio.id);
    setFormData({
      title: portfolio.title,
      description: portfolio.description || '',
      category_id: portfolio.category_id || '',
      project_id: portfolio.project_id || '',
      alt_text: portfolio.alt_text || '',
      tags: portfolio.tags || [],
      keywords: portfolio.keywords || [],
      meta_title: portfolio.meta_title || '',
      meta_description: portfolio.meta_description || '',
      status: portfolio.status
    });
    setPreviewUrl(portfolio.file_path || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        // Find the portfolio item to get the file path
        const portfolio = portfolios.find(p => p.id === id);
        
        // Delete from database
        await CRMService.deleteContent(id);
        
        // Delete from storage if it's a Supabase Storage URL
        if (portfolio?.file_path && portfolio.file_path.includes('supabase.co')) {
          try {
            await StorageService.deleteImage(portfolio.file_path);
          } catch (storageError) {
            console.warn('Could not delete image from storage:', storageError);
          }
        }
        
        await loadData();
        alert('Portfolio item deleted successfully!');
      } catch (error) {
        console.error('Error deleting portfolio:', error);
        alert('Error deleting portfolio. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category_id: '',
      project_id: '',
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

  const handleBatchFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    
    // Find wedding category or use first category as fallback
    const weddingCategory = categories.find(cat => 
      cat.name.toLowerCase().includes('wedding') || 
      cat.name.toLowerCase().includes('bridal')
    );
    const defaultCategoryId = weddingCategory?.id || categories[0]?.id || '';
    
    // Initialize form data for each file
    const initialData: {[key: string]: {name: string, category: string}} = {};
    files.forEach(file => {
      initialData[file.name] = {
        name: '', // Default to empty name
        category: defaultCategoryId
      };
    });
    setBatchFormData(initialData);
  };

  const handleBatchSubmit = async () => {
    if (selectedFiles.length === 0) return;
    
    setBatchUploading(true);
    
    // Initialize progress tracking
    const initialProgress: {[key: string]: 'pending' | 'uploading' | 'success' | 'error'} = {};
    selectedFiles.forEach(file => {
      initialProgress[file.name] = 'pending';
    });
    setUploadProgress(initialProgress);
    
    try {
      let successCount = 0;
      let errorCount = 0;

      // Upload files one by one to show progress
      for (const file of selectedFiles) {
        const fileData = batchFormData[file.name];
        if (!fileData.category) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 'error' }));
          errorCount++;
          continue;
        }
        
        try {
          // Update progress to uploading
          setUploadProgress(prev => ({ ...prev, [file.name]: 'uploading' }));
          
          // Upload file to Supabase Storage
          const publicUrl = await StorageService.uploadImage(file, 'portfolio');
          
          // Get image dimensions from original file
          const img = new Image();
          const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.src = URL.createObjectURL(file);
          });
          
          // Use filename as fallback if name is empty
          const title = fileData.name.trim() || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
          
          const contentData = {
            title: title,
            description: '',
            category_id: fileData.category,
            alt_text: title,
            tags: [],
            keywords: [],
            meta_title: '',
            meta_description: '',
            status: 'published' as const,
            type: 'image' as const,
            file_path: publicUrl,
            file_name: file.name,
            file_size: file.size,
            mime_type: 'image/webp', // Since we convert to WebP
            width: dimensions.width,
            height: dimensions.height,
          };

          await CRMService.createContent(contentData);
          
          // Update progress to success
          setUploadProgress(prev => ({ ...prev, [file.name]: 'success' }));
          successCount++;
          
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadProgress(prev => ({ ...prev, [file.name]: 'error' }));
          errorCount++;
        }
      }

      await loadData();
      
      // Show results
      if (errorCount === 0) {
        alert(`Successfully uploaded ${successCount} portfolio items!`);
        resetBatchForm();
      } else {
        alert(`Upload completed: ${successCount} successful, ${errorCount} failed. Check the progress indicators.`);
      }
      
    } catch (error) {
      console.error('Error batch uploading:', error);
      alert(`Error uploading files: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setBatchUploading(false);
    }
  };

  const resetBatchForm = () => {
    setSelectedFiles([]);
    setBatchFormData({});
    setShowBatchUpload(false);
    setBatchUploading(false);
    setUploadProgress({});
  };

  const updateBatchItemData = (fileName: string, field: 'name' | 'category', value: string) => {
    setBatchFormData(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value
      }
    }));
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
          <h2 className="text-3xl font-bold text-gray-900">Portfolio Management</h2>
          <p className="text-gray-600 mt-2">Manage your portfolio images and content</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBatchUpload(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <UploadCloud size={20} />
            Batch Upload
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Portfolio Item
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{portfolios.length}</p>
            </div>
            <ImageIcon className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {portfolios.filter(p => p.status === 'published').length}
              </p>
            </div>
            <Eye className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">
                {portfolios.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <Edit className="text-yellow-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
            </div>
            <Tag className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {portfolios.map((portfolio) => (
          <motion.div
            key={portfolio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="aspect-square bg-gray-100 relative">
              {portfolio.file_path ? (
                <img
                  src={portfolio.file_path}
                  alt={portfolio.alt_text || portfolio.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  portfolio.status === 'published' 
                    ? 'bg-green-100 text-green-800'
                    : portfolio.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {portfolio.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {portfolio.title}
              </h3>
              
              {portfolio.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {portfolio.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="space-y-2 mb-4">
                {portfolio.category_name && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Tag size={12} />
                    {portfolio.category_name}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} />
                  {new Date(portfolio.created_at).toLocaleDateString()}
                </div>

                {portfolio.view_count > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Eye size={12} />
                    {portfolio.view_count} views
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(portfolio)}
                  className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(portfolio.id)}
                  className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-100 transition-colors flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Batch Upload Modal */}
      <AnimatePresence>
        {showBatchUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Batch Upload Portfolio Items</h3>
                  <button
                    type="button"
                    onClick={resetBatchForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* File Upload */}
                {selectedFiles.length === 0 ? (
                  <div className="mb-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <UploadCloud className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-lg text-blue-600 hover:text-blue-800 font-medium">
                          Click to select multiple images
                        </span>
                        <p className="text-sm text-gray-500 mt-2">
                          Select multiple portfolio images to upload at once
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleBatchFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        {selectedFiles.length} files selected. Set name and category for each:
                      </p>
                      <button
                        onClick={resetBatchForm}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Select Different Files
                      </button>
                    </div>

                    {/* Files List */}
                    <div className="grid gap-4 max-h-96 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={file.name} className="flex items-center gap-4 p-4 border rounded-lg relative">
                          {/* Progress Indicator */}
                          {uploadProgress[file.name] && (
                            <div className="absolute top-2 right-2">
                              {uploadProgress[file.name] === 'pending' && (
                                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                              )}
                              {uploadProgress[file.name] === 'uploading' && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                              {uploadProgress[file.name] === 'success' && (
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                              {uploadProgress[file.name] === 'error' && (
                                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✗</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Preview */}
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Form Fields */}
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Name (Optional)
                              </label>
                              <input
                                type="text"
                                value={batchFormData[file.name]?.name || ''}
                                onChange={(e) => updateBatchItemData(file.name, 'name', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Leave empty to use filename"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Category
                              </label>
                              <select
                                value={batchFormData[file.name]?.category || ''}
                                onChange={(e) => updateBatchItemData(file.name, 'category', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* File Info */}
                          <div className="text-xs text-gray-500 text-right">
                            <div>{file.name}</div>
                            <div>{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t">
                      <button
                        type="button"
                        onClick={resetBatchForm}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBatchSubmit}
                        disabled={batchUploading || selectedFiles.some(file => !batchFormData[file.name]?.category)}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        {batchUploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            Upload {selectedFiles.length} Items
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleSubmit} className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">
                    {editingId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewUrl('');
                            setSelectedFile(null);
                          }}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <label className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-800">
                            Click to upload
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional - leave empty to use filename"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project
                    </label>
                    <select
                      value={formData.project_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, project_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={formData.alt_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the image for accessibility"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe this portfolio item..."
                  />
                </div>

                {/* Advanced Options - Collapsible */}
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
                  >
                    <span className={`transform transition-transform ${showAdvanced ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                    Advanced Options (Tags & SEO)
                  </button>

                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4 pl-6 border-l-2 border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={formData.tags.join(', ')}
                            onChange={(e) => handleTagInput(e.target.value, 'tags')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="wedding, bridal, makeup"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Keywords (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={formData.keywords.join(', ')}
                            onChange={(e) => handleTagInput(e.target.value, 'keywords')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="SEO keywords"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Title
                          </label>
                          <input
                            type="text"
                            value={formData.meta_title}
                            onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="SEO title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Description
                          </label>
                          <input
                            type="text"
                            value={formData.meta_description}
                            onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="SEO description"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};