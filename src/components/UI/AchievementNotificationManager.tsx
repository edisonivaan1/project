import React, { useState, useEffect } from 'react';
import AchievementPopup, { Achievement } from './AchievementPopup';
import { useAchievements } from '../../contexts/AchievementContext';

const AchievementNotificationManager: React.FC = () => {
  const { pendingNotifications, markNotificationShown } = useAchievements();
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show next notification if there are pending ones and none is currently showing
    if (pendingNotifications.length > 0 && !currentNotification) {
      const nextNotification = pendingNotifications[0];
      setCurrentNotification(nextNotification);
      setIsVisible(true);
    }
  }, [pendingNotifications, currentNotification]);

  const handleClose = () => {
    if (currentNotification) {
      setIsVisible(false);
      markNotificationShown(currentNotification.id);
      
      // Small delay before showing next notification
      setTimeout(() => {
        setCurrentNotification(null);
      }, 500);
    }
  };

  return (
    <AchievementPopup
      achievement={currentNotification}
      isVisible={isVisible}
      onClose={handleClose}
      autoCloseDelay={6000} // 6 seconds auto-close
    />
  );
};

export default AchievementNotificationManager;