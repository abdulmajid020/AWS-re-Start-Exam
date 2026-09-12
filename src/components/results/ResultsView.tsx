import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  RotateCcw,
  Home,
  Flag,
  ChevronDown,
  ChevronUp,
  Layers,
  Coffee,
  CheckSquare,
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { CategoryIcon } from '../common/CategoryIcon';

export const ResultsView: React.FC = () => {
  const { lastResult, retakeCurrentQuiz, setCurrentView, setSupportModalOpen } = useQuiz();
  const [filter, setFilter] = useState<'ALL' | 'INCORRECT' | 'FLAGGED' | 'CORRECT'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!lastResult) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">No test results available</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  const formatMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredQuestions = lastResult.questionResults.filter((item) => {
    if (filter === 'INCORRECT') return !item.isCorrect;
    if (filter === 'CORRECT') return item.isCorrect;
    if (filter === 'FLAGGED') return item.flagged;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Banner Card: Scaled Score & Pass/Fail status */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${
                  lastResult.passed
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                }`}
              >
                {lastResult.passed ? 'PASSED' : 'DID NOT PASS'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Passing Cutoff: 700 / 1000 (70%)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
              {lastResult.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{lastResult.date}</p>
          </div>

          {/* Large Scaled Score Display */}
          <div className="text-left sm:text-right shrink-0">
            <div className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              {lastResult.scaledScore}{' '}
              <span className="text-lg font-normal text-slate-400 dark:text-slate-500">/ 1000</span>
            </div>
            <div className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
              Score: {lastResult.scorePercentage}% ({lastResult.correctCount} / {lastResult.totalQuestions})
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Correct</span>
            </div>
            <div className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {lastResult.correctCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-0.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Incorrect</span>
            </div>
            <div className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {lastResult.incorrectCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Unanswered</span>
            </div>
            <div className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {lastResult.unansweredCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Time Elapsed</span>
            </div>
            <div className="text-lg font-display font-bold text-slate-900 dark:text-white font-mono">
              {formatMinutes(lastResult.timeElapsedSeconds)}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            {lastResult.incorrectCount > 0 && (
              <button
                onClick={() => retakeCurrentQuiz(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-300 font-semibold text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry {lastResult.incorrectCount} Missed Questions</span>
              </button>
            )}

            <button
              onClick={() => retakeCurrentQuiz(false)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-display font-bold text-xs shadow-sm transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Entire Exam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Domain / Category Performance Breakdown */}
      {lastResult.categories.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            Domain & Category Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lastResult.categories.map((cat) => (
              <div
                key={cat.category}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                    <CategoryIcon category={cat.category} className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span className="truncate max-w-[170px]">{cat.category}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {cat.correct}/{cat.total} ({cat.percentage}%)
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      cat.percentage >= 70 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Support / Sponsor Banner */}
      <div className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 shrink-0">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-display font-bold text-slate-900 dark:text-white">
              Found this test helpful for your AWS certification?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Support this open-source tool or share it with other AWS students!
            </p>
          </div>
        </div>

        <button
          onClick={() => setSupportModalOpen(true)}
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-display font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Support Project</span>
        </button>
      </div>

      {/* Question Review Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">Question Review</h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({lastResult.questionResults.length})
            </button>
            <button
              onClick={() => setFilter('INCORRECT')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'INCORRECT'
                  ? 'bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Incorrect ({lastResult.incorrectCount})
            </button>
            <button
              onClick={() => setFilter('CORRECT')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'CORRECT'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Correct ({lastResult.correctCount})
            </button>
            <button
              onClick={() => setFilter('FLAGGED')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'FLAGGED'
                  ? 'bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Flagged ({lastResult.questionResults.filter((q) => q.flagged).length})
            </button>
          </div>
        </div>

        {/* Review Items */}
        <div className="space-y-2.5">
          {filteredQuestions.map((item, idx) => {
            const isExpanded = expandedId === item.question.id;
            const isCCP = item.question.bankId === 'ccp400';
            const userAnsText =
              item.userAnswers && item.userAnswers.length > 0
                ? item.userAnswers.join(' • ')
                : item.userAnswer || 'Unanswered';
            const correctAnsText =
              item.question.correctAnswers && item.question.correctAnswers.length > 1
                ? item.question.correctAnswers.join(' • ')
                : item.question.correctAnswer;

            return (
              <div
                key={item.question.id}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-subtle transition-colors"
              >
                {/* Accordion Bar */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.question.id)}
                  className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                          #{idx + 1} • {item.question.category}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            isCCP
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                          }`}
                        >
                          {isCCP ? `CCP Q${item.question.questionNumber}` : `KC #${item.question.kcIndex}`}
                        </span>
                        {item.question.isMultiSelect && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
                            <CheckSquare className="w-2.5 h-2.5" />
                            Multi-Select
                          </span>
                        )}
                        {item.flagged && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-800 dark:text-amber-300 px-1.5 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
                            <Flag className="w-2.5 h-2.5" /> Flagged
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                        {item.question.question}
                      </h4>
                    </div>
                  </div>

                  <div className="shrink-0 text-slate-400 dark:text-slate-500 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs bg-slate-50/50 dark:bg-slate-950/40">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Your Answer:</span>
                        <span
                          className={`font-semibold ${
                            item.isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {userAnsText}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Correct Answer:</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {correctAnsText}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200 uppercase text-[11px]">
                        Explanation & Takeaway
                      </div>
                      <p>{item.question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
