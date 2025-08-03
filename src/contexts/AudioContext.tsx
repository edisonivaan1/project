import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import backgroundMusicFile from '../assets/audio/background-music.mp3';

interface AudioContextType {
  isMusicEnabled: boolean;
  isSoundEffectsEnabled: boolean;
  toggleMusic: () => void;
  toggleSoundEffects: () => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  playSoundEffect: (effect: 'correct' | 'wrong', volume?: number) => void;
  playQuestionAudio: (audioPath: string) => void;
  isUserAuthenticated: boolean; // Para que los componentes puedan verificar
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Clave para sessionStorage
const AUDIO_SETTINGS_KEY = 'grammar_master_audio_settings';

// Función para cargar configuraciones desde sessionStorage
const loadAudioSettings = () => {
  try {
    const saved = sessionStorage.getItem(AUDIO_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        isMusicEnabled: parsed.isMusicEnabled ?? false,
        isSoundEffectsEnabled: parsed.isSoundEffectsEnabled ?? false
      };
    }
  } catch (error) {
    console.error('Error loading audio settings:', error);
  }
  return { isMusicEnabled: false, isSoundEffectsEnabled: false }; // Desactivado por defecto
};

// Función para guardar configuraciones en sessionStorage
const saveAudioSettings = (isMusicEnabled: boolean, isSoundEffectsEnabled: boolean) => {
  try {
    sessionStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify({
      isMusicEnabled,
      isSoundEffectsEnabled
    }));
  } catch (error) {
    console.error('Error saving audio settings:', error);
  }
};

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Obtener estado de autenticación
  
  // Cargar configuraciones persistidas
  const savedSettings = loadAudioSettings();
  const [isMusicEnabled, setIsMusicEnabled] = useState(savedSettings.isMusicEnabled);
  const [isSoundEffectsEnabled, setIsSoundEffectsEnabled] = useState(savedSettings.isSoundEffectsEnabled);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);

  // Cargar la música de fondo (solo una vez)
  useEffect(() => {
    const music = new Audio(backgroundMusicFile);
    music.loop = true;
    music.volume = 0.3;
    music.preload = 'auto';
    setBackgroundMusic(music);
    
    console.log('🎵 Background music loaded');

    // Limpiar al desmontar el componente
    return () => {
      setBackgroundMusic(prev => {
        if (prev) {
          prev.pause();
          prev.currentTime = 0;
          console.log('🛑 Background music cleaned up');
        }
        return null;
      });
    };
  }, []); // Solo ejecutar una vez al montar

  // Efecto para controlar reproducción basado en preferencias Y autenticación
  useEffect(() => {
    saveAudioSettings(isMusicEnabled, isSoundEffectsEnabled);
    
    if (backgroundMusic) {
      // Solo reproducir audio si el usuario está logueado Y la música está habilitada
      if (user && isMusicEnabled) {
        console.log('▶️ Starting background music (user authenticated)');
        backgroundMusic.play().catch(error => {
          console.error('Error playing background music:', error);
        });
      } else {
        if (!user) {
          console.log('⏹️ Stopping background music (user not authenticated)');
        } else {
          console.log('⏹️ Stopping background music (disabled by user)');
        }
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Reiniciar posición
      }
    }
  }, [isMusicEnabled, isSoundEffectsEnabled, backgroundMusic, user]);

  // Efecto para detener audio cuando se hace logout
  useEffect(() => {
    if (!user && backgroundMusic) {
      console.log('🚪 User logged out, stopping all audio');
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  }, [user, backgroundMusic]);

  const toggleMusic = () => {
    setIsMusicEnabled((prev: boolean) => !prev);
  };

  const toggleSoundEffects = () => {
    setIsSoundEffectsEnabled((prev: boolean) => !prev);
  };

  const playBackgroundMusic = () => {
    if (user && isMusicEnabled && backgroundMusic) {
      console.log('🎵 Manual play background music');
      backgroundMusic.play().catch(error => {
        console.error('Error playing background music:', error);
      });
    } else {
      if (!user) {
        console.log('🚫 Background music blocked - user not authenticated');
      } else {
        console.log('🚫 Background music disabled or not loaded');
      }
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusic) {
      console.log('🛑 Manual stop background music');
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  };

  // Efectos de sonido específicos (CorrectAnswer.mp3, WrongAnswer.mp3)
  const playSoundEffect = async (effect: 'correct' | 'wrong', volume: number = 0.6) => {
    // Solo reproducir efectos si el usuario está autenticado Y los efectos están habilitados
    if (!user || !isSoundEffectsEnabled) {
      if (!user) {
        console.log('🚫 Sound effect blocked - user not authenticated');
      }
      return;
    }

    try {
      const audioModule = effect === 'correct' 
        ? await import('../assets/audio/CorrectAnswer.mp3')
        : await import('../assets/audio/WrongAnswer.mp3');
      
      const sound = new Audio(audioModule.default);
      sound.volume = volume;
      sound.play().catch(error => {
        console.error(`Error playing ${effect} sound effect:`, error);
      });
    } catch (error) {
      console.error(`Error loading ${effect} sound effect:`, error);
    }
  };

  // Audio de preguntas (conectado con configuración de Sound Effects)
  const playQuestionAudio = (audioPath: string) => {
    // Solo reproducir audio de preguntas si el usuario está autenticado Y tiene los efectos habilitados
    if (!user || !isSoundEffectsEnabled) {
      if (!user) {
        console.log('🚫 Question audio blocked - user not authenticated');
      } else {
        console.log('🚫 Question audio blocked - sound effects disabled');
      }
      return;
    }

    const sound = new Audio(audioPath);
    sound.volume = 0.7;
    sound.play().catch(error => {
      console.error('Error playing question audio:', error);
    });
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
        playQuestionAudio,
        isUserAuthenticated: !!user,
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