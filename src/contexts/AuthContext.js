import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User credentials and roles
const users = {
  admin: {
    username: 'admin',
    password: 'F@ruq2021',
    role: 'admin',
    name: 'Administrator',
    permissions: {
      dashboard: true,
      products: {
        view: true,
        add: true,
        edit: true,
        delete: true
      },
      sales: {
        view: true,
        add: true,
        edit: true,
        delete: true,
        print: true,
        report: true
      }
    }
  },
  kasir: {
    username: 'kasir',
    password: 'kasir123',
    role: 'kasir',
    name: 'Kasir',
    permissions: {
      dashboard: false,
      products: {
        view: true,
        add: false,
        edit: false,
        delete: false
      },
      sales: {
        view: true,
        add: true,
        edit: false,
        delete: false,
        print: true,
        report: false
      }
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('lababil_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('lababil_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('lababil_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lababil_user');
  };

  const hasPermission = (module, action = 'view') => {
    if (!user || !user.permissions) return false;
    
    if (typeof user.permissions[module] === 'boolean') {
      return user.permissions[module];
    }
    
    if (typeof user.permissions[module] === 'object') {
      return user.permissions[module][action] || false;
    }
    
    return false;
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isKasir = () => {
    return user && user.role === 'kasir';
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    isAdmin,
    isKasir,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
