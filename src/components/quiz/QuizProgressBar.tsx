import React from 'react';
import { useQuiz } from '../../context/QuizContext';

export const QuizProgressBar: React.FC = () => {
  const { session } = useQuiz();
  if (!session) return null;

  const total = session.questions.length;
  const currentIdx = session.currentIndex;
  const answeredCount = Object.values(session.answers).filter(
    (a) => a.selectedOption !== null
  ).length;

  const progressPercentage = total > 0 ? Math.round(((currentIdx + 1) / total) * 100) : 0;
  const answeredPercentage = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
        <span>
          Question <strong className="text-slate-900">{currentIdx + 1}</strong> of{' '}
          <strong className="text-slate-900">{total}</strong>
        </span>
        <span>
          Answered: <strong className="text-slate-800">{answeredCount}</strong> / {total} ({answeredPercentage}%)
        </span>
      </div>

      <div className="relative w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-slate-400 transition-all duration-300"
          style={{ width: `${answeredPercentage}%` }}
        />
        <div
          className="absolute left-0 top-0 h-full bg-slate-900 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};
