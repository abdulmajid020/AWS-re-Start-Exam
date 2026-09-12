import React, { useState } from 'react';
import { ALL_CATEGORIES } from '../../data/quizData';
import { CategoryIcon } from '../common/CategoryIcon';
import { ArrowRight, Search } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const CategoryPracticeGrid: React.FC = () => {
  const { startCategoryPractice } = useQuiz();
  const [search, setSearch] = useState('');

  const filteredCategories = ALL_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Quick search filter */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search domains..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors shadow-subtle"
          />
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          {filteredCategories.length} Domains
        </span>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filteredCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => startCategoryPractice(cat.name, true)}
            className="group flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200/90 dark:border-slate-800/80 hover:border-slate-900 dark:hover:border-amber-500/40 text-left transition-all duration-150 shadow-subtle hover:shadow-md"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-slate-800 dark:group-hover:bg-amber-500 group-hover:text-white dark:group-hover:text-slate-950 group-hover:border-slate-700 dark:group-hover:border-amber-400 shrink-0 transition-colors">
                <CategoryIcon category={cat.name} className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-display font-semibold text-slate-900 dark:text-white group-hover:text-white truncate">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-slate-300 font-mono">
                  {cat.count} Questions
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center text-slate-400 dark:text-slate-500 group-hover:text-amber-400">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

