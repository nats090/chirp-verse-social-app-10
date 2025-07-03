
import React, { useState } from 'react';
import { Camera, Heart, MessageCircle } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (data: { email: string; password: string; username?: string }) => void;
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSubmit, onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-32 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-32 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 right-10 w-16 h-16 bg-white/15 rounded-full blur-lg"></div>
      
      {/* Floating icons */}
      <div className="absolute top-20 right-32 text-white/20">
        <Heart size={24} />
      </div>
      <div className="absolute bottom-32 left-20 text-white/20">
        <Camera size={28} />
      </div>
      <div className="absolute top-1/2 left-16 text-white/20">
        <MessageCircle size={20} />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Chika!
            </h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome back' : 'Join the community'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to continue your journey' : 'Express yourself, connect with others'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-800"
                  placeholder="Choose your username"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
              </div>
            )}

            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-800"
                placeholder="Your email address"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-800"
                placeholder="Your password"
                minLength={6}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-red-700 focus:ring-4 focus:ring-purple-200 transition-all transform hover:-translate-y-1 hover:shadow-2xl shadow-lg"
            >
              {isLogin ? 'Sign In' : 'Join Chika!'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="border-t border-gray-300 flex-1"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="border-t border-gray-300 flex-1"></div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onToggleMode}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors text-lg"
              >
                {isLogin ? 'Create new account' : 'Already have an account?'}
              </button>
              <p className="text-gray-500 text-sm">
                {isLogin ? "New to Chika? Join our creative community!" : "Ready to dive back in?"}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom decorative text */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">
            Where creativity meets community ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
