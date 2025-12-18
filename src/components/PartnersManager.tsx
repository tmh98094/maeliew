import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { CRMService } from '../services/crmService';
import { StorageService } from '../services/storageService';
import { Content } from '../lib/supabase';

interface PartnerFormData {
  title: string;
  alt_text: string;
  status: 'draft' | 'published' | 'archived' | 'deleted';
}

export const PartnersManager: React.FC = () => {
  const [partners, setPartners] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [formData, setFormData] = useState<PartnerFormData>({
    title: '',
    alt_text: '',
    status: 'published'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const partnerData = await CRMService.getAllContent({ type: 'partner' });
      setPartners(partnerData);
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
    
    if (!selectedFile && !editingId) {
      alert('Please select an image');
      return;
    }
    
    try {
      let fileData = {};
      
      if (selectedFile) {
        const publicUrl = await StorageService.uploadImage(selectedFile, 'partners');
        
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
        type: 'partner' as const,
      };

      if (editingId) {
        await CRMService.updateContent(editingId, contentData);
      } else {
        await CRMService.createContent(contentData);
      }

      await loadData();
      resetForm();
      alert('Partner saved successfully!');
    } catch (error) {
      console.error('Error saving partner:', error);
      alert(`Error saving partner: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  const handleEdit = (partner: Content) => {
    setEditingId(partner.id);
    setFormData({
      title: partner.title,
      alt_text: partner.alt_text || '',
      status: partner.status
    });
    setPreviewUrl(partner.file_path || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        const partner = partners.find(p => p.id === id);
        
        await CRMService.deleteContent(id);
        
        if (partner?.file_path && partner.file_path.includes('supabase.co')) {
          try {
            await StorageService.deleteImage(partner.file_path);
          } catch (storageError) {
            console.warn('Could not delete image from storage:', storageError);
          }
        }
        
        await loadData();
        alert('Partner deleted successfully!');
      } catch (error) {
        console.error('Error deleting partner:', error);
        alert('Error deleting partner. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      alt_text: '',
      status: 'published'
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingId(null);
    setShowForm(false);
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
          <h2 className="text-3xl font-bold text-gray-900">Partners & Brands</h2>
          <p className="text-gray-600 mt-2">Manage partner logos and brand collaborations</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Partner
        </button>
      </div>

      {/* Partners Grid */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {partners.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg mb-2">No partners yet</p>
            <p className="text-gray-400 text-sm">Add your first partner logo</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {partners.map((partner) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative group"
              >
                <div className="aspect-square bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                  <img
                    src={partner.file_path || ''}
                    alt={partner.alt_text || partner.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-center mt-2 text-gray-700 truncate">{partner.title}</p>
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(partner)}
                    className="p-2 bg-white text-blue-600 rounded hover:bg-blue-50"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(partner.id)}
                    className="p-2 bg-white text-red-600 rounded hover:bg-red-50"
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {editingId ? 'Edit Partner' : 'Add Partner'}
                </h3>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Logo *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {previewUrl && (
                    <div className="mt-4 p-4 bg-gray-50 rounded flex items-center justify-center">
                      <img src={previewUrl} alt="Preview" className="max-h-32 object-contain" />
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., MAC Cosmetics"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Alt Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (for accessibility)
                  </label>
                  <input
                    type="text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                    placeholder="e.g., MAC Cosmetics logo"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status */}
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
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingId ? 'Update' : 'Add'} Partner
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
