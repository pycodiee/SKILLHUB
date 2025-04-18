import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleLogin } from '@react-oauth/google';
// Add these imports at the top
import { 
  Mail, Lock, ArrowRight, LogIn, BookOpen, 
  GraduationCap, Brain, Lightbulb, Trophy, Target 
} from 'lucide-react';
import axios from 'axios';
import Logo from '@/components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/landing');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await axios.post('http://localhost:5000/api/google-auth', {
        credential: credentialResponse.credential
      });
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/landing');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Google authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-white to-yellow-500/10">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        {/* Educational icons background */}
        {[BookOpen, GraduationCap, Brain, Lightbulb, Trophy, Target].map((Icon, index) => (
          <div
            key={index}
            className="absolute opacity-10"  // Increased opacity
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `float ${10 + index * 2}s ease-in-out infinite`,
              animationDelay: `${index * 0.5}s`
            }}
          >
            <Icon className="w-24 h-24 text-blue-600" />
          </div>
        ))}
        
        {/* Gradient blobs with increased opacity */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side Content */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-blue-600 mb-6">
            Welcome Back!
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            "Education is not preparation for life; education is life itself."
            <span className="block mt-2 text-lg font-medium text-blue-600/80">- John Dewey</span>
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[600px] flex items-center justify-center p-8 relative z-10">
        <Card className="w-full backdrop-blur-sm bg-white/95 border border-blue-200 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Link to="/">
                <Logo className="scale-110 hover:scale-125 transition-transform duration-200" />
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold text-eduGray">Welcome Back!</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100 animate-shake">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-eduGray/50 group-hover:text-eduBlue transition-colors" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 border-eduBlue/20 focus:border-eduBlue focus:ring-eduBlue/20 hover:border-eduBlue/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-eduGray/50 group-hover:text-eduBlue transition-colors" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 border-eduBlue/20 focus:border-eduBlue focus:ring-eduBlue/20 hover:border-eduBlue/40 transition-all"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-eduBlue hover:bg-eduBlue/90 text-white group"
              >
                <LogIn className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Sign In
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-eduGray/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-eduGray/60">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center hover:scale-105 transition-transform">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google authentication failed')}
              />
            </div>

            <p className="text-center mt-6 text-sm text-eduGray/80">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-eduBlue font-medium hover:text-eduBlue/80 inline-flex items-center group"
              >
                Sign up
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;