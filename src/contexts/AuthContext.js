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
      // Find user by username
      const foundUser = Object.values(users).find(u => u.username === username);
      
      if (!foundUser || foundUser.password !== password) {
        throw new Error('Username atau password salah');
      }

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem('lababil_user', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
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
