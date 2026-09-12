import React, { useState, useMemo } from 'react';
import {
  ALL_KNOWLEDGE_CHECKS,
  CCP_PRACTICE_SETS,
  RESTART_KNOWLEDGE_CHECKS,
  ALL_CATEGORIES,
} from '../../data/quizData';
import { CategoryIcon } from '../common/CategoryIcon';
import { Search, Play, Layers, ChevronDown } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const KnowledgeCheckList: React.FC = () => {
  const { startKnowledgeCheck } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBank, setSelectedBank] = useState<'all' | 'ccp400' | 'restart_kcs'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [displayLimit, setDisplayLimit] = useState<number>(16);

  const filteredKCs = useMemo(() => {
    const clean = searchTerm.trim().toLowerCase();
    let pool = ALL_KNOWLEDGE_CHECKS;
    if (selectedBank === 'ccp400') pool = CCP_PRACTICE_SETS;
    if (selectedBank === 'restart_kcs') pool = RESTART_KNOWLEDGE_CHECKS;

    return pool.filter((kc) => {
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
  }, [searchTerm, selectedCategory, selectedBank]);

  const visibleKCs = filteredKCs.slice(0, displayLimit);

  return (
    <div className="space-y-3.5">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Bank Selection Pills */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => {
              setSelectedBank('all');
              setDisplayLimit(16);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedBank === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Sets ({ALL_KNOWLEDGE_CHECKS.length})
          </button>
          <button
            onClick={() => {
              setSelectedBank('ccp400');
              setDisplayLimit(16);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedBank === 'ccp400'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            CCP 400 (16)
          </button>
          <button
            onClick={() => {
              setSelectedBank('restart_kcs');
              setDisplayLimit(16);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedBank === 'restart_kcs'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            re/Start KCs (96)
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setDisplayLimit(16);
              }}
              placeholder="Search assessment sets..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors shadow-sm"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setDisplayLimit(16);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 font-mono shadow-sm max-w-[130px] truncate"
          >
            <option value="ALL">All Domains</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Knowledge Checks / Practice Sets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {visibleKCs.map((kc) => {
          const isCCP = kc.bankId === 'ccp400';
          return (
            <div
              key={kc.id}
              className={`p-3 rounded-xl bg-white dark:bg-slate-900 border transition-all duration-150 shadow-subtle hover:shadow-card flex items-center justify-between gap-3 ${
                isCCP
                  ? 'border-amber-200/80 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-600'
                  : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      isCCP
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isCCP ? `Set ${kc.index}` : `#${kc.index}`}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 truncate max-w-[140px]">
                    <CategoryIcon category={kc.category} className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="truncate">{kc.category}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    {kc.questionCount}Q
                  </span>
                </div>

                <h3 className="text-xs font-display font-semibold text-slate-900 dark:text-white leading-tight truncate" title={kc.title}>
                  {kc.title}
                </h3>
              </div>

              <button
                onClick={() => startKnowledgeCheck(kc.id, true)}
                className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isCCP
                    ? 'bg-amber-500 hover:bg-slate-900 dark:hover:bg-amber-400 text-slate-950 hover:text-white dark:hover:text-slate-950 border-amber-600 dark:border-amber-500 hover:border-slate-900 font-bold'
                    : 'bg-slate-100 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-amber-500 text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-slate-950 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-amber-500'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                Practice
              </button>
            </div>
          );
        })}

        {filteredKCs.length === 0 && (
          <div className="col-span-full py-8 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Layers className="w-6 h-6 text-slate-400 dark:text-slate-500 mx-auto mb-1.5" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">No sets matched your search query</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedBank('all');
              }}
              className="mt-1.5 text-xs text-slate-800 dark:text-amber-400 font-semibold hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Show more button if there are more than displayLimit */}
      {filteredKCs.length > displayLimit && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setDisplayLimit((prev) => prev + 24)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-subtle transition-all"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Show More Sets ({filteredKCs.length - displayLimit} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

