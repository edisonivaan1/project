import React, { createContext, useContext, useState, useEffect } from 'react';

type QuestionStatus = 'unanswered' | 'correct' | 'incorrect';

interface QuestionStatusContextType {
  questionStatuses: Record<string, Record<number, QuestionStatus>>;
  updateQuestionStatus: (topicId: string, questionIndex: number, status: QuestionStatus) => void;
  getQuestionStatus: (topicId: string, questionIndex: number) => QuestionStatus;
}

const QuestionStatusContext = createContext<QuestionStatusContextType | undefined>(undefined);

export const QuestionStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, Record<number, QuestionStatus>>>({});

  // Cargar estados guardados al iniciar
  useEffect(() => {
    const savedStatuses = localStorage.getItem('questionStatuses');
    if (savedStatuses) {
      setQuestionStatuses(JSON.parse(savedStatuses));
    }
  }, []);

  // Guardar estados cuando cambien
  useEffect(() => {
    localStorage.setItem('questionStatuses', JSON.stringify(questionStatuses));
  }, [questionStatuses]);

  const updateQuestionStatus = (topicId: string, questionIndex: number, status: QuestionStatus) => {
    setQuestionStatuses(prev => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        [questionIndex]: status
      }
    }));
  };

  const getQuestionStatus = (topicId: string, questionIndex: number): QuestionStatus => {
    return questionStatuses[topicId]?.[questionIndex] || 'unanswered';
  };

  return (
    <QuestionStatusContext.Provider value={{ questionStatuses, updateQuestionStatus, getQuestionStatus }}>
      {children}
    </QuestionStatusContext.Provider>
  );
};

export const useQuestionStatus = () => {
  const context = useContext(QuestionStatusContext);
  if (context === undefined) {
    throw new Error('useQuestionStatus must be used within a QuestionStatusProvider');
  }
  return context;
}; 