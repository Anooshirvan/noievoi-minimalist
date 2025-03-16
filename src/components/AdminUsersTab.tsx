
import React, { useState } from 'react';
import { useAdmin, AdminUser } from '../contexts/AdminContext';
import { Trash2, Save, Plus, Eye, EyeOff, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AdminUsersTab: React.FC = () => {
  const { adminUsers, addAdminUser, updateAdminUser, deleteAdminUser } = useAdmin();
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [adding, setAdding] = useState(false);
  const [newUser, setNewUser] = useState<AdminUser>({ email: '', password: '', name: '' });
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (key: string) => {
    setShowPassword(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isExisting: boolean = false
  ) => {
    const { name, value } = e.target;
    
    if (isExisting && editing) {
      setEditing({
        ...editing,
        [name]: value
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: value
      });
    }
  };

  const saveUser = () => {
    if (editing) {
      updateAdminUser(editing.email, editing);
      setEditing(null);
      toast.success('Admin user updated successfully');
    } else {
      if (adminUsers.some(user => user.email === newUser.email)) {
        toast.error('An admin with this email already exists');
        return;
      }
      
      addAdminUser(newUser);
      setNewUser({ email: '', password: '', name: '' });
      setAdding(false);
      toast.success('Admin user added successfully');
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setAdding(false);
  };

  const handleDelete = (email: string) => {
    if (adminUsers.length <= 1) {
      toast.error('Cannot delete the only admin user');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this admin user?')) {
      deleteAdminUser(email);
      toast.success('Admin user deleted successfully');
    }
  };

  return (
    <div className="admin-section">
      <h2 className="text-xl font-medium mb-6">Admin Users</h2>
      
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Manage admin users who can access the admin panel
        </p>
        {!adding && !editing && (
          <Button 
            onClick={() => setAdding(true)}
            size="sm"
            className="flex items-center"
          >
            <Plus size={16} className="mr-1" /> Add Admin
          </Button>
        )}
      </div>
      
      {(editing || adding) && (
        <div className="mb-6 border p-4 rounded-lg bg-gray-50">
          <h4 className="font-medium mb-3">{editing ? 'Edit Admin User' : 'Add New Admin'}</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                name="email"
                type="email"
                value={editing ? editing.email : newUser.email}
                onChange={(e) => handleUserChange(e, !!editing)}
                disabled={!!editing} // Can't change email if editing
                placeholder="admin@example.com"
                className="admin-form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name (Optional)</label>
              <Input
                name="name"
                value={editing ? editing.name || '' : newUser.name || ''}
                onChange={(e) => handleUserChange(e, !!editing)}
                placeholder="Admin Name"
                className="admin-form-input"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword[editing ? editing.email : 'new'] ? 'text' : 'password'}
                  value={editing ? editing.password : newUser.password}
                  onChange={(e) => handleUserChange(e, !!editing)}
                  placeholder="Password"
                  className="admin-form-input pr-10"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility(editing ? editing.email : 'new')}
                >
                  {showPassword[editing ? editing.email : 'new'] ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              onClick={cancelEdit}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={saveUser}
              size="sm"
              disabled={
                editing 
                  ? !editing.email.trim() || !editing.password.trim()
                  : !newUser.email.trim() || !newUser.password.trim()
              }
            >
              <Save size={16} className="mr-1" /> Save
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {adminUsers.map(user => (
          <div 
            key={user.email} 
            className="border rounded-lg p-4 bg-white"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <User size={20} className="text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium">{user.email}</h4>
                  {user.name && (
                    <p className="text-gray-600 mt-1">{user.name}</p>
                  )}
                  <div className="mt-1 flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Password:</span>
                    <div className="relative">
                      <span className="text-sm font-medium">
                        {showPassword[user.email] 
                          ? user.password 
                          : '•'.repeat(Math.min(8, user.password.length))}
                      </span>
                      <button 
                        onClick={() => togglePasswordVisibility(user.email)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword[user.email] ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditing(user)}
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.email)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  disabled={adminUsers.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersTab;
