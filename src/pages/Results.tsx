import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Home, RefreshCw, Trophy } from 'lucide-react';
import Card, { CardBody } from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';
import { grammarTopics } from '../data/grammarTopics';
import { useAttempt } from '../contexts/AttemptContext';
import { useQuestionStatus } from '../contexts/QuestionStatusContext';
import { useAchievements } from '../contexts/AchievementContext';
import { useGame } from '../contexts/GameContext';

import { progressService } from '../services/api';

interface BackendAttempt {
  _id: string;
  topicId: string;
  difficulty: string;
  correct: number;
  total: number;
  percentage: number;
  timeSpent: number;
  hintsUsed: number;
  completedAt: string;
}

const Results: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const difficulty = (searchParams.get('difficulty') as 'easy' | 'medium' | 'hard') || 'easy';
  
  // Estados para datos del backend
  const [backendAttempts, setBackendAttempts] = useState<BackendAttempt[]>([]);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(true);
  const [currentScore, setCurrentScore] = useState({ correct: 0, total: 10 });
  const [percentage, setPercentage] = useState(0);
  
  const { getCurrentAttempt, resetAttempt } = useAttempt();
  const { resetQuestionStatuses } = useQuestionStatus();
  const { checkForNewAchievements } = useAchievements();
  const { resetGame } = useGame();


  const topic = grammarTopics.find(t => t.id === topicId);

  // Cargar intentos del backend para este tema y dificultad específicos
  useEffect(() => {
    const loadAttempts = async () => {
      if (!topicId) return;
      
      try {
        setIsLoadingAttempts(true);
        
        // Obtener intentos específicos para este tema y dificultad
        const response = await progressService.getAttempts({
          topicId: topicId.replace('_', '-'), // Convertir formato si es necesario
          difficulty: difficulty,
          limit: 100, // Obtener todos los intentos para este tema/dificultad
          sortBy: 'completedAt',
          sortOrder: 'desc'
        });
        
        if (response.success && response.data?.attempts) {
          const attempts = response.data.attempts as BackendAttempt[];
          setBackendAttempts(attempts);
          
          // Encontrar el intento con la puntuación más alta
          if (attempts.length > 0) {
            const bestAttempt = attempts.reduce((best, current) => 
              current.percentage > best.percentage ? current : best
            );
            
            setCurrentScore({ 
              correct: bestAttempt.correct, 
              total: bestAttempt.total 
            });
            setPercentage(bestAttempt.percentage);
            
            console.log('✅ Mejor intento encontrado:', bestAttempt);
          } else {
            // Fallback a datos locales si no hay intentos en el backend
            const localAttempt = getCurrentAttempt(topicId);
            if (localAttempt && localAttempt.isCompleted) {
              setCurrentScore({ 
                correct: localAttempt.correctAnswers, 
                total: localAttempt.totalQuestions 
              });
              setPercentage(localAttempt.score);
            }
          }
          
          console.log('✅ Intentos cargados para Results:', attempts);
        }
      } catch (error) {
        console.error('❌ Error cargando intentos en Results:', error);
        
        // Fallback a datos locales en caso de error
        const localAttempt = getCurrentAttempt(topicId);
        if (localAttempt && localAttempt.isCompleted) {
          setCurrentScore({ 
            correct: localAttempt.correctAnswers, 
            total: localAttempt.totalQuestions 
          });
          setPercentage(localAttempt.score);
        }
      } finally {
        setIsLoadingAttempts(false);
      }
    };

    loadAttempts();
  }, [topicId, difficulty, getCurrentAttempt]);

  if (!topic) {
    return (
      <div className="text-center py-12">
        <h2 
          className="text-2xl font-bold mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
          tabIndex={0}
          role="heading"
          aria-level={2}
        >
          Topic not found
        </h2>
        <Button 
          onClick={() => navigate('/topics')}
          tabIndex={0}
          aria-label="Volver a la página de temas"
        >
          Return to Topics
        </Button>
      </div>
    );
  }

  const handleTryAgain = () => {
    if (topicId) {
      // Limpiar solo el estado de la sesión actual (no localStorage)
      resetAttempt(topicId);
      resetQuestionStatuses(topicId);
      
      resetGame();
      
      // Navegar directamente al juego sin delay
      const timestamp = Date.now();
      navigate(`/game/${topicId}?difficulty=${difficulty}&fresh=true&key=${timestamp}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isPerfectScore = percentage === 100;

  // Check for new achievements when results are loaded
  useEffect(() => {
    const checkAchievements = async () => {
      try {
        await checkForNewAchievements(undefined);
      } catch (error) {
        console.error('Error checking achievements in Results:', error);
      }
    };
    
    // Small delay to ensure all context data is loaded
    const timer = setTimeout(checkAchievements, 1000);
    return () => clearTimeout(timer);
  }, [checkForNewAchievements, percentage, isPerfectScore]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardBody>
          <div className="text-center mb-6">
            {isPerfectScore && (
              <Trophy 
                className="h-16 w-16 text-yellow-500 mx-auto mb-4" 
                aria-hidden="true"
              />
            )}
            <h1 
              className="text-3xl font-bold mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
              tabIndex={0}
              role="heading"
              aria-level={1}
            >
              {topic.title} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Results
            </h1>
            {isPerfectScore && (
              <p 
                className="text-green-600 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                tabIndex={0}
                role="text"
              >
                ¡Perfecto! Nivel Completado
              </p>
            )}
          </div>
          
          <div className="text-center mb-8">
            <div 
              className="text-6xl font-bold mb-2 text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
              tabIndex={0}
              role="text"
              aria-label={`Score: ${currentScore.correct} out of ${currentScore.total} correct answers`}
            >
              {currentScore.correct} / {currentScore.total}
            </div>
            <div 
              className="text-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
              tabIndex={0}
              role="text"
              aria-label={`Percentage: ${percentage} percent correct`}
            >
              {percentage}% Correct
            </div>
          </div>

          <ProgressBar
            value={percentage}
            max={100}
            size="lg"
            color={percentage === 100 ? 'success' : percentage >= 70 ? 'warning' : 'error'}
            showPercentage
            className="mb-8"
          />

          {/* Status Message */}
          <div className="text-center mb-8">
            <div 
              className={`p-4 rounded-lg ${isPerfectScore ? 'bg-green-100' : 'bg-blue-100'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              tabIndex={0}
              role="region"
              aria-label="Status message about your performance"
            >
              <p className={`font-medium ${isPerfectScore ? 'text-green-800' : 'text-blue-800'}`}>
                {isPerfectScore 
                  ? "¡Excelente! Has dominado completamente este nivel."
                  : percentage >= 80
                  ? "¡Muy bien! Casi perfecto. Necesitas 100% para desbloquear el siguiente nivel."
                  : percentage >= 50
                  ? "Buen intento. Sigue practicando para alcanzar el 100%."
                  : "Sigue practicando. Puedes intentarlo de nuevo hasta conseguir el 100%."}
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              variant="custom"
              onClick={handleTryAgain}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              tabIndex={0}
              aria-label="Intentar el juego de nuevo"
            >
              <RefreshCw className="w-5 h-5 mr-2" aria-hidden="true" />
              Try Again
            </Button> 
            <Button
              variant="outline"
              onClick={() => navigate('/topics')}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              tabIndex={0}
              aria-label="Volver a la página de temas"
            >
              <Home className="w-5 h-5 mr-2" aria-hidden="true" />
              Back to Topics
            </Button>
          </div>
        </CardBody>
      </Card>

      {!isLoadingAttempts && backendAttempts.length > 0 && (
        <Card>
          <CardBody>
            <h2 
              className="text-2xl font-bold mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
              tabIndex={0}
              role="heading"
              aria-level={2}
            >
              My Attempts
              {backendAttempts.length > 5 && (
                <span 
                  className="text-sm font-normal text-gray-500 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  tabIndex={0}
                  role="text"
                >
                  ({backendAttempts.length} total - scroll to see all)
                </span>
              )}
            </h2>
            <div className="relative">
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {backendAttempts.map((attempt, index) => {
                // Encontrar el porcentaje más alto para destacar el mejor intento
                const bestPercentage = Math.max(...backendAttempts.map(a => a.percentage));
                const isBestAttempt = attempt.percentage === bestPercentage;
                
                return (
                  <div
                    key={attempt._id}
                    className={`flex items-center justify-between p-4 rounded-lg relative ${
                      isBestAttempt 
                        ? 'bg-green-50 border-2 border-green-200' 
                        : 'bg-gray-50'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    tabIndex={0}
                    role="region"
                    aria-label={`Attempt ${backendAttempts.length - index}: ${attempt.correct} out of ${attempt.total} correct, ${attempt.percentage} percent${isBestAttempt ? ' - Best attempt' : ''}`}
                  >
                    {isBestAttempt && (
                      <div className="absolute top-2 right-2">
                        <Trophy className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                      </div>
                    )}
                    <div>
                      <div 
                        className={`font-semibold ${isBestAttempt ? 'text-green-800' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1`}
                        tabIndex={0}
                        role="text"
                      >
                        Attempt #{backendAttempts.length - index}
                        {isBestAttempt && (
                          <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            BEST
                          </span>
                        )}
                      </div>
                      <div 
                        className="text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                        tabIndex={0}
                        role="text"
                      >
                        {formatDate(attempt.completedAt)}
                      </div>
                      {attempt.timeSpent > 0 && (
                        <div 
                          className="text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                          tabIndex={0}
                          role="text"
                        >
                          Time: {Math.round(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                        </div>
                      )}
                      {attempt.hintsUsed > 0 && (
                        <div 
                          className="text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                          tabIndex={0}
                          role="text"
                        >
                          Hints used: {attempt.hintsUsed}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div 
                        className={`text-lg font-bold ${isBestAttempt ? 'text-green-700' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1`}
                        tabIndex={0}
                        role="text"
                      >
                        {attempt.correct} / {attempt.total}
                      </div>
                      <div 
                        className={`text-sm ${isBestAttempt ? 'text-green-600' : 'text-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1`}
                        tabIndex={0}
                        role="text"
                      >
                        {attempt.percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
              {/* Gradient indicator at bottom when scrollable */}
              {backendAttempts.length > 5 && (
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {isLoadingAttempts && (
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <div 
                className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                tabIndex={0}
                role="text"
              >
                Loading attempts...
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Results;