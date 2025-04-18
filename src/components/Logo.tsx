
import React from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  variant?: 'default' | 'white';
  showText?: boolean;
}

const Logo = ({ 
  className, 
  textClassName,
  iconClassName,
  variant = 'default',
  showText = true
}: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "flex items-center justify-center rounded-md p-1", 
        variant === 'default' ? "bg-eduBlue text-white" : "bg-white text-eduBlue",
        iconClassName
      )}>
        <BookOpen className="w-6 h-6" />
      </div>
      {showText && (
        <span className={cn(
          "font-heading font-bold text-xl", 
          variant === 'default' ? "text-eduGray" : "text-white",
          textClassName
        )}>
          SkillHub
        </span>
      )}
    </div>
  );
};

export default Logo;
