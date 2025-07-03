
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Check } from 'lucide-react';

const Settings = () => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-xl border border-border p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Palette className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          </div>

          <div className="space-y-8">
            {/* Theme Settings */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Theme Customization</h2>
              <p className="text-muted-foreground mb-6">Choose your preferred theme. This setting only applies to your account.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.value}
                    onClick={() => setTheme(themeOption.value)}
                    className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      theme === themeOption.value
                        ? 'border-primary bg-accent'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-foreground">{themeOption.label}</span>
                      {theme === themeOption.value && (
                        <Check className="w-5 h-5 text-primary" />
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
            <div className="border-t border-border pt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Preview</h3>
              <div className="p-4 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full"></div>
                  <div>
                    <p className="font-medium text-foreground">Sample Post</p>
                    <p className="text-sm text-muted-foreground">This is how your theme looks</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded w-3/4"></div>
                  <div className="h-2 bg-muted rounded w-1/2"></div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                    Primary Button
                  </button>
                  <button className="px-4 py-2 border border-border text-foreground rounded-lg text-sm hover:bg-accent transition-colors">
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
