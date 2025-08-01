import React, { useState, useEffect } from 'react';
import { CircleService } from '../../services/circleService';
import { useAuth } from '../../contexts/AuthContext';
import type { Circle } from '../../types';
import { Users, Plus, Settings, UserPlus, Copy, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CirclesManager() {
  const { user } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleDescription, setNewCircleDescription] = useState('');
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    if (user) {
      loadCircles();
    }
  }, [user]);

  const loadCircles = async () => {
    if (!user) return;

    try {
      const circlesData = await CircleService.getUserCircles(user.id);
      setCircles(circlesData);
    } catch (error) {
      console.error('Error loading circles:', error);
      toast.error('Failed to load circles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCircle = async () => {
    if (!user || !newCircleName.trim()) return;

    try {
      const newCircle = await CircleService.createCircle({
        name: newCircleName.trim(),
        description: newCircleDescription.trim() || undefined,
        owner_id: user.id
      });
      
      setCircles(prev => [newCircle, ...prev]);
      setNewCircleName('');
      setNewCircleDescription('');
      setShowCreateForm(false);
      toast.success('Circle created successfully');
    } catch (error) {
      console.error('Error creating circle:', error);
      toast.error('Failed to create circle');
    }
  };

  const handleJoinCircle = async () => {
    if (!user || !joinCode.trim()) return;

    try {
      const circle = await CircleService.joinCircleByCode(joinCode.trim(), user.id);
      await loadCircles(); // Reload to get updated list
      setJoinCode('');
      setShowJoinForm(false);
      toast.success(`Joined circle: ${circle.name}`);
    } catch (error) {
      console.error('Error joining circle:', error);
      toast.error('Failed to join circle. Check the invite code.');
    }
  };

  const handleCopyInviteCode = (inviteCode: string) => {
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invite code copied to clipboard');
  };

  const handleLeaveCircle = async (circleId: string, circleName: string) => {
    if (!user || !confirm(`Are you sure you want to leave "${circleName}"?`)) return;

    try {
      await CircleService.leaveCircle(circleId, user.id);
      setCircles(prev => prev.filter(c => c.id !== circleId));
      toast.success('Left circle successfully');
    } catch (error) {
      console.error('Error leaving circle:', error);
      toast.error('Failed to leave circle');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Study Circles</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowJoinForm(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Join Circle</span>
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Circle</span>
          </button>
        </div>
      </div>

      {/* Create Circle Form */}
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Circle</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Circle Name *
              </label>
              <input
                type="text"
                value={newCircleName}
                onChange={(e) => setNewCircleName(e.target.value)}
                placeholder="Enter circle name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={newCircleDescription}
                onChange={(e) => setNewCircleDescription(e.target.value)}
                placeholder="Describe your study circle..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateCircle}
                disabled={!newCircleName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Circle
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewCircleName('');
                  setNewCircleDescription('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Circle Form */}
      {showJoinForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Join Circle</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invite Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter invite code..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleJoinCircle}
                disabled={!joinCode.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Join Circle
              </button>
              <button
                onClick={() => {
                  setShowJoinForm(false);
                  setJoinCode('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Circles List */}
      {circles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {circles.map(circle => (
            <div key={circle.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{circle.name}</h3>
                    <p className="text-sm text-gray-600">
                      {circle.members?.length || 0} members
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {circle.owner_id === user?.id && (
                    <button
                      onClick={() => handleCopyInviteCode(circle.invite_code)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                      title="Copy invite code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                  {circle.owner_id !== user?.id && (
                    <button
                      onClick={() => handleLeaveCircle(circle.id, circle.name)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Leave circle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {circle.description && (
                <p className="text-gray-700 text-sm mb-4">{circle.description}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium text-gray-900">
                    {circle.owner_id === user?.id ? 'Owner' : 'Member'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">
                    {new Date(circle.created_at).toLocaleDateString()}
                  </span>
                </div>
                {circle.owner_id === user?.id && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Invite Code:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        {circle.invite_code}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No circles yet</h3>
          <p className="text-gray-600 mb-4">Create or join a study circle to collaborate with others.</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Circle
            </button>
            <button
              onClick={() => setShowJoinForm(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Join a Circle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}