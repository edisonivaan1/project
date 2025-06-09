import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, History, GitBranch, MapPin, Type, HelpCircle, Info, Volume2 } from 'lucide-react';
import Card, { CardBody } from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';
import IconButton from '../components/UI/IconButton';
import { grammarTopics } from '../data/grammarTopics';

const iconComponents: Record<string, React.ReactNode> = {
  Clock: <Clock className="h-6 w-6" />,
  History: <History className="h-6 w-6" />,
  GitBranch: <GitBranch className="h-6 w-6" />,
  MapPin: <MapPin className="h-6 w-6" />,
  Type: <Type className="h-6 w-6" />,
  HelpCircle: <HelpCircle className="h-6 w-6" />,
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-success/20 text-success',
  medium: 'bg-warning/20 text-warning',
  hard: 'bg-error/20 text-error',
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="animate-fade-in">
      <section className="mb-12 text-center">
        <h1 className="font-bold text-4xl md:text-5xl mb-4 text-title">GRAMMAR MASTER PRO</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Master English Grammar Through Intesractive Games And Activities Designed For B1-Level Learners.
        </p>
        <div className="flex justify-center mt-6 space-x-4">
          <IconButton
            icon={<Volume2 />}
            variant="outline"
            size="md"
            tooltip="Sound Settings"
            aria-label="Sound Settings"
            onClick={() => navigate('/settings')}
          />
          <IconButton
            icon={<Info />}
            variant="outline"
            size="md"
            tooltip="Help"
            aria-label="Help"
            onClick={() => navigate('/help')}
          />
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">CHOOSE A GRAMMAR TOPIC</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grammarTopics.map((topic) => (
            <Card 
              key={topic.id}
              className="cursor-pointer"
              onClick={() => navigate(`/tutorial/${topic.id}`)}
            >
              <CardBody>
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg text-white bg-primary mr-4`}>
                    {iconComponents[topic.icon]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{topic.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[topic.difficulty]}`}>
                        {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                    {topic.completedPercentage !== undefined && (
                      <ProgressBar 
                        value={topic.completedPercentage} 
                        max={100}
                        size="sm"
                        color={topic.completedPercentage > 70 ? 'success' : topic.completedPercentage > 30 ? 'warning' : 'primary'}
                        label="Progress"
                        showPercentage
                      />
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/game/${topic.id}`);
                      }}
                    >
                      Start Practice
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;