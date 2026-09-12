import React, { useState, useMemo } from 'react';
import {
  Search,
  Compass,
  Play,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  BookOpen,
  Layers,
  Database,
  CheckSquare,
} from 'lucide-react';
import {
  ALL_QUESTIONS,
  CCP_QUESTIONS,
  RESTART_QUESTIONS,
  ALL_CATEGORIES,
  getQuestionsByBank,
} from '../../data/quizData';
import { CategoryIcon } from '../common/CategoryIcon';
import { useQuiz } from '../../context/QuizContext';
import { QuestionBankId } from '../../types/quiz';

export const QuestionExplorer: React.FC = () => {
  const { startKnowledgeCheck } = useQuiz();
  const [selectedBank, setSelectedBank] = useState<QuestionBankId>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredQuestions = useMemo(() => {
    const clean = searchTerm.trim().toLowerCase();
    const bankPool = getQuestionsByBank(selectedBank);

    return bankPool.filter((q) => {
      if (selectedCategory !== 'ALL' && q.category !== selectedCategory) return false;
      if (!clean) return true;
      return (
        q.question.toLowerCase().includes(clean) ||
        q.kcTitle.toLowerCase().includes(clean) ||
        q.category.toLowerCase().includes(clean) ||
        q.explanation.toLowerCase().includes(clean) ||
        q.options.some((opt) => opt.toLowerCase().includes(clean))
      );
    });
  }, [searchTerm, selectedCategory, selectedBank]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-slate-700 dark:text-amber-400" />
          Question Repository & Solutions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Browse and search through all {ALL_QUESTIONS.length} questions across the CCP 400 exam bank and curriculum knowledge checks.
        </p>
      </div>

      {/* Bank Filter & Search */}
      <div className="space-y-2.5">
        {/* Bank Selection Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <button
            onClick={() => setSelectedBank('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedBank === 'all'
                ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            All Sources ({ALL_QUESTIONS.length})
          </button>
          <button
            onClick={() => setSelectedBank('ccp400')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedBank === 'ccp400'
                ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            CCP 400 Exam Bank ({CCP_QUESTIONS.length})
          </button>
          <button
            onClick={() => setSelectedBank('restart_kcs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedBank === 'restart_kcs'
                ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            re/Start KCs ({RESTART_QUESTIONS.length})
          </button>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords, services (e.g. S3, IAM, VPC, EC2, CloudTrail, DynamoDB, TCO)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors shadow-sm"
          />
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Categories
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.name
                  ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <CategoryIcon category={cat.name} className="w-3 h-3" />
              <span>{cat.name}</span>
              <span className="font-mono opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-2.5">
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Showing {filteredQuestions.length} Questions</span>
          <span>{selectedBank === 'ccp400' ? 'CCP 400 Official' : selectedBank === 'restart_kcs' ? 're/Start Curriculum' : 'Master Pool'}</span>
        </div>

        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedId === q.id;
          const isCCP = q.bankId === 'ccp400';
          const targetCorrect = q.correctAnswers || [q.correctAnswer];

          return (
            <div
              key={q.id}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 overflow-hidden shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              {/* Question Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">#{idx + 1}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        isCCP
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                      }`}
                    >
                      {isCCP ? `CCP Q${q.questionNumber}` : `KC #${q.kcIndex}`}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <CategoryIcon category={q.category} className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      {q.category}
                    </span>
                    {q.isMultiSelect && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
                        <CheckSquare className="w-3 h-3" />
                        Choose {q.requiredSelections || 2}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-medium text-slate-900 dark:text-white leading-snug pt-0.5">
                    {q.question}
                  </h3>
                </div>

                <div className="shrink-0 text-slate-400 dark:text-slate-500 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Question Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs bg-slate-50/50 dark:bg-slate-950/40">
                  {/* Options display */}
                  <div className="space-y-1.5 pt-2">
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 block font-semibold uppercase">
                      Answer Choices:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = targetCorrect.includes(opt);
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200 font-medium'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="leading-relaxed">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation card */}
                  <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 leading-relaxed text-slate-700 dark:text-slate-300">
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200 uppercase text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Concept Explanation:
                    </div>
                    <p>{q.explanation}</p>
                  </div>

                  {/* KC Footer info & Action button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{q.kcTitle}</span>
                    </div>

                    <button
                      onClick={() => startKnowledgeCheck(q.kcId, true)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-semibold transition-all shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Practice Set
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="py-12 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Layers className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No questions matched your search query</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedBank('all');
              }}
              className="mt-2 text-xs text-slate-800 dark:text-amber-400 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
