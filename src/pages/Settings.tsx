
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Check } from 'lucide-react';

const Settings = () => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Palette className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>

          <div className="space-y-8">
            {/* Theme Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Theme Customization</h2>
              <p className="text-gray-600 mb-6">Choose your preferred theme. This setting only applies to your account.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.value}
                    onClick={() => setTheme(themeOption.value)}
                    className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      theme === themeOption.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">{themeOption.label}</span>
                      {theme === themeOption.value && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className={`w-8 h-8 rounded ${themeOption.primary}`}></div>
                      <div className={`w-8 h-8 rounded ${themeOption.secondary}`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Theme Preview */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Sample Post</p>
                    <p className="text-sm text-gray-600">This is how your theme looks</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                    Primary Button
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
