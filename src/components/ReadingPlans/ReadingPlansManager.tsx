import React, { useState, useEffect } from 'react';
import { ReadingPlanService } from '../../services/readingPlanService';
import { useAuth } from '../../contexts/AuthContext';
import type { ReadingPlan, UserReadingPlan } from '../../types';
import { Target, Plus, Play, Pause, CheckCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReadingPlansManager() {
  const { user } = useAuth();
  const [presetPlans, setPresetPlans] = useState<ReadingPlan[]>([]);
  const [userPlans, setUserPlans] = useState<UserReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [presets, plans] = await Promise.all([
        ReadingPlanService.getPresetPlans(),
        ReadingPlanService.getUserReadingPlans(user.id)
      ]);

      setPresetPlans(presets);
      setUserPlans(plans);
    } catch (error) {
      console.error('Error loading reading plans:', error);
      toast.error('Failed to load reading plans');
    } finally {
      setLoading(false);
    }
  };

  const handleStartPlan = async (planId: string, planName: string) => {
    if (!user) return;

    try {
      const plan = presetPlans.find(p => p.id === planId);
      if (!plan) return;

      const startDate = new Date();
      const targetDate = new Date();
      targetDate.setDate(startDate.getDate() + plan.duration_days);

      await ReadingPlanService.createUserReadingPlan({
        user_id: user.id,
        reading_plan_id: planId,
        start_date: startDate.toISOString().split('T')[0],
        target_date: targetDate.toISOString().split('T')[0],
        is_active: true
      });

      await loadData();
      toast.success(`Started reading plan: ${planName}`);
    } catch (error) {
      console.error('Error starting reading plan:', error);
      toast.error('Failed to start reading plan');
    }
  };

  const handleTogglePlan = async (planId: string, isActive: boolean) => {
    try {
      await ReadingPlanService.updateUserReadingPlan(planId, { is_active: !isActive });
      await loadData();
      toast.success(isActive ? 'Reading plan paused' : 'Reading plan resumed');
    } catch (error) {
      console.error('Error updating reading plan:', error);
      toast.error('Failed to update reading plan');
    }
  };

  const calculateProgress = (plan: UserReadingPlan): number => {
    if (!plan.progress) return 0;
    
    const startDate = new Date(plan.start_date);
    const targetDate = new Date(plan.target_date);
    const today = new Date();
    
    const totalDays = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const expectedProgress = Math.min((daysPassed / totalDays) * 100, 100);
    const actualProgress = Math.min((plan.progress.length / 1000) * 100, 100); // Simplified calculation
    
    return actualProgress;
  };

  const getDaysRemaining = (targetDate: string): number => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
        <h1 className="text-2xl font-bold text-gray-900">Reading Plans</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Custom Plan</span>
        </button>
      </div>

      {/* Active Reading Plans */}
      {userPlans.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Active Plans</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userPlans.map(plan => {
              const progress = calculateProgress(plan);
              const daysRemaining = getDaysRemaining(plan.target_date);
              
              return (
                <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${plan.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Target className={`w-6 h-6 ${plan.is_active ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{plan.reading_plan?.name}</h3>
                        <p className="text-sm text-gray-600">
                          {plan.reading_plan?.duration_days} days
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTogglePlan(plan.id, plan.is_active)}
                      className={`p-2 rounded-lg ${
                        plan.is_active 
                          ? 'text-orange-600 hover:bg-orange-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={plan.is_active ? 'Pause plan' : 'Resume plan'}
                    >
                      {plan.is_active ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progress >= 100 ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Days remaining:</span>
                      <span className={`font-medium ${daysRemaining < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Target date:</span>
                      <span className="text-gray-900">
                        {new Date(plan.target_date).toLocaleDateString()}
                      </span>
                    </div>

                    {progress >= 100 && (
                      <div className="flex items-center space-x-2 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed!</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preset Reading Plans */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Reading Plans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {presetPlans.map(plan => {
            const isActive = userPlans.some(up => up.reading_plan_id === plan.id && up.is_active);
            
            return (
              <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.duration_days} days</p>
                    </div>
                  </div>
                  {isActive && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                {plan.description && (
                  <p className="text-gray-700 text-sm mb-4">{plan.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {plan.plan_type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900">{plan.duration_days} days</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartPlan(plan.id, plan.name)}
                  disabled={isActive}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isActive ? 'Already Active' : 'Start Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {presetPlans.length === 0 && userPlans.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reading plans available</h3>
          <p className="text-gray-600">Reading plans help you stay consistent in your Bible study.</p>
        </div>
      )}
    </div>
  );
}