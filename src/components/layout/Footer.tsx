import React from 'react';
import { COURSE_INFO, ALL_QUESTIONS, ALL_KNOWLEDGE_CHECKS } from '../../data/quizData';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-16 text-slate-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{COURSE_INFO.courseName}</span>
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
        </div>
      </div>
    </footer>
  );
};
