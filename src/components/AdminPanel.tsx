
import React, { useState } from 'react';
import { useAdmin, Content } from '../contexts/AdminContext';
import { X, Upload, Save, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface AdminFormProps {
  item: Content | null;
  onSave: (item: Content) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isNew?: boolean;
}

// Helper function to generate unique ID
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
  } as Content);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5000000) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Read and preview the image
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.imageSrc) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Generate ID for new items
    const updatedData = isNew 
      ? { ...formData, id: generateId(formData.type) } 
      : formData;
      
    onSave(updatedData);
    toast.success(`${isNew ? 'Created' : 'Updated'} successfully`);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this item?')) {
      onDelete();
      toast.success('Deleted successfully');
    }
  };

  // Different form fields based on content type
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
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
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
              className="w-full p-2 border rounded"
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Content Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="about">About</option>
              <option value="service">Service</option>
              <option value="team">Team Member</option>
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
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
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              <Save size={16} className="inline mr-2" />
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
          
          {!isNew && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
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
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'team'>('about');

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

  const filteredContent = content.filter(item => {
    if (activeTab === 'about') return item.type === 'about';
    if (activeTab === 'services') return item.type === 'service';
    if (activeTab === 'team') return item.type === 'team';
    return true;
  });

  if (editingItem || isAdding) {
    return (
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
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium">Content Management</h1>
        <div className="space-x-2">
          <button 
            onClick={handleAddNew}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Add New
          </button>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button
            className={`pb-3 px-1 font-medium ${activeTab === 'about' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`pb-3 px-1 font-medium ${activeTab === 'services' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button
            className={`pb-3 px-1 font-medium ${activeTab === 'team' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('team')}
          >
            Team
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map(item => (
          <div 
            key={item.id} 
            className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
                {item.role || item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
