import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, SkipForward, ArrowLeft, Rewind } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import YouTubePlayer from '../components/UI/YouTubePlayer';
import { grammarTopics } from '../data/grammarTopics';
import { presentTensesQuestions } from '../data/sampleQuestions';

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
  
  // Example question for this topic (normally would be loaded based on topicId)
  const exampleQuestion = presentTensesQuestions[0];
  
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
            In this game, you will practice using {topic.title.toLowerCase()} correctly in different contexts. 
            You'll be shown sentences with missing words and need to select the correct option.
          </p>
          
          <div className="bg-gray-100 p-6 rounded-lg my-6">
            <h4 className="font-bold mb-2">Example Question:</h4>
            <p className="mb-4 text-lg">{exampleQuestion.text}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {exampleQuestion.options?.map((option, index) => (
                <button 
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all 
                    ${option === exampleQuestion.correctAnswer 
                      ? 'border-success bg-success/10 font-medium' 
                      : 'border-gray-200 hover:border-primary/50'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="bg-success/10 border border-success/30 p-4 rounded-lg mt-4">
              <h5 className="font-bold text-success mb-1">Explanation:</h5>
              <p>{exampleQuestion.explanation}</p>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-3">Game Features:</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>You'll receive immediate feedback on your answers</li>
            <li>If you're stuck, you can use the hint button</li>
            <li>Track your progress with the progress bar</li>
            <li>See your final score at the end of the game</li>
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