import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings } from '../types';

interface AudioContextType {
  isMusicEnabled: boolean;
  isSoundEffectsEnabled: boolean;
  toggleMusic: () => void;
  toggleSoundEffects: () => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  playSoundEffect: (effect: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isSoundEffectsEnabled, setIsSoundEffectsEnabled] = useState(true);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);

  // Cargar la música de fondo
  useEffect(() => {
    const music = new Audio('/src/assets/audio/background-music.mp3');
    music.loop = true;
    music.volume = 0.5;
    setBackgroundMusic(music);

    // Limpiar al desmontar
    return () => {
      if (music) {
        music.pause();
        music.currentTime = 0;
      }
    };
  }, []);

  const toggleMusic = () => {
    setIsMusicEnabled(prev => {
      const newValue = !prev;
      if (backgroundMusic) {
        if (newValue) {
          backgroundMusic.play().catch(error => {
            console.error('Error playing background music:', error);
          });
        } else {
          backgroundMusic.pause();
        }
      }
      return newValue;
    });
  };

  const toggleSoundEffects = () => {
    setIsSoundEffectsEnabled(prev => !prev);
  };

  const playBackgroundMusic = () => {
    if (isMusicEnabled && backgroundMusic) {
      backgroundMusic.play().catch(error => {
        console.error('Error playing background music:', error);
      });
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  };

  const playSoundEffect = (effect: string) => {
    if (isSoundEffectsEnabled) {
      const sound = new Audio(`/src/assets/audio/${effect}.mp3`);
      sound.volume = 0.7;
      sound.play().catch(error => {
        console.error('Error playing sound effect:', error);
      });
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isMusicEnabled,
        isSoundEffectsEnabled,
        toggleMusic,
        toggleSoundEffects,
        playBackgroundMusic,
        stopBackgroundMusic,
        playSoundEffect,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}; 