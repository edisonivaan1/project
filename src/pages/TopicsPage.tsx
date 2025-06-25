import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Volume2 } from 'lucide-react';
import Card, { CardBody } from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';
import IconButton from '../components/UI/IconButton';
import { grammarTopics } from '../data/grammarTopics';
import { useProgress } from '../contexts/ProgressContext';
import { useAttempt } from '../contexts/AttemptContext';

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
  const { getProgress } = useProgress();
  const { hasInProgressAttempt, hasCompletedAttempt } = useAttempt();
  
  // Group topics by difficulty
  const topicsByDifficulty = grammarTopics.reduce((acc, topic) => {
    if (!acc[topic.difficulty]) {
      acc[topic.difficulty] = [];
    }
    acc[topic.difficulty].push(topic);
    return acc;
  }, {} as Record<string, typeof grammarTopics>);

  const getButtonText = (topicId: string) => {
    if (hasCompletedAttempt(topicId)) {
      return 'VIEW RESULTS';
    }
    if (hasInProgressAttempt(topicId)) {
      return 'CONTINUE ATTEMPT';
    }
    return 'START PRACTICE';
  };

  const handleButtonClick = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    if (hasCompletedAttempt(topicId)) {
      navigate(`/results/${topicId}`);
    } else {
      navigate(`/game/${topicId}`);
    }
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
              const progress = getProgress(topic.id);
              const colors = difficultyColors[topic.difficulty] || difficultyColors.easy;
              
              return (
                <Card 
                  key={topic.id} 
                  className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${colors.border} border-2`}
                  onClick={() => navigate(`/tutorial/${topic.id}`)}
                >
                  <CardBody className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{topic.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.text} ${colors.bg}`}>
                        {topic.difficulty.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-6 flex-grow">{topic.description}</p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <ProgressBar value={progress} max={100} className="h-2" />
                      </div>
                      
                      <Button
                        variant="primary"
                        size="sm"
                        className={`w-full ${colors.button} mt-2`}
                        onClick={(e) => handleButtonClick(e, topic.id)}
                      >
                        {getButtonText(topic.id)}
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

export default TopicsPage;
