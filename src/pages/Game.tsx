import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Lightbulb, Volume2, VolumeX, RefreshCw, Home, 
  ChevronRight, CheckCircle, XCircle, Play, Pause, Trophy
} from 'lucide-react';
import Button from '../components/UI/Button';
import IconButton from '../components/UI/IconButton';
import ProgressBar from '../components/UI/ProgressBar';
import QuestionNavigator from '../components/UI/QuestionNavigator';
import { grammarTopics } from '../data/grammarTopics';
import { 
  presentTensesQuestions, 
  pastTensesQuestions, 
  conditionalsQuestions,
  prepositionsQuestions,
  articlesQuestions,
  modalVerbsQuestions 
} from '../data/sampleQuestions';
import { QuestionType } from '../types';
import { useProgress } from '../contexts/ProgressContext';
import { useQuestionStatus } from '../contexts/QuestionStatusContext';
import { useAttempt } from '../contexts/AttemptContext';
import { useAudio } from '../contexts/AudioContext';
import { useGameProgress } from '../contexts/GameProgressContext';
import { useAchievements } from '../contexts/AchievementContext';
import AchievementToastManager from '../components/UI/AchievementToastManager';
import { toast } from 'react-toastify';

// Importar todas las imágenes
const images = import.meta.glob('../assets/questions/**/*.png', { eager: true });

// Función para obtener la imagen
const getImage = (imagePath: string) => {
  const path = `../assets/${imagePath}`;
  return images[path] as { default: string } | undefined;
};

const HintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 45 46" fill="none" className="mr-2">
    <path d="M11.2499 2.375V6.125H16.8749V12.5L7.70615 8.7125L2.68115 20.825L13.0687 25.1375L22.3874 32.0375L25.8561 33.4813L33.0374 16.1563L29.5687 14.7125L20.6249 13.3812V6.125H26.2499V2.375H11.2499ZM40.8937 12.2937L36.5624 14.0938L37.9874 17.5625L42.3186 15.7625L40.8937 12.2937ZM37.0874 25.9437L35.6249 29.4125L40.8562 31.5687L42.2811 28.1L37.0874 25.9437ZM30.3562 35.9938L26.8874 37.4188L28.6874 41.75L32.1561 40.3062L30.3562 35.9938Z" fill="currentColor"/>
  </svg>
);

