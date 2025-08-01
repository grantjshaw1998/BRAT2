import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#2a2a2a] rounded-3xl border border-[#3a3a3a] p-8 shadow-2xl">
          {/* Logo Container */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#3a3a3a] rounded-2xl p-6 border border-[#4a4a4a]">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-black">
                  <path d="M4 19.5A2.5 2.5 0 0 1 1.5 17V7A2.5 2.5 0 0 1 4 4.5h16A2.5 2.5 0 0 1 22.5 7v10a2.5 2.5 0 0 1-2.5 2.5H4z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 4.5V19.5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18" cy="8" r="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">
              BIBLE RESEARCH
            </h1>
            <p className="text-gray-400 text-sm">
              A smarter way to study the Holy Scriptures
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4a4a4a] transition-colors"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4a4a4a] transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
            >
              {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Forgot password? Reset it
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}