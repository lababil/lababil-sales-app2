'use client'
import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, Eye, EyeOff, Save, X, Shield, UserCheck, ArrowLeft, AlertTriangle } from 'lucide-react';
import { USER_ROLES, DEFAULT_USERS } from '../lib/constants';
import { hashPassword, verifyPassword, validatePasswordStrength, validateEmail, validatePhone, sanitizeInput } from '../lib/security';

const UserManagementMobile = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: USER_ROLES.KASIR,
    isActive: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'

  // Load users from localStorage or use defaults
  useEffect(() => {
    const savedUsers = localStorage.getItem('lababil_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(DEFAULT_USERS);
      localStorage.setItem('lababil_users', JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  // Save users to localStorage
  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('lababil_users', JSON.stringify(updatedUsers));
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sanitize inputs
      const sanitizedData = {
        username: sanitizeInput(formData.username.trim()),
        password: formData.password,
        name: sanitizeInput(formData.name.trim()),
        email: sanitizeInput(formData.email.trim()),
        role: formData.role,
        isActive: formData.isActive
      };

      // Validation
      if (!sanitizedData.username || !sanitizedData.password || !sanitizedData.name) {
        throw new Error('Username, password, and name are required');
      }

      // Validate email if provided
      if (sanitizedData.email && !validateEmail(sanitizedData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password strength for new users
      if (!editingUser) {
        const passwordValidation = validatePasswordStrength(sanitizedData.password);
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.errors.join('. '));
        }
      }

      // Check if username already exists (except for current user being edited)
      const existingUser = users.find(u =>
        u.username === sanitizedData.username && (!editingUser || u.id !== editingUser.id)
      );

      if (existingUser) {
        throw new Error('Username already exists');
      }

      let updatedUsers;

      if (editingUser) {
        // For existing users, only hash password if it's being changed
        let hashedPassword = editingUser.password;
        if (sanitizedData.password !== editingUser.password) {
          hashedPassword = await hashPassword(sanitizedData.password);
        }

        // Update existing user
        updatedUsers = users.map(user =>
          user.id === editingUser.id
            ? {
                ...user,
                ...sanitizedData,
                password: hashedPassword,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : user
        );
      } else {
        // Create new user with hashed password
        const hashedPassword = await hashPassword(sanitizedData.password);
        const newUser = {
          id: Date.now().toString(),
          ...sanitizedData,
          password: hashedPassword,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        updatedUsers = [...users, newUser];
      }

      saveUsers(updatedUsers);
      setCurrentView('list');
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    // Prevent deleting the current admin if it's the last admin
    const user = users.find(u => u.id === userId);
    const adminCount = users.filter(u => u.role === USER_ROLES.ADMIN && u.isActive).length;

    if (user.role === USER_ROLES.ADMIN && adminCount <= 1) {
      alert('Cannot delete the last active admin user');
      return;
    }

    setLoading(true);
    try {
      const updatedUsers = users.filter(u => u.id !== userId);
      saveUsers(updatedUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle user active status
  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map(user =>
      user.id === userId
        ? { ...user, isActive: !user.isActive, updatedAt: new Date().toISOString().split('T')[0] }
        : user
    );
    saveUsers(updatedUsers);
  };

  // Open modal for creating/editing user
  const openModal = (user = null) => {
    setEditingUser(user);
    setFormData(user || {
      username: '',
      password: '',
      name: '',
      email: '',
      role: USER_ROLES.KASIR,
      isActive: true
    });
    setError('');
    setShowPassword(false);
    setCurrentView('form');
  };

  // Close modal
  const closeModal = () => {
    setCurrentView('list');
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      role: USER_ROLES.KASIR,
      isActive: true
    });
    setError('');
    setShowPassword(false);
  };

  // Get role badge style
  const getRoleBadge = (role) => {
    const isAdmin = role === USER_ROLES.ADMIN;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isAdmin
          ? 'bg-purple-100 text-purple-800'
          : 'bg-blue-100 text-blue-800'
      }`}>
        {isAdmin ? <Shield className="h-3 w-3 mr-1" /> : <UserCheck className="h-3 w-3 mr-1" />}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  // List View Component
  const UserListView = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="mr-3 p-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              User Management
            </h2>
            <p className="text-sm text-gray-600">Manage system users</p>
          </div>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleUserStatus(user.id)}
                  className={`p-1.5 rounded-md ${
                    user.isActive
                      ? 'text-orange-600 hover:bg-orange-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={user.isActive ? 'Deactivate User' : 'Activate User'}
                >
                  {user.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => openModal(user)}
                  className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md"
                  title="Edit User"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"
                  title="Delete User"
                  disabled={users.filter(u => u.role === USER_ROLES.ADMIN && u.isActive).length <= 1 && user.role === USER_ROLES.ADMIN}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.isActive)}
              </div>
              <div className="text-xs text-gray-500">
                {user.createdAt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Form View Component
  const UserFormView = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => setCurrentView('list')}
          className="mr-3 p-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold text-gray-900">
          {editingUser ? 'Edit User' : 'Add New User'}
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={USER_ROLES.KASIR}>Cashier</option>
            <option value={USER_ROLES.ADMIN}>Administrator</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Active User
          </label>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {editingUser ? 'Update User' : 'Create User'}
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('list')}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {currentView === 'list' ? <UserListView /> : <UserFormView />}
    </div>
  );
};

export default UserManagementMobile;
