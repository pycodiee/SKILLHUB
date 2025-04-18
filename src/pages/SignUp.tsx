import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail, Lock, User, UserPlus, ArrowRight, Phone, BookOpen,
  GraduationCap, Brain, Lightbulb, Trophy, Target 
} from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Logo from '@/components/Logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 'student',
    usn: '',
    contact: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Using the endpoint from the first file (/api/register)
      const res = await axios.post('http://localhost:5000/api/register', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        userType: formData.user_type, // Match the property name used in the backend
        usn: formData.usn.trim() || null,
        contact: formData.contact.trim() || null
      });
      
      if (res.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          user_type: 'student',
          usn: '',
          contact: ''
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsSubmitting(true);
      const res = await axios.post('http://localhost:5000/api/google-auth', {
        credential: credentialResponse.credential
      });
      
      if (res.data.success) {
        // For Google auth, we'll log them in directly since this is already validated
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/landing');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Google authentication failed');
    } finally {
      setIsSubmitting(false);
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
            className="absolute opacity-10"
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
        
        {/* Gradient blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side Content */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-blue-600 mb-6">
            Join Our Community
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            "The beautiful thing about learning is that no one can take it away from you."
            <span className="block mt-2 text-lg font-medium text-blue-600/80">- B.B. King</span>
          </p>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-[600px] flex items-center justify-center p-8 relative z-10">
        <Card className="w-full backdrop-blur-sm bg-white/95 border border-blue-200 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Link to="/">
                <Logo className="scale-110 hover:scale-125 transition-transform duration-200" />
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold text-eduGray">Create an account</CardTitle>
            <CardDescription>
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Update each input field's styling to match Login page */}
              <div className="relative group">
                <User className="absolute left-3 top-3 h-5 w-5 text-eduGray/50 group-hover:text-eduBlue transition-colors" />
                <Input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 border-eduBlue/20 focus:border-eduBlue focus:ring-eduBlue/20 hover:border-eduBlue/40 transition-all"
                />
              </div>
              
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-eduGray/50" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 border-eduYellow/20 focus-visible:ring-eduYellow"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-eduGray/50" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 border-eduYellow/20 focus-visible:ring-eduYellow"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-eduGray/50" />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="pl-10 border-eduYellow/20 focus-visible:ring-eduYellow"
                />
              </div>
              
              <Select 
                value={formData.user_type} 
                onValueChange={(value) => {
                  setFormData({ ...formData, user_type: value });
                  setError('');
                }}
              >
                <SelectTrigger className="border-eduYellow/20 focus:ring-eduYellow">
                  <SelectValue placeholder="I am a..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
              
              {formData.user_type === 'student' && (
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 h-5 w-5 text-eduGray/50" />
                  <Input
                    name="usn"
                    type="text"
                    placeholder="USN"
                    value={formData.usn}
                    onChange={handleChange}
                    className="pl-10 border-eduYellow/20 focus-visible:ring-eduYellow"
                  />
                </div>
              )}
              
              {formData.user_type === 'teacher' && (
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-eduGray/50" />
                  <Input
                    name="contact"
                    type="tel"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={handleChange}
                    className="pl-10 border-eduYellow/20 focus-visible:ring-eduYellow"
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-eduBlue hover:bg-eduBlue/90 text-white group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <><UserPlus className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /> Create Account</>
                )}
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
                disabled={isSubmitting}
              />
            </div>

            <p className="text-center mt-6 text-sm text-eduGray/80">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-eduBlue font-medium hover:text-eduBlue/80 inline-flex items-center group"
              >
                Sign in
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;