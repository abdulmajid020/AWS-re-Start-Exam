import React from 'react';
import { ALL_CATEGORIES } from '../../data/quizData';
import { CategoryIcon } from '../common/CategoryIcon';
import { ArrowRight, Layers } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const CategoryPracticeGrid: React.FC = () => {
  const { startCategoryPractice } = useQuiz();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-700" />
            18 Curriculum Categories & Domains
          </h2>
          <p className="text-xs text-slate-500">
            Targeted drills with instant concept explanations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => startCategoryPractice(cat.name, true)}
            className="group flex flex-col justify-between p-4 rounded-xl bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 text-left transition-all duration-150 shadow-subtle hover:shadow-card"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-slate-900 transition-colors">
                  <CategoryIcon category={cat.name} className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {cat.count} {cat.count === 1 ? 'Question' : 'Questions'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-display font-bold text-slate-900 group-hover:text-slate-800 line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs text-slate-400">
              <span className="text-[11px] font-mono text-slate-400">
                {cat.kcCount} {cat.kcCount === 1 ? 'Check' : 'Checks'}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 opacity-80 group-hover:opacity-100">
                Practice
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
