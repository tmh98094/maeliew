import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Eye, Upload, Save, X, Image as ImageIcon,
  Tag, Calendar, UploadCloud, Star, GripVertical, ArrowUp, ArrowDown,
  LayoutGrid, List, ChevronDown
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

interface SortableItemProps {
  portfolio: Content;
  onEdit: (portfolio: Content) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
  onOrderChange: (id: string, newOrder: number) => void;
  isReorderMode: boolean;
  isMobile: boolean;
}

const SortablePortfolioItem: React.FC<SortableItemProps> = ({
  portfolio,
  onEdit,
  onDelete,
  onToggleFeatured,
  onOrderChange,
  isReorderMode,
  isMobile,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: portfolio.id, disabled: isMobile || !isReorderMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${isDragging ? 'ring-2 ring-blue-500' : ''
        }`}
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
          <span className={`px-2 py-1 text-xs rounded-full ${portfolio.status === 'published'
            ? 'bg-green-100 text-green-800'
            : portfolio.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
            }`}>
            {portfolio.status}
          </span>
        </div>

        {/* Featured Badge */}
        {portfolio.is_featured && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs rounded-full bg-yellow-400 text-yellow-900 flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          </div>
        )}

        {/* Drag Handle (Desktop + Reorder Mode only) */}
        {isReorderMode && !isMobile && (
          <div
            {...attributes}
            {...listeners}
            className="absolute bottom-2 left-2 p-2 bg-white/90 rounded cursor-grab active:cursor-grabbing hover:bg-white"
          >
            <GripVertical size={20} className="text-gray-600" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base">
          {portfolio.title}
        </h3>

        {/* Meta Info */}
        <div className="space-y-1 mb-3">
          {portfolio.category_name && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Tag size={12} />
              {portfolio.category_name}
            </div>
          )}

          {isReorderMode && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Order:</span>
              <input
                type="number"
                value={portfolio.sort_order || 0}
                onChange={(e) => onOrderChange(portfolio.id, parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 md:gap-2 flex-wrap">
          <button
            onClick={() => onToggleFeatured(portfolio.id, !portfolio.is_featured)}
            className={`p-2 rounded text-sm transition-colors ${portfolio.is_featured
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
            title={portfolio.is_featured ? 'Remove from Featured' : 'Add to Featured'}
          >
            <Star size={14} fill={portfolio.is_featured ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => onEdit(portfolio)}
            className="flex-1 bg-blue-50 text-blue-600 px-2 md:px-3 py-2 rounded text-xs md:text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
          >
            <Edit size={14} />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => onDelete(portfolio.id)}
            className="bg-red-50 text-red-600 p-2 rounded text-sm hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

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
  const [batchFormData, setBatchFormData] = useState<{ [key: string]: { name: string, category: string } }>({});
  const [batchUploading, setBatchUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: 'pending' | 'uploading' | 'success' | 'error' }>({});
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPortfolios((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update sort_order values
        return newItems.map((item, index) => ({
          ...item,
          sort_order: index + 1
        }));
      });
      setHasOrderChanges(true);
    }
  };

  const handleOrderChange = (id: string, newOrder: number) => {
    setPortfolios(prev => prev.map(p =>
      p.id === id ? { ...p, sort_order: newOrder } : p
    ));
    setHasOrderChanges(true);
  };

  const handleSaveOrder = async () => {
    try {
      setSavingOrder(true);
      const orderUpdates = portfolios.map((p, index) => ({
        id: p.id,
        sort_order: p.sort_order || index + 1
      }));
      await CRMService.updateBatchSortOrder(orderUpdates);
      setHasOrderChanges(false);
      alert('Order saved successfully!');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error saving order. Please try again.');
    } finally {
      setSavingOrder(false);
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await CRMService.toggleFeatured(id, isFeatured);
      setPortfolios(prev => prev.map(p =>
        p.id === id ? { ...p, is_featured: isFeatured } : p
      ));
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Error updating featured status.');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

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

      if (selectedFile) {
        const publicUrl = await StorageService.uploadImage(selectedFile, 'portfolio');

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

      const title = formData.title.trim() || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') : 'Untitled');

      const contentData = {
        ...formData,
        title: title,
        alt_text: formData.alt_text || title,
        ...fileData,
        type: 'image' as const,
        sort_order: 0,
        is_featured: false,
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
        const portfolio = portfolios.find(p => p.id === id);
        await CRMService.deleteContent(id);

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

    const weddingCategory = categories.find(cat =>
      cat.name.toLowerCase().includes('wedding') ||
      cat.name.toLowerCase().includes('bridal')
    );
    const defaultCategoryId = weddingCategory?.id || categories[0]?.id || '';

    const initialData: { [key: string]: { name: string, category: string } } = {};
    files.forEach(file => {
      initialData[file.name] = {
        name: '',
        category: defaultCategoryId
      };
    });
    setBatchFormData(initialData);
  };

  const handleBatchSubmit = async () => {
    if (selectedFiles.length === 0) return;

    setBatchUploading(true);

    const initialProgress: { [key: string]: 'pending' | 'uploading' | 'success' | 'error' } = {};
    selectedFiles.forEach(file => {
      initialProgress[file.name] = 'pending';
    });
    setUploadProgress(initialProgress);

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const file of selectedFiles) {
        const fileData = batchFormData[file.name];
        if (!fileData.category) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 'error' }));
          errorCount++;
          continue;
        }

        try {
          setUploadProgress(prev => ({ ...prev, [file.name]: 'uploading' }));

          const publicUrl = await StorageService.uploadImage(file, 'portfolio');

          const img = new Image();
          const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.src = URL.createObjectURL(file);
          });

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
            mime_type: 'image/webp',
            width: dimensions.width,
            height: dimensions.height,
            sort_order: 0,
            is_featured: false,
          };

          await CRMService.createContent(contentData);

          setUploadProgress(prev => ({ ...prev, [file.name]: 'success' }));
          successCount++;

        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadProgress(prev => ({ ...prev, [file.name]: 'error' }));
          errorCount++;
        }
      }

      await loadData();

      if (errorCount === 0) {
        alert(`Successfully uploaded ${successCount} portfolio items!`);
        resetBatchForm();
      } else {
        alert(`Upload completed: ${successCount} successful, ${errorCount} failed.`);
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

  const featuredCount = portfolios.filter(p => p.is_featured).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Portfolio Management</h2>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Manage your portfolio images and content</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
          {isReorderMode && hasOrderChanges && (
            <button
              onClick={handleSaveOrder}
              disabled={savingOrder}
              className="bg-green-600 text-white px-4 py-2 md:py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm md:text-base"
            >
              {savingOrder ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Order
            </button>
          )}
          <button
            onClick={() => setIsReorderMode(!isReorderMode)}
            className={`px-4 py-2 md:py-3 rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base ${isReorderMode
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <List size={18} />
            {isReorderMode ? 'Exit Reorder' : 'Reorder'}
          </button>
          <button
            onClick={() => setShowBatchUpload(true)}
            className="bg-green-600 text-white px-4 py-2 md:py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <UploadCloud size={18} />
            <span className="hidden sm:inline">Batch Upload</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total Items</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{portfolios.length}</p>
            </div>
            <ImageIcon className="text-blue-600 hidden md:block" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Published</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {portfolios.filter(p => p.status === 'published').length}
              </p>
            </div>
            <Eye className="text-green-600 hidden md:block" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Featured</p>
              <p className="text-xl md:text-2xl font-bold text-yellow-600">{featuredCount}</p>
            </div>
            <Star className="text-yellow-600 hidden md:block" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Categories</p>
              <p className="text-xl md:text-2xl font-bold text-purple-600">{categories.length}</p>
            </div>
            <Tag className="text-purple-600 hidden md:block" size={24} />
          </div>
        </div>
      </div>

      {/* Reorder Mode Info */}
      {isReorderMode && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start gap-3">
            <GripVertical className="text-purple-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-purple-900">Reorder Mode</h4>
              <p className="text-sm text-purple-700 mt-1">
                {isMobile
                  ? 'Use the order number input to set the display sequence.'
                  : 'Drag items to reorder or use the order number input. Changes are not saved until you click "Save Order".'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Grid with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={portfolios.map(p => p.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {portfolios.map((portfolio) => (
              <SortablePortfolioItem
                key={portfolio.id}
                portfolio={portfolio}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFeatured={handleToggleFeatured}
                onOrderChange={handleOrderChange}
                isReorderMode={isReorderMode}
                isMobile={isMobile}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg md:text-xl font-bold">Batch Upload Portfolio Items</h3>
                  <button
                    type="button"
                    onClick={resetBatchForm}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <X size={24} />
                  </button>
                </div>

                {selectedFiles.length === 0 ? (
                  <div className="mb-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-400 mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-base md:text-lg text-blue-600 hover:text-blue-800 font-medium">
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
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <p className="text-sm text-gray-600">
                        {selectedFiles.length} files selected
                      </p>
                      <button
                        onClick={resetBatchForm}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Select Different Files
                      </button>
                    </div>

                    <div className="grid gap-3 md:gap-4 max-h-72 md:max-h-96 overflow-y-auto">
                      {selectedFiles.map((file) => (
                        <div key={file.name} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border rounded-lg relative">
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

                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Name (Optional)
                              </label>
                              <input
                                type="text"
                                value={batchFormData[file.name]?.name || ''}
                                onChange={(e) => updateBatchItemData(file.name, 'name', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Use filename"
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

                          <div className="text-xs text-gray-500 text-right hidden md:block">
                            <div className="truncate max-w-24">{file.name}</div>
                            <div>{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                          </div>
                        </div>
                      ))}
                    </div>

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
                        className="px-4 md:px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
              <form onSubmit={handleSubmit} className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg md:text-xl font-bold">
                    {editingId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-40 md:max-h-48 mx-auto rounded"
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
                        <Upload className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-4" />
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

                  <div className="md:col-span-2">
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

                {/* Advanced Options */}
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
                  >
                    <ChevronDown className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} size={16} />
                    Advanced Options (Tags & SEO)
                  </button>

                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4 pl-4 md:pl-6 border-l-2 border-gray-200"
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
                    className="px-4 md:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
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

export default PortfolioManager;