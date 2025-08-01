import React, { useState, useEffect } from 'react';
import { UserService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import type { UserSettings } from '../../types';

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const userSettings = await UserService.getUserSettings(user.id);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Settings</h1>
        
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <span className="text-white text-xl">Font Size</span>
            <select 
              value={settings?.font_size || 'medium'}
              onChange={(e) => setSettings(prev => prev ? { ...prev, font_size: e.target.value as any } : null)}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white min-w-[200px] focus:outline-none focus:border-[#4a4a4a]"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white text-xl">Theme</span>
            <select 
              value={settings?.theme || 'dark'}
              onChange={(e) => setSettings(prev => prev ? { ...prev, theme: e.target.value as any } : null)}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white min-w-[200px] focus:outline-none focus:border-[#4a4a4a]"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="sepia">Sepia</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white text-xl">Notifications</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={true}
                className="sr-only"
              />
              <div className="w-14 h-8 bg-white rounded-full shadow-inner flex items-center">
                <div className="w-6 h-6 bg-black rounded-full shadow ml-1 transition-transform transform translate-x-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}