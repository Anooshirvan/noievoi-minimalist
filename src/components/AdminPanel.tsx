
import React, { useState } from 'react';
import { useAdmin, Content } from '../contexts/AdminContext';
import { X, Upload, Save, Trash2, ChevronLeft, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface AdminFormProps {
  item: Content | null;
  onSave: (item: Content) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isNew?: boolean;
}

const generateId = (type: string) => `${type}-${Date.now()}`;

const AdminForm: React.FC<AdminFormProps> = ({ 
  item, 
  onSave, 
  onCancel, 
  onDelete,
  isNew = false 
}) => {
  const [formData, setFormData] = useState<Content>(item || {
    id: '',
    type: 'about',
    title: '',
    description: '',
    imageSrc: '',
    page: 'home'
  } as Content);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // For approach steps
  const [steps, setSteps] = useState<{id: string; title: string; description: string}[]>(
    formData.steps || []
  );
  
  // For network regions
  const [regions, setRegions] = useState<string[]>(
    formData.regions || []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5000000) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageUrl = event.target.result as string;
        setPreviewImage(imageUrl);
        setFormData(prev => ({ ...prev, imageSrc: imageUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle step changes
  const handleStepChange = (index: number, field: 'title' | 'description', value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  // Add a new step
  const addStep = () => {
    setSteps([...steps, { id: `step-${Date.now()}`, title: '', description: '' }]);
  };

  // Remove a step
  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  // Handle region changes
  const handleRegionChange = (index: number, value: string) => {
    const newRegions = [...regions];
    newRegions[index] = value;
    setRegions(newRegions);
  };

  // Add a new region
  const addRegion = () => {
    setRegions([...regions, '']);
  };

  // Remove a region
  const removeRegion = (index: number) => {
    setRegions(regions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.imageSrc) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Add steps and regions to formData if they exist
    const updatedFormData = {
      ...formData,
      ...(steps.length > 0 && { steps }),
      ...(regions.length > 0 && { regions })
    };

    const updatedData = isNew 
      ? { ...updatedFormData, id: generateId(updatedFormData.type) } 
      : updatedFormData;
      
    onSave(updatedData);
    toast.success(`${isNew ? 'Created' : 'Updated'} successfully`);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this item?')) {
      onDelete();
      toast.success('Deleted successfully');
    }
  };

  const renderTypeSpecificFields = () => {
    switch(formData.type) {
      case 'team':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="Team member name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role || ''}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="Team member role/position"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                rows={4}
                className="admin-form-input"
                placeholder="A brief biography of this team member"
              />
            </div>
          </>
        );
      case 'approach':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="admin-form-input"
                placeholder="Detailed description"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Steps</label>
              {steps.map((step, index) => (
                <div key={step.id} className="mb-4 p-4 border rounded relative">
                  <button 
                    type="button" 
                    onClick={() => removeStep(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                  <div className="mb-2">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                      className="admin-form-input mb-2"
                      placeholder="Step title"
                    />
                  </div>
                  <div>
                    <textarea
                      value={step.description}
                      onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                      rows={2}
                      className="admin-form-input"
                      placeholder="Step description"
                    />
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                onClick={addStep}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} className="mr-1" /> Add Step
              </button>
            </div>
          </>
        );
      case 'network':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="admin-form-input"
                placeholder="Detailed description"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Regions</label>
              {regions.map((region, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => handleRegionChange(index, e.target.value)}
                    className="admin-form-input flex-grow mr-2"
                    placeholder="Region name"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeRegion(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={addRegion}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} className="mr-1" /> Add Region
              </button>
            </div>
          </>
        );
      case 'contact':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="admin-form-input"
                placeholder="Detailed description"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="Contact email"
              />
            </div>
          </>
        );
      case 'hero':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="admin-form-input"
                placeholder="Hero subtitle"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Small Text</label>
              <input
                type="text"
                name="smallText"
                value={formData.smallText || ''}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="Small text (e.g., ABOUT US)"
              />
            </div>
          </>
        );
      case 'service':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="admin-form-input"
              placeholder="Service description"
            />
          </div>
        );
      default:
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="admin-form-input"
              placeholder="Detailed description"
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">
          {isNew ? 'Add New Content' : 'Edit Content'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {isNew && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Page</label>
              <select
                name="page"
                value={formData.page || 'home'}
                onChange={handleChange}
                className="admin-form-input"
              >
                <option value="home">Home Page</option>
                <option value="services">Services Page</option>
                <option value="team">Team Page</option>
                <option value="global">Global Elements</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Content Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="admin-form-input"
              >
                <option value="about">About Section</option>
                <option value="service">Service</option>
                <option value="team">Team Member</option>
                <option value="approach">Approach Section</option>
                <option value="network">Network Section</option>
                <option value="contact">Contact Section</option>
                <option value="hero">Hero Section</option>
              </select>
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="admin-form-input"
            placeholder="Title or heading"
          />
        </div>

        {renderTypeSpecificFields()}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Image</label>
          <div className="flex items-center space-x-4">
            <div className="relative overflow-hidden h-20 w-20 bg-gray-100 rounded">
              {(previewImage || formData.imageSrc) && (
                <img 
                  src={previewImage || formData.imageSrc} 
                  alt="Preview" 
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 transition-colors">
              <Upload size={16} className="mr-2" />
              <span>Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="space-x-2">
            <button
              type="submit"
              className="btn-primary"
            >
              <Save size={16} className="inline mr-2" />
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
          
          {!isNew && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn-danger"
            >
              <Trash2 size={16} className="inline mr-2" />
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const { content, updateContent, addContent, deleteContent, logout } = useAdmin();
  const [editingItem, setEditingItem] = useState<Content | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'team' | 'global'>('home');

  const handleEdit = (item: Content) => {
    setEditingItem(item);
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsAdding(true);
  };

  const handleSave = (item: Content) => {
    if (isAdding) {
      addContent(item);
    } else {
      updateContent(item);
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteContent(id);
    setEditingItem(null);
  };

  // Filter content based on the active tab (page)
  const filteredContent = content.filter(item => {
    // If no page property exists, assign to appropriate page based on type
    const itemPage = item.page || (
      item.type === 'service' ? 'services' : 
      item.type === 'team' ? 'team' : 
      item.type === 'about' || item.type === 'approach' || item.type === 'network' ? 'home' : 
      'global'
    );
    
    return itemPage === activeTab;
  });

  if (editingItem || isAdding) {
    return (
      <div className="container mx-auto p-6 pt-24">
        <button 
          onClick={() => {
            setEditingItem(null);
            setIsAdding(false);
          }}
          className="flex items-center text-gray-600 hover:text-black mb-4 transition-colors"
        >
          <ChevronLeft size={16} className="mr-2" />
          Back to Content List
        </button>
        
        <AdminForm 
          item={editingItem} 
          onSave={handleSave} 
          onCancel={() => {
            setEditingItem(null);
            setIsAdding(false);
          }}
          onDelete={editingItem ? () => handleDelete(editingItem.id) : undefined}
          isNew={isAdding}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium">Website Content Management</h1>
        <div className="space-x-2">
          <button 
            onClick={handleAddNew}
            className="btn-primary"
          >
            Add New Content
          </button>
          <button 
            onClick={logout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button
            className={`pb-3 px-1 font-medium ${activeTab === 'home' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('home')}
          >
            Home Page
          </button>
          <button
            className={`pb-3 px-1 font-medium ${activeTab === 'services' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('services')}
          >
            Services Page
          </button>
          <button
            className={`pb-3 px-1 font-medium ${activeTab === 'team' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('team')}
          >
            Team Page
          </button>
          <button
            className={`pb-3 px-1 font-medium ${activeTab === 'global' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('global')}
          >
            Global Elements
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">
          {activeTab === 'home' && 'Home Page Content'}
          {activeTab === 'services' && 'Services Page Content'}
          {activeTab === 'team' && 'Team Page Content'}
          {activeTab === 'global' && 'Global Elements'}
        </h2>
        <p className="text-gray-600">
          {activeTab === 'home' && 'Manage the content displayed on your home page.'}
          {activeTab === 'services' && 'Manage your services and related content.'}
          {activeTab === 'team' && 'Manage team members and team page content.'}
          {activeTab === 'global' && 'Manage elements that appear across multiple pages.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map(item => (
          <div 
            key={item.id} 
            className="admin-content-item"
            onClick={() => handleEdit(item)}
          >
            <div className="h-40 overflow-hidden">
              <img 
                src={item.imageSrc} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">{item.name || item.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {item.role || item.description || (item.type === 'hero' ? 'Hero Section' : '')}
              </p>
              <div className="mt-2 text-xs text-gray-400 uppercase">
                {item.type}
              </div>
            </div>
          </div>
        ))}
        {filteredContent.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No content found for this page. Click "Add New Content" to create some.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
