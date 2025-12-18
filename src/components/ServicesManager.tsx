import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, DollarSign, Package, Clock, FileText } from 'lucide-react';
import { CRMService, ServicePackage } from '../services/crmService';
import { StorageService } from '../services/storageService';

interface ServiceFormData {
  title: string;
  category: 'wedding' | 'rom' | 'pre-wedding' | 'addon' | 'personal';
  price: number;
  currency: 'RM';
  features: string[];
  description: string;
  duration: string;
  note: string;
  images: string[];
  status: 'active' | 'inactive' | 'archived';
  sort_order: number;
}

const categoryLabels = {
  wedding: 'Wedding Day Services',
  rom: 'Registration of Marriage (ROM)',
  'pre-wedding': 'Pre-Wedding Photography',
  addon: 'Add-On Services',
  personal: 'Personal Services'
};

export const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    category: 'wedding',
    price: 0,
    currency: 'RM',
    features: [''],
    description: '',
    duration: '',
    note: '',
    images: [],
    status: 'active',
    sort_order: 0
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const servicesData = await CRMService.getAllServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrls: string[] = [...formData.images];
      
      // Upload new images if any
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file => 
          StorageService.uploadImage(file, 'services')
        );
        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const serviceData = {
        ...formData,
        images: imageUrls,
        features: formData.features.filter(f => f.trim() !== '')
      };

      if (editingId) {
        await CRMService.updateService(editingId, serviceData);
      } else {
        await CRMService.createService(serviceData);
      }

      await loadServices();
      resetForm();
      alert('Service saved successfully!');
    } catch (error) {
      console.error('Error saving service:', error);
      alert(`Error saving service: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  const handleEdit = (service: ServicePackage) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      category: service.category,
      price: service.price,
      currency: service.currency,
      features: service.features.length > 0 ? service.features : [''],
      description: service.description || '',
      duration: service.duration || '',
      note: service.note || '',
      images: service.images || [],
      status: service.status,
      sort_order: service.sort_order
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await CRMService.deleteService(id);
        await loadServices();
        alert('Service deleted successfully!');
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Error deleting service. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'wedding',
      price: 0,
      currency: 'RM',
      features: [''],
      description: '',
      duration: '',
      note: '',
      images: [],
      status: 'active',
      sort_order: 0
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setEditingId(null);
    setShowForm(false);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
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
          <h2 className="text-3xl font-bold text-gray-900">Services Management</h2>
          <p className="text-gray-600 mt-2">Manage service packages, pricing, and features</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-3xl font-bold text-gray-900">{services.length}</p>
            </div>
            <Package className="text-blue-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Services</p>
              <p className="text-3xl font-bold text-green-600">
                {services.filter(s => s.status === 'active').length}
              </p>
            </div>
            <FileText className="text-green-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-3xl font-bold text-purple-600">
                {new Set(services.map(s => s.category)).size}
              </p>
            </div>
            <Clock className="text-purple-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Price</p>
              <p className="text-3xl font-bold text-yellow-600">
                RM {services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length) : 0}
              </p>
            </div>
            <DollarSign className="text-yellow-600" size={32} />
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">All Services</h3>
          
          {services.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg mb-2">No services yet</p>
              <p className="text-gray-400 text-sm">Create your first service to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {service.images && service.images.length > 0 && (
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{service.title}</h4>
                      <span className="text-lg font-bold text-green-600">
                        {service.currency} {service.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        service.status === 'active' ? 'bg-green-100 text-green-700' :
                        service.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {service.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        📁 {categoryLabels[service.category]}
                      </span>
                      <span className="text-xs text-gray-500">
                        ⭐ {service.features.length} features
                      </span>
                      {service.duration && (
                        <span className="text-xs text-gray-500">
                          ⏱️ {service.duration}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
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
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {editingId ? 'Edit Service' : 'New Service'}
                </h3>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Premium 2-Session Package"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (RM) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
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
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Description and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the service..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Full day service, 2-3 hours"
                    />
                    
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                      Note
                    </label>
                    <textarea
                      rows={2}
                      value={formData.note}
                      onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional notes or conditions..."
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features *
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter feature..."
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  
                  {/* Existing Images */}
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img src={image} alt={`Service ${index + 1}`} className="w-full h-24 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Preview New Images */}
                  {previewUrls.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">New Images Preview:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {previewUrls.map((url, index) => (
                          <img key={index} src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingId ? 'Update' : 'Create'} Service
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