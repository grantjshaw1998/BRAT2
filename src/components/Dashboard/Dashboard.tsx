import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBible } from '../../contexts/BibleContext';
import { BookOpen, Search, FileText, Users, Target, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { books, verses } = useBible();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalVerses: 0,
    notesCount: 0,
    circlesCount: 0
  });

  useEffect(() => {
    setStats({
      totalBooks: books.length,
      totalVerses: verses.length,
      notesCount: 0, // TODO: Get from notes service
      circlesCount: 0 // TODO: Get from circles service
    });
  }, [books, verses]);

  const quickActions = [
    {
      title: 'Read Scripture',
      description: 'Continue your Bible reading',
      icon: BookOpen,
      action: 'bible',
      color: 'bg-blue-600'
    },
    {
      title: 'Search Verses',
      description: 'Find specific passages',
      icon: Search,
      action: 'search',
      color: 'bg-green-600'
    },
    {
      title: 'My Notes',
      description: 'Review your study notes',
      icon: FileText,
      action: 'notes',
      color: 'bg-purple-600'
    },
    {
      title: 'Study Circles',
      description: 'Join group discussions',
      icon: Users,
      action: 'circles',
      color: 'bg-orange-600'
    }
  ];

  const recentActivity = [
    { type: 'reading', text: 'Read John 3:16-21', time: '2 hours ago' },
    { type: 'note', text: 'Added note to Romans 8:28', time: '1 day ago' },
    { type: 'search', text: 'Searched for "love"', time: '2 days ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.display_name || user?.email?.split('@')[0] || 'Friend'}!
        </h1>
        <p className="text-gray-400">Continue your Bible study journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Bible Books</p>
              <p className="text-2xl font-bold text-white">{stats.totalBooks}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Verses</p>
              <p className="text-2xl font-bold text-white">{stats.totalVerses.toLocaleString()}</p>
            </div>
            <Search className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">My Notes</p>
              <p className="text-2xl font-bold text-white">{stats.notesCount}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Study Circles</p>
              <p className="text-2xl font-bold text-white">{stats.circlesCount}</p>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {action.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.text}</p>
                  <p className="text-gray-400 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Verse */}
      <div className="mt-8 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Verse of the Day</h2>
        <blockquote className="text-lg text-gray-100 italic mb-2">
          "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
        </blockquote>
        <cite className="text-blue-300 font-medium">John 3:16</cite>
      </div>
    </div>
  );
}