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
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { CategoryIcon } from '../common/CategoryIcon';

export const ResultsView: React.FC = () => {
  const { lastResult, retakeCurrentQuiz, setCurrentView } = useQuiz();
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
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${
                  lastResult.passed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {lastResult.passed ? 'PASSED' : 'DID NOT PASS'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Passing Cutoff: 700 / 1000 (70%)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
              {lastResult.title}
            </h1>
            <p className="text-xs text-slate-500 font-mono">{lastResult.date}</p>
          </div>

          {/* Large Scaled Score Display */}
          <div className="text-left sm:text-right shrink-0">
            <div className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              {lastResult.scaledScore}{' '}
              <span className="text-lg font-normal text-slate-400">/ 1000</span>
            </div>
            <div className="text-xs font-mono text-slate-600 font-semibold mt-0.5">
              Score: {lastResult.scorePercentage}% ({lastResult.correctCount} / {lastResult.totalQuestions})
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Correct</span>
            </div>
            <div className="text-lg font-display font-bold text-slate-900">
              {lastResult.correctCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-0.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Incorrect</span>
            </div>
            <div className="text-lg font-display font-bold text-slate-900">
              {lastResult.incorrectCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Unanswered</span>
            </div>
            <div className="text-lg font-display font-bold text-slate-900">
              {lastResult.unansweredCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span>Time Elapsed</span>
            </div>
            <div className="text-lg font-display font-bold text-slate-900">
              {formatMinutes(lastResult.timeElapsedSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {lastResult.incorrectCount > 0 && (
            <button
              onClick={() => retakeCurrentQuiz(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Retake Missed ({lastResult.incorrectCount})</span>
            </button>
          )}

          <button
            onClick={() => retakeCurrentQuiz(false)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-display font-bold shadow-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Full Test</span>
          </button>
        </div>
      </div>

      {/* Domain Mastery Breakdown */}
      {lastResult.categories.length > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-600" />
            Category & Domain Breakdown
          </h3>

          <div className="space-y-3">
            {lastResult.categories.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <CategoryIcon category={cat.category} className="w-3.5 h-3.5 text-slate-500" />
                    {cat.category}
                  </span>
                  <span className="font-mono text-slate-500">
                    <strong className="text-slate-900">{cat.correct}</strong> / {cat.total} (
                    {cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      cat.percentage >= 70
                        ? 'bg-emerald-600'
                        : cat.percentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Review Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h3 className="text-base font-display font-bold text-slate-900">Question Review</h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({lastResult.questionResults.length})
            </button>
            <button
              onClick={() => setFilter('INCORRECT')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'INCORRECT'
                  ? 'bg-white text-rose-800 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Incorrect ({lastResult.incorrectCount})
            </button>
            <button
              onClick={() => setFilter('CORRECT')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'CORRECT'
                  ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Correct ({lastResult.correctCount})
            </button>
            <button
              onClick={() => setFilter('FLAGGED')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'FLAGGED'
                  ? 'bg-white text-amber-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
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
            return (
              <div
                key={item.question.id}
                className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-subtle"
              >
                {/* Accordion Bar */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.question.id)}
                  className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-mono text-slate-400">
                          #{idx + 1} • {item.question.category}
                        </span>
                        {item.flagged && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-800 px-1.5 rounded bg-amber-50 border border-amber-200">
                            <Flag className="w-2.5 h-2.5" /> Flagged
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-slate-900 line-clamp-2">
                        {item.question.question}
                      </h4>
                    </div>
                  </div>

                  <div className="shrink-0 text-slate-400 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-3.5 text-xs bg-slate-50/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <span className="text-slate-400 block mb-0.5">Your Answer:</span>
                        <span
                          className={`font-semibold ${
                            item.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {item.userAnswer || 'Unanswered'}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <span className="text-slate-400 block mb-0.5">Correct Answer:</span>
                        <span className="font-semibold text-emerald-700">
                          {item.question.correctAnswer}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1 text-slate-700 leading-relaxed">
                      <div className="font-mono font-bold text-slate-800 uppercase text-[11px]">
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
