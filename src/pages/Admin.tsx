
import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import AdminPanel from '../components/AdminPanel';
import { toast } from '@/components/ui/sonner';

const Admin = () => {
  const { isAuthenticated, login } = useAdmin();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate network delay for better UX
    setTimeout(() => {
      const success = login(password);
      setIsLoading(false);
      
      if (!success) {
        setError('Invalid password');
        toast.error('Login failed: Invalid password');
      } else {
        toast.success('Login successful');
      }
    }, 800);
  };

  if (isAuthenticated) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-medium text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your password to access the admin panel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {isLoading ? 'Logging in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-sm text-center text-gray-500">
            <p>For demo purposes, use password: "admin123"</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
