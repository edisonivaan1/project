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

interface AchievementPopupProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
  autoCloseDelay?: number; // milliseconds
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
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

  const getPopupStyle = () => {
    switch (achievement.category) {
      case 'medal':
        return {
          gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
          border: 'border-yellow-300',
          icon: Trophy,
          bgColor: 'bg-yellow-50'
        };
      case 'performance':
        return {
          gradient: 'from-purple-400 via-purple-500 to-purple-600',
          border: 'border-purple-300',
          icon: Star,
          bgColor: 'bg-purple-50'
        };
      case 'completion':
        return {
          gradient: 'from-green-400 via-green-500 to-green-600',
          border: 'border-green-300',
          icon: Award,
          bgColor: 'bg-green-50'
        };
      default:
        return {
          gradient: 'from-blue-400 via-blue-500 to-blue-600',
          border: 'border-blue-300',
          icon: Trophy,
          bgColor: 'bg-blue-50'
        };
    }
  };

  const style = getPopupStyle();
  const IconComponent = style.icon;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div 
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        <div className={`relative max-w-md mx-auto bg-white rounded-2xl shadow-2xl border-4 ${style.border} overflow-hidden`}>
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${style.gradient} px-6 py-4 text-white relative`}>
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
              aria-label="Close achievement notification"
              tabIndex={0}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <IconComponent className="w-8 h-8" />
              </div>
              <div>
                <h3 
                  className="text-lg font-bold focus:outline-none focus:ring-2 focus:ring-white rounded px-1"
                  tabIndex={0}
                  role="heading"
                  aria-level={3}
                >
                  {achievement.category === 'medal' ? 'Medal Earned!' : 'Achievement Unlocked!'}
                </h3>
                <p 
                  className="text-sm opacity-90 focus:outline-none focus:ring-2 focus:ring-white rounded px-1"
                  tabIndex={0}
                  role="text"
                >
                  Congratulations!
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`p-6 ${style.bgColor}`}>
            <div className="text-center">
              {/* Achievement Icon */}
              <div className="text-6xl mb-4">
                {achievement.icon}
              </div>
              
              {/* Achievement Details */}
              <h4 
                className="text-2xl font-bold text-gray-900 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="heading"
                aria-level={4}
              >
                {achievement.name}
              </h4>
              <p 
                className="text-gray-600 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
              >
                {achievement.description}
              </p>
              
              {/* Category Badge */}
              <div 
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-80 text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                tabIndex={0}
                role="text"
                aria-label={`Achievement category: ${achievement.category === 'medal' ? 'Difficulty Medal' : achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}`}
              >
                {achievement.category === 'medal' ? 'Difficulty Medal' : 
                 achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)} Achievement
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={handleClose}
                className={`px-6 py-2 bg-gradient-to-r ${style.gradient} text-white font-medium rounded-full hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
                tabIndex={0}
                aria-label="Continue learning and close achievement notification"
              >
                Continue Learning
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full opacity-70 animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-300 rounded-full opacity-50 animate-pulse"></div>
        </div>
      </div>
    </>
  );
};

export default AchievementPopup;