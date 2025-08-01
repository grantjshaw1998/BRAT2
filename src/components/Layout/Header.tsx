import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Settings, User, LogOut } from 'lucide-react';

interface HeaderProps {
  user: any;
}

export default function Header({ user }: HeaderProps) {
  const { signOut } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Bible Research App</h1>
          <p className="text-sm text-gray-400">Study the Word with powerful tools</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="text-white font-medium">{user?.display_name || 'User'}</p>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={signOut}
            className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}