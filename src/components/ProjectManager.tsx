import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Folder, Calendar, DollarSign, User, Phone, Mail } from 'lucide-react';
import { CRMService } from '../services/crmService';
import { Project } from '../lib/supabase';

interface ProjectFormData {
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled';
  start_date: string;
  end_date: string;
  budget: string;
  client_name: string;
  client_email: string;
  client_phone: string;
}

const STATUS_COLORS = {
  planning: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  active: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  completed: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
  on_hold: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' }
};

export const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'planning',
    start_date: '',
    end_date: '',
    budget: '',
    client_name: '',
    client_email: '',
    client_phone: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await CRMService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const projectData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
      };

      if (editingId) {
        await CRMService.updateProject(editingId, projectData);
      } else {
        await CRMService.createProject(projectData);
      }

      await loadProjects();
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description || '',
      status: project.status,
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      budget: project.budget?.toString() || '',
      client_name: project.client_name || '',
      client_email: project.client_email || '',
      client_phone: project.client_phone || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      start_date: '',
      end_date: '',
      budget: '',
      client_name: '',
      client_email: '',
      client_phone: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusStats = () => {
    const stats = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return stats;
  };

  const getTotalBudget = () => {
    return projects.reduce((total, project) => {
      return total + (project.budget || 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statusStats = getStatusStats();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Project Management</h2>
          <p className="text-gray-600 mt-2">Manage your client projects and workflows</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <Folder className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-green-600">{statusStats.active || 0}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-600">{statusStats.completed || 0}</p>
            </div>
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-purple-600">
                ${getTotalBudget().toLocaleString()}
              </p>
            </div>
            <DollarSign className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => {
          const statusStyle = STATUS_COLORS[project.status];
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                    {project.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text}`}>
                    <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></div>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                
                {project.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {project.description}
                  </p>
                )}

                {/* Client Info */}
                {project.client_name && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={14} />
                      {project.client_name}
                    </div>
                    {project.client_email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        {project.client_email}
                      </div>
                    )}
                    {project.client_phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        {project.client_phone}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6 space-y-3">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {project.start_date && (
                    <div>
                      <p className="text-gray-500">Start Date</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(project.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {project.end_date && (
                    <div>
                      <p className="text-gray-500">End Date</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(project.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Budget */}
                {project.budget && (
                  <div className="text-sm">
                    <p className="text-gray-500">Budget</p>
                    <p className="font-medium text-lg flex items-center gap-1">
                      <DollarSign size={14} />
                      {project.budget.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Created Date */}
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      // Note: We'd need to add deleteProject to CRMService
                      console.log('Delete project:', project.id);
                    }
                  }}
                  className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-100 transition-colors flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
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
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleSubmit} className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">
                    {editingId ? 'Edit Project' : 'Add Project'}
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
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter project name"
                      />
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
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the project..."
                    />
                  </div>

                  {/* Client Information */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Client Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Client Name
                        </label>
                        <input
                          type="text"
                          value={formData.client_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Client name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.client_email}
                          onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="client@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.client_phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, client_phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
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