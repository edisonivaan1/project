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
  const { getCurrentAttempt, getAttemptHistory, resetAttempt, getAttemptScore } = useAttempt();
  const { getQuestionStatus } = useQuestionStatus();

  const topic = grammarTopics.find(t => t.id === topicId);
  const attempt = topicId ? getCurrentAttempt(topicId) : null;
  const attemptHistory = topicId ? getAttemptHistory(topicId) : [];
  const currentScore = topicId ? getAttemptScore(topicId) : { correct: 0, total: 10 };

  if (!topic || !attempt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Results not found</h2>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  const percentage = Math.round((currentScore.correct / currentScore.total) * 100);

  const handleTryAgain = () => {
    if (topicId) {
      resetAttempt(topicId);
      navigate(`/game/${topicId}`);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardBody>
          <h1 className="text-3xl font-bold mb-6 text-center">{topic.title} - Results</h1>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-2 text-primary">
              {currentScore.correct} / {currentScore.total}
            </div>
            <div className="text-xl text-gray-600">
              {percentage}% Correct
            </div>
          </div>

          <ProgressBar
            value={percentage}
            max={100}
            size="lg"
            color={percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'error'}
            showPercentage
            className="mb-8"
          />

          <div className="flex justify-center space-x-4">
            <Button
              variant="primary"
              onClick={handleTryAgain}
              className="flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Button>
          </div>
        </CardBody>
      </Card>

      {attemptHistory.length > 0 && (
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold mb-6">My Attempts</h2>
            <div className="space-y-4">
              {attemptHistory.map((history) => (
                <div
                  key={history.timestamp}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold">Attempt #{history.attemptNumber}</div>
                    <div className="text-sm text-gray-600">{formatDate(history.timestamp)}</div>
                  </div>
                  <div className="text-lg font-bold">
                    {history.correctAnswers} / {history.totalQuestions}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Results;