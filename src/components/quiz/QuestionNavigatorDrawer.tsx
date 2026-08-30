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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col shadow-xl p-6 overflow-y-auto">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-display font-bold text-slate-900">Question Map Navigator</h3>
            <p className="text-xs text-slate-500">
              {answeredCount} of {total} Answered • {flaggedCount} Flagged
            </p>
          </div>
          <button
            onClick={() => setNavigatorDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300" />
            <span>Unanswered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
            <span>Flagged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded ring-2 ring-slate-900 bg-white" />
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

            let buttonClass = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400';
            if (isAnswered) {
              buttonClass = 'bg-slate-900 border-slate-900 text-white font-medium';
            }
            if (isFlagged && !isAnswered) {
              buttonClass = 'bg-amber-50 border-amber-300 text-amber-900';
            }
            if (isCurrent) {
              buttonClass += ' ring-2 ring-slate-900 ring-offset-2 font-bold';
            }

            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-mono transition-all duration-150 active:scale-95 ${buttonClass}`}
              >
                <span>{idx + 1}</span>
                {isFlagged && (
                  <Flag className={`w-2.5 h-2.5 absolute top-1 right-1 ${isAnswered ? 'text-amber-300 fill-amber-300' : 'text-amber-600 fill-amber-600'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer actions */}
        <div className="pt-4 mt-auto border-t border-slate-200">
          <button
            onClick={() => {
              setNavigatorDrawerOpen(false);
              setConfirmSubmitModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold text-xs shadow-sm transition-all"
          >
            Submit Assessment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
