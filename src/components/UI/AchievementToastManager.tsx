import React, { useState, useEffect } from 'react';
import AchievementToast, { Achievement } from './AchievementToast';
import { useAchievements } from '../../contexts/AchievementContext';

interface AchievementToastManagerProps {
  enabled?: boolean; // Allow enabling/disabling toasts for specific pages
}

const AchievementToastManager: React.FC<AchievementToastManagerProps> = ({ 
  enabled = true 
}) => {
  const { pendingNotifications, markNotificationShown } = useAchievements();
  const [currentToast, setCurrentToast] = useState<Achievement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Add new pending notifications to queue
    if (pendingNotifications.length > 0) {
      setToastQueue(prev => {
        // Avoid duplicates
        const newNotifications = pendingNotifications.filter(
          notification => !prev.some(queued => queued.id === notification.id) &&
                          (!currentToast || currentToast.id !== notification.id)
        );
        return [...prev, ...newNotifications];
      });
    }
  }, [pendingNotifications, enabled, currentToast]);

  useEffect(() => {
    if (!enabled) return;

    // Show next toast if there are queued notifications and no current toast
    if (toastQueue.length > 0 && !currentToast) {
      const nextToast = toastQueue[0];
      setCurrentToast(nextToast);
      setIsVisible(true);
      
      // Remove from queue
      setToastQueue(prev => prev.slice(1));
    }
  }, [toastQueue, currentToast, enabled]);

  const handleClose = async () => {
    if (currentToast) {
      setIsVisible(false);
      
      // Mark as shown in the achievement system
      await markNotificationShown(currentToast.id);
      
      // Clear current toast after animation
      setTimeout(() => {
        setCurrentToast(null);
      }, 500);
    }
  };

  if (!enabled) {
    return null;
  }

  return (
    <AchievementToast
      achievement={currentToast}
      isVisible={isVisible}
      onClose={handleClose}
      autoCloseDelay={4000} // 4 seconds for in-game toasts
    />
  );
};

export default AchievementToastManager;