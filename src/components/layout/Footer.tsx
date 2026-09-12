import React from 'react';
import { COURSE_INFO, ALL_QUESTIONS, ALL_KNOWLEDGE_CHECKS } from '../../data/quizData';
import { Coffee } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const Footer: React.FC = () => {
  const { setSupportModalOpen } = useQuiz();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-8 mt-16 text-slate-500 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">{COURSE_INFO.courseName}</span>
            <span>•</span>
            <span>Course ID: {COURSE_INFO.courseId}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>{ALL_KNOWLEDGE_CHECKS.length} Knowledge Checks</span>
            <span>•</span>
            <span>{ALL_QUESTIONS.length} Questions</span>
            <span>•</span>
            <span>CLF-C02 Standard</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSupportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 font-medium transition-colors"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Buy Me a Coffee</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
