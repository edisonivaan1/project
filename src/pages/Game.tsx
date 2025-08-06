import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, VolumeX, RefreshCw, Home, 
  ChevronRight, CheckCircle, XCircle, Play, Pause, Trophy,
  AudioLines
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
import { useGameProgress } from '../contexts/GameProgressContext';
import { useQuestionStatus } from '../contexts/QuestionStatusContext';
import { useAttempt } from '../contexts/AttemptContext';
import { useAudio } from '../contexts/AudioContext';
import { useAchievements } from '../contexts/AchievementContext';
import AchievementToastManager from '../components/UI/AchievementToastManager';
import { inProgressAttemptService } from '../services/api';
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

// Icono simple de play para audio de pregunta
const QuestionAudioIcon = ({ className = "", isPlaying = false }: { className?: string; isPlaying?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    {!isPlaying ? (
      // Icono de play simple
        <path d="M8 5v14l11-7z" fill="currentColor" />
    ) : (
      // Icono de pausa para cuando está reproduciéndose
      <>
        <rect x="6" y="4" width="4" height="16" fill="currentColor" />
        <rect x="14" y="4" width="4" height="16" fill="currentColor" />
      </>
    )}
  </svg>
);

const QuestionAudioIconDisabled = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 5v14l11-7z" fill="currentColor" opacity="0.3" />
    <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Game: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const difficulty = (searchParams.get('difficulty') as 'easy' | 'medium' | 'hard') || 'easy';
  
  const { completeLevel, canAccessDifficulty } = useGameProgress();
  const { updateQuestionStatus, getQuestionStatus, resetQuestionStatuses } = useQuestionStatus();
  const { 
    getCurrentAttempt, 
    startNewAttempt, 
    submitAnswer, 
    completeAttempt, 
    hasInProgressAttempt,
    recordHintUsage,
    loadInProgressAttempt,
    resetAttempt
  } = useAttempt();
  const { playSoundEffect, isSoundEffectsEnabled, isMusicEnabled, toggleMusic, isUserAuthenticated } = useAudio();
  const { checkForNewAchievements } = useAchievements();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState<string>('');
  const [draggedAnswers, setDraggedAnswers] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timePerQuestion, setTimePerQuestion] = useState<Record<number, number>>({});
  const [hintsPerQuestion, setHintsPerQuestion] = useState<Record<number, number>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Estados para accesibilidad del drag and drop
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null); // Índice de palabra seleccionada de la lista de opciones
  const [selectedSpaceIndex, setSelectedSpaceIndex] = useState<number | null>(null); // Índice del espacio seleccionado en la oración
  const [accessibilityAnnouncement, setAccessibilityAnnouncement] = useState<string>(''); // Mensajes para lectores de pantalla
  const [isKeyboardMode, setIsKeyboardMode] = useState(false); // Indica si el usuario está usando navegación por teclado
  
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
  
  // Estado para controlar si se ha verificado el intento en progreso
  const [hasCheckedAttempt, setHasCheckedAttempt] = useState(false);
  const [isLoadingAttempt, setIsLoadingAttempt] = useState(true);
  
  // Verificar acceso a la dificultad SOLO después de verificar el intento en progreso
  useEffect(() => {
    if (hasCheckedAttempt && !canAccessDifficulty(difficulty)) {
      // Solo verificar si no hay un intento en progreso
      const checkInProgressAttempt = async () => {
        if (!topicId) return;
        
        try {
          const existingAttempt = await loadInProgressAttempt(topicId, difficulty);
          if (!existingAttempt) {
            // No hay intento en progreso y no tiene acceso, redirigir
            toast.error(`You don't have access to ${difficulty} difficulty. Complete previous levels first.`);
      navigate('/topics');
    }
        } catch (error) {
          console.error('Error checking in-progress attempt:', error);
          // En caso de error, permitir que continúe (mejor UX)
        }
      };
      
      checkInProgressAttempt();
    }
  }, [difficulty, canAccessDifficulty, navigate, hasCheckedAttempt, topicId]);
  


  // Initialize attempt if needed
  useEffect(() => {
    const initializeAttempt = async () => {
      if (!topicId) return;

      const isFreshStart = searchParams.get('fresh') === 'true';
      
      // Si es un reinicio fresco, crear nuevo intento
      if (isFreshStart) {
        resetQuestionStatuses(topicId);
        await startNewAttempt(topicId, difficulty, questions.length);
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
        setIsCorrect(false);

        // Marcar que ya se verificó el intento en progreso
        setHasCheckedAttempt(true);
        setIsLoadingAttempt(false);

        // Limpiar el parámetro fresh del URL
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('fresh');
        const newURL = newSearchParams.toString() 
          ? `${window.location.pathname}?${newSearchParams.toString()}`
          : window.location.pathname;
        window.history.replaceState({}, '', newURL);

        return;
      }

      // Intentar cargar un intento en progreso desde el backend
      const existingAttempt = await loadInProgressAttempt(topicId, difficulty);
      
      // Marcar que ya se verificó el intento en progreso
      setHasCheckedAttempt(true);
      setIsLoadingAttempt(false);
      
      if (existingAttempt) {
        // Restaurar estado desde el backend
        console.log('🔄 Restaurando intento desde backend:', existingAttempt);
        
        // Calcular el puntaje actual basado en las respuestas guardadas
        let currentScore = 0;
        Object.entries(existingAttempt.answers).forEach(([index, answer]) => {
          const questionIndex = parseInt(index);
          if (questionIndex < questions.length) {
            const question = questions[questionIndex];
            const isCorrect = answer === question.correctAnswer;
            if (isCorrect) {
              currentScore++;
              updateQuestionStatus(topicId, questionIndex, 'correct');
            } else {
              updateQuestionStatus(topicId, questionIndex, 'incorrect');
            }
          }
        });

        setScore(currentScore);
        setTimePerQuestion(existingAttempt.timePerQuestion);
        setHintsPerQuestion(existingAttempt.hintsPerQuestion);

        // Encontrar la primera pregunta sin responder
        const firstUnansweredIndex = questions.findIndex((_, index) => 
          !existingAttempt.answers.hasOwnProperty(index.toString())
        );
        
        let targetQuestionIndex;
        if (firstUnansweredIndex !== -1) {
          // Ir a la primera pregunta sin responder
          targetQuestionIndex = firstUnansweredIndex;
        } else {
          // Todas las preguntas están respondidas, ir a la última
          targetQuestionIndex = questions.length - 1;
        }

        setCurrentQuestionIndex(targetQuestionIndex);

        // Configurar estado SOLO para la pregunta objetivo SI ya está respondida
        const targetAnswer = existingAttempt.answers ? existingAttempt.answers[targetQuestionIndex] : undefined;
        if (targetAnswer) {
          // Esta pregunta ya fue respondida, mostrar la respuesta
          setSelectedAnswer(targetAnswer);
          setWrittenAnswer(targetAnswer);
          setDraggedAnswers(targetAnswer.split(', '));
          setIsAnswerSubmitted(true);
          
          const isCorrect = targetAnswer === questions[targetQuestionIndex].correctAnswer;
          setIsCorrect(isCorrect);
        } else {
          // Esta pregunta NO está respondida, mantener estado limpio
          setSelectedAnswer(null);
          setWrittenAnswer('');
          setDraggedAnswers([]);
          setIsAnswerSubmitted(false);
          setIsCorrect(false);
        }

        console.log('✅ Estado restaurado desde backend');
      } else if (!hasInProgressAttempt(topicId)) {
        // No hay intento en progreso, crear uno nuevo
        // Marcar que ya se verificó el intento en progreso (en este punto sabemos que no hay)
        setHasCheckedAttempt(true);
        setIsLoadingAttempt(false);
        
        resetQuestionStatuses(topicId);
        await startNewAttempt(topicId, difficulty, questions.length);
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
        setIsCorrect(false);

        console.log('✨ Nuevo intento creado');
      }

      // Check for achievements when starting/resuming a game
      setTimeout(() => {
        checkForNewAchievements(undefined).catch(error => {
          console.error('Error checking achievements at game start:', error);
        });
      }, 1000);
    };

    initializeAttempt().catch(error => {
      console.error('Error initializing attempt:', error);
      // En caso de error, marcar como terminado el loading para evitar pantalla infinita
      setHasCheckedAttempt(true);
      setIsLoadingAttempt(false);
    });
  }, [topicId, difficulty, searchParams]);





  // Función para reproducir audio de feedback usando AudioContext
  const playFeedbackAudio = (isCorrect: boolean) => {
    if (!isSoundEffectsEnabled) return;
    playSoundEffect(isCorrect ? 'correct' : 'wrong');
  };

  // ==================== FUNCIONES DE ACCESIBILIDAD PARA DRAG AND DROP ====================
  
  /**
   * Anuncia mensajes a lectores de pantalla usando aria-live
   * @param message - Mensaje a anunciar
   */
  const announceToScreenReader = (message: string) => {
    setAccessibilityAnnouncement(message);
    setTimeout(() => setAccessibilityAnnouncement(''), 100);
  };

  /**
   * Selecciona una palabra de la lista de opciones disponibles
   * Se activa con Ctrl + número (1-3)
   * @param wordIndex - Índice de la palabra en dragOptions
   */
  const selectWordFromList = (wordIndex: number) => {
    if (!currentQuestion.dragOptions || wordIndex >= currentQuestion.dragOptions.length) return;
    
    const word = currentQuestion.dragOptions[wordIndex];
    
    // Verificar si la palabra ya está colocada en los espacios en blanco
    const isWordAlreadyUsed = draggedAnswers.includes(word);
    
    if (isWordAlreadyUsed) {
      announceToScreenReader(`The word "${word}" is already placed in a space.`);
      return;
    }
    
    setSelectedWordIndex(wordIndex);
    setSelectedSpaceIndex(null);
    announceToScreenReader(`Word "${word}" selected. Press 1 or 2 to place it in a space.`);
  };

  /**
   * Selecciona una palabra que ya está colocada en un espacio de la oración
   * Se activa con Shift + número (1-2)
   * @param spaceIndex - Índice del espacio en la oración
   */
  const selectWordFromSpace = (spaceIndex: number) => {
    const word = draggedAnswers[spaceIndex];
    if (!word) {
      announceToScreenReader(`Space ${spaceIndex + 1} is empty.`);
      return;
    }
    
    setSelectedSpaceIndex(spaceIndex);
    setSelectedWordIndex(null);
    announceToScreenReader(`Word "${word}" selected from space ${spaceIndex + 1}. Press 1 or 2 to move it.`);
  };

  /**
   * Coloca la palabra seleccionada en el espacio objetivo
   * Se activa con número solo (1-2) después de seleccionar una palabra
   * @param targetSpaceIndex - Índice del espacio donde colocar la palabra
   */
  const placeWordInSpace = (targetSpaceIndex: number) => {
    if (selectedWordIndex !== null && currentQuestion.dragOptions) {
      // Colocar palabra de la lista en un espacio
      const word = currentQuestion.dragOptions[selectedWordIndex];
      const newAnswers = [...draggedAnswers];
      
      if (newAnswers[targetSpaceIndex]) {
        announceToScreenReader(`Replacing "${newAnswers[targetSpaceIndex]}" with "${word}" in space ${targetSpaceIndex + 1}.`);
      } else {
        announceToScreenReader(`Placing "${word}" in space ${targetSpaceIndex + 1}.`);
      }
      
      newAnswers[targetSpaceIndex] = word;
      setDraggedAnswers(newAnswers);
      
      setSelectedWordIndex(null);
    } else if (selectedSpaceIndex !== null) {
      // Mover palabra de un espacio a otro
      const word = draggedAnswers[selectedSpaceIndex];
      const newAnswers = [...draggedAnswers];
      
      // Intercambiar palabras si el espacio de destino tiene una palabra
      if (newAnswers[targetSpaceIndex]) {
        const targetWord = newAnswers[targetSpaceIndex];
        newAnswers[selectedSpaceIndex] = targetWord;
        newAnswers[targetSpaceIndex] = word;
        announceToScreenReader(`Swapping "${word}" with "${targetWord}".`);
      } else {
        // Solo mover la palabra
        newAnswers[selectedSpaceIndex] = '';
        newAnswers[targetSpaceIndex] = word;
        announceToScreenReader(`Moving "${word}" to space ${targetSpaceIndex + 1}.`);
      }
      
      setDraggedAnswers(newAnswers);
      setSelectedSpaceIndex(null);
    }
  };

  /**
   * Elimina una palabra de un espacio específico
   * Se activa con Delete/Backspace cuando hay un espacio seleccionado
   * @param spaceIndex - Índice del espacio a limpiar
   */
  const clearSpace = (spaceIndex: number) => {
    const word = draggedAnswers[spaceIndex];
    if (word) {
      const newAnswers = [...draggedAnswers];
      newAnswers[spaceIndex] = '';
      setDraggedAnswers(newAnswers);
      announceToScreenReader(`Word "${word}" removed from space ${spaceIndex + 1}.`);
    }
  };

  // ==================== MANEJADOR DE EVENTOS DE TECLADO ====================
  useEffect(() => {
    /**
     * Maneja todos los eventos de teclado para accesibilidad y navegación
     * Combinaciones implementadas:
     * - Ctrl+1/2/3: Seleccionar palabra de la lista
     * - Shift+1/2: Seleccionar palabra de un espacio
     * - 1/2: Colocar palabra seleccionada en espacio
     * - Escape: Cancelar selección
     * - Delete/Backspace: Limpiar espacio seleccionado
     * - Flechas: Navegar entre preguntas
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      // Solo procesar si no estamos en un input o textarea (excepto para drag and drop)
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        // Para drag and drop, permitir navegación por teclado incluso en inputs
        if (!currentQuestion.isDragAndDrop) {
        return;
        }
      }

      // ==================== ESCAPE - SIEMPRE DISPONIBLE ====================
      // Escape: cancelar cualquier selección activa (funciona en cualquier momento)
      if (event.key === 'Escape' && currentQuestion.isDragAndDrop && !isAnswerSubmitted) {
        event.preventDefault();
        event.stopPropagation();
        setSelectedWordIndex(null);
        setSelectedSpaceIndex(null);
        announceToScreenReader('Selection cancelled.');
        return;
      }

      // ==================== COMBINACIONES PARA DRAG AND DROP ====================
      if (currentQuestion.isDragAndDrop && !isAnswerSubmitted) {
        // Ctrl + número: seleccionar palabra de la lista de opciones disponibles
        if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
          const key = event.key;
          if (key >= '1' && key <= '3') {
            const wordIndex = parseInt(key) - 1; // Convertir 1-3 a índices 0-2
            
            // Verificar que el índice sea válido y la palabra esté disponible
            if (currentQuestion.dragOptions && wordIndex < currentQuestion.dragOptions.length) {
              const word = currentQuestion.dragOptions[wordIndex];
              const isWordAlreadyUsed = draggedAnswers.includes(word);
              
              if (!isWordAlreadyUsed) {
                event.preventDefault();
                event.stopPropagation();
                selectWordFromList(wordIndex);
                setIsKeyboardMode(true);
                return;
              } else {
                // Si la palabra ya está en uso, no hacer nada pero anunciar al usuario
                announceToScreenReader(`The word "${word}" is already placed.`);
                return;
              }
            }
          }
        }
        
        // Shift + número: seleccionar palabra ya colocada en un espacio
        if (event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
          const key = event.key;
          // Para Shift+número, el key puede ser diferente (!, @, etc), usar event.code en su lugar
          if (event.code === 'Digit1' || event.code === 'Digit2') {
            const spaceIndex = event.code === 'Digit1' ? 0 : 1;
            event.preventDefault();
            event.stopPropagation();
            selectWordFromSpace(spaceIndex);
            setIsKeyboardMode(true);
            return;
          }
        }
        
        // Número solo: colocar palabra seleccionada en el espacio objetivo
        if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey && (selectedWordIndex !== null || selectedSpaceIndex !== null)) {
          const key = event.key;
          if (key >= '1' && key <= '2') {
            const targetSpace = parseInt(key) - 1; // Convertir 1-2 a índices 0-1
            event.preventDefault();
            event.stopPropagation();
            placeWordInSpace(targetSpace);
            return;
          }
        }

        // Delete/Backspace: limpiar espacio si hay uno seleccionado
        if ((event.key === 'Delete' || event.key === 'Backspace') && selectedSpaceIndex !== null) {
          event.preventDefault();
          event.stopPropagation();
          clearSpace(selectedSpaceIndex);
          setSelectedSpaceIndex(null);
          return;
        }
      }

      // ==================== NAVEGACIÓN GENERAL DE PREGUNTAS ====================
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentQuestionIndex > 0) {
            handleQuestionSelect(currentQuestionIndex - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentQuestionIndex < questions.length - 1) {
            handleQuestionSelect(currentQuestionIndex + 1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentQuestionIndex, questions.length, currentQuestion, isAnswerSubmitted, selectedWordIndex, selectedSpaceIndex, draggedAnswers]);
  
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

  // Limpiar estados de accesibilidad cuando cambia la pregunta
  useEffect(() => {
    setSelectedWordIndex(null);
    setSelectedSpaceIndex(null);
    setAccessibilityAnnouncement('');
    setIsKeyboardMode(false);
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
  
  const handleAnswerSelect = async (answer: string) => {
    if (!isAnswerSubmitted && topicId) {
      setSelectedAnswer(answer);
      setIsAnswerSubmitted(true);
      
      const isAnswerCorrect = answer === currentQuestion.correctAnswer;
      setIsCorrect(isAnswerCorrect);
      
      // Reproducir audio de feedback
      playFeedbackAudio(isAnswerCorrect);
      
      if (isAnswerCorrect) {
        setScore(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'correct');
      } else {
        setAttempts(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'incorrect');
      }

      // Save answer to attempt
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      await submitAnswer(topicId, currentQuestionIndex, answer, timeSpent, showHint ? 1 : 0);

      // Update progress with current score


      

      // Check for achievements after each answer
      checkForNewAchievements(undefined).catch(error => {
        console.error('Error checking achievements after answer:', error);
      });
    }
  };

  const handleWrittenAnswerSubmit = async () => {
    if (!isAnswerSubmitted && topicId && writtenAnswer.trim()) {
      setIsAnswerSubmitted(true);
      
      const correctAnswer = Array.isArray(currentQuestion.correctAnswer) 
        ? currentQuestion.correctAnswer[0] 
        : currentQuestion.correctAnswer;
      
      const isAnswerCorrect = writtenAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
      setIsCorrect(isAnswerCorrect);
      
      // Reproducir audio de feedback
      playFeedbackAudio(isAnswerCorrect);
      
      if (isAnswerCorrect) {
        setScore(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'correct');
      } else {
        setAttempts(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'incorrect');
      }

      // Save answer to attempt
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      await submitAnswer(topicId, currentQuestionIndex, writtenAnswer.trim(), timeSpent, showHint ? 1 : 0);

      // Update progress with current score


      

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

  const handleDragAndDropSubmit = async () => {
    if (!isAnswerSubmitted && topicId && draggedAnswers.length > 0) {
      setIsAnswerSubmitted(true);
      
      const correctAnswer = currentQuestion.correctAnswer;
      const isAnswerCorrect = Array.isArray(correctAnswer) 
        ? JSON.stringify(draggedAnswers) === JSON.stringify(correctAnswer)
        : draggedAnswers[0] === correctAnswer;
      
      setIsCorrect(isAnswerCorrect);
      
      // Reproducir audio de feedback
      playFeedbackAudio(isAnswerCorrect);
      
      if (isAnswerCorrect) {
        setScore(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'correct');
      } else {
        setAttempts(prev => prev + 1);
        updateQuestionStatus(topicId, currentQuestionIndex, 'incorrect');
      }

      // Save answer to attempt
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      await submitAnswer(topicId, currentQuestionIndex, draggedAnswers.join(', '), timeSpent, showHint ? 1 : 0);

      // Update progress with current score


      

      // Check for achievements after each answer
      checkForNewAchievements(undefined).catch(error => {
        console.error('Error checking achievements after answer:', error);
      });
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

          // Eliminar el intento en progreso del backend ya que está completado
          try {
            await inProgressAttemptService.deleteInProgressAttempt(topicId, difficulty);
            console.log('🗑️ Intento en progreso eliminado tras completar el nivel');
          } catch (deleteError) {
            console.warn('Warning: Could not delete in-progress attempt:', deleteError);
          }

          if (result.success) {
            const percentage = Math.round((score / questions.length) * 100);
            if (result.newUnlocks && result.newUnlocks.length > 0) {
              toast.success(`Progress saved! You've unlocked: ${result.newUnlocks.join(', ').toUpperCase()}`, {
                position: "top-center",
                autoClose: 4000
              });
            } else if (percentage === 100) {
              toast.success('Perfect! Level completed 100%!', {
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
  
  const handleRestartGame = async () => {
    if (!topicId || isRestarting) return;

    setIsRestarting(true);
    
    try {
      // 1. Eliminar el intento actual del backend
      await resetAttempt(topicId);
      
      // 2. Resetear el estado de las preguntas
      resetQuestionStatuses(topicId);
      
      // 3. Crear un nuevo intento limpio en el backend
      await startNewAttempt(topicId, difficulty, questions.length);
      
      // 4. Reiniciar todo el estado local
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setWrittenAnswer('');
      setDraggedAnswers([]);
      setIsAnswerSubmitted(false);
      setScore(0);
      setShowHint(false);
      setAttempts(0);
      setIsGameCompleted(false);
      setIsCorrect(false);
      setTimePerQuestion({});
      setHintsPerQuestion({});
      setQuestionStartTime(Date.now());
      
      console.log('🔄 Nuevo intento iniciado tras "Try Again"');
    } catch (error) {
      console.error('Error al reiniciar el juego:', error);
    } finally {
      setIsRestarting(false);
    }
  };
  
  // La música de fondo se controla globalmente desde AudioContext
  // No necesitamos controlarla aquí basada en isPlaying

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
    if (currentQuestion?.audio && isUserAuthenticated && isSoundEffectsEnabled) {
      setIsPlaying(!isPlaying);
    }
  };
  

  
  // Mostrar loading mientras se verifica el intento en progreso
  if (isLoadingAttempt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            tabIndex={0}
            role="img"
            aria-label="Loading spinner"
          ></div>
          <h2 
            className="text-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            tabIndex={0}
            role="heading"
            aria-level={2}
            aria-label="Loading your progress"
          >
            Loading your progress...
          </h2>
          <p 
            className="text-gray-500 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
            tabIndex={0}
            role="text"
            aria-label="Please wait while we restore your attempt"
          >
            Please wait while we restore your attempt
          </p>
        </div>
      </div>
    );
  }
  
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

  if (!canAccessDifficulty(difficulty)) {
    return (
      <div className="text-center py-12">
        <h2 
          className="text-2xl font-bold mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
          tabIndex={0}
          role="heading"
          aria-level={2}
        >
          Access Denied
        </h2>
        <p 
          className="text-gray-600 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
          tabIndex={0}
          role="text"
        >
          You need to complete previous levels first.
        </p>
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
                <Trophy 
                  className="h-16 w-16 text-yellow-500 mx-auto mb-4" 
                  aria-hidden="true"
                />
              ) : (
                <div 
                  className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  tabIndex={0}
                  role="img"
                  aria-label="Level completion icon"
                >
                  <span className="text-2xl">📚</span>
                </div>
              )}
              <h1 
                className="text-3xl font-bold mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                tabIndex={0}
                role="heading"
                aria-level={1}
                aria-label={isPerfectScore ? 'Perfect! Level Completed!' : 'Level Attempted!'}
              >
                {isPerfectScore ? 'Perfect! Level Completed!' : 'Level Attempted!'}
              </h1>
              <p 
                className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
                aria-label={`${topic?.title} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`}
              >
                {topic?.title} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </p>
            </div>
            
            <div className="text-center mb-8">
              <div 
                className="text-6xl font-bold mb-2 text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                tabIndex={0}
                role="text"
                aria-label={`Score: ${score} out of ${questions.length} questions correct`}
              >
                {score}/{questions.length}
              </div>
              <ProgressBar 
                value={percentage} 
                max={100}
                size="lg"
                color={percentage === 100 ? 'success' : percentage >= 70 ? 'warning' : 'error'}
                className="mb-2"
              />
              <p 
                className="text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
                aria-label={`${percentage}% Correct`}
              >
                {percentage}% Correct
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 
                className="font-bold mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="heading"
                aria-level={3}
                aria-label="Performance Summary"
              >
                Performance Summary:
              </h3>
              <p 
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
                aria-label={
                  isPerfectScore 
                    ? "Excellent work! Perfect score. You've completely mastered this level." 
                    : percentage >= 80 
                    ? "Very good! Almost perfect. You need 100% to unlock the next level." 
                    : percentage >= 50
                    ? "Nice try. Keep practicing to reach 100%."
                    : "Keep practicing. You can try again until you get 100%."
                }
              >
                {isPerfectScore 
                  ? "Excellent work! Perfect score. You've completely mastered this level." 
                  : percentage >= 80 
                  ? "Very good! Almost perfect. You need 100% to unlock the next level." 
                  : percentage >= 50
                  ? "Nice try. Keep practicing to reach 100%."
                  : "Keep practicing. You can try again until you get 100%."}
              </p>
              <div 
                className="mt-3 p-3 bg-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                tabIndex={0}
                role="text"
                aria-label="Progress saved successfully message"
              >
                <p className="text-blue-800 font-medium">
                  ✨ ¡Progreso guardado exitosamente!
                </p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={handleRestartGame}
                disabled={isRestarting}
                className="h-[40px] w-[225px] border-2 border-black flex items-center justify-center"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${isRestarting ? 'animate-spin' : ''}`} />
                {isRestarting ? 'Restarting...' : 'Try Again'}
              </Button>
              <Button
                variant="custom"
                onClick={() => navigate('/topics')}
                className="h-[40px] w-[225px] bg-blue-500 hover:bg-blue-600 text-white border-2 border-black flex items-center justify-center"
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
          <h1 
            className="text-3xl font-bold text-center mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            tabIndex={0}
            role="heading"
            aria-level={1}
            aria-label={`Current topic: ${topic.title}`}
          >
            {topic.title}
          </h1>
          
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
                <span 
                  className="text-[#000] font-['Poppins'] text-[18px] italic font-[275] leading-normal capitalize ml-2 flex items-center mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={0}
                  role="text"
                  aria-label="Back to Topics navigation text"
                >
                  Back to Topics
                </span>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="flex justify-between items-center mb-2">
                </div>
              </div>

              {/* Keyboard navigation hint */}
              <div 
                className="text-xs text-gray-500 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
                aria-label="Keyboard navigation hint: Use arrow keys to navigate between questions"
              >
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs mr-1">←</kbd>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs mr-2">→</kbd>
                <span>Navigate</span>
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
                      <span 
                        className="text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                        tabIndex={0}
                        role="text"
                        aria-label={`${answeredQuestions} of ${questions.length} questions answered`}
                      >
                        {answeredQuestions} of {questions.length} questions answered
                      </span>
                      <span 
                        className="text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                        tabIndex={0}
                        role="text"
                        aria-label={`${percentage}% Completed`}
                      >
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
                <h2 
                  className="text-2xl font-bold flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                  tabIndex={0}
                  role="heading"
                  aria-level={2}
                  aria-label={`Question: ${currentQuestion.text}`}
                >
                  {currentQuestion.text}
                </h2>
                <div className="flex items-center gap-2 ml-4">
                  {/* Botón de Música de Fondo */}
                  <IconButton
                    icon={!isUserAuthenticated ? <VolumeX size={20} className="opacity-50" /> : (isMusicEnabled ? <Volume2 size={20} className="text-blue-600" /> : <VolumeX size={20} />)}
                    onClick={isUserAuthenticated ? toggleMusic : undefined}
                    tooltip={!isUserAuthenticated ? "Música disponible después del login" : (isMusicEnabled ? "Silenciar Música de Fondo" : "Activar Música de Fondo")}
                    aria-label={!isUserAuthenticated ? "Música disponible después del login" : (isMusicEnabled ? "Silenciar Música de Fondo" : "Activar Música de Fondo")}
                    variant="ghost"
                    disabled={!isUserAuthenticated}
                    className={!isUserAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}
                  />
                  {/* Botón de Audio de Pregunta */}
                  {currentQuestion?.audio && (
                    <IconButton
                      icon={!isUserAuthenticated || !isSoundEffectsEnabled ? 
                        <QuestionAudioIconDisabled className="text-gray-400" /> : 
                        <QuestionAudioIcon className="text-orange-600" isPlaying={isPlaying} />
                      }
                      onClick={isUserAuthenticated && isSoundEffectsEnabled ? togglePlayPause : undefined}
                      tooltip={!isUserAuthenticated ? "🔊 Audio de pregunta disponible después del login" : !isSoundEffectsEnabled ? "🔊 Activar Audio de Pregunta en Configuración" : (isPlaying ? "⏸️ Parar Audio de Pregunta" : "▶️ Reproducir Audio de Pregunta")}
                      aria-label={!isUserAuthenticated ? "Audio de pregunta disponible después del login" : !isSoundEffectsEnabled ? "Activar Audio de Pregunta en Configuración" : (isPlaying ? "Parar Audio de Pregunta" : "Reproducir Audio de Pregunta")}
                      variant="ghost"
                      disabled={!isUserAuthenticated || !isSoundEffectsEnabled}
                      className={(!isUserAuthenticated || !isSoundEffectsEnabled) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-50'}
                    />
                  )}
                </div>
              </div>

              {/* Question Image */}
              {currentQuestion.image && (
                <div 
                  className="flex justify-center mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  tabIndex={0}
                  role="img"
                  aria-label={currentQuestion.alt || `Grammar question illustration for: ${currentQuestion.text.substring(0, 50)}...`}
                >
                  <img 
                    src={getImage(currentQuestion.image)?.default}
                    alt={currentQuestion.alt || `Grammar question illustration for: ${currentQuestion.text.substring(0, 50)}...`}
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
                      placeholder="Write your answer here..."
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
                        Submit Answer
                      </Button>
                    )}
                  </div>
                </div>
              ) : currentQuestion.isDragAndDrop ? (
                <div className="mb-6">
                  <div className="space-y-6">
                    {/* Región de anuncios para lectores de pantalla */}
                    <div
                      aria-live="polite"
                      aria-atomic="true"
                      className="sr-only"
                      role="status"
                    >
                      {accessibilityAnnouncement}
                    </div>

                    {/* Área de Drag and Drop principal */}
                    <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center mb-4">
                        <p 
                        className="text-sm text-gray-600 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                        tabIndex={0}
                        role="text"
                        aria-label="Instructions: Drag the words into the blank spaces"
                      >
                        Drag the words into the blank spaces
                      </p>
                        <div 
                          className="flex flex-wrap gap-2 justify-center"
                          role="application"
                          aria-label="Sentence construction area"
                        >
                          {(() => {
                            const textParts = currentQuestion.text.split('______');
                            
                            return textParts.map((part, index) => (
                              <React.Fragment key={index}>
                                <span className="text-lg" role="text">{part}</span>
                                {index < textParts.length - 1 && (
                                  <div
                                    className={`inline-block w-32 h-10 border-2 border-dashed rounded-lg flex items-center justify-center bg-white transition-all
                                      ${selectedSpaceIndex === index ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-400'}
                                      ${draggedAnswers[index] ? 'border-green-400 bg-green-50' : ''}
                                    `}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onClick={() => !isAnswerSubmitted && selectWordFromSpace(index)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        !isAnswerSubmitted && selectWordFromSpace(index);
                                      }
                                    }}
                                    tabIndex={!isAnswerSubmitted ? 0 : -1}
                                    role="button"
                                    aria-label={`Space ${index + 1}: ${draggedAnswers[index] || 'empty'}. ${!isAnswerSubmitted ? 'Press Enter to select.' : ''}`}
                                    aria-describedby={`space-${index}-description`}
                                  >
                                    {draggedAnswers[index] ? (
                                      <span className="text-sm font-medium text-gray-700">
                                        {draggedAnswers[index]}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-gray-400">Espacio {index + 1}</span>
                                    )}
                                  </div>
                                )}
                                {/* Descripción para cada espacio (oculta visualmente) */}
                                {index < textParts.length - 1 && (
                                  <div 
                                    id={`space-${index}-description`} 
                                    className="sr-only"
                                  >
                                    Space number {index + 1} to place a word.
                                  </div>
                                )}
                              </React.Fragment>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Lista de opciones disponibles */}
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                      <p 
                        className="text-sm font-medium text-gray-700 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                        tabIndex={0}
                        role="text"
                        aria-label="Available words section"
                      >
                        Available words:
                      </p>
                      <div 
                        className="flex flex-wrap gap-3"
                        role="group"
                        aria-label="List of available words to drag"
                      >
                        {currentQuestion.dragOptions?.map((option, index) => {
                          const isUsed = draggedAnswers.includes(option);
                          const isAvailable = !isUsed; // Simplificado: si ya está usada, no está disponible
                          const isSelected = selectedWordIndex === index;
                          
                          return (
                            <div
                              key={`${option}-${index}`}
                              draggable={isAvailable && !isAnswerSubmitted}
                              onDragStart={(e) => handleDragStart(e, option)}
                              onClick={() => !isAnswerSubmitted && isAvailable && selectWordFromList(index)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  !isAnswerSubmitted && isAvailable && selectWordFromList(index);
                                }
                              }}
                              tabIndex={isAvailable && !isAnswerSubmitted ? 0 : -1}
                              className={`px-4 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${isSelected ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-300' : ''}
                                ${isAvailable && !isAnswerSubmitted
                                  ? 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 cursor-pointer'
                                  : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                                }
                              `}
                              role="button"
                              aria-label={`Word ${index + 1}: ${option}. ${isAvailable && !isAnswerSubmitted ? 'Press Ctrl+' + (index + 1) + ' to select.' : 'Not available.'}`}
                              aria-pressed={isSelected}
                              aria-disabled={!isAvailable || isAnswerSubmitted}
                            >
                              <span className="text-sm font-medium">
                                {index + 1}. {option}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Botón de verificación */}
                    {!isAnswerSubmitted && (
                      <div className="flex justify-center">
                        <Button
                          variant="custom"
                          onClick={handleDragAndDropSubmit}
                          disabled={draggedAnswers.filter(answer => answer.trim()).length === 0}
                          className="h-[40px] w-[225px] bg-blue-500 hover:bg-blue-600 text-white border-2 border-black"
                          aria-label="Check drag and drop answer"
                        >
                          Check Answer
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
                      <h3 
                        className={`font-bold text-${isCorrect ? 'success' : 'error'} mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1`}
                        tabIndex={0}
                        role="heading"
                        aria-level={3}
                        aria-label={isCorrect ? 'Correct answer feedback' : 'Incorrect answer feedback'}
                      >
                        {isCorrect ? 'Correct!' : "It's incorrect"}
                      </h3>
                                          {currentQuestion.isFillInTheBlank && !isCorrect && (
                        <p 
                          className="mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                          tabIndex={0}
                          role="text"
                          aria-label={`Your answer: ${writtenAnswer.trim()}. Correct answer: ${Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer[0] : currentQuestion.correctAnswer}`}
                        >
                          <strong>Your answer:</strong> {writtenAnswer.trim()}<br/>
                          <strong>Correct answer:</strong> {Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer[0] : currentQuestion.correctAnswer}
                        </p>
                      )}
                      {currentQuestion.isDragAndDrop && !isCorrect && (
                        <p 
                          className="mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                          tabIndex={0}
                          role="text"
                          aria-label={`Your answer: ${draggedAnswers.join(', ')}. Correct answer: ${Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.join(', ') : currentQuestion.correctAnswer}`}
                        >
                          <strong>Your answer:</strong> {draggedAnswers.join(', ')}<br/>
                          <strong>Correct answer:</strong> {Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.join(', ') : currentQuestion.correctAnswer}
                        </p>
                      )}
                      <p 
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                        tabIndex={0}
                        role="text"
                        aria-label={`Explanation: ${currentQuestion.explanation}`}
                      >
                        {currentQuestion.explanation}
                      </p>
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