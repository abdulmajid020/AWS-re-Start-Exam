import React from 'react';
import {
  Clock,
  Flag,
  Grid,
  X,
  Zap,
} from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { CategoryIcon } from '../common/CategoryIcon';

export const QuizHeader: React.FC = () => {
  const {
    session,
    currentQuestion,
    currentAnswer,
    toggleFlag,
    cancelQuiz,
    navigatorDrawerOpen,
    setNavigatorDrawerOpen,
  } = useQuiz();

  if (!session || !currentQuestion) return null;

  const isFlagged = currentAnswer?.flagged ?? false;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime =
    session.timeRemainingSeconds !== null && session.timeRemainingSeconds <= 300; // <= 5 mins

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
      {/* Category badge & KC title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-medium">
            <CategoryIcon category={currentQuestion.category} className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            {currentQuestion.category}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            KC #{currentQuestion.kcIndex}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white line-clamp-1">
          {session.title}
        </h2>
      </div>

      {/* Right controls: Timer, Flag, Map Navigator, Exit */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {session.timeRemainingSeconds !== null ? (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-colors ${
              isLowTime
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{formatTime(session.timeRemainingSeconds)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Untimed</span>
          </div>
        )}

        {/* Flag Bookmark button */}
        <button
          onClick={() => toggleFlag()}
          title="Flag Question for Review (Press F)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            isFlagged
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-300 font-semibold'
              : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm'
          }`}
        >
          <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />
          <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Flag'}</span>
          <kbd className="hidden lg:inline text-[10px] font-mono opacity-50">F</kbd>
        </button>

        {/* Navigator Drawer Toggle */}
        <button
          onClick={() => setNavigatorDrawerOpen(!navigatorDrawerOpen)}
          title="Question Navigator (Press M)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-all shadow-sm"
        >
          <Grid className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">Map</span>
          <kbd className="hidden lg:inline text-[10px] font-mono opacity-50">M</kbd>
        </button>

        {/* Exit Quiz */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to exit? Your progress in this test will be lost.')) {
              cancelQuiz();
            }
          }}
          title="Exit Assessment"
          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
