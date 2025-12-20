import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon, Grid } from 'lucide-react';
import { CRMService } from '../services/crmService';
import { StorageService } from '../services/storageService';
import { Content } from '../lib/supabase';

interface CuratedCollection {
  id: string;
  name: string;
  category: 'wedding' | 'rom' | 'celebrity';
  images: string[];
}

interface CollectionFormData {
  name: string;
  category: 'wedding' | 'rom' | 'celebrity';
}

export const CuratedCollectionManager: React.FC = () => {
  const [collections, setCollections] = useState<CuratedCollection[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<CollectionFormData>({
    name: '',
    category: 'wedding'
  });

  const categories = [
    { id: 'wedding', label: 'Wedding', description: 'Wedding makeup collections' },
    { id: 'rom', label: 'ROM', description: 'Registration of Marriage collections' },
    { id: 'celebrity', label: 'Celebrity', description: 'Celebrity makeup collections' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load portfolio images
      const images = await CRMService.getAllContent({ 
        type: 'image', 
        status: 'published',
        limit: 100 
      });
      setPortfolioImages(images);

      // Load existing collections from localStorage (since we don't have a dedicated table)
      const savedCollections = localStorage.getItem('curatedCollections');
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      } else {
        // Initialize with default collections
        const defaultCollections: CuratedCollection[] = [
          {
            id: 'wedding-collection',
            name: 'Wedding Collection',
            category: 'wedding',
            images: ["/images/portfolio/wd.webp", "/images/portfolio/wd1.webp", "/images/portfolio/wd2.webp"]
          },
          {
            id: 'rom-collection',
            name: 'ROM Collection',
            category: 'rom',
            images: ["/images/portfolio/rom1.webp", "/images/portfolio/rom3.webp", "/images/portfolio/rom2.webp"]
          },
          {
            id: 'celebrity-collection',
            name: 'Celebrity Collection',
            category: 'celebrity',
            images: ["/images/about/ceb1.webp", "/images/about/ceb2.webp", "/images/about/ceb3.webp"]
          }
        ];
        setCollections(defaultCollections);
        localStorage.setItem('curatedCollections', JSON.stringify(defaultCollections));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCollections = (newCollections: CuratedCollection[]) => {
    setCollections(newCollections);
    localStorage.setItem('curatedCollections', JSON.stringify(newCollections));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedImages.length !== 3) {
      alert('Please select exactly 3 images for the collection.');
      return;
    }

    const newCollection: CuratedCollection = {
      id: editingId || `collection-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      images: selectedImages
    };

    let updatedCollections;
    if (editingId) {
      updatedCollections = collections.map(c => c.id === editingId ? newCollection : c);
    } else {
      // Replace existing collection of same category or add new
      const existingIndex = collections.findIndex(c => c.category === formData.category);
      if (existingIndex >= 0) {
        updatedCollections = [...collections];
        updatedCollections[existingIndex] = newCollection;
      } else {
        updatedCollections = [...collections, newCollection];
      }
    }

    saveCollections(updatedCollections);
    resetForm();
    alert('Collection saved successfully!');
  };

  const handleEdit = (collection: CuratedCollection) => {
    setEditingId(collection.id);
    setFormData({
      name: collection.name,
      category: collection.category
    });
    setSelectedImages(collection.images);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      const updatedCollections = collections.filter(c => c.id !== id);
      saveCollections(updatedCollections);
      alert('Collection deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'wedding'
    });
    setSelectedImages([]);
    setEditingId(null);
    setShowForm(false);
  };

  const toggleImageSelection = (imagePath: string) => {
    if (selectedImages.includes(imagePath)) {
      setSelectedImages(selectedImages.filter(img => img !== imagePath));
    } else if (selectedImages.length < 3) {
      setSelectedImages([...selectedImages, imagePath]);
    } else {
      alert('You can only select 3 images per collection.');
    }
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
          <h2 className="text-3xl font-bold text-gray-900">Curated Collections</h2>
          <p className="text-gray-600 mt-2">Manage homepage curated collection images (3 images per category)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Edit Collection
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => {
          const collection = collections.find(c => c.category === category.id);
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.label}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  {collection && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(collection)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit collection"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete collection"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Images */}
              <div className="p-4">
                {collection ? (
                  <div className="grid grid-cols-3 gap-2">
                    {collection.images.map((imagePath, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <img
                          src={imagePath}
                          alt={`${category.label} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.webp';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Grid className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-500 text-sm">No collection set</p>
                    <button
                      onClick={() => {
                                        setFormData({ name: `${category.label} Collection`, category: category.id as any });
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      Create Collection
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

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
              className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleSubmit} className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">
                    {editingId ? 'Edit Collection' : 'Create Collection'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Collection Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Wedding Collection"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Selected Images ({selectedImages.length}/3)
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedImages.map((imagePath, index) => (
                        <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                          <img
                            src={imagePath}
                            alt={`Selected ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => toggleImageSelection(imagePath)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Selection */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Select Images from Portfolio (Choose exactly 3)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                    {portfolioImages.map((image) => (
                      <div
                        key={image.id}
                        className={`relative aspect-square bg-gray-100 rounded overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedImages.includes(image.file_path || '') 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-transparent hover:border-gray-300'
                        }`}
                        onClick={() => toggleImageSelection(image.file_path || '')}
                      >
                        {image.file_path ? (
                          <img
                            src={image.file_path}
                            alt={image.alt_text || image.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={24} className="text-gray-400" />
                          </div>
                        )}
                        
                        {selectedImages.includes(image.file_path || '') && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                              {selectedImages.indexOf(image.file_path || '') + 1}
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                          {image.title}
                        </div>
                      </div>
                    ))}
                  </div>
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
                    disabled={selectedImages.length !== 3}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    {editingId ? 'Update Collection' : 'Create Collection'}
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