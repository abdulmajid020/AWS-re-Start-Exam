import React from 'react';
import { X, Flag, ArrowRight } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const QuestionNavigatorDrawer: React.FC = () => {
  const {
    session,
    goToQuestion,
    navigatorDrawerOpen,
    setNavigatorDrawerOpen,
    setConfirmSubmitModalOpen,
  } = useQuiz();

  if (!navigatorDrawerOpen || !session) return null;

  const total = session.questions.length;
  const answeredCount = Object.values(session.answers).filter(
    (a) => a.selectedOption !== null
  ).length;
  const flaggedCount = Object.values(session.answers).filter((a) => a.flagged).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-xl p-6 overflow-y-auto transition-colors">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">Question Map Navigator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {answeredCount} of {total} Answered • {flaggedCount} Flagged
            </p>
          </div>
          <button
            onClick={() => setNavigatorDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800 dark:bg-slate-600" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
            <span>Unanswered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700" />
            <span>Flagged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded ring-2 ring-slate-900 dark:ring-amber-500 bg-white dark:bg-slate-800" />
            <span>Current</span>
          </div>
        </div>

        {/* Question Grid */}
        <div className="grid grid-cols-5 gap-2 flex-1 content-start py-2">
          {session.questions.map((q, idx) => {
            const ans = session.answers[q.id];
            const isCurrent = idx === session.currentIndex;
            const isAnswered = ans?.selectedOption !== null;
            const isFlagged = ans?.flagged ?? false;

            let buttonClass = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500';
            if (isAnswered) {
              buttonClass = 'bg-slate-900 dark:bg-slate-700 border-slate-900 dark:border-slate-600 text-white font-medium';
            }
            if (isFlagged && !isAnswered) {
              buttonClass = 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300';
            }
            if (isCurrent) {
              buttonClass += ' ring-2 ring-slate-900 dark:ring-amber-500 ring-offset-2 dark:ring-offset-slate-900 font-bold';
            }

            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-mono transition-all duration-150 active:scale-95 ${buttonClass}`}
              >
                <span>{idx + 1}</span>
                {isFlagged && (
                  <Flag className={`w-2.5 h-2.5 absolute top-1 right-1 ${isAnswered ? 'text-amber-300 fill-amber-300' : 'text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer actions */}
        <div className="pt-4 mt-auto border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setNavigatorDrawerOpen(false);
              setConfirmSubmitModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-display font-semibold text-xs shadow-sm transition-all"
          >
            Submit Assessment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
