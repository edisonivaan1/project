import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, SkipForward, ArrowLeft, Rewind } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import YouTubePlayer from '../components/UI/YouTubePlayer';
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

const Tutorial: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [isWatched, setIsWatched] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);
  
  const topic = grammarTopics.find(t => t.id === topicId);
  
  // Función para extraer el ID del video de una URL de YouTube
  const extractVideoId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  };
  
  const handleVideoProgress = (videoProgress: number) => {
    setProgress(videoProgress);
  };
  
  const handleVideoComplete = () => {
    setIsWatched(true);
    setProgress(100);
  };
  
  const handleVideoError = () => {
    setVideoError(true);
  };
  
  if (!topic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Topic not found</h2>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }
  
  const handleStartGame = () => {
    navigate(`/game/${topicId}`);
  };
  
  const handleSkipTutorial = () => {
    setIsWatched(true);
    setProgress(100);
  };
  
  const handleReplayTutorial = () => {
    setIsWatched(false);
    setProgress(0);
    setVideoError(false);
  };
  
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
        return presentTensesQuestions;
    }
  };

  // Get example question for this topic
  const questions = getQuestions();
  const exampleQuestion = questions[0];

  // Determine question type
  const getQuestionType = (question: QuestionType): 'multiple-choice' | 'fill-in-blank' | 'drag-and-drop' => {
    if (question.isDragAndDrop) return 'drag-and-drop';
    if (question.isFillInTheBlank) return 'fill-in-blank';
    return 'multiple-choice';
  };

  const questionType = getQuestionType(exampleQuestion);
  
  // Tutorial components for different question types
  const MultipleChoiceTutorial = ({ question }: { question: QuestionType }) => (
    <div className="bg-gray-100 p-6 rounded-lg my-6">
      <h4 className="font-bold mb-2">Example Question:</h4>
      <p className="mb-4 text-lg">{question.text}</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {question.options?.map((option, index) => (
          <button 
            key={index}
            className={`p-3 rounded-lg border-2 transition-all 
              ${option === question.correctAnswer 
                ? 'border-success bg-success/10 font-medium' 
                : 'border-gray-200 hover:border-primary/50'}`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="bg-success/10 border border-success/30 p-4 rounded-lg mt-4">
        <h5 className="font-bold text-success mb-1">Explanation:</h5>
        <p>{question.explanation}</p>
      </div>
    </div>
  );

  const FillInBlankTutorial = ({ question }: { question: QuestionType }) => (
    <div className="bg-gray-100 p-6 rounded-lg my-6">
      <h4 className="font-bold mb-2">Example Question:</h4>
      <p className="mb-4 text-lg">{question.text}</p>
      <div className="mb-4">
        <input
          type="text"
          value={Array.isArray(question.correctAnswer) ? question.correctAnswer[0] : question.correctAnswer}
          readOnly
          className="p-3 border-2 border-success bg-success/10 rounded-lg w-full font-medium"
          placeholder="Type your answer here..."
        />
      </div>
      <div className="bg-success/10 border border-success/30 p-4 rounded-lg mt-4">
        <h5 className="font-bold text-success mb-1">Correct Answer:</h5>
        <p className="font-medium mb-2">
          {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
        </p>
        <h5 className="font-bold text-success mb-1">Explanation:</h5>
        <p>{question.explanation}</p>
      </div>
    </div>
  );

  const DragAndDropTutorial = ({ question }: { question: QuestionType }) => {
    const textParts = question.text.split('______');
    const correctAnswers = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer 
      : [question.correctAnswer];

    return (
      <div className="bg-gray-100 p-6 rounded-lg my-6">
        <h4 className="font-bold mb-2">Example Question:</h4>
        
        {/* Sentence with blanks filled */}
        <div className="mb-4 p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-lg text-center">
            {textParts.map((part, index) => (
              <React.Fragment key={index}>
                <span>{part}</span>
                {index < textParts.length - 1 && (
                  <span className="inline-block mx-2 px-3 py-1 bg-success/20 border-2 border-success rounded-lg font-medium">
                    {correctAnswers[index] || '______'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Available options */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Available words:</p>
          <div className="flex flex-wrap gap-2">
            {question.dragOptions?.map((option, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-lg border-2 transition-all
                  ${correctAnswers.includes(option)
                    ? 'border-success bg-success/10 font-medium'
                    : 'border-gray-200 bg-gray-50'
                  }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-success/10 border border-success/30 p-4 rounded-lg mt-4">
          <h5 className="font-bold text-success mb-1">Explanation:</h5>
          <p>{question.explanation}</p>
        </div>
      </div>
    );
  };

  // Get tutorial description based on question type
  const getTutorialDescription = (type: string, topicTitle: string) => {
    switch (type) {
      case 'multiple-choice':
        return `In this game, you will practice using ${topicTitle.toLowerCase()} correctly in different contexts. You'll be shown sentences with missing words and need to select the correct option from multiple choices.`;
      case 'fill-in-blank':
        return `In this game, you will practice using ${topicTitle.toLowerCase()} correctly by typing the complete sentences. You'll be given sentence structures with hints, and you need to write the full correct sentence.`;
      case 'drag-and-drop':
        return `In this game, you will practice using ${topicTitle.toLowerCase()} correctly by dragging words into the right positions. You'll be shown sentences with blank spaces and need to drag the correct words from the available options.`;
      default:
        return `In this game, you will practice using ${topicTitle.toLowerCase()} correctly in different contexts.`;
    }
  };

  // Get game features based on question type
  const getGameFeatures = (type: string) => {
    const commonFeatures = [
      "You'll receive immediate feedback on your answers",
      "If you're stuck, you can use the hint button",
      "Track your progress with the progress bar",
      "See your final score at the end of the game"
    ];

    switch (type) {
      case 'drag-and-drop':
        return [
          ...commonFeatures,
          "Drag words from the options area to the blank spaces",
          "Use keyboard shortcuts: Ctrl+1/2/3 to select words, 1/2 to place them"
        ];
      case 'fill-in-blank':
        return [
          ...commonFeatures,
          "Type complete sentences using proper grammar",
          "Press Enter to submit your answer"
        ];
      default:
        return commonFeatures;
    }
  };
  
  // Extraer el ID del video de YouTube
  const videoId = topic.youtubeUrl ? extractVideoId(topic.youtubeUrl) : '';
  
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-center">{topic.title} - Tutorial</h1>
      
      <Card className="mb-8">
        <CardBody>
          <div className="aspect-video bg-gray-800 rounded-lg mb-4 relative overflow-hidden">
            {videoError ? (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-xl mb-2">Video no disponible</div>
                  <div className="mb-4">El video de tutorial no se pudo cargar</div>
                  <Button 
                    variant="primary"
                    icon={<Rewind />}
                    onClick={handleReplayTutorial}
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            ) : topic.youtubeUrl && videoId ? (
              <YouTubePlayer
                videoId={videoId}
                onProgress={handleVideoProgress}
                onComplete={handleVideoComplete}
                className="w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-xl mb-2">Tutorial Video</div>
                  <div className="mb-4">Loading {progress}%...</div>
                  {progress < 100 && (
                    <Button 
                      variant="primary"
                      icon={<SkipForward />}
                      onClick={handleSkipTutorial}
                    >
                      Skip Tutorial
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Progress indicator */}
            {!isWatched && !videoError && (
              <div 
                className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300" 
                style={{ width: `${progress}%` }} 
              />
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-4">How this Game Works</h3>
          <p className="mb-4">
            {getTutorialDescription(questionType, topic.title)}
          </p>
          
          {/* Dynamic tutorial component based on question type */}
          {questionType === 'multiple-choice' && <MultipleChoiceTutorial question={exampleQuestion} />}
          {questionType === 'fill-in-blank' && <FillInBlankTutorial question={exampleQuestion} />}
          {questionType === 'drag-and-drop' && <DragAndDropTutorial question={exampleQuestion} />}
          
          <h3 className="text-xl font-bold mb-3">Game Features:</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            {getGameFeatures(questionType).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          
          <p className="font-medium">
            Ready to start practicing {topic.title.toLowerCase()}?
          </p>
        </CardBody>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            icon={<ArrowLeft className="text-white" />}
            onClick={() => navigate('/')}
            className="h-[40px] w-[225px] bg-[rgb(var(--color-button))] hover:bg-[rgb(var(--color-button))/0.8] text-white border-[2px] border-solid border-[#000000]"
          >
            Back to Topics
          </Button>
          <Button 
            variant="primary"
            icon={<PlayCircle />}
            onClick={handleStartGame}
            disabled={!isWatched}
          >
            {isWatched ? 'Start Game' : 'Watch Tutorial First'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Tutorial;