const Game: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const difficulty = (searchParams.get('difficulty') as 'easy' | 'medium' | 'hard') || 'easy';
  
  const { setProgress, getLastQuestionIndex, setLastQuestionIndex } = useProgress();
  const { updateQuestionStatus, getQuestionStatus, resetQuestionStatuses } = useQuestionStatus();
  const { 
    getCurrentAttempt, 
    startNewAttempt, 
    submitAnswer, 
    completeAttempt, 
    hasInProgressAttempt,
    recordHintUsage,
    getUsedHints
  } = useAttempt();
  const { playBackgroundMusic, stopBackgroundMusic } = useAudio();
  const { completeLevel, canAccessDifficulty } = useGameProgress();
  const { checkForNewAchievements } = useAchievements();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState<string>('');
  const [draggedAnswers, setDraggedAnswers] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timePerQuestion, setTimePerQuestion] = useState<Record<number, number>>({});
  const [hintsPerQuestion, setHintsPerQuestion] = useState<Record<number, number>>({});
  const [isFreshRestart, setIsFreshRestart] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const topic = grammarTopics.find(t => t.id === topicId);
  
  // Get questions based on topic ID
  const getQuestions = (): QuestionType[] => {
    switch (topicId) {
      case 'present-tenses':
        return presentTensesQuestions;
      case 'past-tenses':
        return pastTensesQuestions;
      case 'conditionals':
        return conditionalsQuestions;
      case 'prepositions':
        return prepositionsQuestions;
      case 'articles':
        return articlesQuestions;
      case 'modal-verbs':
        return modalVerbsQuestions;
      default:
        return presentTensesQuestions; // Default to present tenses questions
    }
  };
  
  const questions = getQuestions();
  const currentQuestion = questions[currentQuestionIndex];
  
  // Verificar acceso a la dificultad
  useEffect(() => {
    if (!canAccessDifficulty(difficulty)) {
      toast.error(`No tienes acceso a la dificultad ${difficulty}. Completa los niveles anteriores primero.`);
      navigate('/topics');
    }
  }, [difficulty, canAccessDifficulty, navigate]);
  
  // Detectar fresh restart al montar el componente
  useEffect(() => {
    const isFreshStart = searchParams.get('fresh') === 'true';
    setIsFreshRestart(isFreshStart);
  }, []);

  // Initialize attempt if needed
  useEffect(() => {
    if (topicId) {
      const isFreshStart = searchParams.get('fresh') === 'true';
      if (!hasInProgressAttempt(topicId) || isFreshStart) {
        // Reset all states for a new attempt
        resetQuestionStatuses(topicId);
        startNewAttempt(topicId);
        setCurrentQuestionIndex(0);
        setScore(0);
        setAttempts(0);
        setShowHint(false);
        setIsAnswerSubmitted(false);
        setSelectedAnswer(null);
        setWrittenAnswer('');
        setDraggedAnswers([]);
        setIsPlaying(false);
        setTimePerQuestion({});
        setHintsPerQuestion({});
        setQuestionStartTime(Date.now());
        setIsGameCompleted(false);
        setShowFeedback(false);
        setIsCorrect(false);

        // Limpiar el parámetro fresh del URL si está presente
        if (isFreshStart) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('fresh');
          const newURL = newSearchParams.toString() 
            ? `${window.location.pathname}?${newSearchParams.toString()}`
            : window.location.pathname;
          window.history.replaceState({}, '', newURL);
          setIsFreshRestart(false); // Reset the flag after cleaning
        }

        // Check for achievements when starting a new game (attempts-based achievements)
        setTimeout(() => {
          checkForNewAchievements(undefined).catch(error => {
            console.error('Error checking achievements at game start:', error);
          });
        }, 1000); // Dar más tiempo para que se inicialice el contexto
      }
    }
  }, [topicId, searchParams]);

  // Load attempt state
  useEffect(() => {
    if (topicId && !isFreshRestart) {
      // Solo restaurar estado si NO es un fresh restart
      const attempt = getCurrentAttempt(topicId);
      if (attempt) {
        // Restore answers and hints
        Object.entries(attempt.answers).forEach(([index, answer]) => {
          const questionIndex = parseInt(index);
          if (answer === questions[questionIndex].correctAnswer) {
            updateQuestionStatus(topicId, questionIndex, 'correct');
          } else {
            updateQuestionStatus(topicId, questionIndex, 'incorrect');
          }
        });

        // Set current question to first unanswered question
        const firstUnansweredIndex = questions.findIndex((_, index) => !attempt.answers[index]);
        if (firstUnansweredIndex !== -1) {
          setCurrentQuestionIndex(firstUnansweredIndex);
        }

        // Restore hint states
        const usedHints = getUsedHints(topicId);
        if (usedHints.includes(currentQuestionIndex)) {
          setShowHint(true);
        }
      }
    }
  }, [topicId, isFreshRestart, questions]);
  
  // Función para mezclar las opciones
  const shuffleOptions = (options: string[]) => {
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Efecto para mezclar las opciones cuando cambia la pregunta
  useEffect(() => {
    if (currentQuestion && currentQuestion.options && !currentQuestion.isFillInTheBlank) {
      setShuffledOptions(shuffleOptions(currentQuestion.options));
    }
  }, [currentQuestion]);
  
  // Check if two attempts have been made to show hint automatically
  useEffect(() => {
    if (attempts >= 2 && !showHint && !isAnswerSubmitted) {
      setShowHint(true);
    }
  }, [attempts, showHint, isAnswerSubmitted]);

  // Actualizar tiempo cuando cambia la pregunta
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  // Registrar tiempo cuando se responde una pregunta
  const recordQuestionTime = () => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000); // Convertir a segundos
    setTimePerQuestion(prev => ({
      ...prev,
      [currentQuestionIndex]: timeSpent
    }));
  };

  const handleQuestionSelect = (index: number) => {
    if (index !== currentQuestionIndex) {
      setCurrentQuestionIndex(index);
      // If the question has already been answered, only allow viewing
      const status = getQuestionStatus(topicId!, index);
      if (status === 'unanswered') {
        setSelectedAnswer(null);
        setWrittenAnswer('');
        setDraggedAnswers([]);
        setIsAnswerSubmitted(false);
        setShowHint(false);
        setAttempts(0);
      } else {
        // If already answered, maintain answer state
        setIsAnswerSubmitted(true);
        const attempt = getCurrentAttempt(topicId!);
        if (attempt) {
          setSelectedAnswer(attempt.answers[index] || null);
          setWrittenAnswer(attempt.answers[index] || '');
          setDraggedAnswers(attempt.answers[index] ? attempt.answers[index].split(', ') : []);
          setIsCorrect(status === 'correct');
        }
      }
    }
  };
  
  // Registrar uso de pista
  const handleShowHint = () => {
    setShowHint(true);
    recordHintUsage(topicId!, currentQuestionIndex);
    setHintsPerQuestion(prev => ({
      ...prev,
      [currentQuestionIndex]: (prev[currentQuestionIndex] || 0) + 1
    }));

    // Check for hint-related achievements
    checkForNewAchievements(undefined).catch(error => {
      console.error('Error checking achievements after hint usage:', error);
    });
  };
  
  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerSubmitted && topicId) {
      setSelectedAnswer(answer);
      setIsAnswerSubmitted(true);
      
      const isAnswerCorrect = answer === currentQuestion.correctAnswer;
      setIsCorrect(isAnswerCorrect);
      
      if (isAnswerCorrect) {
        setScore(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'correct');
      } else {
        setAttempts(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'incorrect');
      }

      // Save answer to attempt
      submitAnswer(topicId, currentQuestionIndex, answer);

      // Update progress with current score
      const nextQuestionIndex = currentQuestionIndex + 1;
      const newScore = score + (isAnswerCorrect ? 1 : 0);
      setProgress(topicId, newScore, questions.length);
      setLastQuestionIndex(topicId, nextQuestionIndex);

      // Check for achievements after each answer
      checkForNewAchievements(undefined).catch(error => {
        console.error('Error checking achievements after answer:', error);
      });
    }
  };

  const handleWrittenAnswerSubmit = () => {
    if (!isAnswerSubmitted && topicId && writtenAnswer.trim()) {
      setIsAnswerSubmitted(true);
      
      const correctAnswer = Array.isArray(currentQuestion.correctAnswer) 
        ? currentQuestion.correctAnswer[0] 
        : currentQuestion.correctAnswer;
      
      const isAnswerCorrect = writtenAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
      setIsCorrect(isAnswerCorrect);
      
      if (isAnswerCorrect) {
        setScore(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'correct');
      } else {
        setAttempts(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'incorrect');
      }

      // Save answer to attempt
      submitAnswer(topicId, currentQuestionIndex, writtenAnswer.trim());

      // Update progress with current score
      const nextQuestionIndex = currentQuestionIndex + 1;
      const newScore = score + (isAnswerCorrect ? 1 : 0);
      setProgress(topicId, newScore, questions.length);
      setLastQuestionIndex(topicId, nextQuestionIndex);

      // Check for achievements after each answer
      checkForNewAchievements(undefined).catch(error => {
        console.error('Error checking achievements after answer:', error);
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, option: string) => {
    e.dataTransfer.setData('text/plain', option);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const draggedOption = e.dataTransfer.getData('text/plain');
    
    setDraggedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[dropIndex] = draggedOption;
      return newAnswers;
    });
  };

  const handleDragAndDropSubmit = () => {
    if (!isAnswerSubmitted && topicId && draggedAnswers.length > 0) {
      setIsAnswerSubmitted(true);
      
      const correctAnswer = currentQuestion.correctAnswer;
      const isAnswerCorrect = Array.isArray(correctAnswer) 
        ? JSON.stringify(draggedAnswers) === JSON.stringify(correctAnswer)
        : draggedAnswers[0] === correctAnswer;
      
      setIsCorrect(isAnswerCorrect);
      
      if (isAnswerCorrect) {
        setScore(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'correct');
      } else {
        setAttempts(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'incorrect');
      }

      // Save answer to attempt
      submitAnswer(topicId, currentQuestionIndex, draggedAnswers.join(', '));

      // Update progress with current score
      const nextQuestionIndex = currentQuestionIndex + 1;
      const newScore = score + (isAnswerCorrect ? 1 : 0);
      setProgress(topicId, newScore, questions.length);
      setLastQuestionIndex(topicId, nextQuestionIndex);

      // Check for achievements after each answer
      checkForNewAchievements(undefined).catch(error => {
        console.error('Error checking achievements after answer:', error);
      });
    }
  };
  
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;
    
    setIsAnswerSubmitted(true);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setIsCorrect(true);
    } else {
      setAttempts(attempts + 1);
      setIsCorrect(false);
    }
  };
  
  const handleNextQuestion = async () => {
    const answeredQuestions = questions.filter((_, index) => getQuestionStatus(topicId!, index) !== 'unanswered').length;
    
    // Registrar tiempo de la pregunta actual antes de continuar
    recordQuestionTime();
    
    if (answeredQuestions === questions.length) {
      // Si todas las preguntas están respondidas, completar el intento
      if (topicId) {
        completeAttempt(topicId, score, questions.length);
        
        // Obtener detalles de las preguntas
        const questionsDetails = questions.map((question, index) => {
          const attempt = getCurrentAttempt(topicId);
          const answer = attempt?.answers[index] || '';
          const correctAnswer = Array.isArray(question.correctAnswer) 
            ? question.correctAnswer.join(', ') 
            : question.correctAnswer;
          const isCorrect = answer === correctAnswer;
          
          return {
            questionId: `q${index + 1}`,
            userAnswer: answer,
            correctAnswer,
            isCorrect,
            timeSpent: timePerQuestion[index] || 0,
            hintsUsed: hintsPerQuestion[index] || 0
          };
        });

        // Calcular totales
        const totalTimeSpent = Object.values(timePerQuestion).reduce((sum, time) => sum + time, 0);
        const totalHintsUsed = Object.values(hintsPerQuestion).reduce((sum, hints) => sum + hints, 0);
        
        // Guardar progreso en el backend
        try {
          // Asegurar que los datos sean del tipo correcto
          const totalTimeSpentInt = Math.round(totalTimeSpent);
          const totalHintsUsedInt = Math.round(totalHintsUsed);
          
          const result = await completeLevel(
            topicId, 
            difficulty, 
            score, 
            questions.length, 
            {
              timeSpent: totalTimeSpentInt,
              hintsUsed: totalHintsUsedInt,
              questionsDetails: questionsDetails.map(q => ({
                ...q,
                timeSpent: Math.round(q.timeSpent || 0),
                hintsUsed: Math.round(q.hintsUsed || 0)
              }))
            }
          );

          if (result.success) {
            const percentage = Math.round((score / questions.length) * 100);
            if (result.newUnlocks && result.newUnlocks.length > 0) {
              toast.success(`¡Progreso guardado! Has desbloqueado: ${result.newUnlocks.join(', ').toUpperCase()}`, {
                position: "top-center",
                autoClose: 4000
              });
            } else if (percentage === 100) {
              toast.success('¡Perfecto! Nivel completado al 100%', {
                position: "top-center",
                autoClose: 2000
              });
            } else {
              toast.success('Progress saved successfully!', {
                position: "top-center",
                autoClose: 2000
              });
            }

            // Check for new achievements after completing a level
            console.log('🏆 Checking for achievements after level completion...');
            try {
              const newAchievements = await checkForNewAchievements(undefined);
              console.log('🏆 New achievements found:', newAchievements.length);
              if (newAchievements.length > 0) {
                console.log('🏆 Achievement names:', newAchievements.map(a => a.name));
              }
            } catch (error) {
              console.error('Error checking achievements after level completion:', error);
            }
          }
        } catch (error) {
          console.error('Error saving progress:', error);
          toast.error('Failed to save progress, but game completed locally');
        }
      }
      setIsGameCompleted(true);
    } else if (currentQuestionIndex < questions.length - 1) {
      // Si no es la última pregunta, ir a la siguiente
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setWrittenAnswer('');
      setDraggedAnswers([]);
      setIsAnswerSubmitted(false);
      setShowHint(false);
      setAttempts(0);
    }
  };
  
  const handleRestartGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setWrittenAnswer('');
    setDraggedAnswers([]);
    setIsAnswerSubmitted(false);
    setScore(0);
    setShowHint(false);
    setAttempts(0);
    setIsGameCompleted(false);
  };
  
  // Efecto para manejar la reproducción de música
  useEffect(() => {
    if (isPlaying) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }, [isPlaying]);

  // Efecto para manejar la reproducción de audio de la pregunta
  useEffect(() => {
    if (currentQuestion?.audio) {
      // Detener y limpiar el audio anterior si existe
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Crear nuevo elemento de audio
      const audio = new Audio();
      audio.src = currentQuestion.audio;
      audio.volume = 0.7;
      
      // Agregar manejadores de eventos
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Error loading audio:', e);
        setIsPlaying(false);
      });
      
      audioRef.current = audio;

      // Limpiar al desmontar
      return () => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          audio.removeEventListener('ended', () => {});
          audio.removeEventListener('error', () => {});
        }
      };
    }
  }, [currentQuestion]);

  // Efecto para manejar el estado de reproducción
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (currentQuestion?.audio) {
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };
  
  if (!topic || !currentQuestion) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Topic not found</h2>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }
  
  // Render the game completion screen
  if (isGameCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfectScore = percentage === 100; // Solo 100% es "completado"
    
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Achievement Manager for completion screen */}
        <AchievementToastManager enabled={true} />
        
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8 animate-slide-up">
            <div className="text-center mb-6">
              {isPerfectScore ? (
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              ) : (
                <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
              )}
              <h1 className="text-3xl font-bold mb-2">
                {isPerfectScore ? 'Perfect! Level Completed!' : 'Level Attempted!'}
              </h1>
              <p className="text-gray-600">
                {topic?.title} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </p>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-6xl font-bold mb-2 text-primary">{score}/{questions.length}</div>
              <ProgressBar 
                value={percentage} 
                max={100}
                size="lg"
                color={percentage === 100 ? 'success' : percentage >= 70 ? 'warning' : 'error'}
                className="mb-2"
              />
              <p className="text-lg">{percentage}% Correct</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold mb-2">Performance Summary:</h3>
              <p>
                {isPerfectScore 
                  ? "Excellent work! Perfect score. You've completely mastered this level." 
                  : percentage >= 80 
                  ? "Very good! Almost perfect. You need 100% to unlock the next level." 
                  : percentage >= 50
                  ? "Nice try. Keep practicing to reach 100%."
                  : "Keep practicing. You can try again until you get 100%."}
              </p>
              <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                <p className="text-blue-800 font-medium">
                  ✨ ¡Progreso guardado exitosamente!
                </p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={handleRestartGame}
                className="h-[40px] w-[225px] border-2 border-black flex items-center justify-center"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/topics')}
                className="h-[40px] w-[225px] bg-[rgb(var(--color-button))] hover:bg-[rgb(var(--color-button))/0.8] text-white border-[2px] border-solid border-[#000000] flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2 text-white" />
                BACK TO TOPICS
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Achievement Manager */}
      <AchievementToastManager enabled={true} />
      
      {/* Game Content */}
      <div className="flex-grow container-custom py-8">
        <div className="max-w-3xl mx-auto">
          {/* Topic Title */}
          <h1 className="text-3xl font-bold text-center mb-8">{topic.title}</h1>
          
          {/* Question Card */}
          <div className="bg-[rgb(var(--color-background-card))] rounded-xl shadow-md p-6 mb-6">
            {/* Navigation and Progress */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <IconButton
                  icon={<ArrowLeft />}
                  variant="ghost"
                  onClick={() => {
                    navigate('/topics');
                  }}
                  tooltip="Back to Topics"
                  aria-label="Back to Topics"
                  className="flex items-center"
                />
                <span className="text-[#000] font-['Poppins'] text-[18px] italic font-[275] leading-normal capitalize ml-2 flex items-center mt-1">Back to Topics</span>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="flex justify-between items-center mb-2">
                </div>
              </div>
            </div>

            {/* Question Navigator */}
            <QuestionNavigator
              topicId={topicId!}
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              className="mb-4"
            />

            {/* Progress Bar */}
            <div className="mb-6">
              {(() => {
                const answeredQuestions = questions.filter((_, index) => getQuestionStatus(topicId!, index) !== 'unanswered').length;
                const percentage = Math.round((answeredQuestions / questions.length) * 100);
                
                return (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        {answeredQuestions} of {questions.length} questions answered
                      </span>
                      <span className="text-sm font-medium">
                        {percentage}% Completed
                      </span>
                    </div>
                    <ProgressBar 
                      value={answeredQuestions} 
                      max={questions.length}
                      size="md"
                      color="primary"
                      className="transition-all duration-300"
                    />
                  </>
                );
              })()}
            </div>
            
            {/* Question and Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex-1">{currentQuestion.text}</h2>
                <div className="flex items-center gap-2 ml-4">
                  <IconButton
                    icon={soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    onClick={toggleSound}
                    tooltip={soundEnabled ? "Mute Sound" : "Unmute Sound"}
                    aria-label={soundEnabled ? "Mute Sound" : "Unmute Sound"}
                    variant="ghost"
                  />
                  {currentQuestion?.audio && (
                    <IconButton
                      icon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      onClick={togglePlayPause}
                      tooltip={isPlaying ? "Stop Audio" : "Play Audio"}
                      aria-label={isPlaying ? "Stop Audio" : "Play Audio"}
                      variant="ghost"
                    />
                  )}
                </div>
              </div>

              {/* Question Image */}
              {currentQuestion.image && (
                <div className="flex justify-center mb-6">
                  <img 
                    src={getImage(currentQuestion.image)?.default}
                    alt={currentQuestion.alt || "Question illustration"}
                    className="rounded-lg shadow-md"
                    style={{
                      width: '300px',
                      height: '300px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      console.error('Error loading image:', currentQuestion.image);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Options, Text Input, or Drag and Drop */}
              {currentQuestion.isFillInTheBlank ? (
                <div className="mb-6">
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      value={writtenAnswer}
                      onChange={(e) => setWrittenAnswer(e.target.value)}
                      placeholder="Escribe tu respuesta aquí..."
                      className="p-4 border-2 border-gray-200 rounded-lg focus:border-[rgb(var(--color-primary))] focus:outline-none transition-all duration-300"
                      disabled={isAnswerSubmitted}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isAnswerSubmitted && writtenAnswer.trim()) {
                          handleWrittenAnswerSubmit();
                        }
                      }}
                    />
                    {!isAnswerSubmitted && (
                      <Button
                        onClick={handleWrittenAnswerSubmit}
                        disabled={!writtenAnswer.trim()}
                        className="ml-auto h-[40px] w-[225px] bg-[rgb(var(--color-button))] hover:bg-[rgb(var(--color-button))/0.8] text-white border-[2px] border-solid border-[#000000]"
                      >
                        Enviar Respuesta
                      </Button>
                    )}
                  </div>
                </div>
              ) : currentQuestion.isDragAndDrop ? (
                <div className="mb-6">
                  <div className="space-y-6">
                    {/* Drag and Drop Area */}
                    <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-600 mb-2">Drag the words into the blank spaces</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {(() => {
                            const textParts = currentQuestion.text.split('______');
                            const blanks = textParts.length - 1;
                            
                            return textParts.map((part, index) => (
                              <React.Fragment key={index}>
                                <span className="text-lg">{part}</span>
                                {index < textParts.length - 1 && (
                                  <div
                                    className="inline-block w-32 h-10 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-white"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, index)}
                                  >
                                    {draggedAnswers[index] ? (
                                      <span className="text-sm font-medium text-gray-700">{draggedAnswers[index]}</span>
                                    ) : (
                                      <span className="text-xs text-gray-400">Soltar aquí</span>
                                    )}
                                  </div>
                                )}
                              </React.Fragment>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Drag Options */}
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-3">Available options:</p>
                      <div className="flex flex-wrap gap-3">
                        {currentQuestion.dragOptions?.map((option, index) => {
                          const isUsed = draggedAnswers.includes(option);
                          const usedCount = draggedAnswers.filter(answer => answer === option).length;
                          const availableCount = currentQuestion.dragOptions?.filter(opt => opt === option).length || 0;
                          const isAvailable = !isUsed || usedCount < availableCount;
                          
                          return (
                            <div
                              key={`${option}-${index}`}
                              draggable={isAvailable && !isAnswerSubmitted}
                              onDragStart={(e) => handleDragStart(e, option)}
                              className={`px-4 py-2 rounded-lg border-2 cursor-move transition-all ${
                                isAvailable && !isAnswerSubmitted
                                  ? 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
                                  : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                              }`}
                            >
                              <span className="text-sm font-medium">{option}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    {!isAnswerSubmitted && (
                      <div className="flex justify-center">
                        <Button
                          onClick={handleDragAndDropSubmit}
                          disabled={draggedAnswers.length === 0}
                          className="h-[40px] w-[225px] bg-[rgb(var(--color-button))] hover:bg-[rgb(var(--color-button))/0.8] text-white border-[2px] border-solid border-[#000000]"
                        >
                          Verificar Respuesta
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {shuffledOptions.map((option, index) => {
                    const isCorrect = option === currentQuestion.correctAnswer;
                    const isSelected = option === selectedAnswer;
                    
                    let optionClass = "p-4 rounded-lg border-2 transition-all duration-300 flex justify-center items-center";
                    
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        optionClass += " border-[rgb(var(--color-correct-option))] bg-[rgb(var(--color-correct-option)/0.1)] text-[rgb(var(--color-correct-option))]";
                      } else if (isSelected) {
                        optionClass += " border-[rgb(var(--color-incorrect-option))] bg-[rgb(var(--color-incorrect-option)/0.45)] text-[rgb(var(--color-incorrect-option))]";
                      } else {
                        optionClass += " border-gray-200 opacity-60";
                      }
                    } else {
                      optionClass += isSelected 
                        ? " border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary)/0.1)]" 
                        : " border-gray-200 hover:border-[rgb(var(--color-primary)/0.5)]";
                    }
                    
                    return (
                      <button
                        key={index}
                        className={optionClass}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={isAnswerSubmitted}
                        style={{ height: '40px' }}
                      >
                        <span className="text-center">{option}</span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle className="h-5 w-5 text-success ml-2" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="h-5 w-5 text-error ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              
              {/* Hint Section */}
              {showHint && (
                <div className="mt-4 p-4 rounded-lg bg-[rgb(var(--color-background-hint))] border-2 border-black">
                  <div className="flex items-center gap-2 mb-2">
                    <HintIcon />
                    <span className="font-medium">Hint:</span>
                  </div>
                  <p>{currentQuestion.hint}</p>
                </div>
              )}
              
              {/* Explanation (shown after answer is submitted) */}
              {isAnswerSubmitted && (
                <div className="space-y-4">
                  <div className={`bg-${isCorrect ? 'success' : 'error'}/10 border border-${isCorrect ? 'success' : 'error'}/30 p-4 rounded-lg`}>
                    <h3 className={`font-bold text-${isCorrect ? 'success' : 'error'} mb-2`}>
                      {isCorrect ? '¡Correct!' : "It's incorrect"}
                    </h3>
                    {currentQuestion.isFillInTheBlank && !isCorrect && (
                      <p className="mb-2">
                        <strong>Your answer:</strong> {writtenAnswer.trim()}<br/>
                        <strong>Correct answer:</strong> {Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer[0] : currentQuestion.correctAnswer}
                      </p>
                    )}
                    {currentQuestion.isDragAndDrop && !isCorrect && (
                      <p className="mb-2">
                        <strong>Your answer:</strong> {draggedAnswers.join(', ')}<br/>
                        <strong>Correct answer:</strong> {Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.join(', ') : currentQuestion.correctAnswer}
                      </p>
                    )}
                    <p>{currentQuestion.explanation}</p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="custom"
                      icon={<ChevronRight className="text-white" />}
                      iconPosition="right"
                      onClick={handleNextQuestion}
                      className="h-[40px] w-[225px] bg-[rgb(var(--color-button))] hover:bg-[#183AB0] text-white border-[2px] border-solid border-white"
                    >
                      {(() => {
                        const answeredQuestions = questions.filter((_, index) => getQuestionStatus(topicId!, index) !== 'unanswered').length;
                        return answeredQuestions === questions.length ? 'See results' : 'Next Question';
                      })()}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <div>
                  {!showHint && !isAnswerSubmitted && (
                    <Button
                      variant="outline"
                      onClick={handleShowHint}
                      className="bg-[rgb(var(--color-background-hint))] hover:bg-[rgb(var(--color-background-hint))/0.8] text-text border-2 border-black w-[323px]"
                      style={{ height: '40px', width: '225px' }}
                    >
                      <HintIcon />
                      {showHint ? 'Hide Hint' : 'Show hint'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;