import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Home, RefreshCw, Trophy } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';
import { grammarTopics } from '../data/grammarTopics';
import { useAttempt } from '../contexts/AttemptContext';
import { useQuestionStatus } from '../contexts/QuestionStatusContext';
import { useGameProgress } from '../contexts/GameProgressContext';

const Results: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const difficulty = (searchParams.get('difficulty') as 'easy' | 'medium' | 'hard') || 'easy';
  
  const { getCurrentAttempt, getAttemptHistory, resetAttempt, getAttemptScore } = useAttempt();
  const { getQuestionStatus } = useQuestionStatus();
  const { getLevelProgress, getLevelPercentage } = useGameProgress();

  const topic = grammarTopics.find(t => t.id === topicId);
  const attempt = topicId ? getCurrentAttempt(topicId) : null;
  const attemptHistory = topicId ? getAttemptHistory(topicId) : [];
  
  // Usar progreso del backend si está disponible, sino usar el local
  const levelProgress = topicId ? getLevelProgress(topicId, difficulty) : null;
  const backendPercentage = topicId ? getLevelPercentage(topicId, difficulty) : 0;
  const localScore = topicId ? getAttemptScore(topicId) : { correct: 0, total: 10 };
  
  // Priorizar datos del backend si existen
  const currentScore = levelProgress ? levelProgress.bestScore : localScore;
  const percentage = levelProgress ? backendPercentage : Math.round((localScore.correct / localScore.total) * 100);

  if (!topic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Topic not found</h2>
        <Button onClick={() => navigate('/topics')}>Return to Topics</Button>
      </div>
    );
  }

  const handleTryAgain = () => {
    if (topicId) {
      resetAttempt(topicId);
      navigate(`/game/${topicId}?difficulty=${difficulty}`);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const isPerfectScore = percentage === 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardBody>
          <div className="text-center mb-6">
            {isPerfectScore && (
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold mb-2">
              {topic.title} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Results
            </h1>
            {isPerfectScore && (
              <p className="text-green-600 font-semibold text-lg">¡Perfecto! Nivel Completado</p>
            )}
          </div>
          
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
            color={percentage === 100 ? 'success' : percentage >= 70 ? 'warning' : 'error'}
            showPercentage
            className="mb-8"
          />

          {/* Status Message */}
          <div className="text-center mb-8">
            <div className={`p-4 rounded-lg ${isPerfectScore ? 'bg-green-100' : 'bg-blue-100'}`}>
              <p className={`font-medium ${isPerfectScore ? 'text-green-800' : 'text-blue-800'}`}>
                {isPerfectScore 
                  ? "¡Excelente! Has dominado completamente este nivel."
                  : percentage >= 80
                  ? "¡Muy bien! Casi perfecto. Necesitas 100% para desbloquear el siguiente nivel."
                  : percentage >= 50
                  ? "Buen intento. Sigue practicando para alcanzar el 100%."
                  : "Sigue practicando. Puedes intentarlo de nuevo hasta conseguir el 100%."}
              </p>
            </div>
          </div>

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
              onClick={() => navigate('/topics')}
              className="flex items-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Topics
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