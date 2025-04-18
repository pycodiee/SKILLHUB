import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500/10 via-white to-yellow-500/10">
      <Card className="w-[400px] backdrop-blur-sm bg-white/95 border border-blue-200 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-eduGray flex items-center justify-center gap-2">
            <LogOut className="h-6 w-6" />
            Logging Out
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-eduGray/80">Please wait while we log you out...</p>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eduBlue"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logout;