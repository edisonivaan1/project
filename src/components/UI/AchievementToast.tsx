import React, { useState, useEffect } from 'react';
import { X, Trophy, Award, Star } from 'lucide-react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  category: 'completion' | 'performance' | 'consistency' | 'exploration' | 'medal';
}

interface AchievementToastProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
  autoCloseDelay?: number; // milliseconds
}

const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  isVisible,
  onClose,
  autoCloseDelay = 5000
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible && achievement) {
      setIsAnimating(true);
      
      // Auto close after delay
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, achievement, autoCloseDelay]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible || !achievement) {
    return null;
  }

  const getToastStyle = () => {
    switch (achievement.category) {
      case 'medal':
        return {
          gradient: 'from-yellow-400 to-yellow-600',
          border: 'border-yellow-300',
          icon: Trophy,
          bgColor: 'bg-yellow-50'
        };
      case 'performance':
        return {
          gradient: 'from-purple-400 to-purple-600',
          border: 'border-purple-300',
          icon: Star,
          bgColor: 'bg-purple-50'
        };
      case 'completion':
        return {
          gradient: 'from-green-400 to-green-600',
          border: 'border-green-300',
          icon: Award,
          bgColor: 'bg-green-50'
        };
      default:
        return {
          gradient: 'from-blue-400 to-blue-600',
          border: 'border-blue-300',
          icon: Trophy,
          bgColor: 'bg-blue-50'
        };
    }
  };

  const style = getToastStyle();
  const IconComponent = style.icon;

  return (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{ maxWidth: '350px' }}
    >
      <div className={`bg-white rounded-lg shadow-xl border-2 ${style.border} overflow-hidden`}>
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${style.gradient} px-4 py-2 text-white relative`}>
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors p-1"
            aria-label="Close achievement notification"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-2 pr-8">
            <div className="p-1 bg-white bg-opacity-20 rounded-full">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                Achievement Unlocked!
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`p-4 ${style.bgColor}`}>
          <div className="flex items-start space-x-3">
            {/* Achievement Icon */}
            <div className="text-3xl flex-shrink-0">
              {achievement.icon}
            </div>
            
            {/* Achievement Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-gray-900 truncate">
                {achievement.name}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {achievement.description}
              </p>
              
              {/* Category Badge */}
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-60 text-gray-700 mt-2">
                {achievement.category === 'medal' ? 'Medal' : 
                 achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-70 animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full opacity-50 animate-pulse"></div>
      </div>
    </div>
  );
};

export default AchievementToast;