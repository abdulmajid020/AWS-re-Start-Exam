import React, { useState, useMemo } from 'react';
import { ALL_KNOWLEDGE_CHECKS, ALL_CATEGORIES } from '../../data/quizData';
import { CategoryIcon } from '../common/CategoryIcon';
import { Search, Play, BookOpen, Layers } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const KnowledgeCheckList: React.FC = () => {
  const { startKnowledgeCheck } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredKCs = useMemo(() => {
    const clean = searchTerm.trim().toLowerCase();
    return ALL_KNOWLEDGE_CHECKS.filter((kc) => {
      const matchCat = selectedCategory === 'ALL' || kc.category === selectedCategory;
      if (!matchCat) return false;
      if (!clean) return true;
      return (
        kc.title.toLowerCase().includes(clean) ||
        kc.category.toLowerCase().includes(clean) ||
        kc.summary.toLowerCase().includes(clean) ||
        `#${kc.index}`.includes(clean)
      );
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700" />
            All 96 Module Knowledge Checks
          </h2>
          <p className="text-xs text-slate-500">
            Formative module questions arranged from A to Z
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Knowledge Checks..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors shadow-sm"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 transition-colors font-mono shadow-sm"
            >
              <option value="ALL">All Categories ({ALL_KNOWLEDGE_CHECKS.length})</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name} ({cat.kcCount})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Knowledge Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredKCs.map((kc) => (
          <div
            key={kc.id}
            className="flex flex-col justify-between p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all duration-150 shadow-subtle hover:shadow-card"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    #{kc.index}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
                    <CategoryIcon category={kc.category} className="w-3 h-3 text-slate-500" />
                    {kc.category}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-500">
                  {kc.questionCount} {kc.questionCount === 1 ? 'Question' : 'Questions'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-display font-bold text-slate-900 leading-snug">
                  {kc.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {kc.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-mono">ID: {kc.id}</span>
              <button
                onClick={() => startKnowledgeCheck(kc.id, true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white text-xs font-semibold border border-slate-200 hover:border-slate-900 transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                Practice KC
              </button>
            </div>
          </div>
        ))}

        {filteredKCs.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-xl bg-white border border-slate-200">
            <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">No Knowledge Checks matched your search</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
              }}
              className="mt-2 text-xs text-slate-800 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
