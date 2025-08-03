import React from 'react';
import { useQuestionStatus } from '../../contexts/QuestionStatusContext';

interface QuestionNavigatorProps {
  topicId: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  className?: string;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  topicId,
  totalQuestions,
  currentQuestionIndex,
  onQuestionSelect,
  className = '',
}) => {
  const { getQuestionStatus } = useQuestionStatus();

  const getStatusClasses = (index: number) => {
    const status = getQuestionStatus(topicId, index);
    const baseClasses = 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (status) {
      case 'correct':
        return `${baseClasses} bg-[rgb(var(--color-success))] text-white hover:bg-green-600 focus:ring-[rgb(var(--color-success))/0.5]`;
      case 'incorrect':
        return `${baseClasses} bg-[rgb(var(--color-error))] text-white hover:bg-red-600 focus:ring-[rgb(var(--color-error))/0.5]`;
      default:
        return `${baseClasses} border-2 ${index === currentQuestionIndex ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))/0.1]' : 'border-gray-300'} text-gray-700 hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))/0.5]`;
    }
  };

  return (
    <div 
      className={`flex items-center justify-center space-x-2 ${className}`}
      role="navigation"
      aria-label="Question navigation"
    >
      {Array.from({ length: totalQuestions }, (_, i) => {
        const status = getQuestionStatus(topicId, i);
        
        return (
          <button
            key={i}
            onClick={() => onQuestionSelect(i)}
            className={getStatusClasses(i)}
            aria-label={`Pregunta ${i + 1}: ${status}`}
            title={`Pregunta ${i + 1}`}
            tabIndex={0}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionNavigator; 