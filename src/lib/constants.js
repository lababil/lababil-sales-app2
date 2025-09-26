// User Roles dan Permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  KASIR: 'kasir'
};

export const PERMISSIONS = {
  // Product permissions
  CREATE_PRODUCT: 'create_product',
  READ_PRODUCT: 'read_product',
  UPDATE_PRODUCT: 'update_product',
  DELETE_PRODUCT: 'delete_product',

  // Sales permissions
  CREATE_SALE: 'create_sale',
  READ_SALE: 'read_sale',
  UPDATE_SALE: 'update_sale',
  DELETE_SALE: 'delete_sale',

  // User management permissions
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',

  // Settings access
  ACCESS_SETTINGS: 'access_settings',

  // Print permissions
  PRINT_RECEIPT: 'print_receipt',
  DOWNLOAD_RECEIPT: 'download_receipt',
};

// Receipt number format
export const RECEIPT_FORMAT = {
  PREFIX: 'LS',
  SEPARATOR: '/',
  DATE_FORMAT: 'DDMMYYYY'
};

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    // Full access to all permissions
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.READ_PRODUCT,
    PERMISSIONS.UPDATE_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.CREATE_SALE,
    PERMISSIONS.READ_SALE,
    PERMISSIONS.UPDATE_SALE,
    PERMISSIONS.DELETE_SALE,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.ACCESS_SETTINGS,
    PERMISSIONS.PRINT_RECEIPT,
    PERMISSIONS.DOWNLOAD_RECEIPT,
  ],
  [USER_ROLES.KASIR]: [
    // Limited access - no delete sales, no user management, no settings
    PERMISSIONS.READ_PRODUCT,
    PERMISSIONS.CREATE_SALE,
    PERMISSIONS.READ_SALE,
    PERMISSIONS.PRINT_RECEIPT,
    PERMISSIONS.DOWNLOAD_RECEIPT,
  ]
};

// Helper function to check if user has permission
export const hasPermission = (userRole, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.indexOf(permission) !== -1;
};

// Default users - akan dipindah ke database/localStorage nanti
// Note: Passwords are hashed using bcrypt for security
export const DEFAULT_USERS = [
  {
    id: '1',
    username: 'admin',
    password: '$2b$10$B/wz5439YIN/7la04sadBecrMgrbOrB3m6FIGZNZ8r726YGa3lG66', // hashed 'F@ruq2021'
    name: 'Administrator',
    role: USER_ROLES.ADMIN,
    email: 'admin@lababilsolution.com',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isActive: true
  },
  {
    id: '2',
    username: 'kasir',
    password: '$2b$10$vmu/JWNpvCCSGzoxZrhuJOLpAupyoTMPjasg8tsEB7aKif4tDekKi', // hashed 'kasir123'
    name: 'Cashier',
    role: USER_ROLES.KASIR,
    email: 'kasir@lababilsolution.com',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isActive: true
  }
];

// Company information - UPDATED: Using SVG logo for web interface
export const COMPANY_INFO = {
  companyName: 'Lababil Solution',
  address: 'Jl. Teknologi No. 123, Jakarta Pusat, DKI Jakarta 10230, Indonesia',
  phone: '+62 21-1234-5678',
  email: 'info@lababilsolution.com',
  website: 'www.lababilsolution.com',
  logo: '/logo.svg', // ✅ SVG for web interface (scalable, fast loading)
  bankAccount: 'BCA 7870598488 a/n PT. Lababil Solution'
};

// UI Theme constants
export const UI_THEME = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a'
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706'
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626'
    }
  },
  gradients: {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700',
    primaryHover: 'hover:from-blue-700 hover:to-blue-800',
    card: 'bg-gradient-to-br from-white to-blue-50',
    header: 'bg-gradient-to-r from-blue-50 via-white to-blue-50'
  }
};

// NEW: Dark Theme Colors
export const DARK_THEME = {
  colors: {
    primary: {
      50: '#1e293b',
      100: '#334155',
      200: '#475569',
      300: '#64748b',
      400: '#94a3b8',
      500: '#cbd5e1',
      600: '#e2e8f0',
      700: '#f1f5f9',
      800: '#f8fafc',
      900: '#ffffff'
    },
    background: {
      50: '#0f172a',
      100: '#1e293b',
      200: '#334155',
      300: '#475569'
    },
    card: {
      background: '#1e293b',
      border: '#334155'
    }
  }
};

// Theme context and utilities
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Helper function to get current theme
export const getCurrentTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('lababil_theme') || THEMES.LIGHT;
  }
  return THEMES.LIGHT;
};

// Helper function to toggle theme
export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
  localStorage.setItem('lababil_theme', newTheme);

  // Apply theme to document
  if (typeof document !== 'undefined') {
    if (newTheme === THEMES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return newTheme;
};

// Helper function to apply theme on page load
export const applyTheme = () => {
  if (typeof document !== 'undefined') {
    const currentTheme = getCurrentTheme();
    if (currentTheme === THEMES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

// Helper function to generate receipt number
export const generateReceiptNumber = () => {
  const now = new Date();
  const dateStr = now.getDate().toString().padStart(2, '0') +
                  (now.getMonth() + 1).toString().padStart(2, '0') +
                  now.getFullYear().toString();

  // Get last receipt number for today from localStorage
  const lastReceiptKey = `last_receipt_${dateStr}`;
  const lastReceiptNum = parseInt(localStorage.getItem(lastReceiptKey) || '0') + 1;

  // Save new receipt number
  localStorage.setItem(lastReceiptKey, lastReceiptNum.toString());

  // Format: 0001/LS/22092025
  const receiptNum = lastReceiptNum.toString().padStart(4, '0');
  return `${receiptNum}${RECEIPT_FORMAT.SEPARATOR}${RECEIPT_FORMAT.PREFIX}${RECEIPT_FORMAT.SEPARATOR}${dateStr}`;
};
