import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Volume2, Lock, Check, Star } from 'lucide-react';
import Card, { CardBody } from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';
import IconButton from '../components/UI/IconButton';
import { grammarTopics } from '../data/grammarTopics';
import { useAttempt } from '../contexts/AttemptContext';
import { useGameProgress } from '../contexts/GameProgressContext';

const difficultyColors: Record<string, { bg: string; text: string; border: string; button: string }> = {
  easy: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    button: 'bg-emerald-500 hover:bg-emerald-600 text-white'
  },
  medium: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    button: 'bg-blue-500 hover:bg-blue-600 text-white'
  },
  hard: {
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
    border: 'border-fuchsia-200',
    button: 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white'
  }
};

const TopicsPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasInProgressAttemptForDifficulty, hasCompletedAttempt } = useAttempt();
  const { 
    canAccessDifficulty, 
    isLevelCompleted, 
    getLevelPercentage
  } = useGameProgress();
  
  // Estado para rastrear intentos en progreso por tema y dificultad
  const [inProgressAttempts, setInProgressAttempts] = useState<Record<string, boolean>>({});
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(true);
  
  // Group topics by difficulty
  const topicsByDifficulty = grammarTopics.reduce((acc, topic) => {
    if (!acc[topic.difficulty]) {
      acc[topic.difficulty] = [];
    }
    acc[topic.difficulty].push(topic);
    return acc;
  }, {} as Record<string, typeof grammarTopics>);

  // Cargar intentos en progreso al montar el componente
  useEffect(() => {
    const loadInProgressAttempts = async () => {
      setIsLoadingAttempts(true);
      const attemptPromises: Record<string, boolean> = {};
      
      // Verificar cada tema y dificultad
      for (const topic of grammarTopics) {
        const key = `${topic.id}-${topic.difficulty}`;
        try {
          const hasAttempt = await hasInProgressAttemptForDifficulty(topic.id, topic.difficulty);
          attemptPromises[key] = hasAttempt;
        } catch (error) {
          console.error(`Error checking attempt for ${topic.id}-${topic.difficulty}:`, error);
          attemptPromises[key] = false;
        }
      }
      
      setInProgressAttempts(attemptPromises);
      setIsLoadingAttempts(false);
    };

    loadInProgressAttempts();
  }, [hasInProgressAttemptForDifficulty]);

  const getButtonText = (topicId: string, difficulty: string) => {
    const key = `${topicId}-${difficulty}`;
    if (isLoadingAttempts) {
      return 'LOADING...';
    }
    if (inProgressAttempts[key]) {
      return 'CONTINUE ATTEMPT';
    }
    return 'START PRACTICE';
  };

  const handleStartClick = (e: React.MouseEvent, topicId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    e.stopPropagation();
    
    // Verificar si el usuario puede acceder a esta dificultad
    if (!canAccessDifficulty(difficulty)) {
      return; // No permitir clic si está bloqueado
    }
    
    navigate(`/game/${topicId}?difficulty=${difficulty}`);
  };

  const handleViewResultsClick = (e: React.MouseEvent, topicId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    e.stopPropagation();
    
    // Verificar si el usuario puede acceder a esta dificultad
    if (!canAccessDifficulty(difficulty)) {
      return; // No permitir clic si está bloqueado
    }
    
    navigate(`/results/${topicId}?difficulty=${difficulty}`);
  };

  const getTopicStatus = (topicId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    if (!canAccessDifficulty(difficulty)) {
      return 'locked';
    }
    if (isLevelCompleted(topicId, difficulty)) {
      return 'completed';
    }
    return 'available';
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="mb-16 text-center">
        <h1 className="font-extrabold text-5xl md:text-6xl mb-6 text-primary tracking-tight">
          GRAMMAR MASTER PRO
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Master English Grammar Through Interactive Games And Activities Designed For B1-Level Learners.
        </p>
        


        <div className="flex justify-center mt-8 space-x-4">
          <IconButton
            icon={<Volume2 className="h-6 w-6" />}
            variant="outline"
            size="lg"
            tooltip="Sound Settings"
            aria-label="Sound Settings"
            onClick={() => navigate('/settings')}
            className="hover:scale-105 transition-transform"
          />
          <IconButton
            icon={<Info className="h-6 w-6" />}
            variant="outline"
            size="lg"
            tooltip="Help"
            aria-label="Help"
            onClick={() => navigate('/help')}
            className="hover:scale-105 transition-transform"
          />
        </div>
      </section>
      
      {Object.entries(topicsByDifficulty).map(([difficulty, topics]) => (
        <section key={difficulty} className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 capitalize">
            {difficulty} Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const progress = getLevelPercentage(topic.id, topic.difficulty as 'easy' | 'medium' | 'hard');
              const status = getTopicStatus(topic.id, topic.difficulty as 'easy' | 'medium' | 'hard');
              const colors = difficultyColors[topic.difficulty] || difficultyColors.easy;
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';
              
              return (
                <Card 
                  key={topic.id} 
                  className={`transition-all duration-300 ${!isLocked ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : 'opacity-60'} ${colors.border} border-2 ${isCompleted ? 'ring-2 ring-green-400' : ''}`}
                  onClick={() => !isLocked && navigate(`/tutorial/${topic.id}?difficulty=${topic.difficulty}`)}
                >
                  <CardBody className="flex flex-col h-full relative">
                    {isLocked && (
                      <div className="absolute top-4 right-4 z-10">
                        <Lock className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-10">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`text-xl font-bold ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                        {topic.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.text} ${colors.bg}`}>
                          {topic.difficulty.toUpperCase()}
                        </span>
                        {progress === 100 && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                    
                    <p className={`mb-6 flex-grow ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                      {topic.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <ProgressBar value={progress} max={100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className={`w-full ${isLocked ? 'bg-gray-400 cursor-not-allowed' : colors.button}`}
                          onClick={(e) => handleStartClick(e, topic.id, topic.difficulty as 'easy' | 'medium' | 'hard')}
                          disabled={isLocked}
                        >
                          {isLocked ? (
                            <div className="flex items-center justify-center">
                              <Lock className="h-4 w-4 mr-2" />
                              LOCKED
                            </div>
                          ) : (
                            getButtonText(topic.id, topic.difficulty)
                          )}
                        </Button>
                        
                        {!isLocked && hasCompletedAttempt(topic.id, topic.difficulty as 'easy' | 'medium' | 'hard') && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                            onClick={(e) => handleViewResultsClick(e, topic.id, topic.difficulty as 'easy' | 'medium' | 'hard')}
                          >
                            VIEW RESULTS
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default TopicsPage;
