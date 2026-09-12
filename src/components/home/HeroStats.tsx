import React from 'react';
import {
  Trophy,
  Target,
  Bookmark,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { ALL_QUESTIONS, CCP_QUESTIONS, RESTART_QUESTIONS } from '../../data/quizData';

export const HeroStats: React.FC = () => {
  const { stats, startWeakAreas, startFlaggedReview, clearStats } = useQuiz();

  const totalQuestions = ALL_QUESTIONS.length;
  const totalAnswered = stats.totalQuestionsAnswered;
  const accuracy = totalAnswered > 0 ? Math.round((stats.totalCorrect / totalAnswered) * 100) : 0;
  const masteredCount = stats.masteredQuestionIds.length;
  const missedCount = stats.missedQuestionIds.length;
  const flaggedCount = stats.flaggedQuestionIds.length;

  return (
    <div className="space-y-4">
      {/* Header Container */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              AWS Certified Cloud Practitioner • 503 Questions Bank
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              AWS Knowledge Checks & Exam Simulator
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Complete practice assessment repository containing the <span className="font-semibold text-slate-900 dark:text-white">CCP 400 Question Bank</span> ({CCP_QUESTIONS.length} Questions) and <span className="font-semibold text-slate-900 dark:text-white">AWS re/Start Curriculum KCs</span> ({RESTART_QUESTIONS.length} Questions).
            </p>
          </div>

          {/* Quick Action Buttons for Weak Areas & Flagged */}
          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            {missedCount > 0 && (
              <button
                onClick={startWeakAreas}
                className="flex items-center justify-between gap-3 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-xs font-semibold transition-all group"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Review {missedCount} Missed</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {flaggedCount > 0 && (
              <button
                onClick={startFlaggedReview}
                className="flex items-center justify-between gap-3 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 dark:bg-amber-950/40 dark:hover:bg-amber-950/70 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs font-semibold transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Review {flaggedCount} Flagged</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Real-time stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-medium mb-1">
              <Trophy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Tests Completed</span>
            </div>
            <div className="text-xl font-display font-bold text-slate-900 dark:text-white">
              {stats.totalQuizzesTaken}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-medium mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Accuracy</span>
            </div>
            <div className="text-xl font-display font-bold text-slate-900 dark:text-white">
              {accuracy}%
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-medium mb-1">
              <Bookmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Mastered</span>
            </div>
            <div className="text-xl font-display font-bold text-slate-900 dark:text-white">
              {masteredCount} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/ {totalQuestions}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-medium mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Needs Practice</span>
            </div>
            <div className="text-xl font-display font-bold text-slate-900 dark:text-white">
              {missedCount}
            </div>
          </div>
        </div>

        {stats.totalQuizzesTaken > 0 && (
          <div className="flex justify-end mt-3">
            <button
              onClick={() => {
                if (window.confirm('Reset all assessment history and statistics?')) {
                  clearStats();
                }
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Statistics
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
