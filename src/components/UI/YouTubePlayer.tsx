import React, { useState, useEffect, useRef } from 'react';
import { Play, SkipForward, RotateCcw } from 'lucide-react';
import Button from './Button';

interface YouTubePlayerProps {
  videoId: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  className?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  videoId, 
  onProgress, 
  onComplete, 
  className = '' 
}) => {
  const [isWatched, setIsWatched] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Función para extraer el ID del video de una URL de YouTube
  const extractVideoId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  };

  // Función para simular el progreso del video
  const startProgressSimulation = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        onProgress?.(newProgress);
        
        if (newProgress >= 100) {
          setIsWatched(true);
          onComplete?.();
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
        }
        return newProgress;
      });
    }, 1000); // 1 segundo por 1% de progreso (100 segundos total)
  };

  const handleSkipTutorial = () => {
    setIsWatched(true);
    setProgress(100);
    onComplete?.();
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleReplayTutorial = () => {
    setIsWatched(false);
    setProgress(0);
    setIsReady(false);
    // Recargar el iframe
    if (playerRef.current) {
      const currentSrc = playerRef.current.src;
      playerRef.current.src = '';
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  const handleIframeLoad = () => {
    setIsReady(true);
    startProgressSimulation();
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0`;

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
              {!isReady && (
          <div 
            className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10 focus:outline-none focus:ring-2 focus:ring-white rounded"
            tabIndex={0}
            role="text"
            aria-label="Loading video content"
          >
            <div className="text-white text-center">
              <div 
                className="text-xl mb-2 focus:outline-none focus:ring-2 focus:ring-white rounded px-1"
                tabIndex={0}
                role="text"
              >
                Cargando video...
              </div>
              <div 
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto focus:outline-none focus:ring-2 focus:ring-white rounded"
                tabIndex={0}
                role="img"
                aria-label="Loading spinner"
              ></div>
            </div>
          </div>
        )}

      <iframe
        ref={playerRef}
        src={embedUrl}
        title="YouTube video player"
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleIframeLoad}
      />

      {/* Overlay controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        {/* Progress bar */}
        <div className="absolute bottom-16 left-0 right-0 px-4 pointer-events-auto">
          <div 
            className="w-full h-1 bg-gray-600 rounded-lg relative focus:outline-none focus:ring-2 focus:ring-white rounded"
            tabIndex={0}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Video progress: ${Math.floor(progress)}% completed`}
          >
            <div 
              className="h-full bg-primary rounded-lg transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between text-white text-sm mt-1">
            <span 
              className="focus:outline-none focus:ring-2 focus:ring-white rounded px-1"
              tabIndex={0}
              role="text"
            >
              {Math.floor(progress)}% completado
            </span>
            <span 
              className="focus:outline-none focus:ring-2 focus:ring-white rounded px-1"
              tabIndex={0}
              role="text"
            >
              {isWatched ? 'Completado' : 'En progreso'}
            </span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 pointer-events-auto">
          {!isWatched && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipTutorial}
              className="text-white hover:bg-white/20"
            >
              <SkipForward size={20} />
              Saltar Tutorial
            </Button>
          )}
          
          {isWatched && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplayTutorial}
              className="text-white hover:bg-white/20"
            >
              <RotateCcw size={20} />
              Repetir Tutorial
            </Button>
          )}
        </div>
      </div>

      {/* Completion overlay */}
      {isWatched && (
        <div 
          className="absolute inset-0 bg-green-500/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
          tabIndex={0}
          role="text"
          aria-label="Tutorial completed successfully"
        >
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
            ✅ Tutorial Completado
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer; 