import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        ...formData,
        isLogin: isLoginMode
      };
      
      await onLogin(userData);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Auth error:', error);
      // Error is handled in the parent component
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Simulate social login
    const userData = {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 9876543210'
    };
    onLogin && onLogin(userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLoginMode ? 'Sign In' : 'Sign Up'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required={!isLoginMode}
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email or Phone</Label>
              <Input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email or phone number"
                required
              />
            </div>

            {!isLoginMode && (
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  required={!isLoginMode}
                />
              </div>
            )}

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLoginMode && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required={!isLoginMode}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Continue with Google</span>
              </div>
            </Button>

            <Button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
            >
              Continue with Facebook
            </Button>
          </div>

          {/* Switch mode */}
          <div className="text-center mt-6">
            <span className="text-gray-600">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-pink-500 hover:text-pink-600 font-semibold"
            >
              {isLoginMode ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          {/* Terms */}
          {!isLoginMode && (
            <p className="text-xs text-gray-500 text-center mt-4">
              By signing up, you agree to our{' '}
              <a href="#" className="text-pink-500 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-pink-500 hover:underline">
                Privacy Policy
              </a>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuthModal;