import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';
import { grammarTopics } from '../data/grammarTopics';
import { useAttempt } from '../contexts/AttemptContext';
import { useQuestionStatus } from '../contexts/QuestionStatusContext';

const Results: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { getCurrentAttempt } = useAttempt();
  const { getQuestionStatus } = useQuestionStatus();

  const topic = grammarTopics.find(t => t.id === topicId);
  const attempt = topicId ? getCurrentAttempt(topicId) : null;

  if (!topic || !attempt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Results not found</h2>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  // Calculate score
  const totalQuestions = Object.keys(attempt.answers).length;
  const correctAnswers = Object.entries(attempt.answers).filter(([index, answer]) => {
    const questionIndex = parseInt(index);
    return getQuestionStatus(topicId!, questionIndex) === 'correct';
  }).length;

  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-center">{topic.title} - Results</h1>
      
      <Card>
        <CardBody>
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-2 text-primary">{correctAnswers}/{totalQuestions}</div>
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

          <div className="space-y-4">
            <h3 className="font-bold mb-4">Question Review:</h3>
            {Object.entries(attempt.answers).map(([index, answer]) => {
              const questionIndex = parseInt(index);
              const status = getQuestionStatus(topicId!, questionIndex);
              const isCorrect = status === 'correct';

              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect 
                      ? 'border-success bg-success/10' 
                      : 'border-error bg-error/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Question {parseInt(index) + 1}</span>
                    <span className={`font-medium ${isCorrect ? 'text-success' : 'text-error'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-gray-700">Your answer: {answer}</p>
                </div>
              );
            })}
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