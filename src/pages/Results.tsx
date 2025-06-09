import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trophy, RefreshCw, Home, ArrowRight } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';
import { grammarTopics } from '../data/grammarTopics';

interface ResultsProps {
  score?: number;
  totalQuestions?: number;
}

const Results: React.FC<ResultsProps> = ({ 
  score = 7,  // Default values for demonstration
  totalQuestions = 10 
}) => {
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId: string }>();
  
  const percentage = Math.round((score / totalQuestions) * 100);
  const topic = grammarTopics.find(t => t.id === topicId);
  
  // Find related topics to suggest
  const relatedTopics = grammarTopics
    .filter(t => t.id !== topicId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);
  
  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <Card>
        <CardBody>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mb-4">
              <Trophy className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Results</h1>
            <p className="text-gray-600">{topic?.title || 'Grammar Practice'}</p>
          </div>
          
          <div className="text-center mb-8">
            <div className="text-5xl font-bold mb-4">
              {score}/{totalQuestions}
            </div>
            <ProgressBar 
              value={percentage} 
              max={100}
              size="lg"
              color={percentage >= 70 ? 'success' : percentage >= 40 ? 'warning' : 'error'}
              className="mb-2"
            />
            <p className="text-lg font-medium">{percentage}% Correct</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Performance Analysis</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Accuracy</span>
                  <span>{percentage}%</span>
                </div>
                <ProgressBar 
                  value={percentage} 
                  max={100}
                  size="sm"
                  color={percentage >= 70 ? 'success' : percentage >= 40 ? 'warning' : 'error'}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Completion Time</span>
                  <span>2:45</span>
                </div>
                <ProgressBar 
                  value={70} 
                  max={100}
                  size="sm"
                  color="secondary"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Hints Used</span>
                  <span>2/5</span>
                </div>
                <ProgressBar 
                  value={40} 
                  max={100}
                  size="sm"
                  color="accent"
                />
              </div>
            </div>
          </div>
          
          {percentage < 70 && (
            <div className="bg-warning/10 border border-warning/30 p-4 rounded-lg mb-8">
              <h3 className="font-bold text-warning mb-2">Areas to Improve</h3>
              <p>
                You might need more practice with {topic?.title.toLowerCase() || 'this topic'}. 
                Try reviewing the tutorial and attempting the exercises again.
              </p>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-bold mb-4">Suggested Next Activities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedTopics.map((relatedTopic) => (
                <Card 
                  key={relatedTopic.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/tutorial/${relatedTopic.id}`)}
                >
                  <CardBody className="p-4">
                    <h3 className="font-bold mb-1">{relatedTopic.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{relatedTopic.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      icon={<ArrowRight />}
                      iconPosition="right"
                      className="w-full"
                    >
                      Start
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </CardBody>
        
        <CardFooter className="flex flex-wrap gap-4 justify-center">
          <Button
            variant="outline"
            icon={<RefreshCw />}
            onClick={() => navigate(`/game/${topicId}`)}
          >
            Try Again
          </Button>
          <Button
            variant="primary"
            icon={<Home />}
            onClick={() => navigate('/')}
          >
            Back to Topics
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Results;