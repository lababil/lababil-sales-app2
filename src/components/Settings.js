'use client'
import React, { useState, useEffect } from 'react';
import { Settings, Printer, Building, Upload, Save, X, FileText, Monitor, Paperclip, Image, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { COMPANY_INFO, THEMES, getCurrentTheme, toggleTheme, DARK_THEME } from '../lib/constants';
import UserManagement from './UserManagement';
import LababilLogo from './LababilLogo';

const SettingsComponent = () => {
  const [settings, setSettings] = useState({
    // Company Information
    companyName: COMPANY_INFO.companyName,
    companyAddress: COMPANY_INFO.address,
    companyPhone: COMPANY_INFO.phone,
    companyEmail: COMPANY_INFO.email,
    companyWebsite: COMPANY_INFO.website,
    companyBankAccount: COMPANY_INFO.bankAccount,

    // Printer Settings
    printerName: 'Default Printer',
    paperSize: 'A4',
    paperOrientation: 'portrait',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,

    // Receipt Settings
    showLogo: true,
    showCompanyInfo: true,
    showCustomerInfo: true,
    showTax: true,
    taxRate: 11,
    currency: 'IDR',
    language: 'id',

    // Logo Settings
    logoFile: null,
    logoPreview: COMPANY_INFO.logo
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeSection, setActiveSection] = useState('company');

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('lababil_settings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = async () => {
    setLoading(true);
    try {
      localStorage.setItem('lababil_settings', JSON.stringify(settings));
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Handle file upload for logo
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setMessage({ type: 'error', text: 'File size must be less than 2MB' });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings(prev => ({
          ...prev,
          logoFile: file,
          logoPreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        companyName: COMPANY_INFO.companyName,
        companyAddress: COMPANY_INFO.address,
        companyPhone: COMPANY_INFO.phone,
        companyEmail: COMPANY_INFO.email,
        companyWebsite: COMPANY_INFO.website,
        companyBankAccount: COMPANY_INFO.bankAccount,
        printerName: 'Default Printer',
        paperSize: 'A4',
        paperOrientation: 'portrait',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        showLogo: true,
        showCompanyInfo: true,
        showCustomerInfo: true,
        showTax: true,
        taxRate: 11,
        currency: 'IDR',
        language: 'id',
        logoFile: null,
        logoPreview: COMPANY_INFO.logo
      });
      setMessage({ type: 'success', text: 'Settings reset to defaults!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const paperSizes = [
    { value: 'A4', label: 'A4 (210 × 297 mm)' },
    { value: 'A5', label: 'A5 (148 × 210 mm)' },
    { value: 'Letter', label: 'Letter (8.5 × 11 in)' },
    { value: 'Legal', label: 'Legal (8.5 × 14 in)' },
    { value: 'Thermal-58', label: 'Thermal 58mm' },
    { value: 'Thermal-80', label: 'Thermal 80mm' }
  ];

  const currencies = [
    { value: 'IDR', label: 'Indonesian Rupiah (Rp)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' }
  ];

  const languages = [
    { value: 'id', label: 'Bahasa Indonesia' },
    { value: 'en', label: 'English' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">System Settings</h2>
            <p className="text-blue-100">Configure your system preferences and company information</p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <Settings className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-3" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-3" />
          )}
          {message.text}
        </div>
      )}

      {/* Settings Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-1">
        <div className="flex space-x-1 overflow-x-auto">
          {[
            { id: 'company', label: 'Company Info', icon: Building },
            { id: 'printer', label: 'Printer Settings', icon: Printer },
            { id: 'receipt', label: 'Receipt Settings', icon: FileText },
            { id: 'theme', label: 'Theme', icon: Monitor },
            { id: 'users', label: 'User Management', icon: Users }
          ].map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Company Information Section */}
      {activeSection === 'company' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-600" />
            Company Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Email
              </label>
              <input
                type="email"
                value={settings.companyEmail}
                onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter company email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Phone
              </label>
              <input
                type="tel"
                value={settings.companyPhone}
                onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter company phone"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Website
              </label>
              <input
                type="url"
                value={settings.companyWebsite}
                onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter company website"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Address
              </label>
              <textarea
                value={settings.companyAddress}
                onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter company address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bank Account Information
              </label>
              <input
                type="text"
                value={settings.companyBankAccount}
                onChange={(e) => handleInputChange('companyBankAccount', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter bank account information"
              />
            </div>
          </div>

          {/* Logo Upload Section - UPDATED: Using SVG Logo Component */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Image className="h-5 w-5 mr-2 text-blue-600" />
              Company Logo
            </h4>

            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-lg">
                {/* ✅ SVG Logo Preview - Clean, no border, scalable and crisp */}
                <LababilLogo size={64} variant="default" />
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Logo
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Recommended: PNG or JPG, max 2MB, square aspect ratio
                </p>
                <p className="text-xs text-green-600 mt-1 font-medium">
                  ✅ Current: Using optimized SVG logo (scalable, fast loading)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printer Settings Section */}
      {activeSection === 'printer' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Printer className="h-5 w-5 mr-2 text-blue-600" />
            Printer Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Printer Name
              </label>
              <select
                value={settings.printerName}
                onChange={(e) => handleInputChange('printerName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Default Printer">Default Printer</option>
                <option value="Thermal Printer">Thermal Printer</option>
                <option value="Laser Printer">Laser Printer</option>
                <option value="Inkjet Printer">Inkjet Printer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Paper Size
              </label>
              <select
                value={settings.paperSize}
                onChange={(e) => handleInputChange('paperSize', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {paperSizes.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Paper Orientation
              </label>
              <select
                value={settings.paperOrientation}
                onChange={(e) => handleInputChange('paperOrientation', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {currencies.map(curr => (
                  <option key={curr.value} value={curr.value}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Margins Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Page Margins (mm)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Top Margin
                </label>
                <input
                  type="number"
                  value={settings.marginTop}
                  onChange={(e) => handleInputChange('marginTop', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bottom Margin
                </label>
                <input
                  type="number"
                  value={settings.marginBottom}
                  onChange={(e) => handleInputChange('marginBottom', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Left Margin
                </label>
                <input
                  type="number"
                  value={settings.marginLeft}
                  onChange={(e) => handleInputChange('marginLeft', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Right Margin
                </label>
                <input
                  type="number"
                  value={settings.marginRight}
                  onChange={(e) => handleInputChange('marginRight', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="50"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Settings Section */}
      {activeSection === 'receipt' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Receipt Settings
          </h3>

          <div className="space-y-6">
            {/* Display Options */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Display Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showLogo}
                    onChange={(e) => handleInputChange('showLogo', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Show company logo on receipt</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showCompanyInfo}
                    onChange={(e) => handleInputChange('showCompanyInfo', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Show company information</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showCustomerInfo}
                    onChange={(e) => handleInputChange('showCustomerInfo', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Show customer information</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showTax}
                    onChange={(e) => handleInputChange('showTax', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Show tax calculation</span>
                </label>
              </div>
            </div>

            {/* Tax Settings */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Tax Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Settings Section */}
      {activeSection === 'theme' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-blue-600" />
            Theme Settings
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Appearance</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-900">Light Theme</span>
                    </div>
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={getCurrentTheme() === 'light'}
                      onChange={() => toggleTheme()}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Clean and bright interface</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-800 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-900">Dark Theme</span>
                    </div>
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={getCurrentTheme() === 'dark'}
                      onChange={() => toggleTheme()}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Easy on the eyes, perfect for low-light environments</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Theme Preview</h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Current theme: {getCurrentTheme()}</div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                  <div className="w-8 h-8 bg-purple-600 rounded"></div>
                  <div className="w-8 h-8 bg-green-600 rounded"></div>
                  <div className="w-8 h-8 bg-yellow-600 rounded"></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Theme changes will be applied immediately and saved to your preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Section */}
      {activeSection === 'users' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            User Management
          </h3>
          <UserManagement />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={saveSettings}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Settings
            </>
          )}
        </button>

        <button
          onClick={resetToDefaults}
          className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
        >
          <X className="h-5 w-5 mr-2" />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default SettingsComponent;
