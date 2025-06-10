import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Info, Volume2 } from 'lucide-react';
import Card, { CardBody } from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';
import IconButton from '../components/UI/IconButton';
import PlayIcon from '../components/UI/icons/PlayIcon';
import { grammarTopics } from '../data/grammarTopics';
import { useProgress } from '../contexts/ProgressContext';

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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { getProgress } = useProgress();
  
  // Agrupar temas por dificultad
  const topicsByDifficulty = grammarTopics.reduce((acc, topic) => {
    if (!acc[topic.difficulty]) {
      acc[topic.difficulty] = [];
    }
    acc[topic.difficulty].push(topic);
    return acc;
  }, {} as Record<string, typeof grammarTopics>);

  const handleStartPractice = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    navigate(`/game/${topicId}`);
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
            {difficulty} Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const progress = getProgress(topic.id);
              const hasProgress = progress > 0;
              
              return (
                <Card 
                  key={topic.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${difficultyColors[topic.difficulty].border}`}
                  onClick={() => navigate(`/tutorial/${topic.id}`)}
                >
                  <CardBody className="p-6 flex flex-col h-full">
                    <div className="flex flex-col items-center text-center mb-6">
                      <PlayIcon className={`mb-3 ${difficultyColors[topic.difficulty].text}`} size={32} />
                      <h3 className="font-bold text-xl text-gray-900">{topic.title}</h3>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex justify-center mb-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${difficultyColors[topic.difficulty].bg} ${difficultyColors[topic.difficulty].text}`}>
                          {topic.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <div className="h-24">
                        <p className="text-gray-600 text-base leading-relaxed text-center line-clamp-3">{topic.description}</p>
                      </div>
                      {topic.completedPercentage !== undefined && (
                        <div className="mb-6">
                          <ProgressBar 
                            value={topic.completedPercentage} 
                            max={100}
                            size="md"
                            color={topic.difficulty === 'easy' ? 'success' : topic.difficulty === 'medium' ? 'warning' : 'error'}
                            label="Progress"
                            showPercentage
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        className={`w-full ${difficultyColors[topic.difficulty].button} transition-colors duration-200 font-semibold`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/game/${topic.id}`);
                        }}
                      >
                        START PRACTICE
                      </Button>
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

export default Home;