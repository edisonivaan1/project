import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Lightbulb, Volume2, VolumeX, RefreshCw, Home, 
  ChevronRight, CheckCircle, XCircle 
} from 'lucide-react';
import Button from '../components/UI/Button';
import IconButton from '../components/UI/IconButton';
import ProgressBar from '../components/UI/ProgressBar';
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
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  
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
    if (currentQuestion && currentQuestion.options) {
      setShuffledOptions(shuffleOptions(currentQuestion.options));
    }
  }, [currentQuestion]);
  
  // Check if two attempts have been made to show hint automatically
  useEffect(() => {
    if (attempts >= 2 && !showHint && !isAnswerSubmitted) {
      setShowHint(true);
    }
  }, [attempts, showHint, isAnswerSubmitted]);
  
  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answer);
      setIsAnswerSubmitted(true);
      
      if (answer === currentQuestion.correctAnswer) {
        setScore(score + 1);
        setIsCorrect(true);
      } else {
        setAttempts(attempts + 1);
        setIsCorrect(false);
      }
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
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
      setAttempts(0);
    } else {
      setIsGameCompleted(true);
    }
  };
  
  const handleRestartGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setShowHint(false);
    setAttempts(0);
    setIsGameCompleted(false);
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
    
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8 animate-slide-up">
            <h1 className="text-3xl font-bold mb-6 text-center">Game Completed!</h1>
            
            <div className="text-center mb-8">
              <div className="text-6xl font-bold mb-2 text-primary">{score}/{questions.length}</div>
              <ProgressBar 
                value={percentage} 
                max={100}
                size="lg"
                color={percentage >= 70 ? 'success' : percentage >= 40 ? 'warning' : 'error'}
                className="mb-2"
              />
              <p className="text-lg">{percentage}% Correct</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold mb-2">Performance Summary:</h3>
              <p>
                {percentage >= 80 
                  ? "Excellent job! You've mastered this topic!" 
                  : percentage >= 60 
                  ? "Good work! You're on the right track." 
                  : "Keep practicing! You'll improve with more attempts."}
              </p>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Game Completed!</h2>
              <p className="text-lg mb-6">
                Your score: {score} out of {questions.length}
              </p>
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
                  onClick={() => navigate('/')}
                  className="h-[40px] w-[225px] bg-[rgb(var(--color-button))] hover:bg-[rgb(var(--color-button))/0.8] text-white border-[2px] border-solid border-[#000000] flex items-center justify-center"
                >
                  <Home className="h-5 w-5 mr-2 text-white" />
                  BACK TO HOME
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
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
                  onClick={() => navigate('/')}
                  tooltip="Back to Home"
                  aria-label="Back to Home"
                  className="flex items-center"
                />
                <span className="text-[#000] font-['Poppins'] text-[18px] italic font-[275] leading-normal capitalize ml-2 flex items-center mt-1">Back Home</span>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="flex justify-between items-center mb-2">
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-sm font-medium">{Math.round((currentQuestionIndex / questions.length) * 100)}% Complete</span>
              </div>
              <ProgressBar 
                value={currentQuestionIndex} 
                max={questions.length}
                size="md"
                color="primary"
                className="transition-all duration-300"
              />
            </div>
            
            {/* Question and Controls */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex-1">{currentQuestion.text}</h2>
              <div className="flex items-center space-x-2 ml-4">
                <IconButton
                  icon={soundEnabled ? <Volume2 /> : <VolumeX />}
                  variant="ghost"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  tooltip={soundEnabled ? "Mute Sound" : "Enable Sound"}
                  aria-label={soundEnabled ? "Mute Sound" : "Enable Sound"}
                />
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
            
            {/* Options */}
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
                <div className={`bg-${selectedAnswer === currentQuestion.correctAnswer ? 'success' : 'error'}/10 border border-${selectedAnswer === currentQuestion.correctAnswer ? 'success' : 'error'}/30 p-4 rounded-lg`}>
                  <h3 className={`font-bold text-${selectedAnswer === currentQuestion.correctAnswer ? 'success' : 'error'} mb-2`}>
                    {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Not quite right'}
                  </h3>
                  <p>{currentQuestion.explanation}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    icon={<ChevronRight className="text-white" />}
                    iconPosition="right"
                    onClick={handleNextQuestion}
                    className="h-[40px] w-[225px] bg-[rgb(var(--color-button))] hover:bg-[rgb(var(--color-button))/0.8] text-white border-[2px] border-solid border-[#000000]"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
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
                    onClick={() => setShowHint(!showHint)}
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
  );
};

export default Game;